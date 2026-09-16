/*
# Create portfolio-media storage bucket

1. Storage
- Creates a public bucket named `portfolio-media` for project videos and images.
- The bucket is public so visitors can view media without authentication.
2. Security
- Storage policies (already applied in prior migration) control read/write access.
- Public read for anon + authenticated; authenticated-only for write operations.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;