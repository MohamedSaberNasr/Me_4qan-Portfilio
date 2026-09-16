-- Apply in Supabase SQL Editor as the project owner. Keeps existing content.
BEGIN;
CREATE SCHEMA IF NOT EXISTS portfolio_private;
REVOKE ALL ON SCHEMA portfolio_private FROM PUBLIC, anon, authenticated;
CREATE TABLE IF NOT EXISTS portfolio_private.admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
ALTER TABLE portfolio_private.admins ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON portfolio_private.admins FROM PUBLIC, anon, authenticated;
CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = ''
AS $$ SELECT EXISTS (
  SELECT 1 FROM portfolio_private.admins WHERE user_id = (SELECT auth.uid())
); $$;
REVOKE ALL ON FUNCTION public.is_portfolio_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_portfolio_admin() TO anon, authenticated;
-- Remove the unused temporary privileged upload endpoint.
DROP FUNCTION IF EXISTS public.upload_video_from_bytes(text, text, text);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
-- These two tables belong exclusively to the portfolio. Replace their policies.
DO $$ DECLARE entry record; BEGIN
  FOR entry IN SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('projects', 'site_settings')
  LOOP EXECUTE format('DROP POLICY %I ON %I.%I', entry.policyname, entry.schemaname, entry.tablename); END LOOP;
END $$;
REVOKE ALL ON public.projects, public.site_settings FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.projects, public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects, public.site_settings TO authenticated;
CREATE POLICY public_select_published_projects ON public.projects
  FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY portfolio_admin_projects ON public.projects
  FOR ALL TO authenticated USING ((SELECT public.is_portfolio_admin()))
  WITH CHECK ((SELECT public.is_portfolio_admin()));
CREATE POLICY public_select_settings ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY portfolio_admin_settings ON public.site_settings
  FOR ALL TO authenticated USING ((SELECT public.is_portfolio_admin()))
  WITH CHECK ((SELECT public.is_portfolio_admin()));
-- Preserve policies for unrelated storage buckets.
DROP POLICY IF EXISTS auth_insert_portfolio_media ON storage.objects;
DROP POLICY IF EXISTS auth_update_portfolio_media ON storage.objects;
DROP POLICY IF EXISTS auth_delete_portfolio_media ON storage.objects;
DROP POLICY IF EXISTS portfolio_admin_media ON storage.objects;
CREATE POLICY portfolio_admin_media ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'portfolio-media' AND (SELECT public.is_portfolio_admin()))
  WITH CHECK (bucket_id = 'portfolio-media' AND (SELECT public.is_portfolio_admin()));
-- Restrictive guards also prevent unrelated broad policies allowing portfolio writes.
DROP POLICY IF EXISTS portfolio_media_insert_guard ON storage.objects;
CREATE POLICY portfolio_media_insert_guard ON storage.objects AS RESTRICTIVE
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id <> 'portfolio-media' OR (SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_media_update_guard ON storage.objects;
CREATE POLICY portfolio_media_update_guard ON storage.objects AS RESTRICTIVE
  FOR UPDATE TO anon, authenticated
  USING (bucket_id <> 'portfolio-media' OR (SELECT public.is_portfolio_admin()))
  WITH CHECK (bucket_id <> 'portfolio-media' OR (SELECT public.is_portfolio_admin()));
DROP POLICY IF EXISTS portfolio_media_delete_guard ON storage.objects;
CREATE POLICY portfolio_media_delete_guard ON storage.objects AS RESTRICTIVE
  FOR DELETE TO anon, authenticated
  USING (bucket_id <> 'portfolio-media' OR (SELECT public.is_portfolio_admin()));
COMMIT;
