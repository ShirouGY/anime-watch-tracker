
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

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

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

  return (
    <div className="flex min-h-screen items-center justify-center p-2 sm:p-4 bg-gradient-to-br from-anime-navy to-black">
      <Card className="w-full max-w-sm sm:max-w-md border-anime-purple/20">
        <CardHeader className="space-y-2 text-center px-4 sm:px-6">
          <div className="flex justify-center mb-2">
            <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-anime-purple" />
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold anime-gradient-text">
            SoloAnimeList
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Crie sua conta para gerenciar suas listas de animes
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4 px-4 sm:px-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 sm:h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-10 sm:h-11"
              />
              {passwordError && (
                <p className="text-xs sm:text-sm text-red-500">{passwordError}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-anime-purple hover:bg-anime-purple/90 h-10 sm:h-11 text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Criar Conta"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex justify-center px-4 sm:px-6">
          <div className="text-xs sm:text-sm text-muted-foreground text-center">
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
