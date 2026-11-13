import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/server/env";

/**
 * Anon client for the public catalogue (branches, hours, blocked dates,
 * services). It runs under RLS, so it can only ever see active rows and
 * can write nothing. Cookie-free: no user session is involved here.
 * (Prompt H adds a cookie-aware @supabase/ssr client for signed-in admins.)
 */
let client: SupabaseClient | null = null;

export function supabasePublic(): SupabaseClient {
  client ??= createClient(supabaseUrl(), supabaseAnonKey(), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return client;
}
