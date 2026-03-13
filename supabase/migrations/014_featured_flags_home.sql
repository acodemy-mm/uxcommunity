-- Featured flags for home surface
ALTER TABLE public.video_courses
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

ALTER TABLE public.podcasts
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

ALTER TABLE public.job_posts
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

