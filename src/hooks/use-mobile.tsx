
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      }
    };

    {/* Verifica se é mobile ao montar */}
    checkIsMobile();
    
    {/* Adiciona um listener de evento */}
    window.addEventListener("resize", checkIsMobile);
    
    {/* Limpa o listener de evento */}
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
}
