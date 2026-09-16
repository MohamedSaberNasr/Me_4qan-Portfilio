# Portfolio refinements

The existing purple glass hero, logo timeline, section order, portfolio content and grid layouts remain. Supreme Spike is applied globally using Next.js local font loading and preloading. Source: https://fonts.cdnfonts.com/css/supreme-spike (26.7 KB WOFF). Supreme Spike is by Beary; verify the appropriate webfont license before public commercial deployment: https://www.myfonts.com/collections/supreme-spike-font-beary/ .

`RevealText` uses the installed Framer Motion library for word reveals with a restrained spring overshoot and pointer response. Existing scroll motion remains with smaller parallax/blur amplitudes. CSS radial light leaks cover the viewport and GSAP moves their transforms slowly; animations pause in hidden tabs. No WebGL or additional animation packages were added. Reduced motion disables the new spring, magnetic and light-leak movement and retains readable text.

Navigation/footer now use the supplied Jin-Woo image. The same image covers the anime project. Local SVG artwork covers the existing SaaS and Technology entries via `lib/project-cover.ts`; videos and metadata are unchanged. Card covers stay visible until video playback begins; failed or reduced-motion previews retain the image. Covers are also supplied as video posters in the existing details dialog.

Start a Project opens an accessible Radix dialog with required name/email, service, budget, timeline and project description. It validates locally, prepares a reviewable email brief, lets visitors edit or copy it, and opens a draft addressed to the existing contact email. Nothing is submitted to a backend and the interface explicitly states that the email still needs sending. No email provider or database schema was added.

## Run

`npm ci` then `npm run dev`, or `npm run build` then `npm start`.

## Checks

TypeScript and production build passed. Browser checks covered font loading, phone-width layout, project detail opening, the inquiry review and edit flow, and console errors. New effects use existing GSAP/Framer Motion; the home route reports about 201 KB first-load JavaScript. Reduced-motion branches were inspected in code; browser media emulation was unavailable. Existing Supabase bundling, metadataBase and img-optimization warnings are non-blocking.
