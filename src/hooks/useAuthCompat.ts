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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'admin' | 'student') => void;
}

export const useAuth = (): AuthContextType => {
  const { 
    user: supabaseUser, 
    profile, 
    isAuthenticated, 
    signIn, 
    signOut, 
    switchRole: supabaseSwitchRole 
  } = useSupabaseAuth();

  // Transform Supabase user + profile into legacy user format
  const user: User | null = supabaseUser && profile ? {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: profile.display_name || supabaseUser.email?.split('@')[0] || 'User',
    role: profile.role,
    avatar: profile.avatar_url || undefined
  } : null;

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password);
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
    login,
    logout,
    switchRole
  };
};