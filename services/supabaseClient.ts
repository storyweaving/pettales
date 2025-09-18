import { createClient } from '@supabase/supabase-js';
import { Database } from '../types';

const supabaseUrl = 'https://hhhmxhabrihayoipdits.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhoaG14aGFicmloYXlvaXBkaXRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxOTMwOTEsImV4cCI6MjA3Mzc2OTA5MX0.EKMIu1XG7eNk-1BcleNSFVEjWCf-u-h5Caa0tdNQQo4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Key are missing. Please provide them in services/supabaseClient.ts');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Explicitly setting these options ensures the session is persisted in localStorage,
    // which is the most common fix for "Refresh Token Not Found" errors.
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
