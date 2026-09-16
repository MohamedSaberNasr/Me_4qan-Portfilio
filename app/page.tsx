import { PortfolioEffects } from '@/components/portfolio/portfolio-effects';
import { withProjectCover } from '@/lib/project-cover';
import { Navigation } from '@/components/portfolio/navigation';
import { Hero } from '@/components/portfolio/hero';
import { WorkSection } from '@/components/portfolio/work-section';
import { AboutSection } from '@/components/portfolio/about-section';
import { CapabilitiesSection } from '@/components/portfolio/capabilities-section';
import { ContactSection } from '@/components/portfolio/contact-section';
import { Footer } from '@/components/portfolio/footer';
import { CustomCursor } from '@/components/portfolio/custom-cursor';
import { ScrollProgress } from '@/components/portfolio/scroll-progress';
import { getMainProjects, getExperimentalProjects, getSiteSettings } from '@/lib/data';

export default async function Home() {
  const [mainProjects, experimentalProjects, settings] = await Promise.all([
    getMainProjects(),
    getExperimentalProjects(),
    getSiteSettings(),
  ]);

  const heroTitle = settings?.hero_title || 'MOTION THAT MAKES PRODUCTS FEEL ALIVE.';
  const heroSubtitle =
    settings?.hero_subtitle ||
    'I create premium motion graphics, SaaS explainers, product visuals, and cinematic digital experiences for technology and modern brands.';
  const aboutText =
    settings?.about_text ||
    'Motion Designer focused on SaaS, technology, digital products, 3D, and visual storytelling. I help brands and products communicate complex ideas through premium motion design.';
  const email = settings?.email || 'Mohsabmdr@gmail.com';
  const instagram = settings?.instagram || 'https://www.instagram.com/me_4qan/';
  const ctaTitle = settings?.contact_cta_title || 'HAVE A PRODUCT WORTH SHOWING?';
  const ctaSubtitle = settings?.contact_cta_subtitle || "Let's turn your idea into motion.";
  const animeProjectUrl = settings?.anime_project_url || 'https://payhip.com/ME4QAN';

  return (
    <>
      <PortfolioEffects />
      <div className="noise" />
      <ScrollProgress />
      <CustomCursor />
      <Navigation />
      <main className="relative">
        <Hero heroTitle={heroTitle} heroSubtitle={heroSubtitle} />
        <WorkSection
          mainProjects={mainProjects.map(withProjectCover)}
          experimentalProjects={experimentalProjects.map(withProjectCover)}
          animeProjectUrl={animeProjectUrl}
        />
        <AboutSection aboutText={aboutText} />
        <CapabilitiesSection />
        <ContactSection
          email={email}
          instagram={instagram}
          ctaTitle={ctaTitle}
          ctaSubtitle={ctaSubtitle}
        />
      </main>
      <Footer email={email} instagram={instagram} />
    </>
  );
}
