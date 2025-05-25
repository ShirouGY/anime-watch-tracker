
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Crown, Lock } from "lucide-react";
import { AvatarOption, AvatarFile } from "@/types/avatar";
import { useAvatarUnlocks } from "@/hooks/use-avatar-unlocks";

// Mapeamento de arquivos de avatar para IDs de anime (você pode expandir isso)
const AVATAR_ANIME_MAPPING: Record<string, { animeId: string; animeTitle: string }> = {
  'naruto.png': { animeId: '20', animeTitle: 'Naruto' },
  'sasuke.png': { animeId: '20', animeTitle: 'Naruto' },
  'goku.png': { animeId: '223', animeTitle: 'Dragon Ball Z' },
  'vegeta.png': { animeId: '223', animeTitle: 'Dragon Ball Z' },
  'luffy.png': { animeId: '21', animeTitle: 'One Piece' },
  'zoro.png': { animeId: '21', animeTitle: 'One Piece' },
  // Adicione mais mapeamentos conforme necessário
};

export function AvatarSelector({
  currentAvatar,
  onAvatarChange,
  isPremium = false
}: {
  currentAvatar: string | null;
  onAvatarChange: (url: string) => void;
  isPremium?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [availableAvatars, setAvailableAvatars] = useState<AvatarOption[]>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && availableAvatars.length === 0) {
      const fetchAvatars = async () => {
        setLoadingAvatars(true);
        
        try {
          // Fetch free icons
          const { data: freeIcons, error: freeError } = await supabase.storage
            .from('avatar-icons')
            .list('icons_free');

          if (freeError) {
            console.error("Erro ao listar ícones gratuitos:", freeError);
          }

          // Fetch premium icons
          const { data: premiumIcons, error: premiumError } = await supabase.storage
            .from('avatar-icons')
            .list('icons_premium');

          if (premiumError) {
            console.error("Erro ao listar ícones premium:", premiumError);
          }

          const allAvatars: AvatarOption[] = [];

          // Process free icons
          if (freeIcons) {
            freeIcons.forEach((file: AvatarFile) => {
              const { data: { publicUrl } } = supabase.storage
                .from('avatar-icons')
                .getPublicUrl(`icons_free/${file.name}`);
              
              allAvatars.push({
                url: publicUrl,
                isPremium: false,
                name: file.name
              });
            });
          }

          // Process premium icons
          if (premiumIcons) {
            premiumIcons.forEach((file: AvatarFile) => {
              const { data: { publicUrl } } = supabase.storage
                .from('avatar-icons')
                .getPublicUrl(`icons_premium/${file.name}`);
              
              const animeMapping = AVATAR_ANIME_MAPPING[file.name];
              
              allAvatars.push({
                url: publicUrl,
                isPremium: true,
                name: file.name,
                animeId: animeMapping?.animeId,
                animeTitle: animeMapping?.animeTitle
              });
            });
          }

          setAvailableAvatars(allAvatars);
        } catch (error) {
          console.error("Erro geral ao buscar avatares:", error);
          toast({
            variant: "destructive",
            description: "Erro ao carregar opções de avatar."
          });
        } finally {
          setLoadingAvatars(false);
        }
      };

      fetchAvatars();
    }
  }, [isOpen, availableAvatars.length, toast]);

  const { data: avatarsWithUnlocks } = useAvatarUnlocks(availableAvatars);

  const handleSelectAvatar = async (avatarOption: AvatarOption) => {
    if (!user) return;

    if (!avatarOption.isUnlocked) {
      if (!isPremium) {
        toast({
          variant: "destructive",
          description: "Este avatar é exclusivo para usuários Premium!"
        });
      } else if (avatarOption.animeTitle) {
        toast({
          variant: "destructive",
          description: `Você precisa assistir ${avatarOption.animeTitle} para desbloquear este avatar!`
        });
      } else {
        toast({
          variant: "destructive",
          description: "Este avatar ainda não foi desbloqueado!"
        });
      }
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarOption.url })
        .eq('id', user.id);

      if (error) throw error;

      onAvatarChange(avatarOption.url);
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

  const avatarsToDisplay = avatarsWithUnlocks || availableAvatars;

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
          ) : avatarsToDisplay.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {avatarsToDisplay.map((avatarOption, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <button
                      className={`rounded-full overflow-hidden border-2 transition-all ${
                        currentAvatar === avatarOption.url
                          ? "border-anime-purple scale-110"
                          : "border-transparent hover:border-anime-purple/50"
                      } ${
                        !avatarOption.isUnlocked
                          ? "opacity-50 cursor-not-allowed" 
                          : "cursor-pointer"
                      }`}
                      onClick={() => handleSelectAvatar(avatarOption)}
                      disabled={!avatarOption.isUnlocked}
                    >
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={avatarOption.url} alt={`Avatar ${index + 1}`} />
                        <AvatarFallback>{`A${index + 1}`}</AvatarFallback>
                      </Avatar>
                      
                      {!avatarOption.isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </button>
                    
                    {avatarOption.isPremium && (
                      <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white p-1 h-6 w-6 rounded-full flex items-center justify-center">
                        <Crown className="h-3 w-3" />
                      </Badge>
                    )}
                  </div>
                  
                  {avatarOption.isPremium && avatarOption.animeTitle && !avatarOption.isUnlocked && (
                    <p className="text-xs text-center text-muted-foreground">
                      Assista {avatarOption.animeTitle}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Nenhum avatar encontrado.</p>
          )}
          
          {!isPremium && avatarsToDisplay.some(avatar => avatar.isPremium) && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              <p>Avatares com <Crown className="inline h-4 w-4 text-yellow-500" /> são exclusivos para usuários Premium</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
