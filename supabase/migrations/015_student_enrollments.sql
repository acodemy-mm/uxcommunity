-- Public student enrollment applications (admins review status)
CREATE TABLE IF NOT EXISTS public.student_enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  school TEXT,
  education_level TEXT,
  course_interest TEXT,
  motivation TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can submit an application
CREATE POLICY "Anyone can submit enrollment"
  ON public.student_enrollments FOR INSERT
  WITH CHECK (true);

-- Only admins can read applications
CREATE POLICY "Admins can read enrollments"
  ON public.student_enrollments FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Only admins can update applications (status, notes)
CREATE POLICY "Admins can update enrollments"
  ON public.student_enrollments FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Only admins can delete applications
CREATE POLICY "Admins can delete enrollments"
  ON public.student_enrollments FOR DELETE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE INDEX idx_student_enrollments_status ON public.student_enrollments(status);
CREATE INDEX idx_student_enrollments_created ON public.student_enrollments(created_at DESC);
