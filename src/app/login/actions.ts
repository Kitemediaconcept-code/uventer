'use server';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kgwehgvokxhlgvkhygsx.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2VoZ3Zva3hobGd2a2h5Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODk3NTgsImV4cCI6MjA5MjQ2NTc1OH0.NwzDaUbzk_u720R7ZcxorLHd2Sz17lQef7iUpZAfwZ0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function sendMagicLink(email: string, redirectToPath: string) {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUrl = `${siteUrl}${redirectToPath.startsWith('/') ? redirectToPath : `/${redirectToPath}`}`;
    
    console.log('Sending magic link to', email, 'with redirect:', redirectUrl);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectUrl },
    });
    
    if (error) {
      console.error('Supabase Auth Error:', error);
      return { error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Server Action Catch Error:', err);
    return { error: err.message || 'Failed to send magic link' };
  }
}
