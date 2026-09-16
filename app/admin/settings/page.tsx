'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2 } from 'lucide-react';
import { supabase, type SiteSettings } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        setSettings(data as SiteSettings);
        setIsLoading(false);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);

    const { error } = await supabase
      .from('site_settings')
      .update({
        name: settings.name,
        email: settings.email,
        instagram: settings.instagram,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        about_text: settings.about_text,
        contact_cta_title: settings.contact_cta_title,
        contact_cta_subtitle: settings.contact_cta_subtitle,
        anime_project_url: settings.anime_project_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', settings.id);

    if (error) {
      toast.error('Failed to save settings');
    } else {
      toast.success('Settings saved');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500/30 border-t-violet-500" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <p className="text-sm text-muted-foreground">Settings not found.</p>
      </div>
    );
  }

  const fields = [
    { name: 'name', label: 'Name', type: 'input' },
    { name: 'email', label: 'Email', type: 'input' },
    { name: 'instagram', label: 'Instagram URL', type: 'input' },
    { name: 'anime_project_url', label: 'Anime Project URL', type: 'input' },
    { name: 'hero_title', label: 'Hero Title', type: 'input' },
    { name: 'hero_subtitle', label: 'Hero Subtitle', type: 'textarea' },
    { name: 'about_text', label: 'About Text', type: 'textarea' },
    { name: 'contact_cta_title', label: 'Contact CTA Title', type: 'input' },
    { name: 'contact_cta_subtitle', label: 'Contact CTA Subtitle', type: 'input' },
  ] as const;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-white">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit your portfolio content and contact information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`glass rounded-2xl p-6 ${
                field.type === 'textarea' ? 'md:col-span-2' : ''
              }`}
            >
              <label className="mb-2 block text-sm font-medium text-white">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  value={settings[field.name as keyof SiteSettings] as string}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              ) : (
                <input
                  name={field.name}
                  value={settings[field.name as keyof SiteSettings] as string}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-muted-foreground/50 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              )}
            </div>
          ))}
        </div>

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
          Save Settings
        </button>
      </form>
    </div>
  );
}
