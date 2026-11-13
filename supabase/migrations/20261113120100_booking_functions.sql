-- Kikiewa bookings: server-side functions.
--
-- Called only by the website's server code with the service-role key.
-- EXECUTE is revoked from PUBLIC, anon and authenticated at the bottom, so
-- none of these can be reached through the public API.
--
-- "Live" bookings hold a slot: requested, confirmed, and pending_payment
-- whose hold has not expired. Expired holds are released on read; the
-- daily cron only tidies their status.

-- ---------------------------------------------------------------------------
-- record_booking_attempt: throttle. Logs one attempt for the phone and IP
-- hashes and returns false once either has more than p_limit attempts in
-- the window.
-- ---------------------------------------------------------------------------
create or replace function public.record_booking_attempt(
  p_phone_hash text,
  p_ip_hash text,
  p_limit integer default 5,
  p_window interval default interval '1 hour'
)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
  v_phone integer := 0;
  v_ip integer := 0;
begin
  if p_phone_hash is not null then
    insert into public.booking_attempts (key_type, key_hash) values ('phone', p_phone_hash);
    select count(*) into v_phone from public.booking_attempts
      where key_type = 'phone' and key_hash = p_phone_hash and created_at > now() - p_window;
  end if;
  if p_ip_hash is not null then
    insert into public.booking_attempts (key_type, key_hash) values ('ip', p_ip_hash);
    select count(*) into v_ip from public.booking_attempts
      where key_type = 'ip' and key_hash = p_ip_hash and created_at > now() - p_window;
  end if;
  return v_phone <= p_limit and v_ip <= p_limit;
end;
$$;

-- ---------------------------------------------------------------------------
-- live_bookings_overlapping: how many live bookings of a service at a
-- branch overlap [p_start, p_end), optionally leaving one booking out.
-- ---------------------------------------------------------------------------
create or replace function public.live_bookings_overlapping(
  p_branch_id uuid,
  p_service_id uuid,
  p_start timestamptz,
  p_end timestamptz,
  p_exclude uuid default null
)
returns integer
language sql
stable
set search_path = ''
as $$
  select count(*)::integer
  from public.bookings bk
  where bk.branch_id = p_branch_id
    and bk.service_id = p_service_id
    and bk.start_at < p_end
    and bk.end_at > p_start
    and (p_exclude is null or bk.id <> p_exclude)
    and (
      bk.status in ('requested', 'confirmed')
      or (bk.status = 'pending_payment' and bk.hold_expires_at > now())
    );
$$;

-- ---------------------------------------------------------------------------
-- create_booking: the only way a booking row is made.
--
-- Locks the branch row (SELECT ... FOR UPDATE), so concurrent bookings at
-- one branch run one at a time; then re-checks capacity and inserts. Two
-- people racing for the last place: the second waits for the first to
-- commit, sees the slot full and gets 'slot_full'.
--
-- The price is not a parameter: the amount due is worked out here from the
-- services row, so nothing the browser sends can change it.
-- ---------------------------------------------------------------------------
create or replace function public.create_booking(
  p_service_id uuid,
  p_branch_id uuid,
  p_start_at timestamptz,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_notes text,
  p_consented_at timestamptz,
  p_reference_suffix text,
  p_hold_minutes integer default 15
)
returns public.bookings
language plpgsql
set search_path = ''
as $$
declare
  v_service public.services%rowtype;
  v_end timestamptz;
  v_status text;
  v_due bigint := 0;
  v_hold timestamptz;
  v_ref text;
  v_reference text;
  v_bytes bytea;
  v_alphabet constant text := '23456789ABCDEFGHJKMNPQRSTVWXYZ';
  v_tries integer := 0;
  v_row public.bookings%rowtype;
begin
  if p_start_at <= now() then
    raise exception 'slot_in_past';
  end if;

  -- Serialise bookings at this branch.
  perform 1 from public.branches b where b.id = p_branch_id and b.active for update;
  if not found then
    raise exception 'branch_unavailable';
  end if;

  select * into v_service from public.services s where s.id = p_service_id and s.active;
  if not found then
    raise exception 'service_unavailable';
  end if;

  v_end := p_start_at + make_interval(mins => v_service.duration_mins);

  if public.live_bookings_overlapping(p_branch_id, p_service_id, p_start_at, v_end) >= v_service.capacity_per_slot then
    raise exception 'slot_full';
  end if;

  -- Amount due, from the catalogue only.
  if v_service.payment_mode = 'full' then
    v_due := v_service.price_kobo;
  elsif v_service.payment_mode = 'deposit' then
    v_due := coalesce(v_service.deposit_kobo, ceil(v_service.price_kobo * v_service.deposit_percent / 100.0)::bigint);
  end if;

  if v_due > 0 then
    if p_customer_email is null then
      raise exception 'email_required';
    end if;
    if p_reference_suffix is null or p_reference_suffix !~ '^[a-z0-9]{6,16}$' then
      raise exception 'invalid_reference_suffix';
    end if;
    v_status := 'pending_payment';
    v_hold := now() + make_interval(mins => p_hold_minutes);
  else
    v_status := 'requested';
  end if;

  loop
    -- Four random characters from the alphabet (bytes of a v4 UUID).
    v_bytes := uuid_send(gen_random_uuid());
    v_ref := 'KKW-';
    for i in 0..3 loop
      v_ref := v_ref || substr(v_alphabet, (get_byte(v_bytes, i) % 30) + 1, 1);
    end loop;
    v_reference := case when v_status = 'pending_payment' then v_ref || '-' || p_reference_suffix end;

    begin
      insert into public.bookings (
        ref, service_id, branch_id, start_at, end_at,
        customer_name, customer_phone, customer_email, notes,
        status, amount_due_kobo, paystack_reference, hold_expires_at, consented_at
      ) values (
        v_ref, p_service_id, p_branch_id, p_start_at, v_end,
        p_customer_name, p_customer_phone, p_customer_email, p_notes,
        v_status, v_due, v_reference, v_hold, p_consented_at
      )
      returning * into v_row;
      exit;
    exception when unique_violation then
      v_tries := v_tries + 1;
      if v_tries >= 8 then
        raise;
      end if;
    end;
  end loop;

  return v_row;
end;
$$;

-- ---------------------------------------------------------------------------
-- release_booking: frees a pending_payment hold straight away (used when
-- Paystack could not start the payment).
-- ---------------------------------------------------------------------------
create or replace function public.release_booking(p_booking_id uuid)
returns void
language sql
set search_path = ''
as $$
  update public.bookings
  set status = 'expired', hold_expires_at = least(hold_expires_at, now())
  where id = p_booking_id and status = 'pending_payment';
$$;

-- ---------------------------------------------------------------------------
-- confirm_booking_payment: idempotent. Call it only with figures that came
-- from Paystack's Verify Transaction response, never from a webhook body or
-- the browser.
--
-- Outcomes:
--   confirmed          paid in full while the hold was live
--   confirmed_late     the hold had lapsed but the slot was still free
--   already_confirmed  a repeat call (webhook retry, status page refresh)
--   refund_required    money arrived but the booking can't be honoured
--   amount_mismatch    wrong currency or less than the amount due
--   not_found          no booking carries this reference
-- ---------------------------------------------------------------------------
create or replace function public.confirm_booking_payment(
  p_reference text,
  p_amount_kobo bigint,
  p_currency text,
  p_paid_at timestamptz
)
returns text
language plpgsql
set search_path = ''
as $$
declare
  v public.bookings%rowtype;
  v_capacity integer;
begin
  select * into v from public.bookings where paystack_reference = p_reference for update;
  if not found then
    return 'not_found';
  end if;

  -- Already settled: repeat calls change nothing.
  if v.status in ('confirmed', 'completed') then
    return 'already_confirmed';
  end if;
  if v.paid_at is not null then
    return case when v.refund_required then 'refund_required' else 'already_confirmed' end;
  end if;

  if p_currency is distinct from 'NGN' or p_amount_kobo is null or p_amount_kobo < v.amount_due_kobo then
    update public.bookings
    set amount_paid_kobo = coalesce(p_amount_kobo, 0), paid_at = p_paid_at, refund_required = true
    where id = v.id;
    return 'amount_mismatch';
  end if;

  if v.status = 'pending_payment' and v.hold_expires_at > now() then
    update public.bookings
    set status = 'confirmed', amount_paid_kobo = p_amount_kobo, paid_at = p_paid_at, hold_expires_at = null
    where id = v.id;
    return 'confirmed';
  end if;

  if v.status in ('pending_payment', 'expired') then
    -- The hold lapsed. Same lock as create_booking, then confirm only if
    -- the slot is still free.
    perform 1 from public.branches b where b.id = v.branch_id for update;
    select capacity_per_slot into v_capacity from public.services where id = v.service_id;
    if public.live_bookings_overlapping(v.branch_id, v.service_id, v.start_at, v.end_at, v.id) < v_capacity then
      update public.bookings
      set status = 'confirmed', amount_paid_kobo = p_amount_kobo, paid_at = p_paid_at, hold_expires_at = null
      where id = v.id;
      return 'confirmed_late';
    end if;
    update public.bookings
    set status = 'expired', amount_paid_kobo = p_amount_kobo, paid_at = p_paid_at, refund_required = true
    where id = v.id;
    return 'refund_required';
  end if;

  -- cancelled, no_show, requested: not waiting for this money.
  update public.bookings
  set amount_paid_kobo = p_amount_kobo, paid_at = p_paid_at, refund_required = true
  where id = v.id;
  return 'refund_required';
end;
$$;

-- ---------------------------------------------------------------------------
-- expire_stale_holds: daily tidy-up (cron). Availability already ignores
-- lapsed holds; this sets their status and clears old throttle rows.
-- ---------------------------------------------------------------------------
create or replace function public.expire_stale_holds()
returns integer
language plpgsql
set search_path = ''
as $$
declare
  v_count integer;
begin
  update public.bookings
  set status = 'expired'
  where status = 'pending_payment' and hold_expires_at < now();
  get diagnostics v_count = row_count;

  delete from public.booking_attempts where created_at < now() - interval '1 day';
  return v_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- Only the service role may call these.
-- ---------------------------------------------------------------------------
revoke execute on function public.record_booking_attempt(text, text, integer, interval) from public, anon, authenticated;
revoke execute on function public.live_bookings_overlapping(uuid, uuid, timestamptz, timestamptz, uuid) from public, anon, authenticated;
revoke execute on function public.create_booking(uuid, uuid, timestamptz, text, text, text, text, timestamptz, text, integer) from public, anon, authenticated;
revoke execute on function public.release_booking(uuid) from public, anon, authenticated;
revoke execute on function public.confirm_booking_payment(text, bigint, text, timestamptz) from public, anon, authenticated;
revoke execute on function public.expire_stale_holds() from public, anon, authenticated;

grant execute on function public.record_booking_attempt(text, text, integer, interval) to service_role;
grant execute on function public.live_bookings_overlapping(uuid, uuid, timestamptz, timestamptz, uuid) to service_role;
grant execute on function public.create_booking(uuid, uuid, timestamptz, text, text, text, text, timestamptz, text, integer) to service_role;
grant execute on function public.release_booking(uuid) to service_role;
grant execute on function public.confirm_booking_payment(text, bigint, text, timestamptz) to service_role;
grant execute on function public.expire_stale_holds() to service_role;
