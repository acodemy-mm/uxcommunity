-- Allow admins to update any profile (e.g. change role for user management)
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
