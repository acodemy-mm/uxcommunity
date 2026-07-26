-- Programs, cohorts, price tiers for TPS-style enroll wizard
CREATE TABLE IF NOT EXISTS public.enrollment_programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enrollment_cohorts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.enrollment_programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  starts_at DATE NOT NULL,
  schedule_label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  sort_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enrollment_price_tiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cohort_id UUID NOT NULL REFERENCES public.enrollment_cohorts(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  amount_mmk INT NOT NULL,
  per_seat BOOLEAN NOT NULL DEFAULT false,
  sold_out BOOLEAN NOT NULL DEFAULT false,
  sort_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.enrollment_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_price_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read enrollment programs"
  ON public.enrollment_programs FOR SELECT USING (true);

CREATE POLICY "Public can read enrollment cohorts"
  ON public.enrollment_cohorts FOR SELECT USING (true);

CREATE POLICY "Public can read enrollment price tiers"
  ON public.enrollment_price_tiers FOR SELECT USING (true);

CREATE POLICY "Admins manage enrollment programs"
  ON public.enrollment_programs FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Admins manage enrollment cohorts"
  ON public.enrollment_cohorts FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Admins manage enrollment price tiers"
  ON public.enrollment_price_tiers FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Extend student applications for wizard fields
ALTER TABLE public.student_enrollments
  ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES public.enrollment_programs(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cohort_id UUID REFERENCES public.enrollment_cohorts(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS price_tier_id UUID REFERENCES public.enrollment_price_tiers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS completed_prior_course BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_terms BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consent_data BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'bank_transfer',
  ADD COLUMN IF NOT EXISTS payment_note TEXT,
  ADD COLUMN IF NOT EXISTS payment_confirmed BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS amount_mmk INT;

CREATE INDEX IF NOT EXISTS idx_enrollment_cohorts_program ON public.enrollment_cohorts(program_id);
CREATE INDEX IF NOT EXISTS idx_enrollment_price_tiers_cohort ON public.enrollment_price_tiers(cohort_id);
CREATE INDEX IF NOT EXISTS idx_student_enrollments_cohort ON public.student_enrollments(cohort_id);

-- Seed: UX Community Foundations + Batch 1 + three price tiers
DO $$
DECLARE
  prog_id UUID;
  cohort_id UUID;
BEGIN
  INSERT INTO public.enrollment_programs (title, slug)
  VALUES ('UX Community Foundations', 'foundations')
  ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
  RETURNING id INTO prog_id;

  SELECT id INTO prog_id FROM public.enrollment_programs WHERE slug = 'foundations';

  IF NOT EXISTS (
    SELECT 1 FROM public.enrollment_cohorts c
    WHERE c.program_id = prog_id AND c.name = 'Batch 1'
  ) THEN
    INSERT INTO public.enrollment_cohorts (program_id, name, starts_at, schedule_label, status, sort_index)
    VALUES (
      prog_id,
      'Batch 1',
      '2026-08-08',
      'Every Weekend, 9:00 - 10:30 AM (MMT)',
      'open',
      0
    )
    RETURNING id INTO cohort_id;

    INSERT INTO public.enrollment_price_tiers (cohort_id, label, amount_mmk, per_seat, sold_out, sort_index)
    VALUES
      (cohort_id, 'Regular', 400000, false, false, 0);
  END IF;
END $$;
