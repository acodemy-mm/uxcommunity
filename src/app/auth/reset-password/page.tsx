"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/"), 2500);
  }

  if (done) {
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
          <h2 className="mb-2 text-[22px] font-bold text-white">Password Updated!</h2>
          <p className="text-[15px]" style={{ color: "rgba(235,235,245,0.6)" }}>
            Your password has been changed. Redirecting you now…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8" style={{ background: "#1C1C1E" }}>
          {/* Icon */}
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ background: "rgba(10,132,255,0.15)" }}
          >
            <Lock className="h-7 w-7" style={{ color: "#0A84FF" }} />
          </div>

          <h1 className="mb-1 text-[28px] font-bold text-white">New Password</h1>
          <p className="mb-6 text-[15px]" style={{ color: "rgba(235,235,245,0.6)" }}>
            Choose a strong password for your account.
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
            {/* Password field */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-[13px] font-medium"
                style={{ color: "rgba(235,235,245,0.7)" }}
              >
                New password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl px-4 py-3 pr-12 text-[15px] text-white placeholder-[rgba(235,235,245,0.3)] outline-none"
                  style={{ background: "#2C2C2E", border: "none" }}
                  onFocus={(e) => (e.target.style.outline = "2px solid #0A84FF")}
                  onBlur={(e) => (e.target.style.outline = "none")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(235,235,245,0.4)" }}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirm"
                className="mb-1.5 block text-[13px] font-medium"
                style={{ color: "rgba(235,235,245,0.7)" }}
              >
                Confirm new password
              </label>
              <input
                id="confirm"
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Re-enter your password"
                className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder-[rgba(235,235,245,0.3)] outline-none"
                style={{ background: "#2C2C2E", border: "none" }}
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
              {loading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
