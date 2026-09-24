import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  const configured = isSupabaseConfigured();
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  
  // Mask the URL for security display: e.g. "https://abc...supabase.co"
  let maskedUrl = null;
  if (configured && rawUrl) {
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname;
      const parts = host.split('.');
      if (parts.length >= 2) {
        const subdomain = parts[0];
        const maskedSub = subdomain.length > 6 ? `${subdomain.slice(0, 4)}...${subdomain.slice(-2)}` : subdomain;
        maskedUrl = `https://${maskedSub}.${parts.slice(1).join('.')}`;
      } else {
        maskedUrl = host;
      }
    } catch {
      maskedUrl = 'Valid Supabase URL configured';
    }
  }

  return NextResponse.json({
    configured,
    maskedUrl,
    timestamp: new Date().toISOString(),
  });
}
