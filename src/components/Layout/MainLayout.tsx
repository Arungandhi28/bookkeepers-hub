
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from '@/components/ui/toaster';

interface MainLayoutProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'librarian';
}

export function MainLayout({ children, requiredRole }: MainLayoutProps) {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Check role permissions
  if (requiredRole && user.role !== requiredRole && requiredRole === 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 ml-16 md:ml-64">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
