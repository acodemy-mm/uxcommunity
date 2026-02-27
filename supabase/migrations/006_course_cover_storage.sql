-- Storage bucket for course cover images (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-covers',
  'course-covers',
  true,
  5242880,
  ARRAY['image/png','image/jpeg','image/gif','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow public read for course covers
CREATE POLICY "Course covers are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-covers');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload course covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-covers' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Allow admins to update and delete
CREATE POLICY "Admins can update course covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-covers' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can delete course covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-covers' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );
