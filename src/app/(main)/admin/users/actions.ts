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

export async function createUser(input: {
  email: string;
  password: string;
  full_name?: string;
  role?: "user" | "admin";
}): Promise<UserActionResult> {
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
      return { success: false, error: "Only admins can create users." };

    const email = input.email?.trim().toLowerCase();
    const password = input.password ?? "";
    const full_name = input.full_name?.trim() || null;
    const role = input.role === "admin" ? "admin" : "user";

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters.",
      };
    }

    const admin = createServerAdminClient();
    if (!admin)
      return {
        success: false,
        error:
          "Create user is not configured. Add SUPABASE_SERVICE_ROLE_KEY to enable.",
      };

    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: full_name ? { full_name } : undefined,
    });

    if (error) return { success: false, error: error.message };
    if (!created.user)
      return { success: false, error: "Failed to create user." };

    // Ensure profile fields (trigger usually creates the row)
    const { error: profileError } = await admin.from("profiles").upsert({
      id: created.user.id,
      email,
      full_name,
      role,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      // User exists in auth; surface profile error so admin can fix role manually
      return {
        success: false,
        error: `User created but profile update failed: ${profileError.message}`,
      };
    }

    revalidatePath("/admin/users");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to create user.",
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
