// Read-only check that the Supabase project behind .env.local is set up
// for database bookings: keys valid, migrations applied, catalogue seeded,
// RLS keeping the public out of private tables. Writes nothing.
//
//   npm run db:check
//
// Exits 1 if any check fails.
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

let failed = 0;
const pass = (msg) => console.log(`  ok    ${msg}`);
const fail = (msg) => {
  failed += 1;
  console.log(`  FAIL  ${msg}`);
};

console.log("Supabase check");

// 1. Environment
if (!/^https:\/\/[a-z0-9]{20}\.supabase\.co\/?$/.test(url)) {
  fail("NEXT_PUBLIC_SUPABASE_URL should look like https://<project-ref>.supabase.co (Project Settings > API)");
}
if (!anonKey) fail("NEXT_PUBLIC_SUPABASE_ANON_KEY is empty");
else if (anonKey.startsWith("sb_secret_")) fail("NEXT_PUBLIC_SUPABASE_ANON_KEY holds a secret key: use the publishable key");
if (!serviceKey) fail("SUPABASE_SERVICE_ROLE_KEY is empty");
else if (serviceKey.startsWith("sb_publishable_")) fail("SUPABASE_SERVICE_ROLE_KEY holds the publishable key: use a secret key");
if (failed) {
  console.log(`\n${failed} problem(s) in .env.local. Fix and rerun.`);
  process.exit(1);
}
pass("environment variables present");

const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const anon = createClient(url, anonKey, options);
const admin = createClient(url, serviceKey, options);

// GET with limit(1), not head: true. postgrest-js turns a bodiless 404 (the
// answer to HEAD on a missing table) into "204, no error", which would read
// as an empty table.
async function count(client, table, filter) {
  let query = client.from(table).select("*", { count: "exact" }).limit(1);
  if (filter) query = filter(query);
  const { count: n, error } = await query;
  return { n: n ?? 0, error };
}

// 2. Service role: key works and every table exists
const tables = ["branches", "branch_hours", "blocked_dates", "services", "bookings", "payment_events", "booking_attempts", "admins"];
const totals = {};
for (const table of tables) {
  const { n, error } = await count(admin, table);
  if (error) {
    const hint = error.code === "42P01" || error.code === "PGRST205" ? " (migrations not applied?)" : "";
    fail(`secret key reads ${table}: ${error.message}${hint}`);
  } else {
    totals[table] = n;
  }
}
if (Object.keys(totals).length === tables.length) pass("secret key valid, all 8 tables exist");

// 3. Seed
if (totals.branches !== undefined) {
  if (totals.branches >= 2 && totals.services > 0 && totals.branch_hours > 0) {
    pass(`catalogue seeded: ${totals.branches} branches, ${totals.services} services, ${totals.branch_hours} opening-hour rows`);
  } else {
    fail(`catalogue looks empty: ${totals.branches} branches, ${totals.services} services, ${totals.branch_hours} hours`);
  }
}

// 4. Booking functions present. live_bookings_overlapping is a read-only
//    (stable) function; zero ids match nothing.
{
  const zero = "00000000-0000-0000-0000-000000000000";
  const { error } = await admin.rpc("live_bookings_overlapping", {
    p_branch_id: zero,
    p_service_id: zero,
    p_start: "2026-01-01T09:00:00Z",
    p_end: "2026-01-01T10:00:00Z",
  });
  if (error) fail(`booking functions: ${error.message}${error.code === "PGRST202" ? " (migrations not applied?)" : ""}`);
  else pass("booking functions installed");
}

// 5. Anon (publishable) key: reads the public catalogue only
{
  const { n, error } = await count(anon, "services");
  if (error) fail(`publishable key reads services: ${error.message}`);
  else if (totals.services > 0 && n === 0) fail("publishable key sees no services (RLS policy or key from another project?)");
  else pass(`publishable key valid, sees ${n} active services`);
}
for (const table of ["bookings", "payment_events", "booking_attempts", "admins"]) {
  const { data, error } = await anon.from(table).select("*").limit(1);
  if (error?.code === "PGRST205") fail(`${table} missing`);
  else if (error || (data ?? []).length === 0) pass(`public cannot read ${table}`);
  else fail(`PUBLIC CAN READ ${table}: RLS is not protecting it`);
}
{
  const { error } = await anon.from("services").update({ active: false }).eq("slug", "__never_matches__");
  if (error?.code === "PGRST205") fail("services missing");
  else if (error) pass("public cannot write the catalogue");
  else fail("public update on services was not refused");
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll Supabase checks passed.");
process.exit(failed ? 1 : 0);
