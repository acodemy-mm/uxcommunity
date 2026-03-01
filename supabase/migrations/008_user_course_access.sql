-- Per-user access to video courses. If a course has no rows here, everyone can view.
-- If a course has at least one row, only listed users (and admins) can view.
CREATE TABLE IF NOT EXISTS public.user_course_access (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.video_courses(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_course_access ENABLE ROW LEVEL SECURITY;

-- Users can see their own access
CREATE POLICY "Users can read own course access"
  ON public.user_course_access FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can do everything
CREATE POLICY "Admins manage course access"
  ON public.user_course_access FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE INDEX idx_user_course_access_user ON public.user_course_access(user_id);
CREATE INDEX idx_user_course_access_course ON public.user_course_access(course_id);
