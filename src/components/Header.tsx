'use client';

import React from 'react';
import { Database, Sparkles, HelpCircle, ExternalLink, GitBranch, Rocket } from 'lucide-react';

interface HeaderProps {
  isConfigured: boolean;
  onOpenGuide: () => void;
  maskedUrl?: string | null;
}

export function Header({ isConfigured, onOpenGuide, maskedUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/10">
            <div className="h-full w-full bg-white dark:bg-zinc-900 rounded-[10px] flex items-center justify-center">
              <Database className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">
                Nexus<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                Demo
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Next.js + Supabase Backend + Vercel
            </p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Status Badge */}
          {isConfigured ? (
            <div
              title={maskedUrl ? `Connected to ${maskedUrl}` : 'Supabase is connected'}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden md:inline">Supabase Live</span>
              <span className="md:hidden">Live</span>
            </div>
          ) : (
            <button
              onClick={onOpenGuide}
              className="group flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-500 group-hover:rotate-12 transition-transform" />
              <span>Demo Mode (Connect DB)</span>
            </button>
          )}

          {/* Setup Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5 text-zinc-500" />
            <span className="hidden sm:inline">Setup Guide</span>
          </button>

          {/* GitHub / Deploy Links */}
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white rounded-lg transition-colors shadow-sm"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Deploy on Vercel</span>
          </a>
        </div>
      </div>
    </header>
  );
}
