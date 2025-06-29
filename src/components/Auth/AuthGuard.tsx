import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, fallback }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth status:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!data.session);
        }
      } catch (error) {
        console.error('Error in auth check:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => {
      // Clean up subscription
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-custom-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Return children if authenticated, fallback if not
  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

export default AuthGuard;