import { NextResponse, type NextRequest } from "next/server";

// Proxy only passes the request through. Session refresh runs in server components and auth/callback
// to avoid "Error evaluating Node.js code" when Supabase SSR is bundled for Edge.
export async function proxy(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
