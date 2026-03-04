-- Allow everyone to read course metadata (title, description, thumbnail) so
-- locked courses can be displayed in the UI. The course_lessons policy
-- (from migration 010) still restricts actual lesson content to authorised users.

DROP POLICY IF EXISTS "Video courses viewable with access" ON public.video_courses;

CREATE POLICY "Video courses metadata viewable by all"
  ON public.video_courses FOR SELECT
  USING (true);
