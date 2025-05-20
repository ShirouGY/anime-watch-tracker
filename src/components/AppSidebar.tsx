
import { useState } from "react";
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
  BookOpen, 
  Home, 
  List, 
  LogOut, 
  Plus, 
  Settings, 
  Star, 
  User 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
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
    <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} className="border-r">
      <SidebarHeader className="flex justify-center items-center py-6">
        <Link to="/dashboard" className="w-full flex justify-center">
          {!collapsed ? (
            <h1 className="text-xl font-bold anime-gradient-text">MeuAnimeLista</h1>
          ) : (
            <BookOpen className="text-anime-purple" size={24} />
          )}
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={cn("text-xs uppercase text-muted-foreground", 
            collapsed ? "sr-only" : "")}>
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
          <SidebarGroupLabel className={cn("text-xs uppercase text-muted-foreground", 
            collapsed ? "sr-only" : "")}>
            Ações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                  <Button className="w-full flex gap-2 items-center justify-center">
                    <Plus size={18} />
                    <span className={cn(collapsed ? "sr-only" : "")}>Adicionar Anime</span>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-red-500 hover:bg-red-500/10">
                  <Link to="/login">
                    <LogOut size={18} />
                    <span>Sair</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <div className={cn("p-4", collapsed ? "sr-only" : "")}>
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
