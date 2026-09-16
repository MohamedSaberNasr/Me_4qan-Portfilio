/*
# Create portfolio schema (projects + site_settings)

## Overview
Creates the database schema for a motion designer portfolio with an admin CMS.
Two tables: `projects` (portfolio work) and `site_settings` (editable site content).
Storage bucket `portfolio-media` for video/image uploads.

## 1. New Tables

### projects
- `id` (uuid, PK)
- `title` (text, not null) — project title
- `category` (text) — e.g. "SaaS Explainer", "3D", "Motion Graphics"
- `description` (text) — short description shown on cards
- `detailed_description` (text) — longer description shown in detail view
- `role` (text) — e.g. "Motion Designer"
- `tools` (text[]) — array of tools used, e.g. {"After Effects", "Cinema 4D"}
- `year` (text) — project year
- `thumbnail_url` (text) — poster/thumbnail image URL
- `video_url` (text) — video file URL (from storage or external)
- `external_url` (text) — optional external link
- `is_featured` (boolean, default false) — featured projects get special treatment
- `is_published` (boolean, default true) — only published projects show on the portfolio
- `display_order` (integer, default 0) — ordering for projects
- `project_type` (text, default 'main') — 'main' for primary work, 'experimental' for secondary
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### site_settings
- `id` (uuid, PK, single row)
- `name` (text) — site owner name
- `email` (text) — contact email
- `instagram` (text) — Instagram URL
- `hero_title` (text) — main hero headline
- `hero_subtitle` (text) — hero supporting text
- `about_text` (text) — about section content
- `contact_cta_title` (text) — final CTA headline
- `contact_cta_subtitle` (text) — final CTA supporting text
- `anime_project_url` (text) — external anime project link
- `updated_at` (timestamptz)

## 2. Storage
- Creates `portfolio-media` storage bucket (public read, authenticated write)

## 3. Security (RLS)
- projects: public can SELECT published projects; authenticated can do all CRUD
- site_settings: public can SELECT; authenticated can do all CRUD
- Storage: public can read; authenticated can upload/update/delete
*/