import { useState, useEffect } from 'react';

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
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock users for demo
  const mockUsers = {
    'student@example.com': {
      id: 'user-1',
      email: 'student@example.com',
      name: 'John Doe',
      role: 'student' as const,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    'admin@example.com': {
      id: 'admin-1',
      email: 'admin@example.com',
      name: 'Sarah Admin',
      role: 'admin' as const,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2f5de1a?w=32&h=32&fit=crop&crop=face'
    }
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('learnflow-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      // Auto-login as student for demo
      const defaultUser = mockUsers['student@example.com'];
      setUser(defaultUser);
      setIsAuthenticated(true);
      localStorage.setItem('learnflow-user', JSON.stringify(defaultUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in production, this would be a real API call
    const userData = mockUsers[email as keyof typeof mockUsers];
    
    if (userData && password === 'demo') {
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('learnflow-user', JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('learnflow-user');
  };

  const switchRole = (role: 'admin' | 'student') => {
    if (!user) return;
    
    const updatedUser = { ...user, role };
    setUser(updatedUser);
    localStorage.setItem('learnflow-user', JSON.stringify(updatedUser));
  };

  return {
    user,
    isAuthenticated,
    login,
    logout,
    switchRole
  };
};