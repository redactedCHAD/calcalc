import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Create the authentication context
const AuthContext = createContext();

// AuthProvider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for user session on initial load
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (error) {
        console.error('Error checking auth session:', error);
        // Don't set the user to null here in case of connection errors
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Cleanup subscription
    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user profile information
  const getUserProfile = async () => {
    try {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  // Context value
  const value = {
    user,
    loading,
    signOut,
    getUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
