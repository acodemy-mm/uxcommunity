-- Course lessons (each video in a course)
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID NOT NULL REFERENCES public.video_courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  duration_minutes INTEGER,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Course lessons are viewable by everyone"
  ON public.course_lessons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage course lessons"
  ON public.course_lessons FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE INDEX idx_course_lessons_course_id ON public.course_lessons(course_id);
