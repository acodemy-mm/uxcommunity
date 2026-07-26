import Link from "next/link";
import { CreateUserForm } from "../CreateUserForm";

export default function NewUserPage() {
  return (
    <div>
      <Link
        href="/admin/users"
        className="text-indigo-400 hover:underline mb-6 inline-block"
      >
        ← Back to users
      </Link>

      <h2 className="text-xl font-semibold text-slate-100 mb-2">Create user</h2>
      <p className="text-slate-400 text-sm mb-6">
        Accounts are invite-only. Create an email and temporary password for the
        new member.
      </p>

      <CreateUserForm />
    </div>
  );
}
