"use server";

import { createClient } from "@/lib/supabase/server";
import { createServerAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export type UserActionResult =
  | { success: true }
  | { success: false; error: string };

export async function removeUser(userId: string): Promise<UserActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized." };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin")
      return { success: false, error: "Only admins can remove users." };

    if (userId === user.id)
      return { success: false, error: "You cannot remove yourself." };

    const admin = createServerAdminClient();
    if (!admin)
      return {
        success: false,
        error:
          "Remove user is not configured. Add SUPABASE_SERVICE_ROLE_KEY to enable.",
      };

    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to remove user.",
    };
  }
}

export async function updateUserRole(
  profileId: string,
  role: "user" | "admin"
): Promise<UserActionResult> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized." };

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin")
      return { success: false, error: "Only admins can change roles." };

    if (role !== "user" && role !== "admin")
      return { success: false, error: "Invalid role." };

    const { error } = await supabase
      .from("profiles")
      .update({ role, updated_at: new Date().toISOString() })
      .eq("id", profileId);

    if (error) return { success: false, error: error.message };
    revalidatePath("/admin/users");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update role.",
    };
  }
}
