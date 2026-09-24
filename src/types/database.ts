export interface Entry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  role: string;
  message: string;
  rating: number;
  social_url?: string | null;
  likes: number;
}

export type EntryInsert = Omit<Entry, 'id' | 'created_at' | 'likes'> & {
  likes?: number;
};

export const AVAILABLE_ROLES = [
  'Developer',
  'Designer',
  'Founder',
  'DevOps',
  'Student',
  'Other',
] as const;

export type RoleType = (typeof AVAILABLE_ROLES)[number];
