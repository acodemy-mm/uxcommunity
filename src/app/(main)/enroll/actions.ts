"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type EnrollmentActionResult =
  | { success: true }
  | { success: false; error: string };

export type EnrollmentWizardPayload = {
  program_id: string;
  cohort_id: string;
  price_tier_id: string;
  amount_mmk: number;
  completed_prior_course: boolean;
  full_name: string;
  email: string;
  phone?: string;
  school?: string;
  education_level?: string;
  course_interest?: string;
  motivation: string;
  consent_terms: boolean;
  consent_data: boolean;
  payment_confirmed: boolean;
  payment_note?: string;
};

export async function submitEnrollment(
  payload: EnrollmentWizardPayload
): Promise<EnrollmentActionResult> {
  try {
    const full_name = payload.full_name?.trim();
    const email = payload.email?.trim();
    const motivation = payload.motivation?.trim();

    if (!full_name || !email) {
      return { success: false, error: "Full name and email are required." };
    }
    if (!payload.program_id || !payload.cohort_id || !payload.price_tier_id) {
      return { success: false, error: "Please select a cohort and price." };
    }
    if (!motivation || motivation.length < 20) {
      return {
        success: false,
        error: "Please share a bit more about why you want to join (20+ characters).",
      };
    }
    if (!payload.consent_terms || !payload.consent_data) {
      return { success: false, error: "Please accept the consent checkboxes." };
    }
    if (!payload.payment_confirmed) {
      return {
        success: false,
        error: "Please confirm you will transfer the enrollment fee.",
      };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("student_enrollments").insert({
      full_name,
      email,
      phone: payload.phone?.trim() || null,
      school: payload.school?.trim() || null,
      education_level: payload.education_level?.trim() || null,
      course_interest: payload.course_interest?.trim() || null,
      motivation,
      program_id: payload.program_id,
      cohort_id: payload.cohort_id,
      price_tier_id: payload.price_tier_id,
      amount_mmk: payload.amount_mmk,
      completed_prior_course: payload.completed_prior_course,
      consent_terms: payload.consent_terms,
      consent_data: payload.consent_data,
      payment_method: "bank_transfer",
      payment_confirmed: payload.payment_confirmed,
      payment_note: payload.payment_note?.trim() || null,
      status: "pending",
    });

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/enrollments");
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Failed to submit application.",
    };
  }
}
