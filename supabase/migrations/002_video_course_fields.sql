-- Add optional fields for course cards (matching reference design)
ALTER TABLE public.video_courses
  ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
  ADD COLUMN IF NOT EXISTS lessons_count INTEGER,
  ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1);
