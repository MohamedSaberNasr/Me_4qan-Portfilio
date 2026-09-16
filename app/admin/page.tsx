'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FolderKanban, Star, Plus, TrendingUp, ArrowRight } from 'lucide-react';
import { supabase, type Project } from '@/lib/supabase';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });
    setProjects((data || []) as Project[]);
    setIsLoading(false);
  };

  const totalProjects = projects.length;
  const featuredProjects = projects.filter((p) => p.is_featured).length;
  const publishedProjects = projects.filter((p) => p.is_published).length;
  const recentProjects = projects.slice(0, 5);

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      icon: FolderKanban,
      color: 'from-violet-600/20 to-violet-500/10',
    },
    {
      label: 'Featured',
      value: featuredProjects,
      icon: Star,
      color: 'from-amber-600/20 to-amber-500/10',
    },
    {
      label: 'Published',
      value: publishedProjects,
      icon: TrendingUp,
      color: 'from-emerald-600/20 to-emerald-500/10',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your portfolio projects and settings
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/40 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/10"
              style={{ background: `linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--primary)/0.05))` }}
            >
              <stat.icon className="h-5 w-5 text-violet-400" />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Link
            href="/admin/projects"
            className="flex items-center gap-1 text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            No projects yet. Click &quot;Add Project&quot; to create your first one.
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-colors hover:bg-white/5"
              >
                <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg video-poster">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FolderKanban className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.category} · {project.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {project.is_featured && (
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      project.is_published
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-white/5 text-muted-foreground'
                    }`}
                  >
                    {project.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
