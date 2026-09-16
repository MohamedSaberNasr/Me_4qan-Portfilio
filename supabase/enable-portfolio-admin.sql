-- First create this user in Supabase Authentication > Users (or use the existing account).
-- Run AFTER portfolio-security-fix.sql, in Supabase SQL Editor as the project owner.
BEGIN;
DO $$ DECLARE admin_id uuid; BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE lower(email) = 'mohsabmdr@gmail.com';
  IF admin_id IS NULL THEN RAISE EXCEPTION 'Create the admin Auth account mohsabmdr@gmail.com first'; END IF;
  INSERT INTO portfolio_private.admins(user_id) VALUES (admin_id) ON CONFLICT DO NOTHING;
END $$;
COMMIT;
-- Verify the approved account. This does not display passwords or tokens.
SELECT u.email, a.user_id FROM portfolio_private.admins a JOIN auth.users u ON u.id = a.user_id;
