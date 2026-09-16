/*
# Storage policies for portfolio-media bucket

1. Security
- Public can read files from portfolio-media bucket
- Authenticated users can upload, update, delete files
*/

DROP POLICY IF EXISTS "public_read_portfolio_media" ON storage.objects;
CREATE POLICY "public_read_portfolio_media"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_insert_portfolio_media" ON storage.objects;
CREATE POLICY "auth_insert_portfolio_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_update_portfolio_media" ON storage.objects;
CREATE POLICY "auth_update_portfolio_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-media') WITH CHECK (bucket_id = 'portfolio-media');

DROP POLICY IF EXISTS "auth_delete_portfolio_media" ON storage.objects;
CREATE POLICY "auth_delete_portfolio_media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-media');