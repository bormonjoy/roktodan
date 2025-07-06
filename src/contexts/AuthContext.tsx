import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { User, Session, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export interface Profile {
  id: string;
  name: string;
  phone: string;
  blood_group: string;
  date_of_birth: string;
  gender: string;
  division: string;
  district: string;
  last_donation: string | null;
  is_available: boolean;
  total_donations: number;
  medical_conditions: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  verifyOtp: (email: string, token: string) => Promise<AuthResponse>;
  resendOtp: (email: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async (userId: string) => {
    console.log('📦 Fetching profile for:', userId);
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status !== 406) {
        console.warn('⚠️ Error fetching profile:', error.message);
        throw error;
      }

      if (data) {
        setProfile(data);
        console.log('✅ Profile fetched:', data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Unexpected error in fetchProfile:', error);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    console.log('🔐 Setting up auth listener...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          throw error;
        }

        if (!mounted) return;

        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    // Set up the listener for future changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth state change event: ${event}`);
        
        if (!mounted) return;

        // Skip the initial session event if we've already initialized
        if (event === 'INITIAL_SESSION' && initialized) {
          return;
        }

        try {
          setSession(session);
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            await fetchProfile(currentUser.id);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('❌ Error in auth state change:', error);
        }
      }
    );

    return () => {
      console.log('🧹 Unsubscribing from auth listener...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, initialized]);

  const signOut = async () => {
    const originalLoading = loading;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setSession(null);
      navigate('/signin');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      // Restore original loading state on error
      setLoading(originalLoading);
      throw error;
    } finally {
      // Don't set loading to false here as navigation will handle it
    }
  };

  const signUp = async (email: string, password: string, profileData: any) => {
    const originalLoading = loading;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profileData,
        },
      });
      return { data, error };
    } catch (error) {
      console.error('❌ Error signing up:', error);
      setLoading(originalLoading);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const originalLoading = loading;
    setLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return result;
    } catch (error) {
      console.error('❌ Error signing in:', error);
      setLoading(originalLoading);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user is logged in');
    
    const originalLoading = loading;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (error) throw error;
      await fetchProfile(user.id);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setLoading(originalLoading);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const verifyOtp = async (email: string, token: string) => {
    const originalLoading = loading;
    setLoading(true);
    try {
      const result = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });
      return result;
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      setLoading(originalLoading);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async (email: string) => {
    const originalLoading = loading;
    setLoading(true);
    try {
      const result = await supabase.auth.resend({
        email,
        type: 'signup',
      });
      return result;
    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      setLoading(originalLoading);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    verifyOtp,
    resendOtp,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading && !initialized ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};