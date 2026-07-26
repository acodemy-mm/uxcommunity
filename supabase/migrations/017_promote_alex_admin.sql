-- Promote alex@alex.com to admin (run in Supabase SQL Editor if not already admin)
UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'alex@alex.com';
