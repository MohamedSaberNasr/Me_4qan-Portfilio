/*
# Create projects and site_settings tables

1. New Tables
- `projects` — portfolio projects with video, metadata, ordering, featured/published flags
- `site_settings` — single-row table for editable site content (name, email, hero text, etc.)

2. Security
- Enable RLS on both tables.
- projects: anon+authenticated can SELECT published; authenticated can INSERT/UPDATE/DELETE.
- site_settings: anon+authenticated can SELECT; authenticated can do all CRUD.
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text DEFAULT '',
  description text DEFAULT '',
  detailed_description text DEFAULT '',
  role text DEFAULT '',
  tools text[] DEFAULT '{}',
  year text DEFAULT '',
  thumbnail_url text DEFAULT '',
  video_url text DEFAULT '',
  external_url text DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  project_type text NOT NULL DEFAULT 'main',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_published_projects" ON projects;
CREATE POLICY "public_select_published_projects"
ON projects FOR SELECT
TO anon, authenticated
USING (is_published = true);

DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects"
ON projects FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects"
ON projects FOR DELETE
TO authenticated
USING (true);

CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Motion Designer',
  email text NOT NULL DEFAULT 'Mohsabmdr@gmail.com',
  instagram text NOT NULL DEFAULT 'https://www.instagram.com/me_4qan/',
  hero_title text NOT NULL DEFAULT 'MOTION THAT MAKES PRODUCTS FEEL ALIVE.',
  hero_subtitle text NOT NULL DEFAULT 'I create premium motion graphics, SaaS explainers, product visuals, and cinematic digital experiences for technology and modern brands.',
  about_text text NOT NULL DEFAULT 'Motion Designer focused on SaaS, technology, digital products, 3D, and visual storytelling. I help brands and products communicate complex ideas through premium motion design.',
  contact_cta_title text NOT NULL DEFAULT 'HAVE A PRODUCT WORTH SHOWING?',
  contact_cta_subtitle text NOT NULL DEFAULT 'Let''s turn your idea into motion.',
  anime_project_url text NOT NULL DEFAULT 'https://payhip.com/ME4QAN',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_settings" ON site_settings;
CREATE POLICY "public_select_settings"
ON site_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON site_settings;
CREATE POLICY "auth_insert_settings"
ON site_settings FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_settings" ON site_settings;
CREATE POLICY "auth_update_settings"
ON site_settings FOR UPDATE
TO authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_settings" ON site_settings;
CREATE POLICY "auth_delete_settings"
ON site_settings FOR DELETE
TO authenticated
USING (true);

CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);