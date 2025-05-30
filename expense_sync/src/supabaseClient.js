  // supabaseClient.js
  // Sets up the Supabase client for the app using environment variables for config.
  // PUBLIC_INTERFACE
  import { createClient } from '@supabase/supabase-js';

  /**
   * Exports a singleton Supabase client.
   * Requires the following environment variables to be set in your `.env`:
   *   REACT_APP_SUPABASE_URL
   *   REACT_APP_SUPABASE_ANON_KEY
   *
   * Example:
   *   REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
   *   REACT_APP_SUPABASE_ANON_KEY=your-anon-key
   * 
   * Do not commit actual keys to version control! Only use environment variables.
   */
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL||'https://uzdwzgadtsktzdbylidv.supabase.co';
  const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY||'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZHd6Z2FkdHNrdHpkYnlsaWR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MTIwMzAsImV4cCI6MjA2NDE4ODAzMH0.QMg1DjfLApwLpYYjxvuFz6Puy1PkHFKX1O1sbMcFaU4';

  if (!supabaseUrl || !supabaseAnonKey) {
    // You may handle missing config gracefully, for now just warn for dev mode.
    // In production, you might want to throw an error.
    // eslint-disable-next-line no-console
    console.warn(
      '[supabaseClient.js] Supabase URL or anon key missing. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in environment variables.'
    );
  }

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
