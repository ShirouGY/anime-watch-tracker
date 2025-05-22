
import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AVATAR_OPTIONS = [
  {
    id: 1,
    name: "Naruto",
    url: "https://i.imgur.com/7LdpJKQ.png"
  },
  {
    id: 2,
    name: "Luffy",
    url: "https://i.imgur.com/GVqwFjY.png"
  },
  {
    id: 3,
    name: "Goku",
    url: "https://i.imgur.com/8KA9GBF.png"
  },
  {
    id: 4,
    name: "Ichigo",
    url: "https://i.imgur.com/Yz8QY5g.png"
  },
  {
    id: 5,
    name: "Sakura",
    url: "https://i.imgur.com/JYmS5m2.png"
  },
  {
    id: 6,
    name: "Mikasa",
    url: "https://i.imgur.com/NXZnvqC.png"
  }
];

export function AvatarSelector({ currentAvatar, onAvatarChange }: { 
  currentAvatar: string | null,
  onAvatarChange: (url: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSelectAvatar = async (url: string) => {
    if (!user) return;

    try {
      onAvatarChange(url);
      
      // Update the profile in Supabase
      await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);
      
      toast({
        description: "Avatar atualizado com sucesso!"
      });
      
      setIsOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Erro ao atualizar o avatar."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="absolute bottom-0 right-0 rounded-full bg-background shadow-sm border h-8 w-8 p-0">
          <span className="sr-only">Alterar avatar</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><line x1="18" x2="22" y1="2" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolha um avatar</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          {AVATAR_OPTIONS.map((avatar) => (
            <div key={avatar.id} className="flex flex-col items-center gap-2">
              <button
                className={`rounded-full overflow-hidden border-2 transition-all ${
                  currentAvatar === avatar.url 
                    ? "border-anime-purple scale-110" 
                    : "border-transparent hover:border-anime-purple/50"
                }`}
                onClick={() => handleSelectAvatar(avatar.url)}
              >
                <Avatar className="h-20 w-20">
                  <AvatarImage src={avatar.url} alt={avatar.name} />
                  <AvatarFallback>{avatar.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              </button>
              <span className="text-xs font-medium">{avatar.name}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
