-- Enable idempotent upserts by user_id on public.students.
CREATE UNIQUE INDEX IF NOT EXISTS students_user_id_key
  ON public.students(user_id)
  WHERE user_id IS NOT NULL;