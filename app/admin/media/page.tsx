'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Trash2, Copy, Loader2, FileVideo, FileImage } from 'lucide-react';
import { supabase, STORAGE_BUCKET } from '@/lib/supabase';
import { toast } from 'sonner';

type MediaFile = {
  name: string;
  id: string;
  publicUrl: string;
  size: number;
  createdAt: string;
  type: 'image' | 'video' | 'other';
};

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) {
      toast.error('Failed to load media');
      setIsLoading(false);
      return;
    }

    const mediaFiles: MediaFile[] = (data || [])
      .filter((f) => f.name && !f.name.endsWith('/'))
      .map((f) => {
        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(f.name);
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        const type: MediaFile['type'] = ['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)
          ? 'video'
          : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
          ? 'image'
          : 'other';
        return {
          name: f.name,
          id: f.id || f.name,
          publicUrl: urlData.publicUrl,
          size: (f.metadata as { size?: number })?.size || 0,
          createdAt: f.created_at || '',
          type,
        };
      });

    setFiles(mediaFiles);
    setIsLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length === 0) return;
    setIsUploading(true);

    for (const file of uploadedFiles) {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file);

      if (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    toast.success('Upload complete');
    setIsUploading(false);
    loadFiles();
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Delete this file? This cannot be undone.')) return;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([fileName]);
    if (error) {
      toast.error('Failed to delete file');
    } else {
      toast.success('File deleted');
      loadFiles();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Media</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload and manage project videos and images
          </p>
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-600/20 transition-all hover:shadow-violet-600/40 hover:brightness-110 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Upload
        </button>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
        </div>
      ) : files.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-2xl p-16 text-center">
          <p className="text-sm text-muted-foreground">No media files yet.</p>
          <button
            onClick={() => fileRef.current?.click()}
            className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-4 py-2 text-sm font-medium text-white"
          >
            <Upload className="h-4 w-4" />
            Upload files
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass group overflow-hidden rounded-xl"
            >
              <div className="relative aspect-video overflow-hidden video-poster">
                {file.type === 'image' ? (
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                ) : file.type === 'video' ? (
                  <video
                    src={file.publicUrl}
                    className="h-full w-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileImage className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => copyUrl(file.publicUrl)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-white"
                    title="Copy URL"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 text-red-400"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-1.5">
                  {file.type === 'video' ? (
                    <FileVideo className="h-3 w-3 text-violet-400" />
                  ) : (
                    <FileImage className="h-3 w-3 text-violet-400" />
                  )}
                  <p className="truncate text-xs text-white">{file.name}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatSize(file.size)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
