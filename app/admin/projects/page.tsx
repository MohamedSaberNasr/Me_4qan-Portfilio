'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Star, Pencil, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import { supabase, type Project } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete project');
    } else {
      toast.success('Project deleted');
      loadProjects();
    }
  };

  const toggleFeatured = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_featured: !project.is_featured })
      .eq('id', project.id);
    if (error) {
      toast.error('Failed to update project');
    } else {
      toast.success('Project updated');
      loadProjects();
    }
  };

  const togglePublished = async (project: Project) => {
    const { error } = await supabase
      .from('projects')
      .update({ is_published: !project.is_published })
      .eq('id', project.id);
    if (error) {
      toast.error('Failed to update project');
    } else {
      toast.success('Project updated');
      loadProjects();
    }
  };

  const handleDragStart = (id: string) => setDraggedId(id);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = projects.findIndex((p) => p.id === draggedId);
    const targetIndex = projects.findIndex((p) => p.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newProjects = [...projects];
    const [moved] = newProjects.splice(draggedIndex, 1);
    newProjects.splice(targetIndex, 0, moved);

    const updates = newProjects.map((p, i) => ({
      id: p.id,
      display_order: i,
    }));

    setProjects(newProjects);
    setDraggedId(null);

    for (const update of updates) {
      await supabase
        .from('projects')
        .update({ display_order: update.display_order })
        .eq('id', update.id);
    }
    toast.success('Order updated');
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Drag to reorder · Click edit to modify
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

      {projects.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-16 text-center">
          <p className="text-sm text-muted-foreground">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <motion.div
              key={project.id}
              draggable
              onDragStart={() => handleDragStart(project.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(project.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass group flex items-center gap-4 rounded-xl p-4 transition-all hover:bg-white/5"
            >
              <div className="cursor-grab text-muted-foreground/40 hover:text-white">
                <GripVertical className="h-5 w-5" />
              </div>

              <div className="h-14 w-20 flex-shrink-0 overflow-hidden rounded-lg video-poster">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-ink-800">
                    <span className="text-xs text-muted-foreground/40">No image</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white">
                    {project.title}
                  </p>
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">
                    {project.project_type}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.category} · {project.year}
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleFeatured(project)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    project.is_featured
                      ? 'text-amber-400 hover:bg-amber-500/10'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  }`}
                  title={project.is_featured ? 'Unfeature' : 'Feature'}
                >
                  <Star className={`h-4 w-4 ${project.is_featured ? 'fill-amber-400' : ''}`} />
                </button>
                <button
                  onClick={() => togglePublished(project)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                    project.is_published
                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white'
                  }`}
                  title={project.is_published ? 'Unpublish' : 'Publish'}
                >
                  {project.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
