
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
    <div className="min-h-screen">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-4 pb-16">
              <div className={cn("flex items-center mb-6", isMobile ? "justify-between" : "justify-end")}>
                {isMobile && (
                  <SidebarTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu />
                    </Button>
                  </SidebarTrigger>
                )}
                <div className="flex items-center gap-2">
                  {/* Area para notificações ou outras funcionalidades do cabeçalho */}
                </div>
              </div>
              <Outlet />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default AppLayout;
