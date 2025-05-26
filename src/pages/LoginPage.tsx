
import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle, user } = useAuth();

  {/* Se o usuário já estiver logado, redireciona para o dashboard */}
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  {/* Função para fazer login */}
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  {/* Função para fazer login com Google */}
  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    
    setIsGoogleLoading(true);
    
    try {
      console.log('Clicou no botão Google');
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  {/* Renderiza o login */}
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-anime-navy to-black">
      <Card className="w-full max-w-md border-anime-purple/20">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <BookOpen className="h-12 w-12 text-anime-purple" />
          </div>
          <CardTitle className="text-2xl font-bold anime-gradient-text">
            AnimeList
          </CardTitle>
          <CardDescription>
            Entre para acessar suas listas de animes
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/recuperar-senha"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Botão de login */}
            <Button 
              type="submit" 
              className="w-full bg-anime-purple hover:bg-anime-purple/90"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            {/* Divisor */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
              </div>
            </div>
            {/* Botão de login com Google */}
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
            >
              {/* Botão de login com Google */}
              {isGoogleLoading ? (
                "Carregando..."
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </>
              )}
            </Button>
          </CardContent>
        </form>
        {/* Rodapé */}
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link to="/registro" className="text-primary hover:underline">
              Registre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
