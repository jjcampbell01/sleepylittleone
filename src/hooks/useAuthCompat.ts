import { useSupabaseAuth } from './useSupabaseAuth';

// Compatibility layer to bridge old useAuth interface with new Supabase auth
interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'student';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'admin' | 'student') => void;
}

export const useAuth = (): AuthContextType => {
  const { 
    user: supabaseUser, 
    profile, 
    isAuthenticated, 
    isLoading,
    signIn, 
    signUp: supabaseSignUp,
    signOut, 
    switchRole: supabaseSwitchRole 
  } = useSupabaseAuth();

  // Transform Supabase user into legacy user format
  // Authentication doesn't require profile - user can be authenticated without profile loaded
  const user: User | null = supabaseUser ? {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile?.display_name || supabaseUser.email?.split('@')[0] || 'User',
    role: (profile?.role as 'admin' | 'student') || 'student',
    avatar: profile?.avatar_url || undefined
  } : null;

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password);
    return !error;
  };

  const signUp = async (email: string, password: string, fullName?: string): Promise<boolean> => {
    const { error } = await supabaseSignUp(email, password, fullName);
    return !error;
  };

  const logout = async (): Promise<void> => {
    await signOut();
  };

  const switchRole = async (role: 'admin' | 'student'): Promise<void> => {
    await supabaseSwitchRole(role);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    signUp,
    logout,
    switchRole
  };
};