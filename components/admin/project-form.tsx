'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Upload, ArrowLeft, X, Loader2 } from 'lucide-react';
import { supabase, type Project, STORAGE_BUCKET } from '@/lib/supabase';
import { toast } from 'sonner';

type ProjectFormProps = {
  project?: Project;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [toolsInput, setToolsInput] = useState(
    project?.tools?.join(', ') || ''
  );

  const [form, setForm] = useState({
    title: project?.title || '',
    category: project?.category || '',
    description: project?.description || '',
    detailed_description: project?.detailed_description || '',
    role: project?.role || 'Motion Designer',
    year: project?.year || String(new Date().getFullYear()),
    thumbnail_url: project?.thumbnail_url || '',
    video_url: project?.video_url || '',
    external_url: project?.external_url || '',
    is_featured: project?.is_featured || false,
    is_published: project?.is_published ?? true,
    project_type: project?.project_type || 'main',
  });

  const thumbRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const uploadFile = async (
    file: File,
    folder: string,
    onProgress?: (progress: number) => void
  ): Promise<string | null> => {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`;
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      toast.error(`Upload failed: ${error.message}`);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingThumb(true);
    const url = await uploadFile(file, 'thumbnails');
    if (url) {
      setForm((prev) => ({ ...prev, thumbnail_url: url }));
      toast.success('Thumbnail uploaded');
    }
    setIsUploadingThumb(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video file is too large (max 100MB). Consider using an external URL instead.');
      return;
    }
    setIsUploadingVideo(true);
    const url = await uploadFile(file, 'videos');
    if (url) {
      setForm((prev) => ({ ...prev, video_url: url }));
      toast.success('Video uploaded');
    }
    setIsUploadingVideo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsSaving(true);

    const tools = toolsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...form,
      tools,
    };

    try {
      if (project) {
        const { error } = await supabase
          .from('projects')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', project.id);
        if (error) throw error;
        toast.success('Project updated');
      } else {
        const { data: maxOrder } = await supabase
          .from('projects')
          .select('display_order')
          .order('display_order', { ascending: false })
          .limit(1)
          .maybeSingle();

        const nextOrder = (maxOrder as { display_order: number } | null)?.display_order ?? 0;

        const { error } = await supabase.from('projects').insert({
          ...payload,
          display_order: nextOrder + 1,
        });
        if (error) throw error;
        toast.success('Project created');
      }
      router.push('/admin/projects');
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/projects')}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {project ? 'Edit Project' : 'New Project'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="glass rounded-2xl p-6">
          <label className="mb-2 block text-sm font-medium text-white">
            Title <span className="text-red-400">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Project title"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Category + Year + Type */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <label className="mb-2 block text-sm font-medium text-white">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="SaaS Explainer"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div className="glass rounded-2xl p-6">
            <label className="mb-2 block text-sm font-medium text-white">Year</label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="2024"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div className="glass rounded-2xl p-6">
            <label className="mb-2 block text-sm font-medium text-white">Type</label>
            <select
              name="project_type"
              value={form.project_type}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="main">Main Project</option>
              <option value="experimental">Experimental</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="glass rounded-2xl p-6">
          <label className="mb-2 block text-sm font-medium text-white">
            Short Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="A brief description shown on the project card"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Detailed Description */}
        <div className="glass rounded-2xl p-6">
          <label className="mb-2 block text-sm font-medium text-white">
            Detailed Description
          </label>
          <textarea
            name="detailed_description"
            value={form.detailed_description}
            onChange={handleChange}
            rows={4}
            placeholder="A longer description shown in the project detail view"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Role + Tools */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="glass rounded-2xl p-6">
            <label className="mb-2 block text-sm font-medium text-white">Role</label>
            <input
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Motion Designer"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div className="glass rounded-2xl p-6">
            <label className="mb-2 block text-sm font-medium text-white">
              Tools (comma-separated)
            </label>
            <input
              value={toolsInput}
              onChange={(e) => setToolsInput(e.target.value)}
              placeholder="After Effects, Cinema 4D, Illustrator"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Media uploads */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Thumbnail */}
          <div className="glass rounded-2xl p-6">
            <label className="mb-2 block text-sm font-medium text-white">
              Thumbnail Image
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => thumbRef.current?.click()}
                  disabled={isUploadingThumb}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  {isUploadingThumb ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Image
                </button>
                <input
                  ref={thumbRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbUpload}
                  className="hidden"
                />
              </div>
              {form.thumbnail_url && (
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={form.thumbnail_url}
                    alt="Thumbnail preview"
                    className="aspect-video w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, thumbnail_url: '' }))
                    }
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              <input
                name="thumbnail_url"
                value={form.thumbnail_url}
                onChange={handleChange}
                placeholder="Or paste image URL"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none"
              />
            </div>
          </div>

          {/* Video */}
          <div className="glass rounded-2xl p-6">
            <label className="mb-2 block text-sm font-medium text-white">
              Video File
            </label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => videoRef.current?.click()}
                  disabled={isUploadingVideo}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3 text-sm text-white transition-colors hover:bg-white/10 disabled:opacity-50"
                >
                  {isUploadingVideo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Video
                </button>
                <input
                  ref={videoRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </div>
              {form.video_url && (
                <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-xs text-emerald-400">
                  Video URL set
                </div>
              )}
              <input
                name="video_url"
                value={form.video_url}
                onChange={handleChange}
                placeholder="Or paste video URL"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none"
              />
              <p className="text-xs text-muted-foreground/60">
                Max 100MB. For larger videos, use an external URL.
              </p>
            </div>
          </div>
        </div>

        {/* External URL */}
        <div className="glass rounded-2xl p-6">
          <label className="mb-2 block text-sm font-medium text-white">
            External URL (optional)
          </label>
          <input
            name="external_url"
            value={form.external_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
        </div>

        {/* Toggles */}
        <div className="glass flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
              className="h-5 w-5 rounded border-white/20 bg-white/5 accent-violet-500"
            />
            <span className="text-sm text-white">Featured</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
              className="h-5 w-5 rounded border-white/20 bg-white/5 accent-violet-500"
            />
            <span className="text-sm text-white">Published (visible on portfolio)</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/40 hover:brightness-110 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {project ? 'Save Changes' : 'Publish Project'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/projects')}
            className="rounded-xl border border-white/10 px-6 py-3 text-sm text-white transition-colors hover:bg-white/5"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
