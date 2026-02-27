-- Create storage bucket for article images (public read)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'article-images',
  'article-images',
  true,
  5242880,
  ARRAY['image/png','image/jpeg','image/gif','image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Allow public read for article images
CREATE POLICY "Article images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'article-images');

-- Allow authenticated admins to upload
CREATE POLICY "Admins can upload article images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'article-images' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Allow admins to delete
CREATE POLICY "Admins can delete article images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'article-images' AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
  );

-- Article images for multiple uploads per article
CREATE TABLE IF NOT EXISTS public.article_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article images are viewable by everyone"
  ON public.article_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage article images"
  ON public.article_images FOR ALL
  USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE INDEX idx_article_images_article_id ON public.article_images(article_id);
