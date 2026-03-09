"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User, Lock, Eye, EyeOff, CheckCircle, Mail } from "lucide-react";

interface ProfileSettingsProps {
  userId: string;
  email: string;
  initialFullName: string;
}

function FeedbackMessage({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const isSuccess = type === "success";
  return (
    <div
      className="mt-3 flex items-center gap-2 rounded-xl px-4 py-3 text-[14px]"
      style={{
        background: isSuccess
          ? "rgba(48,209,88,0.12)"
          : "rgba(255,69,58,0.12)",
        color: isSuccess ? "#30D158" : "#FF453A",
        border: `1px solid ${isSuccess ? "rgba(48,209,88,0.25)" : "rgba(255,69,58,0.25)"}`,
      }}
    >
      {isSuccess && <CheckCircle className="h-4 w-4 shrink-0" />}
      {message}
    </div>
  );
}

export function ProfileSettings({
  userId,
  email,
  initialFullName,
}: ProfileSettingsProps) {
  const router = useRouter();

  /* ── Display name state ── */
  const [fullName, setFullName] = useState(initialFullName);
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [namePending, startNameTransition] = useTransition();

  /* ── Password state ── */
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwPending, startPwTransition] = useTransition();

  /* ── Update display name ── */
  async function handleNameSave(e: React.FormEvent) {
    e.preventDefault();
    setNameMsg(null);

    startNameTransition(async () => {
      const supabase = createClient();

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
        .eq("id", userId);

      if (profileError) {
        setNameMsg({ type: "error", text: profileError.message });
        return;
      }

      // Also sync to auth user_metadata so the name is consistent
      await supabase.auth.updateUser({ data: { full_name: fullName.trim() } });

      setNameMsg({ type: "success", text: "Display name updated successfully." });
      router.refresh();
    });
  }

  /* ── Change password ── */
  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword.length < 6) {
      setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    startPwTransition(async () => {
      const supabase = createClient();

      // Re-authenticate with current password first to verify identity
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        setPwMsg({ type: "error", text: "Current password is incorrect." });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setPwMsg({ type: "error", text: updateError.message });
        return;
      }

      setPwMsg({ type: "success", text: "Password changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    });
  }

  /* ── Initials avatar ── */
  const initials = fullName
    ? fullName.trim().split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : email.slice(0, 2).toUpperCase();

  return (
    <div className="p-6 lg:p-8">
      {/* iOS large title header */}
      <div className="mb-8">
        <p
          className="mb-1 text-[11px] font-semibold uppercase tracking-widest"
          style={{ color: "rgba(235,235,245,0.4)" }}
        >
          My Account
        </p>
        <h1 className="text-[34px] font-bold leading-tight text-white">Settings</h1>
      </div>

      <div className="mx-auto max-w-lg space-y-5">
        {/* ── Avatar + email banner ── */}
        <div
          className="flex items-center gap-4 rounded-2xl p-5"
          style={{ background: "#1C1C1E" }}
        >
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-[20px] font-bold text-white shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #0A84FF, #BF5AF2)",
            }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[17px] font-semibold text-white">
              {fullName || email.split("@")[0]}
            </p>
            <div className="mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: "rgba(235,235,245,0.4)" }} />
              <p className="truncate text-[13px]" style={{ color: "rgba(235,235,245,0.55)" }}>
                {email}
              </p>
            </div>
          </div>
        </div>

        {/* ── Display name section ── */}
        <section className="rounded-2xl p-5" style={{ background: "#1C1C1E" }}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px]"
              style={{ background: "#BF5AF2" }}
            >
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-white">Display Name</h2>
              <p className="text-[12px]" style={{ color: "rgba(235,235,245,0.45)" }}>
                This is how your name appears to others
              </p>
            </div>
          </div>

          <form onSubmit={handleNameSave} className="space-y-3">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder-[rgba(235,235,245,0.3)] outline-none"
              style={{ background: "#2C2C2E", border: "none" }}
              onFocus={(e) => (e.target.style.outline = "2px solid #0A84FF")}
              onBlur={(e) => (e.target.style.outline = "none")}
            />

            {nameMsg && <FeedbackMessage type={nameMsg.type} message={nameMsg.text} />}

            <button
              type="submit"
              disabled={namePending}
              className="w-full rounded-xl py-3 text-[15px] font-semibold text-white ios-spring active:scale-[0.98] disabled:opacity-50"
              style={{ background: "#0A84FF" }}
            >
              {namePending ? "Saving…" : "Save Name"}
            </button>
          </form>
        </section>

        {/* ── Change password section ── */}
        <section className="rounded-2xl p-5" style={{ background: "#1C1C1E" }}>
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-[10px]"
              style={{ background: "#FF9F0A" }}
            >
              <Lock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-white">Change Password</h2>
              <p className="text-[12px]" style={{ color: "rgba(235,235,245,0.45)" }}>
                You&apos;ll need your current password to make changes
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-3">
            {/* Current password */}
            <div>
              <label
                className="mb-1 block text-[12px] font-medium"
                style={{ color: "rgba(235,235,245,0.55)" }}
              >
                Current password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder-[rgba(235,235,245,0.3)] outline-none"
                style={{ background: "#2C2C2E", border: "none" }}
                onFocus={(e) => (e.target.style.outline = "2px solid #0A84FF")}
                onBlur={(e) => (e.target.style.outline = "none")}
              />
            </div>

            {/* New password */}
            <div>
              <label
                className="mb-1 block text-[12px] font-medium"
                style={{ color: "rgba(235,235,245,0.55)" }}
              >
                New password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(235,235,245,0.4)" }}
                >
                  {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label
                className="mb-1 block text-[12px] font-medium"
                style={{ color: "rgba(235,235,245,0.55)" }}
              >
                Confirm new password
              </label>
              <input
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className="w-full rounded-xl px-4 py-3 text-[15px] text-white placeholder-[rgba(235,235,245,0.3)] outline-none"
                style={{ background: "#2C2C2E", border: "none" }}
                onFocus={(e) => (e.target.style.outline = "2px solid #0A84FF")}
                onBlur={(e) => (e.target.style.outline = "none")}
              />
            </div>

            {pwMsg && <FeedbackMessage type={pwMsg.type} message={pwMsg.text} />}

            <button
              type="submit"
              disabled={pwPending}
              className="w-full rounded-xl py-3 text-[15px] font-semibold text-white ios-spring active:scale-[0.98] disabled:opacity-50"
              style={{ background: "#FF9F0A" }}
            >
              {pwPending ? "Updating…" : "Change Password"}
            </button>
          </form>
        </section>

        {/* ── Forgot password hint ── */}
        <p className="text-center text-[13px]" style={{ color: "rgba(235,235,245,0.4)" }}>
          Don&apos;t remember your current password?{" "}
          <a href="/auth/forgot-password" style={{ color: "#0A84FF" }}>
            Reset it via email
          </a>
        </p>
      </div>
    </div>
  );
}
