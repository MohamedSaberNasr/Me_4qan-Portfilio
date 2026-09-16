'use client';
import { RevealText } from './reveal-text';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type AboutSectionProps = {
  aboutText: string;
};

export function AboutSection({ aboutText }: AboutSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [24, -24]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0.5]);
  const headingBlur = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [2, 0, 0, 1]);
  const headingFilter = useTransform(headingBlur, (b) => `blur(${b}px)`);

  const words = aboutText.split(' ');

  return (
    <section ref={ref} id="about" className="relative px-6 py-24 sm:py-32">
      <motion.div
        className="ambient-glow h-[400px] w-[400px] bg-ink-600/30"
        style={{ top: '30%', right: '-5%' }}
        animate={reduced ? {} : { opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div style={reduced ? {} : { y, opacity }} className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-violet-400"
          >
            <motion.span
              animate={reduced ? {} : { rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-3 w-3" />
            </motion.span>
            About
          </motion.span>

          <h2
            
            className="relative text-3xl font-bold tracking-tight text-white text-glow sm:text-4xl md:text-5xl"
          >
            <RevealText>Me_4qan — focused on</RevealText>{' '}
            <RevealText className="gradient-text text-glow-accent" delay={0.12}>SaaS, technology & visual storytelling</RevealText>
          </h2>

          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            <RevealText delay={0.1}>{aboutText}</RevealText>
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
