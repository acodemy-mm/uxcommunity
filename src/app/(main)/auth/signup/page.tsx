import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md text-center space-y-6 bg-slate-800 p-8 rounded-2xl border border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">UX Community</h1>
          <h2 className="mt-4 text-xl font-semibold text-slate-100">
            Invite only
          </h2>
          <p className="mt-2 text-slate-400">
            Public registration is disabled. An admin must create your account.
            If you already have credentials, sign in below.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="inline-flex w-full items-center justify-center py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-500"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
