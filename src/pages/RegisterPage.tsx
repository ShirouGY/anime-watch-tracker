
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { signUp, user } = useAuth();

  {/* Se já estiver logado, redireciona para o dashboard */}
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  {/* Função para fazer o registro */}
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  {/* Renderiza a página de registro */}
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-anime-navy to-black">
      <Card className="w-full max-w-md border-anime-purple/20">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <BookOpen className="h-12 w-12 text-anime-purple" />
          </div>
          <CardTitle className="text-2xl font-bold anime-gradient-text">
            SoloAnimeList
          </CardTitle>
          <CardDescription>
            Crie sua conta para gerenciar suas listas de animes
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-anime-purple hover:bg-anime-purple/90"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Criar Conta"}
            </Button>
          </CardContent>
        </form>
        {/* Rodapé */}
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground text-center">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
