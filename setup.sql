-- UVENTER SUPABASE SETUP SCRIPT
-- Run this in your Supabase SQL Editor (SQL Tools -> New Query)

-- 1. Create the events table
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  event_name text not null,
  contact_details text not null,
  event_date date not null,
  start_date date,
  end_date date,
  time_slot text,
  budget numeric,
  price numeric not null,
  location text,
  vision_requirements text,
  image_url text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add missing columns if table already exists
do $$ 
begin 
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='start_date') then
    alter table events add column start_date date;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='end_date') then
    alter table events add column end_date date;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='time_slot') then
    alter table events add column time_slot text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='budget') then
    alter table events add column budget numeric;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='location') then
    alter table events add column location text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='events' and column_name='vision_requirements') then
    alter table events add column vision_requirements text;
  end if;
end $$;

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
