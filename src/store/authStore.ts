import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: any | null;
  session: any | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: any) => void;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isAdmin: false,

      checkSession: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Session check error:', error);
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isAdmin: false,
            });
            return;
          }
          
          if (session) {
            set({
              user: session.user,
              session,
              isAuthenticated: true,
              isAdmin: session.user.user_metadata?.role === 'admin',
            });
          }
        } catch (error) {
          console.error('Session check error:', error);
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isAdmin: false,
          });
        }
      },

      setSession: (session) => {
        if (!session) {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isAdmin: false,
          });
          return;
        }

        set({
          user: session.user,
          session,
          isAuthenticated: true,
          isAdmin: session.user.user_metadata?.role === 'admin',
        });
      },

      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            console.error('Sign in error:', error);
            throw error;
          }

          if (!data?.user || !data?.session) {
            throw new Error('No user data returned from authentication');
          }

          set({
            user: data.user,
            session: data.session,
            isAuthenticated: true,
            isAdmin: data.user.user_metadata?.role === 'admin',
          });
        } catch (error: any) {
          console.error('Sign in error:', error);
          throw new Error(error.message || 'حدث خطأ أثناء تسجيل الدخول');
        }
      },

      signOut: async () => {
        try {
          const currentSession = get().session;
          if (!currentSession) {
            set({
              user: null,
              session: null,
              isAuthenticated: false,
              isAdmin: false,
            });
            window.location.href = '/login';
            return;
          }

          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error('Sign out error:', error);
            throw error;
          }

          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isAdmin: false,
          });

          localStorage.removeItem('auth-storage');
          sessionStorage.clear();

          window.location.href = '/login';
        } catch (error: any) {
          console.error('Sign out error:', error);
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isAdmin: false,
          });
          window.location.href = '/login';
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
      }),
    }
  )
);