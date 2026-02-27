import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-100">Authentication Error</h1>
        <p className="mt-2 text-slate-400">
          Something went wrong during sign in. Please try again.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
