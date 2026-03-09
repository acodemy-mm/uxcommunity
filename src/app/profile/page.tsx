import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileSettings } from "@/components/ProfileSettings";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single();

  return (
    <ProfileSettings
      userId={user.id}
      email={user.email ?? ""}
      initialFullName={profile?.full_name ?? ""}
    />
  );
}
