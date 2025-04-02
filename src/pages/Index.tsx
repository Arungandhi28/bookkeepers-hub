
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoginForm } from '../components/Auth/LoginForm';

const Index = () => {
  const { user, loading } = useAuth();
  
  useEffect(() => {
    document.title = "Library Management System - Login";
  }, []);
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-library-50 to-library-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <LoginForm />
        <p className="mt-4 text-center text-sm text-gray-600">
          Library Management System v1.0
        </p>
      </div>
    </div>
  );
};

export default Index;
