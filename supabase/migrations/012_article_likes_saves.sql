-- article_likes: tracks which user liked which article
CREATE TABLE public.article_likes (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id  UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own likes"
  ON public.article_likes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own likes"
  ON public.article_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON public.article_likes FOR DELETE
  USING (auth.uid() = user_id);

-- article_saves: tracks which user saved which article
CREATE TABLE public.article_saves (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id  UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, article_id)
);

ALTER TABLE public.article_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saves"
  ON public.article_saves FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saves"
  ON public.article_saves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saves"
  ON public.article_saves FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: keep articles.likes_count in sync automatically
CREATE OR REPLACE FUNCTION sync_article_likes_count()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.articles SET likes_count = likes_count + 1 WHERE id = NEW.article_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.articles SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.article_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER article_likes_count_sync
  AFTER INSERT OR DELETE ON public.article_likes
  FOR EACH ROW EXECUTE FUNCTION sync_article_likes_count();
