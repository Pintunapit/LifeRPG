/**
 * Supabase browser client – used only for Auth (sign-in, sign-up, session).
 * All data operations go through the Express backend which uses the
 * service-role key server-side.
 *
 * VITE_ prefix is required for Vite to expose env vars to the browser bundle.
 * Add these two vars to your root .env file:
 *   VITE_SUPABASE_URL=https://your-project.supabase.co
 *   VITE_SUPABASE_ANON_KEY=your_anon_key_here
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnon) {
  console.warn(
    '[LifeRPG] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. ' +
    'Add them to your root .env file and restart Vite.'
  );
}

export const supabase = createClient(
  supabaseUrl  ?? 'https://placeholder.supabase.co',
  supabaseAnon ?? 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'LIFE_RPG_AUTH'
    }
  }
);

/**
 * Returns the JWT access token for the current Supabase session,
 * or null when the user is not logged in.
 */
export const getAccessToken = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
};
