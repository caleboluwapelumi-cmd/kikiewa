import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/server/env";

/**
 * Service-role client: bypasses RLS. Used only by server code for the
 * private tables (bookings, payment_events, booking_attempts) and the
 * booking functions. Never send it, or anything it reads unfiltered, to the
 * browser.
 */
let client: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  client ??= createClient(supabaseUrl(), supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
