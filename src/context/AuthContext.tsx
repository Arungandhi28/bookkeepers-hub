
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

// This is a mock auth context - would be replaced with Supabase Auth in production
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@library.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin' as UserRole,
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'librarian@library.com',
    password: 'librarian123',
    name: 'Librarian User',
    role: 'librarian' as UserRole,
    created_at: '2023-01-01T00:00:00Z'
  }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock auth check - in production, we'd check Supabase session here
    const savedUser = localStorage.getItem('libraryAuthUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse auth user:', e);
        localStorage.removeItem('libraryAuthUser');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setError(null);
    setLoading(true);
    
    try {
      // Mock authentication - would use Supabase in production
      const foundUser = mockUsers.find(user => user.email === email && user.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('libraryAuthUser', JSON.stringify(userWithoutPassword));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    // Mock sign out - would use Supabase in production
    setUser(null);
    localStorage.removeItem('libraryAuthUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
