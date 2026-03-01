import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  // Use placeholders during build when env vars are not set (e.g. Vercel without env configured).
  // Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel for runtime.
  return createBrowserClient(
    supabaseUrl || "https://rgbjuudusfkejddabmtd.supabase.co",
    supabaseKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYmp1dWR1c2ZrZWpkZGFibXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNjE1NzMsImV4cCI6MjA4NzczNzU3M30.4Vvb400nQmlc9jVG6OTEzKDPyNtw20hB6zphItsWJ4Q"
  );
}
