# Deploy the current portfolio to Vercel

This is the complete Next.js source project, including all local logo layers, Supreme Spike font, video covers, Jin-Woo image, inquiry form, admin screens, and Supabase migrations. The duplicate purple cursor has been removed; the standard mouse pointer remains with a soft background light.

1. Extract this archive. `package.json` is at the project root.
2. Upload the extracted source to your Git repository, then import that repository in Vercel. Alternatively run the Vercel CLI from the extracted folder.
3. Use the Next.js framework preset. Install: `npm ci`. Build: `npm run build`. Keep the default output directory.
4. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Vercel environment settings before building. Your existing public values are provided separately in `SUPABASE_PUBLIC_ENV.txt`. Use the same Supabase project to keep existing portfolio content and admin access.
5. In Supabase authentication settings, add your final Vercel domain as an allowed redirect URL and set the Site URL as appropriate for your existing authentication flow.

The inquiry form prepares an email draft; visitors still send the email themselves. Video URLs and portfolio content use the existing Supabase service, so those remote resources are not bundled as local video files. The included font source and license information is documented in `ENHANCEMENTS.md`.

For local use, copy `.env.example` to `.env.local`, fill in your public Supabase values, run `npm ci`, then `npm run dev`.

Generated build files and installed dependencies are excluded from the ZIP. Vercel installs dependencies and builds from source. Original Netlify configuration remains in the source but is not used by the included Vercel configuration.

The deployment package uses Next.js 15.5.24 and React 18.3.1. Next.js was updated from the original 13.5.1 release to a supported patched release; the existing design and application components remain in place. Reference: https://nextjs.org/blog/august-2026-security-release .

Validation: source type checking and linting passed (image optimization warnings remain). Archive checks verify assets and package/lockfile consistency. The final production build could not be completed locally because the environment rejects child-process spawning with EPERM; validate the build in Vercel before publishing.
