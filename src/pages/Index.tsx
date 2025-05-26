
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    {/* Redireciona para a página de login ao acessar a raiz */}
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Index;
