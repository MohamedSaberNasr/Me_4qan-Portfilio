# Portfolio admin security setup

The public anon key is intended for browser use. Database permissions decide what visitors can do. Never use a service_role or secret key in NEXT_PUBLIC variables.

1. In Supabase SQL Editor run `supabase/migrations/20260916010000_restrict_portfolio_admin.sql` against the existing project. This replaces write permissions on the portfolio tables, restricts portfolio-media writes, and removes the unused privileged upload function. Existing portfolio content stays in place. Unrelated storage bucket policies are preserved.
2. In Authentication > Users, create `mohsabmdr@gmail.com` if it does not already exist. Use a strong unique password; create a confirmed account using the dashboard. Do not add a second account if the email already exists.
3. Run `supabase/enable-portfolio-admin.sql` in SQL Editor. Only the project owner can approve admins; approval uses the Auth user ID, not editable user metadata.
4. Disable new user signup in Supabase Authentication settings. The website no longer offers signup, but hiding that button alone cannot disable the Auth API.
5. Upload the updated complete source to GitHub and redeploy Vercel. Keep the existing public Supabase URL and anon key environment variables. Open `/admin/login` and sign in with the approved account.

Verify in a private window that the portfolio still loads. An unapproved signed-in account must be denied the dashboard and database writes. Test the approved account by saving a reversible setting change and restoring it. Storage uploads should work only for approved admins. Run the included SQL authorization checks in SQL Editor; they roll back test writes.

The source update cannot apply permissions to the hosted database. Protection is effective only after you run the migration. The dashboard fails closed if authorization is missing or unavailable. Site settings are public portfolio content; do not store passwords or secret keys there. Existing browser downloads/cached assets cannot be revoked by this migration.
