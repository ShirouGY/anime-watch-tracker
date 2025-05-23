import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface AvatarFile {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  last_accessed_at: string;
  metadata: Record<string, any>;
}

export function AvatarSelector({
  currentAvatar,
  onAvatarChange
}: {
  currentAvatar: string | null;
  onAvatarChange: (url: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [availableAvatars, setAvailableAvatars] = useState<string[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && availableAvatars.length === 0) {
      const fetchAvatars = async () => {
        setLoadingAvatars(true);
        const { data, error } = await supabase.storage.from('avatars').list();
        
        if (error) {
          console.error("Erro ao listar avatares do bucket:", error);
          toast({
            variant: "destructive",
            description: "Erro ao carregar opções de avatar."
          });
          setLoadingAvatars(false);
          return;
        }

        const avatarUrls = data.map((file: AvatarFile) => {
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(file.name);
            return publicUrl;
        }).filter(url => url !== null);

        setAvailableAvatars(avatarUrls);
        setLoadingAvatars(false);
      };

      fetchAvatars();
    }
  }, [isOpen, availableAvatars.length, toast]);

  const handleSelectAvatar = async (url: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: url })
        .eq('id', user.id);

      if (error) throw error;

      onAvatarChange(url);
      toast({
        description: "Avatar atualizado com sucesso!"
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Erro ao atualizar avatar no DB:", error);
      toast({
        variant: "destructive",
        description: `Erro ao atualizar o avatar: ${error.message || 'Erro desconhecido'}`
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="absolute bottom-0 right-0 rounded-full bg-background shadow-sm border h-8 w-8 p-0"
        >
          <span className="sr-only">Alterar avatar</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-pencil"
          >
            <line x1="18" x2="22" y1="2" y2="6"></line>
            <path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path>
          </svg>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escolha um avatar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loadingAvatars ? (
            <div className="grid grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-20 w-20 rounded-full mx-auto" />
              ))}
            </div>
          ) : availableAvatars.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {availableAvatars.map((avatarUrl, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <button
                    className={`rounded-full overflow-hidden border-2 transition-all ${
                      currentAvatar === avatarUrl
                        ? "border-anime-purple scale-110"
                        : "border-transparent hover:border-anime-purple/50"
                    }`}
                    onClick={() => handleSelectAvatar(avatarUrl)}
                  >
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
                      <AvatarFallback>{`A${index + 1}`}</AvatarFallback>
                    </Avatar>
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-center text-muted-foreground">Nenhum avatar encontrado no bucket.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
