'use client';
import { RevealText } from './reveal-text';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Film, Box, Video } from 'lucide-react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const capabilities = [
  {
    icon: Film,
    title: 'Motion Design',
    items: ['SaaS Explainers', 'Product Animation', 'Motion Graphics', 'Visual Storytelling'],
  },
  {
    icon: Box,
    title: '3D',
    items: ['3D Product Visualization', '3D Motion', 'Product Scenes'],
  },
  {
    icon: Video,
    title: 'Video',
    items: ['Editing', 'Compositing', 'Visual Effects', 'Post Production'],
  },
];

export function CapabilitiesSection() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [18, -18]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [2, 0, 0, 1]);
  const titleFilter = useTransform(titleBlur, (b) => `blur(${b}px)`);

  return (
    <section ref={ref} className="relative px-6 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          style={(reduced ? {} : { y: titleY, filter: titleFilter }) as React.CSSProperties}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <motion.span
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-violet-400"
          >
            Capabilities
          </motion.span>
          <h2 className="relative overflow-hidden text-4xl font-bold tracking-tight text-white text-glow sm:text-5xl md:text-6xl">
            <RevealText>What I</RevealText>{' '}<RevealText className="gradient-text text-glow-accent" delay={0.1}>create</RevealText>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {capabilities.map((cap, index) => (
            <motion.div
              key={cap.title}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 60, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={reduced ? {} : { y: -8, transition: { duration: 0.3 } }}
              className="group glass glass-hover premium-hover relative overflow-hidden rounded-2xl p-8"
            >
              {/* Hover glow */}
              <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    'radial-gradient(400px circle at 50% 0%, rgba(124, 58, 237, 0.12), transparent 60%)',
                }}
              />

              <motion.div
                whileHover={reduced ? {} : { rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/20 to-violet-500/10 ring-1 ring-violet-600/20"
              >
                <cap.icon className="h-6 w-6 text-violet-400" />
              </motion.div>

              <h3 className="mb-4 text-xl font-semibold text-white"><RevealText>{cap.title}</RevealText></h3>
              <ul className="space-y-2">
                {cap.items.map((item, i) => (
                  <motion.li
                    key={item}
                    initial={reduced ? { opacity: 0 } : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.2 + i * 0.08 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-white"
                  >
                    <span className="h-1 w-1 rounded-full bg-violet-500" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
