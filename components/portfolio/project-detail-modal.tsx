'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play } from 'lucide-react';
import { useEffect } from 'react';
import type { Project } from '@/lib/supabase';

type ProjectDetailModalProps = {
  project: Project | null;
  onClose: () => void;
};

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
        >
          <div
            className="absolute inset-0 bg-ink-950/90 backdrop-blur-xl"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl"
          >
            <button
              onClick={onClose}
              className="glass absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Video */}
            <div className="relative aspect-video overflow-hidden rounded-t-3xl video-poster">
              {project.video_url ? (
                <video
                  src={project.video_url}
                  poster={project.thumbnail_url || undefined}
                  className="h-full w-full object-cover"
                  controls
                  autoPlay
                  loop
                  playsInline
                />
              ) : project.thumbnail_url ? (
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Play className="h-16 w-16 text-violet-500/30" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-10">
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="glass rounded-full px-3 py-1 text-xs font-medium text-violet-400">
                  {project.category}
                </span>
                <span className="text-xs text-muted-foreground">{project.year}</span>
                {project.is_featured && (
                  <span className="glass rounded-full px-3 py-1 text-xs font-medium text-amber-400">
                    Featured
                  </span>
                )}
              </div>

              <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {project.title}
              </h2>

              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                {project.detailed_description || project.description}
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Role
                  </h4>
                  <p className="text-sm text-white">{project.role || 'Motion Designer'}</p>
                </div>
                <div>
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Year
                  </h4>
                  <p className="text-sm text-white">{project.year}</p>
                </div>
                <div className="sm:col-span-2">
                  <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
                    Tools
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.length > 0 ? (
                      project.tools.map((tool) => (
                        <span
                          key={tool}
                          className="glass rounded-lg px-3 py-1.5 text-sm text-white"
                        >
                          {tool}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">No tools listed</span>
                    )}
                  </div>
                </div>
              </div>

              {project.external_url && (
                <a
                  href={project.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/40 hover:brightness-110"
                >
                  View Project
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
