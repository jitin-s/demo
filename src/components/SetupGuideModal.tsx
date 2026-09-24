'use client';

import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, Terminal, Key, Database, GitBranch, ArrowRight } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
}

const SQL_SCHEMA_SNIPPET = `-- Run this in your Supabase SQL Editor:
create table if not exists public.entries (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    email text not null,
    role text not null default 'Developer',
    message text not null,
    rating smallint default 5,
    social_url text,
    likes integer default 0
);

alter table public.entries enable row level security;

create policy "Allow public read access on entries" on public.entries for select using (true);
create policy "Allow public insert on entries" on public.entries for insert with check (true);
create policy "Allow public update on entries" on public.entries for update using (true) with check (true);

create index if not exists idx_entries_created_at on public.entries (created_at desc);
create index if not exists idx_entries_role on public.entries (role);`;

export function SetupGuideModal({ isOpen, onClose, isConfigured }: SetupGuideModalProps) {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_SNIPPET);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Supabase & Vercel Setup Guide
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isConfigured ? '✓ Supabase is already configured and active!' : 'Follow these 3 quick steps to connect your database and deploy.'}
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-6 text-sm text-zinc-600 dark:text-zinc-300">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500 text-white font-semibold text-xs">
                  1
                </span>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Create Supabase Table & RLS Policies
                </h3>
              </div>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                <span>Open Dashboard</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              Go to your Supabase project &gt; <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, paste this SQL and click <strong>Run</strong>:
            </p>
            <div className="relative">
              <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto max-h-36">
                {SQL_SCHEMA_SNIPPET}
              </pre>
              <button
                onClick={handleCopySql}
                className="absolute top-2 right-2 flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
              >
                {copiedSql ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy SQL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500 text-white font-semibold text-xs">
                  2
                </span>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Get API Credentials & Add to Environment
                </h3>
              </div>
              <a
                href="https://supabase.com/dashboard/project/_/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                <span>Project API Settings</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
              Copy your <strong>Project URL</strong> and <strong>anon public API key</strong> from Supabase Settings &gt; API.
              Add them to your local <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400">.env.local</code> file:
            </p>
            <div className="relative">
              <pre className="p-3 rounded-lg bg-zinc-900 text-zinc-200 text-xs font-mono overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`}
              </pre>
              <button
                onClick={handleCopyEnv}
                className="absolute top-2 right-2 flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
              >
                {copiedEnv ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Config</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="flex items-center space-x-2 mb-2">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500 text-white font-semibold text-xs">
                3
              </span>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Deploy to Vercel via GitHub
              </h3>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
              Push your code to a GitHub repository, then import it on Vercel:
            </p>
            <ol className="list-decimal list-inside space-x-0 space-y-1 text-xs text-zinc-600 dark:text-zinc-300">
              <li>Commit & push to GitHub: <code className="px-1 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono">git push -u origin main</code></li>
              <li>Go to <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">vercel.com/new</a> and select your GitHub repo.</li>
              <li>In Vercel <strong>Environment Variables</strong>, add <code className="font-mono">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.</li>
              <li>Click <strong>Deploy</strong>! Vercel builds your site in ~30 seconds with automatic CI/CD.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
          >
            Got it, Let&apos;s Go
          </button>
        </div>
      </div>
    </div>
  );
}
