
import React, { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Verificar tema atual ao montar o componente
  useEffect(() => {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.classList.contains('dark');
    setIsDark(currentTheme);
  }, []);

  const toggleTheme = async () => {
    setIsAnimating(true);
    
    // Aplicar o novo tema
    const htmlElement = document.documentElement;
    const newTheme = !isDark;
    
    if (newTheme) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
    
    setIsDark(newTheme);
    
    // Salvar preferência no localStorage
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Aguardar animação terminar
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="flex items-center gap-3 p-2">
      {/* Switch customizado com olhos no thumb */}
      <div className="relative">
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          className={cn(
            "transition-all duration-300 relative",
            isDark ? "data-[state=checked]:bg-red-600" : "data-[state=checked]:bg-blue-500"
          )}
        />
        
        {/* Olho customizado sobreposto ao thumb */}
        <div 
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 pointer-events-none transition-all duration-300 w-5 h-5 rounded-full overflow-hidden",
            isDark ? "left-6" : "left-0.5",
            isDark 
              ? "bg-gradient-to-r from-red-600 to-red-800 shadow-lg shadow-red-500/50" 
              : "bg-gradient-to-r from-blue-400 to-cyan-300 shadow-lg shadow-blue-400/50",
            isAnimating && "animate-pulse scale-110"
          )}
        >
          {/* Pupila central */}
          <div 
            className={cn(
              "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-1000",
              isDark 
                ? "w-2 h-2 bg-black" 
                : "w-1.5 h-1.5 bg-white",
              isAnimating && "animate-spin"
            )}
          />
          
          {/* Padrão Sharingan (modo escuro) */}
          {isDark && (
            <>
              <div 
                className={cn(
                  "absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-1.5 bg-black rounded-full transition-all duration-1000",
                  isAnimating && "animate-pulse"
                )}
              />
              <div 
                className={cn(
                  "absolute bottom-1 left-1/4 transform w-0.5 h-1 bg-black rounded-full transition-all duration-1000",
                  isAnimating && "animate-pulse"
                )}
              />
              <div 
                className={cn(
                  "absolute bottom-1 right-1/4 transform w-0.5 h-1 bg-black rounded-full transition-all duration-1000",
                  isAnimating && "animate-pulse"
                )}
              />
            </>
          )}
          
          {/* Padrão Gojo (modo claro) */}
          {!isDark && (
            <>
              <div 
                className={cn(
                  "absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-1000",
                  isAnimating && "animate-pulse"
                )}
              />
              <div 
                className={cn(
                  "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-0.5 bg-white/50 rounded-full transition-all duration-1000",
                  isAnimating && "animate-pulse"
                )}
              />
            </>
          )}
          
          {/* Brilho nos olhos */}
          <div 
            className={cn(
              "absolute top-1 right-1 w-1 h-1 bg-white/80 rounded-full transition-all duration-1000",
              isAnimating && "animate-ping"
            )}
          />
        </div>
      </div>
      
      {/* Label */}
      <span className="text-sm font-medium text-sidebar-foreground/70">
        {isDark ? 'Sharingan' : 'Six Eyes'}
      </span>
    </div>
  );
}
