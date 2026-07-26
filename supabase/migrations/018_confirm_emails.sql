-- Confirm all existing Auth users so login works without email verification.
-- Also run this in Supabase SQL Editor, then disable "Confirm email" under:
-- Authentication → Providers → Email → Confirm email (OFF)

UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;
