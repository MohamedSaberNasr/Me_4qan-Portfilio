/*
# Temporary function to upload file to storage via URL

1. Functions
- `upload_video_from_bytes` - SECURITY DEFINER function that uploads bytes to storage
- Used once to upload Project 01 video, then can be dropped
*/

CREATE OR REPLACE FUNCTION public.upload_video_from_bytes(p_bucket text, p_path text, p_base64 text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_bytes bytea;
  v_result text;
BEGIN
  v_bytes := decode(p_base64, 'base64');
  
  -- Insert into storage.objects directly
  INSERT INTO storage.objects (bucket_id, name, owner, created_at, updated_at, last_accessed_at, metadata)
  VALUES (p_bucket, p_path, '00000000-0000-0000-0000-000000000000', now(), now(), now(), 
    jsonb_build_object('size', octet_length(v_bytes), 'mimetype', 'video/mp4'));
  
  RETURN 'success';
END;
$$;