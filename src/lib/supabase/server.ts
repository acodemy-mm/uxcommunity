import { cache } from "react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return createServerClient(
    url || "https://placeholder.supabase.co",
    key || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
          }
        },
      },
    }
  );
}

/** Cached per-request so Header, Sidebar, and page share one auth call.
 *  Returns null on expired / invalid refresh tokens instead of throwing. */
export const getCachedUser = cache(async () => {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch {
    return null;
  }
});

/** Cached per-request per userId so profile is fetched once. */
export const getCachedProfile = cache(async (userId: string | undefined) => {
  if (!userId) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
    return data;
  } catch {
    return null;
  }
});
