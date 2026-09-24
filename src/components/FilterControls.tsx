'use client';

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { AVAILABLE_ROLES } from '@/types/database';

export type SortOption = 'newest' | 'oldest' | 'rating' | 'likes';

interface FilterControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFiltered: number;
}

export function FilterControls({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  sortBy,
  onSortChange,
  totalFiltered,
}: FilterControlsProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm mb-6 space-y-4">
      {/* Top row: Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search entries by name or message..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center space-x-2 shrink-0">
          <ArrowUpDown className="h-4 w-4 text-zinc-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="likes">Most Upvoted</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Bottom row: Role filter pills & count */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex flex-wrap gap-1.5 items-center">
          <button
            onClick={() => onRoleChange('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedRole === 'ALL'
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            All Roles
          </button>
          {AVAILABLE_ROLES.map((role) => (
            <button
              key={role}
              onClick={() => onRoleChange(role)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedRole === role
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        <span className="text-xs text-zinc-400 font-medium">
          Showing {totalFiltered} {totalFiltered === 1 ? 'entry' : 'entries'}
        </span>
      </div>
    </div>
  );
}
