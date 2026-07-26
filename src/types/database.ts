export type UserRole = "user" | "admin";

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface VideoCourse {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  thumbnail?: string;
  duration_minutes?: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  episode_url: string;
  cover_image?: string;
  duration_minutes?: number;
  created_at: string;
  updated_at: string;
}

export interface JobPost {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  job_type: string;
  salary_range?: string;
  apply_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rules?: string;
  prize?: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

export type EnrollmentStatus = "pending" | "approved" | "rejected";
export type CohortStatus = "open" | "closed";

export interface EnrollmentProgram {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentCohort {
  id: string;
  program_id: string;
  name: string;
  starts_at: string;
  schedule_label: string;
  status: CohortStatus;
  sort_index: number;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentPriceTier {
  id: string;
  cohort_id: string;
  label: string;
  amount_mmk: number;
  per_seat: boolean;
  sold_out: boolean;
  sort_index: number;
  created_at: string;
  updated_at: string;
}

export interface StudentEnrollment {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  school?: string | null;
  education_level?: string | null;
  course_interest?: string | null;
  motivation?: string | null;
  status: EnrollmentStatus;
  admin_notes?: string | null;
  program_id?: string | null;
  cohort_id?: string | null;
  price_tier_id?: string | null;
  completed_prior_course?: boolean;
  consent_terms?: boolean;
  consent_data?: boolean;
  payment_method?: string | null;
  payment_note?: string | null;
  payment_confirmed?: boolean;
  amount_mmk?: number | null;
  created_at: string;
  updated_at: string;
}

export type EnrollmentCatalog = EnrollmentProgram & {
  cohorts: (EnrollmentCohort & { price_tiers: EnrollmentPriceTier[] })[];
};
