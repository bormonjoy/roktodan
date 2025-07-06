import React, {
  createContext,
  useContext,
  useEffect,
  useState,
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

 useEffect(() => {
  let subscription: ReturnType<typeof supabase.auth.onAuthStateChange>['data']['subscription'] | null = null;

  const init = async () => {
    setLoading(true);
    
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);

    if (session?.user) {
      setUser(session.user);
      await fetchProfile(session.user.id);
    } else {
      setUser(null);
      setProfile(null);
      setLoading(false);
    }

    // Set up auth listener
    const { data } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    subscription = data.subscription;
  };

  init();

  // ✅ Clean up correctly
  return () => {
    subscription?.unsubscribe();
  };
}, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && status === 406) {
        console.warn('⚠️ User profile not found. Might be a new user.');
        setProfile(null);
      } else if (error) {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/signin');
    } catch (err) {
      console.error('❌ Error signing out:', err);
      throw err;
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
      return { data, error };
    } catch (err) {
      console.error('❌ Error signing up:', err);
      throw err;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔑 Signing in user...');
      const result = await supabase.auth.signInWithPassword({ email, password });
      return result;
    } catch (err) {
      console.error('❌ Error signing in:', err);
      throw err;
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
    } catch (err) {
      console.error('❌ Error updating profile:', err);
      throw err;
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
      return result;
    } catch (err) {
      console.error('❌ Error verifying OTP:', err);
      throw err;
    }
  };

  const resendOtp = async (email: string) => {
    try {
      console.log('📧 Resending OTP...');
      const result = await supabase.auth.resend({
        email,
        type: 'signup',
      });
      return result;
    } catch (err) {
      console.error('❌ Error resending OTP:', err);
      throw err;
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
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
