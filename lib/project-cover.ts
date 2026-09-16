import type { Project } from './supabase';

/** Local covers for the existing portfolio entries, shared by cards and video dialogs. */
export function withProjectCover(project: Project): Project {
  const title = project.title.toLowerCase();
  const cover = title.includes('saas product explainer') ? '/covers/saas-cover.svg'
    : title.includes('technology product motion') ? '/covers/tech-cover.svg'
    : title.includes('anime') ? '/brand/avatar.png'
    : project.thumbnail_url;
  return { ...project, thumbnail_url: cover };
}
