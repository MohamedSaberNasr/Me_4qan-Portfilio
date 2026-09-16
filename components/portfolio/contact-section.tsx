'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { ProjectInquiry } from './project-inquiry';
import { RevealText } from './reveal-text';
import { Mail, Instagram, ArrowRight } from 'lucide-react';
import { MagneticButton } from './magnetic-button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type ContactSectionProps = {
  email: string;
  instagram: string;
  ctaTitle: string;
  ctaSubtitle: string;
};

export function ContactSection({
  email,
  instagram,
  ctaTitle,
  ctaSubtitle,
}: ContactSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.9, 1], [0, 1, 1, 0.5]);
  const headingBlur = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [8, 0, 0, 4]);
  const headingFilter = useTransform(headingBlur, (b) => `blur(${b}px)`);


  return (
    <section ref={ref} id="contact" className="relative px-6 py-24 sm:py-32">
      <motion.div
        className="ambient-glow h-[500px] w-[500px] bg-violet-600/15"
        style={{ bottom: '10%', left: '50%', transform: 'translateX(-50%)' }}
        animate={reduced ? {} : { opacity: [0.1, 0.25, 0.1], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={reduced ? {} : { scale, opacity }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            
            className="text-balance text-4xl font-bold tracking-tight text-white text-glow sm:text-5xl md:text-6xl"
          >
            <RevealText>{ctaTitle}</RevealText>
          </h2>

          <motion.p
            initial={reduced ? { opacity: 0 } : { opacity: 0, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            {ctaSubtitle}
          </motion.p>

          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <MagneticButton
              onClick={() => setInquiryOpen(true)}
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-8 py-4 text-sm font-medium text-white shadow-xl shadow-violet-600/25 transition-all hover:shadow-violet-600/40 hover:brightness-110"
            >
              Start a Project
              <motion.span
                className="inline-block"
                animate={reduced ? {} : { x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </MagneticButton>

            <MagneticButton
              onClick={() => window.open(instagram, '_blank')}
              className="glass glass-hover flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium text-white"
            >
              <Instagram className="h-4 w-4" />
              Instagram
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-16"
          >
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-violet-400"
            >
              <Mail className="h-4 w-4" />
              {email}
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
      <ProjectInquiry open={inquiryOpen} onOpenChange={setInquiryOpen} email={email} />
    </section>
  );
}
