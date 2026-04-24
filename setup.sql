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

-- Admin policies — allow digital@kitemediaconcept.com to manage all events
create policy "Admin can view all events"
  on events for select
  using ( auth.jwt() ->> 'email' = 'digital@kitemediaconcept.com' );

create policy "Admin can update all events"
  on events for update
  using ( auth.jwt() ->> 'email' = 'digital@kitemediaconcept.com' );

create policy "Admin can delete all events"
  on events for delete
  using ( auth.jwt() ->> 'email' = 'digital@kitemediaconcept.com' );

-- 4. Bookings Setup
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  user_name text not null,
  user_email text not null,
  user_phone text not null,
  occupation text not null,
  amount_paid numeric not null,
  payment_status text not null default 'pending',
  stripe_session_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Bookings
alter table bookings enable row level security;

create policy "Allow public booking insertion"
  on bookings for insert
  with check ( true );

create policy "Admin can view all bookings"
  on bookings for select
  using ( auth.jwt() ->> 'email' = 'digital@kitemediaconcept.com' );

create policy "Admin can update bookings"
  on bookings for update
  using ( auth.jwt() ->> 'email' = 'digital@kitemediaconcept.com' );
