-- Kikiewa bookings: tables, constraints and row level security.
--
-- Security model
--   * RLS is on for every table.
--   * anon (and signed-in users) may only SELECT the public catalogue:
--     active branches, their hours and blocked dates, and active services.
--     Prices are public, so services are readable in full.
--   * bookings, payment_events, booking_attempts and admins have no policies
--     for anon or authenticated, and their table grants are revoked too.
--     Every write goes through server code holding the service-role key.
--   * Prompt H adds admin policies on top (admins table).
--
-- Times are stored as timestamptz (UTC). The business runs on Africa/Lagos;
-- branch_hours holds Lagos wall-clock times.

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at current
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 120),
  address text,
  lat double precision check (lat between -90 and 90),
  lng double precision check (lng between -180 and 180),
  place_id text,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per opening period. weekday follows Postgres extract(dow):
-- 0 = Sunday ... 6 = Saturday. A day with no rows is closed.
create table public.branch_hours (
  branch_id uuid not null references public.branches (id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  opens time not null,
  closes time not null,
  primary key (branch_id, weekday, opens),
  check (closes > opens)
);

create table public.blocked_dates (
  branch_id uuid not null references public.branches (id) on delete cascade,
  date date not null,
  reason text,
  primary key (branch_id, date)
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  category text not null,
  name text not null check (char_length(name) between 1 and 120),
  duration_mins integer not null check (duration_mins between 5 and 600),
  -- null while the price is not set; payment_mode must then be 'none'.
  price_kobo bigint check (price_kobo >= 0),
  payment_mode text not null default 'none' check (payment_mode in ('none', 'deposit', 'full')),
  deposit_kobo bigint check (deposit_kobo > 0),
  deposit_percent smallint check (deposit_percent between 1 and 100),
  requires_consultation boolean not null default false,
  capacity_per_slot integer not null default 1 check (capacity_per_slot >= 1),
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- A service can only take money once it knows how much.
  constraint services_payment_config check (
    payment_mode = 'none'
    or (payment_mode = 'full' and price_kobo > 0)
    or (
      payment_mode = 'deposit'
      and (deposit_kobo is not null or (deposit_percent is not null and price_kobo > 0))
    )
  )
);

create trigger branches_updated_at before update on public.branches
  for each row execute function public.set_updated_at();
create trigger services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Bookings
-- ---------------------------------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  -- Short human code, e.g. KKW-7F3K. Alphabet leaves out 0, 1, I, L, O, U.
  ref text not null unique check (ref ~ '^KKW-[2-9A-HJKMNP-TV-Z]{4}$'),
  service_id uuid not null references public.services (id),
  branch_id uuid not null references public.branches (id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  customer_name text not null check (char_length(customer_name) between 1 and 80),
  customer_phone text not null check (customer_phone ~ '^\+[1-9][0-9]{7,14}$'),
  customer_email text check (customer_email is null or char_length(customer_email) between 3 and 254),
  notes text check (notes is null or char_length(notes) <= 500),
  status text not null check (
    status in ('requested', 'pending_payment', 'confirmed', 'completed', 'cancelled', 'no_show', 'expired')
  ),
  amount_due_kobo bigint not null default 0 check (amount_due_kobo >= 0),
  amount_paid_kobo bigint not null default 0 check (amount_paid_kobo >= 0),
  paystack_reference text unique,
  hold_expires_at timestamptz,
  paid_at timestamptz,
  -- Money arrived but the booking could not be honoured (slot gone after
  -- the hold lapsed, short payment, cancelled booking). Staff refund it.
  refund_required boolean not null default false,
  consented_at timestamptz,
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at),
  check (status <> 'pending_payment' or (hold_expires_at is not null and paystack_reference is not null))
);

-- Availability and capacity checks scan live bookings per branch and time.
create index bookings_live_slot_idx on public.bookings (branch_id, service_id, start_at)
  where status in ('requested', 'pending_payment', 'confirmed');
create index bookings_pending_idx on public.bookings (hold_expires_at)
  where status = 'pending_payment';

create trigger bookings_updated_at before update on public.bookings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Payment events: append-only log of provider webhooks
-- ---------------------------------------------------------------------------
create table public.payment_events (
  id bigint generated always as identity primary key,
  provider text not null,
  event text not null,
  reference text not null,
  payload jsonb not null,
  received_at timestamptz not null default now(),
  unique (provider, event, reference)
);

create or replace function public.payment_events_append_only()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'payment_events is append-only';
end;
$$;

create trigger payment_events_no_update before update or delete on public.payment_events
  for each row execute function public.payment_events_append_only();

-- ---------------------------------------------------------------------------
-- Throttle: booking attempts per phone and per IP (hashed, never raw)
-- ---------------------------------------------------------------------------
create table public.booking_attempts (
  id bigint generated always as identity primary key,
  key_type text not null check (key_type in ('phone', 'ip')),
  key_hash text not null,
  created_at timestamptz not null default now()
);

create index booking_attempts_lookup_idx on public.booking_attempts (key_type, key_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- Admins (used in Prompt H)
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null check (role in ('owner', 'staff')),
  -- Staff may be limited to one branch; null means every branch.
  branch_id uuid references public.branches (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.branches enable row level security;
alter table public.branch_hours enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.payment_events enable row level security;
alter table public.booking_attempts enable row level security;
alter table public.admins enable row level security;

-- Public catalogue: read-only, active rows only.
create policy "Public can read active branches" on public.branches
  for select to anon, authenticated
  using (active);

create policy "Public can read hours of active branches" on public.branch_hours
  for select to anon, authenticated
  using (exists (select 1 from public.branches b where b.id = branch_id and b.active));

create policy "Public can read blocked dates of active branches" on public.blocked_dates
  for select to anon, authenticated
  using (exists (select 1 from public.branches b where b.id = branch_id and b.active));

create policy "Public can read active services" on public.services
  for select to anon, authenticated
  using (active);

-- Belt and braces: the public roles hold no write grants on the catalogue,
-- and no grants at all on private tables.
revoke insert, update, delete, truncate on public.branches, public.branch_hours, public.blocked_dates, public.services
  from anon, authenticated;
revoke all on public.bookings, public.payment_events, public.booking_attempts, public.admins
  from anon, authenticated;
