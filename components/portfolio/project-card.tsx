'use client';
import { RevealText } from './reveal-text';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/supabase';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

type ProjectCardProps = {
  project: Project;
  index: number;
  onClick: () => void;
};

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [previewReady, setPreviewReady] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isHovered && !reduced) {
      video.play().catch(() => setPreviewReady(false));
    } else {
      video.pause();
      setPreviewReady(false);
    }
    return () => video.pause();
  }, [isHovered, reduced]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    damping: 20,
    stiffness: 200,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    damping: 20,
    stiffness: 200,
  });

  // Cursor spotlight position
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(300px circle at ${x}% ${y}%, rgba(124, 58, 237, 0.1), transparent 70%)`
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(px - 0.5);
    mouseY.set(py - 0.5);
    spotlightX.set(px * 100);
    spotlightY.set(py * 100);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    spotlightX.set(50);
    spotlightY.set(50);
  };

  const projectNumber = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 80, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={reduced ? { duration: 0.3, delay: index * 0.1 } : { duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title}`}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        style={reduced ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl glass glass-hover premium-hover"
        data-cursor="pointer"
      >
        {/* Cursor-reactive spotlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: reduced ? undefined : spotlightBg }}
        />

        {/* Glow on hover */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(600px circle at 50% 0%, rgba(124, 58, 237, 0.15), transparent 40%)',
          }}
        />

        {/* Video / Thumbnail */}
        <div className="relative aspect-video overflow-hidden video-poster">
          {project.thumbnail_url && (
            <img
              src={project.thumbnail_url}
              alt={project.title}
              loading="lazy"
              width="1200" height="675"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          {project.video_url && (
            <video
              ref={videoRef}
              src={project.video_url}
              poster={project.thumbnail_url || undefined}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                isHovered && previewReady && !reduced ? 'scale-105 opacity-100' : 'scale-100 opacity-0'
              }`}
              onPlaying={() => setPreviewReady(true)}
              onError={() => setPreviewReady(false)}
              muted
              loop
              playsInline
              preload="metadata"
            />
          )}
          {!project.video_url && !project.thumbnail_url && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <Play className="mx-auto h-12 w-12 text-violet-500/40" />
                <p className="mt-2 text-xs text-muted-foreground/50">
                  No media uploaded
                </p>
              </div>
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />

          {/* Project number */}
          <div className="absolute left-5 top-5">
            <span className="glass rounded-full px-3 py-1 text-xs font-medium text-violet-400">
              {projectNumber}
            </span>
          </div>

          {/* Featured badge */}
          {project.is_featured && (
            <div className="absolute right-5 top-5">
              <span className="glass rounded-full px-3 py-1 text-xs font-medium text-amber-400">
                Featured
              </span>
            </div>
          )}

          {/* Play indicator */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ x: '-50%', y: '-50%' }}
            animate={{ opacity: isHovered && previewReady ? 0 : 1 }}
          >
            <div className="glass-strong flex h-14 w-14 items-center justify-center rounded-full">
              <Play className="h-5 w-5 fill-white text-white" />
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="relative p-6">
          <div className="mb-2 flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-violet-400">
              {project.category}
            </span>
            <span className="text-xs text-muted-foreground/60">{project.year}</span>
          </div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-white">
            <RevealText>{project.title}</RevealText>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {project.tools.slice(0, 3).map((tool) => (
                <span
                  key={tool}
                  className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-xs text-violet-400 transition-transform group-hover:translate-x-0.5">
              View
              <ArrowUpRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
