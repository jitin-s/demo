'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AVAILABLE_ROLES, Entry, RoleType } from '@/types/database';
import { Send, Star, CheckCircle2, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

interface EntryFormProps {
  onEntryAdded: (newEntry: Entry) => void;
  isConfigured: boolean;
  onOpenGuide: () => void;
}

export function EntryForm({ onEntryAdded, isConfigured, onOpenGuide }: EntryFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleType>('Developer');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [socialUrl, setSocialUrl] = useState('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic frontend validation
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!message.trim() || message.trim().length < 3) {
      setErrorMessage('Please enter a message (at least 3 characters).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role,
          message: message.trim(),
          rating,
          social_url: socialUrl.trim() || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit entry.');
      }

      // Trigger celebratory confetti animation!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback silently if canvas is unavailable
      }

      onEntryAdded(result.entry);
      setSuccessMessage(
        isConfigured
          ? 'Entry recorded in your Supabase database successfully!'
          : 'Entry added in Demo Preview! Connect your Supabase credentials to persist forever.'
      );

      // Reset form fields
      setName('');
      setEmail('');
      setMessage('');
      setSocialUrl('');
      setRating(5);

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-7 relative overflow-hidden">
      {/* Decorative top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <span>Submit New Entry</span>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Add feedback, introduce yourself, or leave a message on the board.
          </p>
        </div>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 flex items-start space-x-2.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-2.5 text-xs text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-500" />
          <div className="flex-1">
            <span>{successMessage}</span>
            {!isConfigured && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="ml-2 underline font-medium hover:text-emerald-900 dark:hover:text-emerald-100 inline"
              >
                View Setup Guide
              </button>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Row 2: Role selection */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
            Your Role / Community Tag
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_ROLES.map((r) => {
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    active
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/80 dark:hover:bg-zinc-700'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Rating stars */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Experience Rating
          </label>
          <div className="flex items-center space-x-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = (hoverRating ?? rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 rounded hover:scale-110 transition-transform focus:outline-none"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`h-5 w-5 ${
                      isFilled
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-zinc-300 dark:text-zinc-600'
                    } transition-colors`}
                  />
                </button>
              );
            })}
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 ml-2">
              {rating} of 5 stars
            </span>
          </div>
        </div>

        {/* Row 4: Message */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Message or Feedback <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share your thoughts, suggestions, or greetings..."
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors resize-none"
          />
        </div>

        {/* Row 5: Optional Link */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
            Website or Social Profile <span className="text-zinc-400 font-normal">(Optional)</span>
          </label>
          <input
            type="url"
            value={socialUrl}
            onChange={(e) => setSocialUrl(e.target.value)}
            placeholder="https://github.com/yourhandle or https://yourdomain.com"
            className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white flex items-center justify-center space-x-2 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Writing to Database...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Submit Entry</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
