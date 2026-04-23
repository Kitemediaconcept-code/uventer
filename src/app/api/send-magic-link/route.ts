import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kgwehgvokxhlgvkhygsx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2VoZ3Zva3hobGd2a2h5Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODk3NTgsImV4cCI6MjA5MjQ2NTc1OH0.NwzDaUbzk_u720R7ZcxorLHd2Sz17lQef7iUpZAfwZ0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { email, password, redirectTo, type } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Password-based sign in
    if (type === 'password') {
      if (!password) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('[auth] Password sign-in error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        user: { email: data.user?.email, id: data.user?.id },
      });
    }

    // Magic link (OTP) sign in
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const redirectUrl = `${origin}${redirectTo || '/'}`;

    console.log('[send-magic-link] Sending OTP to:', email, '-> redirect:', redirectUrl);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });

    if (error) {
      console.error('[send-magic-link] Supabase error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[auth] Unexpected error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
