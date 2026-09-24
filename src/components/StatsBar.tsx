'use client';

import React from 'react';
import { Entry } from '@/types/database';
import { Users, Star, Layers, Activity } from 'lucide-react';

interface StatsBarProps {
  entries: Entry[];
  isConfigured: boolean;
}

export function StatsBar({ entries, isConfigured }: StatsBarProps) {
  const totalCount = entries.length;

  const avgRating = totalCount > 0
    ? (entries.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1)
    : '5.0';

  // Calculate most common role
  const roleCounts: Record<string, number> = {};
  entries.forEach((e) => {
    roleCounts[e.role] = (roleCounts[e.role] || 0) + 1;
  });

  let topRole = 'None';
  let maxRoleCount = 0;
  Object.entries(roleCounts).forEach(([role, count]) => {
    if (count > maxRoleCount) {
      maxRoleCount = count;
      topRole = role;
    }
  });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* Total Entries */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-3.5">
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Entries</p>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{totalCount}</p>
        </div>
      </div>

      {/* Avg Rating */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-3.5">
        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Avg Rating</p>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{avgRating} <span className="text-xs font-normal text-zinc-400">/ 5.0</span></p>
        </div>
      </div>

      {/* Top Role */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-3.5">
        <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <Layers className="h-5 w-5" />
        </div>
        <div className="truncate">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Top Community</p>
          <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 truncate">{topRole}</p>
        </div>
      </div>

      {/* Backend Engine */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center space-x-3.5">
        <div className={`p-2.5 rounded-xl ${
          isConfigured 
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' 
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
        }`}>
          <Activity className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Backend Status</p>
          <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {isConfigured ? 'Supabase Postgres' : 'Demo Mode'}
          </p>
        </div>
      </div>
    </div>
  );
}
