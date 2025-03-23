import { createClient } from '@supabase/supabase-js';

// Default values for development - don't use in production
const defaultSupabaseUrl = 'https://your-project-id.supabase.co';
const defaultSupabaseKey = 'your-anon-key';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || defaultSupabaseUrl;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultSupabaseKey;

// Check if we're in a production environment
if (process.env.NODE_ENV === 'production' && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 