import { createClient } from '@supabase/supabase-js';

// Hardcoded for production to ensure connection works regardless of Vercel env var state
const supabaseUrl = 'https://kgwehgvokxhlgvkhygsx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnd2VoZ3Zva3hobGd2a2h5Z3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4ODk3NTgsImV4cCI6MjA5MjQ2NTc1OH0.NwzDaUbzk_u720R7ZcxorLHd2Sz17lQef7iUpZAfwZ0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

