# Purple glass scroll hero

Run `npm ci`, then `npm run dev`. Open http://localhost:3000.
For production run `npm run build` and `npm start`.

The existing Next.js portfolio, navigation, project dialogs, admin screens, Supabase migrations and settings remain in place. The uploaded archive contained the original text hero, so the new hero replaces that component directly; no frame sequence is loaded.

## Motion

`components/portfolio/hero.tsx` uses GSAP ScrollTrigger. Six transparent PNG layers in `public/logo` share an aligned canvas: ring, top, right, bottom, left, center. Scroll blooms each leaf with an individual translation, rotation, depth and scale; staggered regroup precedes the introduction to selected work. Pointer tilt adds desktop parallax. Reversing scroll reverses the timeline.

Desktop pin length is 3.2 viewport heights; mobile uses 2.2 and smaller offsets. The matchMedia lifecycle rebuilds at the mobile breakpoint and removes pinning and pointer interaction for reduced motion, including live preference changes. Reduced motion shows the assembled logo and accessible links in normal document flow. All triggers and event listeners are disposed on unmount.

## Validation

TypeScript checking and the Next.js production build passed. Browser inspection confirmed six loaded aligned layers, independent leaf transforms during scrub, regroup, desktop and 390px mobile compositions, and the existing portfolio content. The Home button now scrolls explicitly to zero because the hero is pinned. The navigation's Framer Motion horizontal centering is explicit to avoid overriding its CSS centering. The reduced-motion branch was checked in code; no browser media emulation was available. Existing Supabase bundling and metadataBase warnings remain non-blocking. Admin routes build successfully; no admin or database writes were performed.

## Assets and limits

The cached conversation provided AL3.png but no downloadable segmented layers. A transparent version was prepared from that PNG and separated into the ring, four leaves, and center. These are raster 2.5D layers, not a true rotating 3D mesh; rotations intentionally remain subtle. The connected center has masked cut boundaries during bloom. Assets preserve the purple glass appearance but background removal involves image reconstruction.

The included original `.env` carries the supplied project's public Supabase configuration. Keep any private deployment credentials out of source control. Supabase availability determines the existing site's portfolio content and admin behavior. No database changes are required.

The inquiry form now uses direct server email sending. Follow EMAIL_SETUP.md; the earlier email-draft workflow has been replaced.
