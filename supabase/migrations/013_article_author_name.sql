-- Add author_name display field for articles
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS author_name TEXT;

