import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured, fetchEntries, createEntry } from '@/lib/supabase';
import { INITIAL_MOCK_ENTRIES } from '@/lib/mockData';
import { EntryInsert } from '@/types/database';

export async function GET() {
  if (isSupabaseConfigured()) {
    const { data, error } = await fetchEntries();
    if (error) {
      return NextResponse.json(
        { error: error.message, isMock: false },
        { status: 500 }
      );
    }
    return NextResponse.json({ entries: data, isMock: false });
  }

  // Graceful fallback to initial mock entries if Supabase credentials are not yet set
  return NextResponse.json({
    entries: INITIAL_MOCK_ENTRIES,
    isMock: true,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, role, message, rating, social_url } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters long.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 3) {
      return NextResponse.json(
        { error: 'Message must be at least 3 characters long.' },
        { status: 400 }
      );
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5.' },
        { status: 400 }
      );
    }

    const entryToInsert: EntryInsert = {
      name: name.trim(),
      email: email.trim(),
      role: role ? String(role).trim() : 'Explorer',
      message: message.trim(),
      rating: numericRating,
      social_url: social_url ? String(social_url).trim() : undefined,
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await createEntry(entryToInsert);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ entry: data, isMock: false }, { status: 201 });
    }

    // In demo mode: create an ephemeral entry object to respond with
    const mockEntry = {
      id: `demo-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...entryToInsert,
      likes: 0,
    };

    return NextResponse.json(
      { entry: mockEntry, isMock: true, note: 'Created in demo preview mode' },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid request payload';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
