'use client';
import { RevealText } from './reveal-text';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/supabase';
import { ProjectCard } from './project-card';
import { ProjectDetailModal } from './project-detail-modal';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type WorkSectionProps = {
  mainProjects: Project[];
  experimentalProjects: Project[];
  animeProjectUrl: string;
};

export function WorkSection({
  mainProjects,
  experimentalProjects,
  animeProjectUrl,
}: WorkSectionProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const titleBlur = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [2, 0, 0, 1]);
  const titleFilter = useTransform(titleBlur, (b) => `blur(${b}px)`);

  return (
    <section ref={ref} id="work" className="relative px-6 py-24 sm:py-32">
      <motion.div
        className="ambient-glow h-[500px] w-[500px] bg-violet-600/8"
        style={{ top: '20%', left: '-10%' }}
        animate={reduced ? {} : { opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          style={(reduced ? {} : { y: titleY, filter: titleFilter }) as React.CSSProperties}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, filter: 'blur(12px)' }}
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
            Selected Work
          </motion.span>

          <h2 className="relative overflow-hidden text-4xl font-bold tracking-tight text-white text-glow sm:text-5xl md:text-6xl">
            <RevealText>Projects that bring</RevealText><br />
            <RevealText className="gradient-text text-glow-accent" delay={0.12}>products to life</RevealText>
          </h2>
        </motion.div>

        {/* Main projects grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {mainProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>

        {/* Experimental / Anime project */}
        {experimentalProjects.length > 0 && (
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Experimental
              </span>
              <motion.div
                className="h-px flex-1 bg-gradient-to-r from-violet-600/30 to-transparent"
                initial={reduced ? { opacity: 0 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{ originX: 0 }}
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {experimentalProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, filter: 'blur(8px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reduced ? {} : { y: -6, transition: { duration: 0.3 } }}
                  className="group relative overflow-hidden rounded-2xl glass glass-hover premium-hover"
                >
                  <div className="relative aspect-[4/3] overflow-hidden video-poster">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url}
                        alt={project.title}
                        loading="lazy"
                        width="735" height="886"
                        style={{ objectPosition: '50% 30%' }}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-700 via-ink-600 to-ink-800">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-violet-500/30">EXP</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="glass rounded-full px-3 py-1 text-xs text-violet-400">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-semibold text-white">
                      <RevealText>{project.title}</RevealText>
                    </h3>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                    <a
                      href={project.external_url || animeProjectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
                    >
                      View Project
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
