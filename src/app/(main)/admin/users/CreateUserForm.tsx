"use client";

import { useState, useTransition } from "react";
import { createUser } from "./actions";

const inputClass =
  "w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500";

export function CreateUserForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createUser({
        email: String(formData.get("email") || ""),
        password: String(formData.get("password") || ""),
        full_name: String(formData.get("full_name") || ""),
        role: formData.get("role") === "admin" ? "admin" : "user",
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setSuccess("User created. They can sign in and change their password in Profile.");
      form.reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/20 text-red-400 text-sm border border-red-500/30">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm border border-emerald-500/30">
          {success}
        </div>
      )}

      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-slate-300 mb-2">
          Full name
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          className={inputClass}
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={inputClass}
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
          Temporary password
        </label>
        <input
          id="password"
          name="password"
          type="text"
          required
          minLength={6}
          className={inputClass}
          placeholder="At least 6 characters"
        />
        <p className="mt-1 text-xs text-slate-500">
          Share this with the user. They can change it after login in Profile.
        </p>
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
          Role
        </label>
        <select id="role" name="role" defaultValue="user" className={inputClass}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium disabled:opacity-50"
      >
        {isPending ? "Creating…" : "Create user"}
      </button>
    </form>
  );
}
