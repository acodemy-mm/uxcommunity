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
