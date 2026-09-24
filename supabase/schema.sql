-- ============================================================
-- Supabase Schema for Nexus Entry Hub Demo
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- 1. Create the `entries` table
create table if not exists public.entries (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null check (char_length(name) >= 2),
    email text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    role text not null default 'Developer',
    message text not null check (char_length(message) >= 3),
    rating smallint default 5 check (rating >= 1 and rating <= 5),
    social_url text,
    likes integer default 0 check (likes >= 0)
);

-- 2. Enable Row Level Security (RLS)
alter table public.entries enable row level security;

-- 3. RLS Policies
-- Allow anyone to read entries
create policy "Allow public read access on entries"
on public.entries
for select
using (true);

-- Allow anyone to submit a new entry
create policy "Allow public insert on entries"
on public.entries
for insert
with check (true);

-- Allow anyone to increment/update likes
create policy "Allow public update on entries"
on public.entries
for update
using (true)
with check (true);

-- 4. Create indexes for performance
create index if not exists idx_entries_created_at on public.entries (created_at desc);
create index if not exists idx_entries_role on public.entries (role);

-- 5. Insert starter demo data
insert into public.entries (name, email, role, message, rating, social_url, likes)
values 
    ('Sarah Connor', 'sarah@example.com', 'Developer', 'Incredible template! Setting up Supabase with Next.js App Router and deploying on Vercel took less than 5 minutes.', 5, 'https://github.com', 12),
    ('Alex Chen', 'alex.chen@designlab.io', 'Designer', 'The glassmorphic design and micro-interactions feel super smooth. Love the star rating and role filters.', 5, 'https://twitter.com', 8),
    ('Elena Rostova', 'elena@startuphq.co', 'Founder', 'Perfect starting point for our MVP waitlist and feedback collection. Clean TypeScript types and RLS policies.', 5, 'https://linkedin.com', 15),
    ('Marcus Vance', 'marcus@cloudops.dev', 'DevOps', 'CI/CD pipeline with GitHub and Vercel worked flawlessly. Zero build errors out of the box!', 5, 'https://github.com', 6)
on conflict do nothing;
