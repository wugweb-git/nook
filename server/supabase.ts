import { createClient } from '@supabase/supabase-js';

// Default Supabase URL if not provided
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lgfztypaflmeqfvwunps.supabase.co';
// Clean URL (ensure it's not a postgresql:// URL)
const cleanSupabaseUrl = SUPABASE_URL.startsWith('postgresql://') ? 'https://lgfztypaflmeqfvwunps.supabase.co' : SUPABASE_URL;

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Use service key if available, otherwise use anon key
const apiKey = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

console.log('Using Supabase URL:', cleanSupabaseUrl);

if (!apiKey) {
  throw new Error(
    "Either SUPABASE_SERVICE_KEY or SUPABASE_ANON_KEY must be set for Supabase connection"
  );
}

// Create Supabase client
export const supabase = createClient(
  cleanSupabaseUrl,
  apiKey,
  {
    auth: {
      persistSession: false
    },
    db: {
      schema: 'public'
    }
  }
);

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
}

// Run test but don't block execution
testSupabaseConnection();