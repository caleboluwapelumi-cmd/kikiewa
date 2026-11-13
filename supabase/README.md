# Bookings: Supabase and Paystack

`/book` runs in one of two modes, set by `BOOKINGS_MODE` (server env, read at build time):

- `whatsapp` (default, and production until switched): the form builds a WhatsApp message. Nothing is stored and no keys are needed.
- `database`: live free times, bookings stored in Supabase, and Paystack for services that take payment. WhatsApp stays on offer as "Prefer WhatsApp?".

## Setting up database mode

1. **Supabase project.** Create one (region close to Lagos, e.g. eu-west). Keep a second, separate project for tests.
2. **Apply the migrations** with the Supabase CLI:
   ```sh
   supabase login
   supabase link --project-ref <ref>
   supabase db push
   ```
   This creates the tables, RLS policies and functions, and seeds both branches, their hours (Mon to Sat, 9:00 to 18:00) and every service from `data/site.ts`.
3. **Environment variables** (Vercel, and `.env.local` for development). See `.env.example`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY`, `CRON_SECRET`, `BOOKINGS_MODE=database`. Use Paystack **test** keys on previews.
4. **Paystack webhook.** In the Paystack dashboard (Settings > API Keys & Webhooks) set the webhook URL to `https://<host>/api/paystack/webhook` (test mode: the preview URL; live mode: `https://www.kikiewa.com/api/paystack/webhook`).
5. **Prices.** Seeded prices are empty, so every service books as a free request (`payment_mode = 'none'`). To take money for a service, set it in the `services` table:
   - full payment: `price_kobo = 1500000, payment_mode = 'full'` (₦15,000)
   - deposit: `payment_mode = 'deposit'` plus `deposit_kobo` or `deposit_percent` (with `price_kobo`)
   A database constraint refuses a payment mode without an amount.
6. **Durations.** Seeded durations are a 60 minute placeholder. Update `duration_mins` per service when known; it sets slot length. `capacity_per_slot` (default 1) is how many people can book the same service at the same time at one branch.
7. **Closures.** Add a row to `blocked_dates` (branch, date, reason) to close a branch for a day.

## How a booking flows

1. Step 3 asks the server for free slots (`loadAvailability`): opening hours, minus blocked dates, minus live bookings of that service (requested, confirmed, and pending payments whose 15 minute hold hasn't run out). Lagos time throughout; stored as UTC.
2. Sending calls the `createBooking` server action: zod validation, honeypot, throttle (5 attempts per phone and per IP per hour), service looked up by slug (the browser never sends a price), slot re-checked, then `create_booking()` in Postgres locks the branch row (`SELECT … FOR UPDATE`), re-checks capacity and inserts, working out the amount due from the services row.
3. No price: status `requested`, the customer sees "Request received" with their code.
4. Price set: status `pending_payment`, held 15 minutes, Paystack Initialize with the stored amount and a reference of the booking code plus a random suffix. The customer pays on Paystack and returns to `/book/status`.
5. Confirmation happens only in `confirmPayment()`, which asks Paystack Verify (status success, NGN, amount at least the amount due) and calls `confirm_booking_payment()`, which is idempotent. It is called by the webhook (after a verified signature, the event stored once in `payment_events`), by `/book/status`, and by the daily cron as a safety net.
6. A payment that arrives after the hold lapsed confirms if the slot is still free; otherwise the booking is flagged `refund_required` for staff.
7. Daily cron (`vercel.json`, 05:00 Lagos): re-checks recent unpaid holds with Paystack, marks lapsed holds expired, clears old throttle rows.

## Tests

`npm test` runs the unit tests. The database suite (`tests/database.integration.test.ts`) runs the real SQL functions against the **test** project when `.env.test.local` has `TEST_SUPABASE_URL`, `TEST_SUPABASE_SERVICE_ROLE_KEY` and `TEST_SUPABASE_ANON_KEY`; otherwise it is skipped.

The seed migration was generated from `data/site.ts` and **was applied to the live project on 2026-11-13** (pasted into the SQL Editor, together with the other two migrations, so the CLI has no record of them). It is history now: don't run `npm run db:seed` (it would rewrite the applied file). Add later menu changes as a new migration, or, from Prompt H, in the admin screens.

If you use the CLI with this project later, log in with the account that owns it, `supabase link`, then mark the three as applied before any `db push`:

```sh
supabase migration repair --status applied 20261113120000 20261113120100 20261113120200
```

`npm run db:check` checks the project in `.env.local` (read-only): keys, tables, functions, seed and RLS.
