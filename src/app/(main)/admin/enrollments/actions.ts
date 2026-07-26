"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import type { EnrollmentStatus } from "@/types/database";

export type EnrollmentAdminResult =
  | { success: true }
  | { success: false; error: string };

export async function updateEnrollmentStatus(
  id: string,
  status: EnrollmentStatus
): Promise<EnrollmentAdminResult> {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Only admins can update enrollments." };
    }

    if (!["pending", "approved", "rejected"].includes(status)) {
      return { success: false, error: "Invalid status." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("student_enrollments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/enrollments");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to update enrollment.",
    };
  }
}

export async function deleteEnrollment(
  id: string
): Promise<EnrollmentAdminResult> {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Only admins can delete enrollments." };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("student_enrollments")
      .delete()
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/enrollments");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to delete enrollment.",
    };
  }
}
