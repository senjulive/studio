-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('verifications', 'verifications', false),
  ('chat_files', 'chat_files', false)
on conflict (id) do nothing;

-- Policies for 'verifications' bucket
-- Allow users to upload their own verification files
create policy "Allow users to upload verification files"
on storage.objects for insert to authenticated with check (
  bucket_id = 'verifications' and (storage.filename(name) like auth.uid() || '/%')
);

-- Allow admins/service_role to read all verification files
create policy "Allow service role to read verification files"
on storage.objects for select to service_role with check (
  bucket_id = 'verifications'
);


-- Policies for 'chat_files' bucket
-- Allow users to upload their own chat files
create policy "Allow users to upload chat files"
on storage.objects for insert to authenticated with check (
  bucket_id = 'chat_files' and (storage.filename(name) like auth.uid() || '/%')
);

-- Allow users to view their own uploaded files
create policy "Allow users to view their own chat files"
on storage.objects for select to authenticated using (
  bucket_id = 'chat_files' and (storage.filename(name) like auth.uid() || '/%')
);

-- Allow admins/service_role to read all chat files
create policy "Allow service role to read chat files"
on storage.objects for select to service_role with check (
  bucket_id = 'chat_files'
);
