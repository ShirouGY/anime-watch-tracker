
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
  
  {/* Itens do menu */}
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

  {/* Renderiza o sidebar */}
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="flex justify-center items-center py-6">
        <Link to="/dashboard" className="w-full flex justify-center">
          <h1 className="text-xl font-bold anime-gradient-text">SoloAnimeList</h1>
        </Link>
      </SidebarHeader>
      
      {/* Conteúdo do sidebar */}
      <SidebarContent>
        {/* Grupo de itens do menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Menu de itens do menu */}
            <SidebarMenu>
              {/* Itens do menu */}
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
        
        {/* Grupo de ações */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs uppercase text-muted-foreground">
            Ações
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Botão para adicionar um anime */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90">
                  <AddAnimeDialog />
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* Botão para sair */}
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
    </Sidebar>
  );
}

export default AppSidebar;
