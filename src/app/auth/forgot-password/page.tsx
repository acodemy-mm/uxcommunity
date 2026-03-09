"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${origin}/auth/callback?next=/auth/reset-password` }
    );

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div
          className="w-full max-w-md rounded-2xl p-8 text-center"
          style={{ background: "#1C1C1E" }}
        >
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: "rgba(48,209,88,0.15)" }}
          >
            <CheckCircle className="h-8 w-8" style={{ color: "#30D158" }} />
          </div>
          <h2 className="mb-2 text-[22px] font-bold text-white">Check your email</h2>
          <p className="mb-6 text-[15px]" style={{ color: "rgba(235,235,245,0.6)" }}>
            We sent a password reset link to{" "}
            <span className="font-medium text-white">{email}</span>. Check your
            inbox and click the link to set a new password.
          </p>
          <Link
            href="/auth/login"
            className="inline-block rounded-full px-6 py-2.5 text-[15px] font-semibold text-white"
            style={{ background: "#0A84FF" }}
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/auth/login"
          className="mb-6 inline-flex items-center gap-2 text-[15px] font-medium"
          style={{ color: "#0A84FF" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sign In
        </Link>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: "#1C1C1E" }}>
          {/* Icon */}
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: "rgba(10,132,255,0.15)" }}
          >
            <Mail className="h-7 w-7" style={{ color: "#0A84FF" }} />
          </div>

          <h1 className="mb-1 text-[28px] font-bold text-white">Forgot Password?</h1>
          <p className="mb-6 text-[15px]" style={{ color: "rgba(235,235,245,0.6)" }}>
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          {error && (
            <div
              className="mb-4 rounded-xl px-4 py-3 text-[14px]"
              style={{
                background: "rgba(255,69,58,0.12)",
                color: "#FF453A",
                border: "1px solid rgba(255,69,58,0.25)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-[13px] font-medium"
                style={{ color: "rgba(235,235,245,0.7)" }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder-[rgba(235,235,245,0.3)] outline-none focus:ring-2"
                style={{
                  background: "#2C2C2E",
                  border: "none",
                }}
                onFocus={(e) => (e.target.style.outline = "2px solid #0A84FF")}
                onBlur={(e) => (e.target.style.outline = "none")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl py-3 text-[15px] font-semibold text-white ios-spring active:scale-[0.98] disabled:opacity-50"
              style={{ background: "#0A84FF" }}
            >
              {loading ? "Sending…" : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
