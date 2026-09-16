import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  detectSessionInUrl: true,
  flowType: 'pkce',
  storage: typeof window !== 'undefined' ? localStorage : undefined,
  storageKey: 'portfolio-auth',
  },
});

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  detailed_description: string;
  role: string;
  tools: string[];
  year: string;
  thumbnail_url: string;
  video_url: string;
  external_url: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  project_type: string;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  name: string;
  email: string;
  instagram: string;
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  contact_cta_title: string;
  contact_cta_subtitle: string;
  anime_project_url: string;
  updated_at: string;
};

export const STORAGE_BUCKET = 'portfolio-media';
