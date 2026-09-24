'use client';

import React, { useState } from 'react';
import { Entry } from '@/types/database';
import { Star, Heart, ExternalLink, Calendar, User } from 'lucide-react';
import { incrementLikes } from '@/lib/supabase';

interface EntryCardProps {
  entry: Entry;
  onLikeUpdated: (id: string, newLikes: number) => void;
  isConfigured: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  Developer: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Designer: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  Founder: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  DevOps: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  Student: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Other: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700',
};

export function EntryCard({ entry, onLikeUpdated, isConfigured }: EntryCardProps) {
  const [likes, setLikes] = useState(entry.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (hasLiked || isLiking) return;

    const nextLikes = likes + 1;
    setLikes(nextLikes);
    setHasLiked(true);
    onLikeUpdated(entry.id, nextLikes);

    if (isConfigured) {
      setIsLiking(true);
      await incrementLikes(entry.id, entry.likes);
      setIsLiking(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const badgeColor = ROLE_COLORS[entry.role] || ROLE_COLORS.Other;

  return (
    <div className="group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm transition-all hover:shadow-md flex flex-col justify-between">
      <div>
        {/* Card Header: Avatar + Info */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 dark:from-zinc-600 dark:to-zinc-800 text-zinc-100 flex items-center justify-center font-bold text-xs shadow-inner">
              {getInitials(entry.name)}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                {entry.name}
              </h3>
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {formatDate(entry.created_at)}
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badgeColor}`}
          >
            {entry.role}
          </span>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center space-x-1 mb-2.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-3.5 w-3.5 ${
                star <= entry.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-zinc-200 dark:text-zinc-700'
              }`}
            />
          ))}
        </div>

        {/* Message */}
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 whitespace-pre-wrap break-words">
          {entry.message}
        </p>
      </div>

      {/* Card Footer: Social Link & Likes */}
      <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
        {entry.social_url ? (
          <a
            href={entry.social_url.startsWith('http') ? entry.social_url : `https://${entry.social_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:underline max-w-[180px] truncate"
          >
            <span className="truncate">{entry.social_url.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <div />
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={hasLiked}
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full transition-all ${
            hasLiked
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold'
              : 'text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40'
          }`}
          aria-label="Like entry"
        >
          <Heart
            className={`h-3.5 w-3.5 ${
              hasLiked ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
          <span>{likes}</span>
        </button>
      </div>
    </div>
  );
}
