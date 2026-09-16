import { supabase, type Project, type SiteSettings } from './supabase';

export async function getPublishedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return (data || []) as Project[];
}

export async function getMainProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .eq('project_type', 'main')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching main projects:', error);
    return [];
  }

  return (data || []) as Project[];
}

export async function getExperimentalProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .eq('project_type', 'experimental')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching experimental projects:', error);
    return [];
  }

  return (data || []) as Project[];
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }

  return data as SiteSettings;
}
