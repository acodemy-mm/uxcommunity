-- All courses are private: only admins or users with explicit access can view.

-- Drop the old open-access policies
DROP POLICY IF EXISTS "Video courses are viewable by everyone" ON public.video_courses;
DROP POLICY IF EXISTS "Course lessons are viewable by everyone" ON public.course_lessons;

-- video_courses: viewable only by admins or users with an access row
CREATE POLICY "Video courses viewable with access"
  ON public.video_courses FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    OR auth.uid() IN (
      SELECT user_id FROM public.user_course_access WHERE course_id = video_courses.id
    )
  );

-- course_lessons: viewable only by admins or users with access to the parent course
CREATE POLICY "Course lessons viewable with access"
  ON public.course_lessons FOR SELECT
  USING (
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin')
    OR auth.uid() IN (
      SELECT user_id FROM public.user_course_access WHERE course_id = course_lessons.course_id
    )
  );
