import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) return null;
    return user;
  } catch {
    return null;
  }
}

export async function getUserProfile() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return profile;
  } catch {
    return null;
  }
}

export async function isAdmin() {
  const profile = await getUserProfile();
  return profile?.role === "admin";
}
