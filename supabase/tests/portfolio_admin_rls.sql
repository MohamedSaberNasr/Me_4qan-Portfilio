-- Run AFTER the security migration and admin approval in Supabase SQL Editor.
-- All test writes roll back. Run the entire script together.
BEGIN;
SELECT set_config('request.jwt.claims', '{"role":"anon"}', true);
SET LOCAL ROLE anon;
DO $$ BEGIN
  IF public.is_portfolio_admin() THEN RAISE EXCEPTION 'Anonymous user was approved'; END IF;
  IF EXISTS (SELECT 1 FROM public.projects WHERE NOT is_published) THEN RAISE EXCEPTION 'Unpublished projects exposed'; END IF;
  PERFORM 1 FROM public.site_settings LIMIT 1;
  BEGIN
    INSERT INTO public.projects(title) VALUES ('SECURITY TEST - MUST ROLLBACK');
    RAISE EXCEPTION 'Anonymous insert unexpectedly allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claims', '{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}', true);
SET LOCAL ROLE authenticated;
DO $$ DECLARE affected integer; BEGIN
  IF public.is_portfolio_admin() THEN RAISE EXCEPTION 'Unapproved user was approved'; END IF;
  BEGIN
    INSERT INTO public.projects(title) VALUES ('SECURITY TEST - MUST ROLLBACK');
    RAISE EXCEPTION 'Unapproved project insert unexpectedly allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    INSERT INTO public.site_settings(name) VALUES ('SECURITY TEST');
    RAISE EXCEPTION 'Unapproved settings insert unexpectedly allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  UPDATE public.projects SET title = title;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Unapproved project update allowed'; END IF;
  DELETE FROM public.site_settings;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN RAISE EXCEPTION 'Unapproved settings delete allowed'; END IF;
  BEGIN
    INSERT INTO storage.objects(bucket_id, name) VALUES ('portfolio-media', 'security-test-denied');
    RAISE EXCEPTION 'Unapproved storage insert unexpectedly allowed';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
  BEGIN
    PERFORM 1 FROM portfolio_private.admins;
    RAISE EXCEPTION 'Private admin list accessible';
  EXCEPTION WHEN insufficient_privilege THEN NULL; END;
END $$;
RESET ROLE;
SELECT set_config('request.jwt.claims', json_build_object('sub', user_id, 'role', 'authenticated')::text, true)
FROM portfolio_private.admins WHERE user_id = (SELECT id FROM auth.users WHERE lower(email) = 'mohsabmdr@gmail.com');
SET LOCAL ROLE authenticated;
DO $$ BEGIN
  IF NOT public.is_portfolio_admin() THEN RAISE EXCEPTION 'Approved admin unavailable'; END IF;
  INSERT INTO public.projects(title, is_published) VALUES ('SECURITY TEST - MUST ROLLBACK', false);
  IF NOT EXISTS (SELECT 1 FROM public.projects WHERE title = 'SECURITY TEST - MUST ROLLBACK' AND NOT is_published)
    THEN RAISE EXCEPTION 'Admin cannot read unpublished project'; END IF;
  UPDATE public.projects SET description = 'test' WHERE title = 'SECURITY TEST - MUST ROLLBACK';
  DELETE FROM public.projects WHERE title = 'SECURITY TEST - MUST ROLLBACK';
END $$;
RESET ROLE;
DO $$ BEGIN
  IF to_regprocedure('public.upload_video_from_bytes(text,text,text)') IS NOT NULL
    THEN RAISE EXCEPTION 'Temporary privileged upload endpoint still exists'; END IF;
END $$;
ROLLBACK;
