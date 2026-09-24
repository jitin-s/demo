import { Entry } from '@/types/database';

export const INITIAL_MOCK_ENTRIES: Entry[] = [
  {
    id: 'mock-1',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    name: 'Sarah Connor',
    email: 'sarah@example.com',
    role: 'Developer',
    message: 'Incredible template! Setting up Supabase with Next.js App Router and deploying on Vercel took less than 5 minutes.',
    rating: 5,
    social_url: 'https://github.com',
    likes: 12,
  },
  {
    id: 'mock-2',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    name: 'Alex Chen',
    email: 'alex.chen@designlab.io',
    role: 'Designer',
    message: 'The sleek glassmorphic UI and micro-interactions feel super responsive. Love the role filtering and star ratings.',
    rating: 5,
    social_url: 'https://twitter.com',
    likes: 8,
  },
  {
    id: 'mock-3',
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6 hours ago
    name: 'Elena Rostova',
    email: 'elena@startuphq.co',
    role: 'Founder',
    message: 'Perfect starting point for our MVP waitlist and user feedback collection. Clean TypeScript types and RLS policies included.',
    rating: 5,
    social_url: 'https://linkedin.com',
    likes: 15,
  },
  {
    id: 'mock-4',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12 hours ago
    name: 'Marcus Vance',
    email: 'marcus@cloudops.dev',
    role: 'DevOps',
    message: 'CI/CD pipeline with GitHub and Vercel worked flawlessly. Zero build errors out of the box!',
    rating: 4,
    social_url: 'https://github.com',
    likes: 6,
  },
];
