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
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
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
        // Don't throw error, just set profile to null
        setProfile(null);
        return;
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
    console.log('🔐 Setting up auth...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🚀 Initializing auth...');
        
        // Get the current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
        }

        if (!mounted) return;

        console.log('📋 Initial session check:', session ? 'Session found' : 'No session');
        
        // Set the session and user state
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        // If we have a user, fetch their profile
        if (currentUser) {
          console.log('👤 User found, fetching profile...');
          await fetchProfile(currentUser.id);
        } else {
          console.log('👤 No user found');
          setProfile(null);
        }

        // Mark initial load as complete
        if (mounted) {
          console.log('✅ Initial auth check complete');
          setInitialLoadComplete(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error in initializeAuth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          setSession(null);
          setInitialLoadComplete(true);
          setLoading(false);
        }
      }
    };

    // Initialize auth state immediately
    initializeAuth();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`🔄 Auth event: ${event}`);
        
        if (!mounted) return;

        // Skip INITIAL_SESSION as we handle it in initializeAuth
        if (event === 'INITIAL_SESSION') {
          console.log('⏭️ Skipping INITIAL_SESSION event');
          return;
        }

        try {
          // Handle different auth events
          switch (event) {
            case 'SIGNED_IN':
              console.log('✅ User signed in');
              setSession(session);
              setUser(session?.user ?? null);
              if (session?.user) {
                await fetchProfile(session.user.id);
              }
              break;
              
            case 'SIGNED_OUT':
              console.log('👋 User signed out');
              setSession(null);
              setUser(null);
              setProfile(null);
              break;
              
            case 'TOKEN_REFRESHED':
              console.log('🔄 Token refreshed');
              setSession(session);
              setUser(session?.user ?? null);
              break;
              
            default:
              console.log(`🔄 Unhandled auth event: ${event}`);
          }
        } catch (error) {
          console.error('❌ Error handling auth state change:', error);
        }
      }
    );

    return () => {
      console.log('🧹 Cleaning up auth...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // State will be cleared by the auth state change listener
      console.log('✅ Sign out successful');
      navigate('/signin');
    } catch (error) {
      console.error('❌ Error signing out:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, profileData: any) => {
    try {
      console.log('📝 Signing up user...');
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profileData,
        },
      });
      console.log('✅ Sign up response:', { data: !!data, error: !!error });
      return { data, error };
    } catch (error) {
      console.error('❌ Error signing up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Signing in user...');
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('✅ Sign in response:', { data: !!result.data, error: !!result.error });
      return result;
    } catch (error) {
      console.error('❌ Error signing in:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) throw new Error('No user is logged in');
    
    try {
      console.log('📝 Updating profile...');
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (error) throw error;
      await fetchProfile(user.id);
      console.log('✅ Profile updated successfully');
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      throw error;
    }
  };
  
  const verifyOtp = async (email: string, token: string) => {
    try {
      console.log('🔐 Verifying OTP...');
      const result = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });
      console.log('✅ OTP verification response:', { data: !!result.data, error: !!result.error });
      return result;
    } catch (error) {
      console.error('❌ Error verifying OTP:', error);
      throw error;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      console.log('📧 Resending OTP...');
      const result = await supabase.auth.resend({
        email,
        type: 'signup',
      });
      console.log('✅ OTP resend response:', { data: !!result.data, error: !!result.error });
      return result;
    } catch (error) {
      console.error('❌ Error resending OTP:', error);
      throw error;
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

  // Show loading spinner only during initial load
  if (!initialLoadComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};