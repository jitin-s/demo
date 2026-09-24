import { createClient } from '@supabase/supabase-js';
import { Entry, EntryInsert } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== 'https://your-project-id.supabase.co' &&
    supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' &&
    supabaseUrl.startsWith('https://') &&
    supabaseUrl.includes('supabase.co')
  );
};

// Singleton client instance (only initialized if configured)
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Fetch all entries ordered by creation date descending
export async function fetchEntries(): Promise<{ data: Entry[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured yet.') };
  }

  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Entry[], error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error fetching entries';
    return { data: null, error: new Error(message) };
  }
}

// Insert a new entry
export async function createEntry(entry: EntryInsert): Promise<{ data: Entry | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase is not configured yet.') };
  }

  try {
    const { data, error } = await supabase
      .from('entries')
      .insert([
        {
          name: entry.name,
          email: entry.email,
          role: entry.role,
          message: entry.message,
          rating: entry.rating,
          social_url: entry.social_url || null,
          likes: 0,
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Entry, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error creating entry';
    return { data: null, error: new Error(message) };
  }
}

// Increment likes on an entry
export async function incrementLikes(id: string, currentLikes: number): Promise<{ success: boolean; error: Error | null }> {
  if (!supabase) {
    return { success: false, error: new Error('Supabase is not configured yet.') };
  }

  try {
    const { error } = await supabase
      .from('entries')
      .update({ likes: currentLikes + 1 })
      .eq('id', id);

    if (error) {
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error updating likes';
    return { success: false, error: new Error(message) };
  }
}
