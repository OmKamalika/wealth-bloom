import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { getAnonymousSessionId, clearAnonymousSessionId } from '../utils/sessionUtils';
import { associateAnonymousCalculations } from '../api/calculate-wealth-api';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: any) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
          
          if (data.session?.user) {
            await fetchProfile(data.session.user.id);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth event: ${event}`);
      setSession(session);
      setUser(session?.user || null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
        
        // If this is a sign-in or sign-up event, associate anonymous calculations
        if (event === 'SIGNED_IN') {
          const anonymousSessionId = getAnonymousSessionId();
          if (anonymousSessionId) {
            console.log('🔄 Associating anonymous calculations with new user');
            const success = await associateAnonymousCalculations(session.user.id, anonymousSessionId);
            if (success) {
              // Clear the anonymous session ID after successful association
              clearAnonymousSessionId();
            }
          }
        }
      } else {
        setProfile(null);
      }
      
      setIsLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from the database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      // Handle the case where no profile exists (PGRST116 error code)
      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No profile found for user, this is expected for new users');
          setProfile(null);
          return;
        }
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during sign in') };
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      
      return { error };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during sign up') };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      console.log('Signing out user...');
      await supabase.auth.signOut();
      
      // Clear all user state
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsLoading(false);
      
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password-confirmation`,
      });
      
      return { error };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error during password reset') };
    }
  };

  // Update user profile
  const updateProfile = async (data: any) => {
    try {
      if (!user) {
        return { error: new Error('User not authenticated') };
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
      
      if (!error) {
        // Refresh profile data
        await fetchProfile(user.id);
      }
      
      return { error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: error instanceof Error ? error : new Error('Unknown error updating profile') };
    }
  };

  const value = {
    session,
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};