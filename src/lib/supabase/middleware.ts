import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Auth cookie name prefixes used by Supabase. */
const AUTH_COOKIE_PREFIXES = ["sb-", "supabase-auth-token"];

function isAuthCookie(name: string) {
  return AUTH_COOKIE_PREFIXES.some((p) => name.startsWith(p));
}

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  const supabase = createServerClient(
    url || "https://placeholder.supabase.co",
    key || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  try {
    const { error } = await supabase.auth.getUser();

    // Invalid / expired refresh token — clear all stale auth cookies so the
    // browser stops sending them and the error stops appearing on every request.
    if (error && (error as { code?: string }).code === "refresh_token_not_found") {
      const clearResponse = NextResponse.next({ request });
      request.cookies.getAll().forEach(({ name }) => {
        if (isAuthCookie(name)) {
          clearResponse.cookies.set(name, "", { maxAge: 0, path: "/" });
        }
      });
      return clearResponse;
    }
  } catch {
    // Any unexpected error — just continue without clearing
  }

  return response;
}
