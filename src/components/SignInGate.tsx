import Link from "next/link";
import { Lock } from "lucide-react";

interface SignInGateProps {
  title: string;
  description: string;
}

export function SignInGate({ title, description }: SignInGateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-slate-700/50 bg-[#16162a] py-16 px-6">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/20">
        <Lock className="h-7 w-7 text-indigo-400" />
      </div>
      <h2 className="mb-2 text-xl font-semibold text-white">{title}</h2>
      <p className="mb-6 max-w-sm text-center text-slate-400">{description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/auth/login"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="rounded-lg border border-slate-600 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/50"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
