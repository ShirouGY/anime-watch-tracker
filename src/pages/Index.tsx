
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Se o usuário já está logado, redireciona para o dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Se não está logado, redireciona para login
        navigate('/login', { replace: true });
      }
    }
  }, [navigate, user, isLoading]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-anime-purple mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default Index;
