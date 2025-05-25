
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";

export function AppLayout() {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full bg-background">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto w-full min-w-0">
            <div className={cn(
              "w-full mx-auto",
              isMobile ? "p-2 pb-16" : "p-4 pb-16 max-w-7xl"
            )}>
              <div className={cn(
                "flex items-center mb-4",
                isMobile ? "justify-between" : "justify-end"
              )}>
                {isMobile && (
                  <SidebarTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SidebarTrigger>
                )}
                <div className="flex items-center gap-2">
                  {/* Area para notificações ou outras funcionalidades do cabeçalho */}
                </div>
              </div>
              <div className="w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default AppLayout;
