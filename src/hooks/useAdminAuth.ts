import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
// src/hooks/useAdminAuth.ts
const ADMIN_EMAILS = [
  'jjcampbell01usa@gmail.com',
  'support@sleepylittleone.com',
  'thiagomartinsv@gmail.com',  // Add this line
];


interface AdminAuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface ProfileCheckResult {
  isAdmin: boolean;
  error?: string;
  retryCount?: number;
}

export const useAdminAuth = () => {
  const [authState, setAuthState] = useState<AdminAuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  
  const { toast } = useToast();

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const checkAdminRoleWithRetry = async (userId: string, maxRetries = 5): Promise<ProfileCheckResult> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Admin role check attempt ${attempt}/${maxRetries} for user:`, userId);
        
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role, display_name, user_id')
          .eq('user_id', userId)
          .single();
        
        console.log(`Attempt ${attempt} - Profile query result:`, { profile, error });
        
        if (error) {
          // If it's a "not found" error and we haven't exhausted retries, try again
          if (error.code === 'PGRST116' && attempt < maxRetries) {
            const backoffDelay = Math.min(100 * Math.pow(2, attempt - 1), 2000); // Exponential backoff: 100ms, 200ms, 400ms, 800ms, 1600ms
            console.log(`Profile not found, retrying in ${backoffDelay}ms...`);
            await sleep(backoffDelay);
            continue;
          }
          
          console.error('Profile lookup error:', error);
          return { 
            isAdmin: false, 
            error: `Failed to load user profile: ${error.message}`,
            retryCount: attempt 
          };
        }
        
        if (!profile) {
          if (attempt < maxRetries) {
            const backoffDelay = Math.min(100 * Math.pow(2, attempt - 1), 2000);
            console.log(`No profile found, retrying in ${backoffDelay}ms...`);
            await sleep(backoffDelay);
            continue;
          }
          
          return { 
            isAdmin: false, 
            error: "Your user profile could not be found. Please contact support.",
            retryCount: attempt 
          };
        }
        
        const isAdmin = profile.role === 'admin';
        console.log(`Profile found on attempt ${attempt}:`, { 
          role: profile.role, 
          isAdmin, 
          displayName: profile.display_name 
        });
        
        if (!isAdmin) {
          return { 
            isAdmin: false, 
            error: "Admin privileges required to access this page",
            retryCount: attempt 
          };
        }
        
        return { isAdmin: true, retryCount: attempt };
        
      } catch (error) {
        console.error(`Unexpected error on attempt ${attempt}:`, error);
        
        if (attempt < maxRetries) {
          const backoffDelay = Math.min(100 * Math.pow(2, attempt - 1), 2000);
          console.log(`Unexpected error, retrying in ${backoffDelay}ms...`);
          await sleep(backoffDelay);
          continue;
        }
        
        return { 
          isAdmin: false, 
          error: "An unexpected error occurred during authentication",
          retryCount: attempt 
        };
      }
    }
    
    return { 
      isAdmin: false, 
      error: "Maximum retry attempts exceeded",
      retryCount: maxRetries 
    };
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('Auth state changed:', { event, hasSession: !!session, hasUser: !!session?.user });
    
    if (event === 'SIGNED_OUT') {
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      return;
    }
    
    if (session?.user) {
      console.log('Session found, checking admin role...', { 
        userId: session.user.id, 
        email: session.user.email 
      });
      
      setAuthState(prev => ({
        ...prev,
        user: session.user,
        session: session,
        isLoading: true,
        error: null,
      }));
      
      const result = await checkAdminRoleWithRetry(session.user.id);
              const isStaticAdmin = ADMIN_EMAILS.includes(session.user.email ?? '');

      
      if (result.isAdmin || isStaticAdmin) {
        console.log(`Admin role confirmed after ${result.retryCount} attempts`);
            //const= ADMIN_EMAILS.includes(session.user.email ?? '');
        setAuthState({
          user: session.user,
          session: session,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        console.log(`Admin role check failed after ${result.retryCount} attempts:`, result.error);
        setAuthState({
          user: session.user,
          session: session,
          isAuthenticated: false,
          isLoading: false,
          error: result.error || 'Access denied',
        });
        
        // Show appropriate toast message
        if (result.error) {
          toast({
            title: result.error.includes('profile') ? "Profile Error" : 
                   result.error.includes('privileges') ? "Access Denied" : "Authentication Error",
            description: result.error,
            variant: "destructive"
          });
        }
      }
    } else {
      console.log('No session/user found');
      setAuthState({
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
    
    // THEN check for existing session
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
            error: error.message,
          }));
          return;
        }
        
        console.log('Initial session check:', { hasSession: !!session, hasUser: !!session?.user });
        
        // The auth state change listener will handle the session
        if (session) {
          await handleAuthStateChange('SIGNED_IN', session);
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false,
          }));
        }
      } catch (error) {
        console.error('Error in initial session check:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to check authentication status',
        }));
      }
    };
    
    checkInitialSession();
    
    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  return {
    ...authState,
    signOut,
  };
};
