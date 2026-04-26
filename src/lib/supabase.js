import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
}

// Standard Supabase initialization with safety check to prevent boot crashes
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : { 
      auth: { onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), getSession: async () => ({ data: { session: null } }), signInWithPassword: async () => ({ error: { message: 'Supabase URL not configured' } }), signUp: async () => ({ error: { message: 'Supabase URL not configured' } }), signOut: async () => {} },
      storage: { from: () => ({ upload: async () => ({ error: { message: 'Supabase URL not configured' } }), getPublicUrl: () => ({ data: { publicUrl: '' } }) }) },
      from: () => ({ select: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) }), insert: async () => ({ error: null }) })
    };
