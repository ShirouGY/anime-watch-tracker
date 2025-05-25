
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
    <div className="min-h-screen w-full">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto w-full">
            <div className="w-full p-4 pb-16 max-w-7xl mx-auto">
              <div className={cn("flex items-center mb-6", isMobile ? "justify-between" : "justify-end")}>
                {isMobile && (
                  <SidebarTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <Menu className="h-5 w-5" />
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
