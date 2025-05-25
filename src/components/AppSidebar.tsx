
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { 
  Home, 
  List, 
  LogOut, 
  Settings, 
  Star, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AddAnimeDialog } from "@/components/AddAnimeDialog";

export function AppSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    {
      title: "Início",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Minhas Listas",
      url: "/listas",
      icon: List,
    },
    {
      title: "Recomendações",
      url: "/recomendacoes",
      icon: Star,
    },
    {
      title: "Perfil",
      url: "/perfil",
      icon: User,
    },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex justify-center items-center py-6">
        <Link to="/dashboard" className="w-full flex justify-center">
          <h1 className="text-xl font-bold anime-gradient-text">SoloAnimeList</h1>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild 
                    className={cn(
                      location.pathname === item.url ? 
                      "bg-sidebar-accent text-sidebar-accent-foreground" : 
                      "hover:bg-sidebar-accent/50"
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground">
            Ações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                  <AddAnimeDialog />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-red-500 hover:bg-red-500/10" onClick={signOut}>
                  <Button variant="ghost" className="w-full flex gap-2 items-center justify-center text-red-500">
                    <LogOut size={18} />
                    <span>Sair</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-muted-foreground" />
            <Link to="/settings" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Configurações
            </Link>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
