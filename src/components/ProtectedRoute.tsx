
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  redirectTo?: string;
}

export const ProtectedRoute = ({ redirectTo = '/login' }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }
  
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <Outlet />;
};
