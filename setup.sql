-- UVENTER SUPABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor (SQL Tools -> New Query)

-- 1. Create the events table
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_name text not null,
  contact_details text not null,
  event_date date not null,
  price numeric not null,
  image_url text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Storage Setup
-- NOTE: Manual action required in Supabase UI:
-- Go to Storage -> New Bucket -> Name it 'events' -> Set it to 'Public'.

-- 3. (Optional) Row Level Security (RLS)
-- By default, you may need to allow anonymous inserts if you don't have auth setup yet.
alter table events enable row level security;

-- Add user_id column if it doesn't exist
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='user_id') then
    alter table events add column user_id uuid references auth.users(id);
  end if;
end $$;

create policy "Allow public read access"
  on events for select
  using ( status = 'approved' );

create policy "Allow public insert access"
  on events for insert
  with check ( true );

create policy "Users can view their own submissions"
  on events for select
  using ( auth.uid() = user_id );
