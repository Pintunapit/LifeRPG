/**
 * authService – Supabase Auth backed.
 *
 * Sign-up and Login go through the Express backend so the server can
 * create the player row + seed all default data atomically.
 * Session state is managed by the Supabase browser client which persists
 * the JWT in localStorage under the key LIFE_RPG_AUTH.
 *
 * The getAuthState() helper is synchronous for backwards compatibility
 * with existing callers; use getSession() when you need async certainty.
 */

import { supabase } from '../lib/supabaseClient';
import { authApi } from '../lib/api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export const authService = {
  /**
   * Returns the current auth state synchronously from Supabase's cached session.
   * Falls back to unauthenticated if no session exists.
   *
   * Supabase v2 stores sessions in localStorage under storageKey as a JSON
   * object with shape: { access_token, refresh_token, expires_at, user, ... }
   * The outer wrapper key Supabase uses is: `sb-<project-ref>-auth-token`
   * BUT when storageKey is overridden (as we do with 'LIFE_RPG_AUTH'),
   * Supabase stores it under: `LIFE_RPG_AUTH`
   *
   * The value shape in v2 is: { access_token, refresh_token, expires_at, user: {...} }
   */
  getAuthState: (): AuthUser => {
    try {
      const raw = localStorage.getItem('LIFE_RPG_AUTH');
      if (!raw) return { id: '', name: '', email: '', isAuthenticated: false };

      // Supabase v2 session shape
      const parsed = JSON.parse(raw) as {
        access_token?: string;
        user?: {
          id: string;
          email?: string;
          user_metadata?: { name?: string };
        };
      };

      const user = parsed?.user;
      const token = parsed?.access_token;

      if (!user || !token) return { id: '', name: '', email: '', isAuthenticated: false };

      return {
        id: user.id,
        name: user.user_metadata?.name ?? user.email?.split('@')[0] ?? 'Hero',
        email: user.email ?? '',
        isAuthenticated: true
      };
    } catch {
      return { id: '', name: '', email: '', isAuthenticated: false };
    }
  },

  /**
   * Async version – resolves the current session from Supabase reliably.
   */
  getSession: async (): Promise<AuthUser> => {
    const { data } = await supabase.auth.getSession();
    const user = data.session?.user;
    if (!user) return { id: '', name: '', email: '', isAuthenticated: false };

    return {
      id: user.id,
      name: (user.user_metadata as Record<string, string> | undefined)?.['name']
        ?? user.email?.split('@')[0]
        ?? 'Hero',
      email: user.email ?? '',
      isAuthenticated: true
    };
  },

  /**
   * Sign up via the Express backend (which uses Supabase admin to create
   * the user with email_confirm: true and seeds all game data).
   * After server-side creation, sign in directly via the Supabase client
   * to obtain a browser session.
   */
  signup: async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthUser> => {
    // Create user server-side (with retry for Render cold-start)
    try {
      await authApi.signup(name, email, password);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      // "Failed to fetch" = backend is asleep (Render free tier cold start)
      if (msg === 'Failed to fetch' || msg.includes('fetch')) {
        throw new Error(
          'Server is waking up — please wait 20–30 seconds and try again. ' +
          '(Render free tier cold start)'
        );
      }
      // Email already taken
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('duplicate')) {
        throw new Error('An account with this email already exists. Please log in instead.');
      }
      throw e;
    }

    // Sign in to get the browser session
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      throw new Error(error?.message ?? 'Sign-in after signup failed.');
    }

    return {
      id: data.user.id,
      name: (data.user.user_metadata as Record<string, string> | undefined)?.['name']
        ?? name,
      email: data.user.email ?? email,
      isAuthenticated: true
    };
  },

  /**
   * Log in via Supabase browser client directly (faster, avoids backend round-trip).
   * The resulting session JWT is what the backend uses to authenticate all
   * subsequent data API calls.
   */
  login: async (email: string, password: string): Promise<AuthUser> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      throw new Error(error?.message ?? 'Login failed.');
    }

    return {
      id: data.user.id,
      name: (data.user.user_metadata as Record<string, string> | undefined)?.['name']
        ?? data.user.email?.split('@')[0]
        ?? 'Hero',
      email: data.user.email ?? email,
      isAuthenticated: true
    };
  },

  /**
   * Sign out from Supabase and clear the local session.
   */
  logout: async (): Promise<void> => {
    await supabase.auth.signOut();
  },

  /**
   * Listen for auth state changes (login / logout / token refresh).
   * Returns the unsubscribe function.
   */
  onAuthChange: (
    callback: (user: AuthUser | null) => void
  ): (() => void) => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        callback(null);
        return;
      }
      callback({
        id: session.user.id,
        name: (session.user.user_metadata as Record<string, string> | undefined)?.['name']
          ?? session.user.email?.split('@')[0]
          ?? 'Hero',
        email: session.user.email ?? '',
        isAuthenticated: true
      });
    });

    return () => data.subscription.unsubscribe();
  }
};
