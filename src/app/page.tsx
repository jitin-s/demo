'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SetupGuideModal } from '@/components/SetupGuideModal';
import { StatsBar } from '@/components/StatsBar';
import { EntryForm } from '@/components/EntryForm';
import { EntryCard } from '@/components/EntryCard';
import { FilterControls, SortOption } from '@/components/FilterControls';
import { Entry } from '@/types/database';
import { 
  Sparkles, 
  Database, 
  RefreshCw, 
  Layers, 
  ShieldCheck, 
  Code, 
  Globe, 
  Info,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [maskedUrl, setMaskedUrl] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch status and entries
  const loadData = async () => {
    try {
      // 1. Check status
      const statusRes = await fetch('/api/status');
      const statusData = await statusRes.json();
      setIsConfigured(statusData.configured);
      setMaskedUrl(statusData.maskedUrl);

      // 2. Fetch entries
      const entriesRes = await fetch('/api/entries');
      const entriesData = await entriesRes.json();
      if (entriesData.entries) {
        setEntries(entriesData.entries);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleEntryAdded = (newEntry: Entry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleLikeUpdated = (id: string, newLikes: number) => {
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: newLikes } : item))
    );
  };

  // Filter and sort entries
  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        const matchesQuery =
          entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.message.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole =
          selectedRole === 'ALL' || entry.role.toLowerCase() === selectedRole.toLowerCase();
        return matchesQuery && matchesRole;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (sortBy === 'likes') {
          return (b.likes || 0) - (a.likes || 0);
        }
        return 0;
      });
  }, [entries, searchQuery, selectedRole, sortBy]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white transition-colors">
      {/* Navigation Header */}
      <Header
        isConfigured={isConfigured}
        maskedUrl={maskedUrl}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Banner when in Demo Mode */}
        {!isConfigured && !loading && (
          <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                  Running in Demo Preview Mode
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 max-w-2xl leading-relaxed">
                  Entries are currently loaded from mock data. You can test submissions and likes in real-time. Connect your Supabase credentials to activate full cloud PostgreSQL persistence!
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-600 hover:bg-amber-500 text-white shrink-0 shadow-sm transition-colors"
            >
              Open Setup Guide
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 mb-4">
            <Database className="h-3.5 w-3.5" />
            <span>Full-Stack Demo Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            Community Entry &amp; Feedback Hub
          </h1>
          <p className="mt-3 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A complete, production-ready starter demonstrating Next.js App Router, Supabase PostgreSQL backend with Row Level Security, and zero-config deployment to Vercel via GitHub.
          </p>
        </div>

        {/* Stats Overview */}
        <StatsBar entries={entries} isConfigured={isConfigured} />

        {/* Two-column layout: Form (Left) & Feed (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Entry Form & Tech Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <EntryForm
              onEntryAdded={handleEntryAdded}
              isConfigured={isConfigured}
              onOpenGuide={() => setIsGuideOpen(true)}
            />

            {/* Architecture Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2 mb-3">
                <Code className="h-4 w-4 text-emerald-500" />
                <span>Architecture &amp; Features</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Next.js 16 + React 19:</strong> Fast Server Components with client hydration.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Supabase Backend:</strong> PostgreSQL database with Row Level Security (RLS) policies.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>GitHub CI/CD:</strong> Seamless push-to-deploy workflow on Vercel.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Tailwind CSS:</strong> Modern, responsive dark/light mode interface.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Live Feed & Filters */}
          <div className="lg:col-span-7">
            {/* Filter and Search Bar */}
            <FilterControls
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalFiltered={filteredEntries.length}
            />

            {/* Section Header with Refresh */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Live Entries Feed
                </h2>
                {isConfigured && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-1.5 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                title="Refresh entries"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Entries List */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-32 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 animate-pulse p-5"
                  />
                ))}
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800">
                <Layers className="h-8 w-8 text-zinc-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  No entries found
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {searchQuery || selectedRole !== 'ALL'
                    ? 'Try clearing your filters or searching for something else.'
                    : 'Be the first to submit an entry using the form on the left!'}
                </p>
                {(searchQuery || selectedRole !== 'ALL') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRole('ALL');
                    }}
                    className="mt-4 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <EntryCard
                    key={entry.id}
                    entry={entry}
                    onLikeUpdated={handleLikeUpdated}
                    isConfigured={isConfigured}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 py-8 mt-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">NexusHub</span>
            <span>•</span>
            <span>Supabase + Next.js + Vercel Deployment Demo</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Setup Guide
            </button>
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Supabase Docs
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Vercel Docs
            </a>
          </div>
        </div>
      </footer>

      {/* Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        isConfigured={isConfigured}
      />
    </div>
  );
}
