import { createClient } from "@supabase/supabase-js";

/**
 * Server-only admin client using the service role key.
 * Use for actions that require elevated privileges (e.g. deleting auth users).
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is not set.
 */
export function createServerAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
