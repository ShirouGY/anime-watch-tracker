
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AddAnimeDialog } from "@/components/AddAnimeDialog";
import { useAnimeLists, useUpdateAnime, useDeleteAnime } from "@/hooks/use-anime-lists";
import { AnimeListTab } from "@/components/anime/AnimeListTab";
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from "@/hooks/use-mobile";

const ListsPage = () => {
  const { toast } = useToast();
  const { data: watchlistAnimes, isLoading: loadingWatchlist } = useAnimeLists('plan_to_watch');
  const { data: watchedAnimes, isLoading: loadingWatched } = useAnimeLists('completed');
  const updateAnimeMutation = useUpdateAnime();
  const deleteAnimeMutation = useDeleteAnime();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  {/* Verifica se o usuário é premium */}
  const isPremium = user?.user_metadata?.is_premium;

  {/* Remove um anime da lista */}
  const handleRemoveAnime = (animeId: string) => {
    deleteAnimeMutation.mutate(animeId);
  };

  {/* Move um anime para a lista de assistidos */}
  const handleMoveToWatched = (animeId: string) => {
    updateAnimeMutation.mutate({
      id: animeId,
      status: 'completed'
    });
    
    toast({
      description: "Anime marcado como assistido.",
    });
  };
  
  {/* Avalia um anime */}
  const handleRateAnime = (animeId: string, rating: number) => {
    updateAnimeMutation.mutate({
      id: animeId,
      rating: rating,
    });

    toast({
      description: `Anime avaliado com ${rating} estrelas.`,
    });
  };
  
  {/* Renderiza as listas de animes */}
  return (
    <div className="space-y-4 animate-fade-in w-full">
      <div className="flex flex-col gap-4">
        <h1 className={`font-bold text-foreground ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>
          Minhas Listas
        </h1>
        <div className="w-full">
          <AddAnimeDialog />
        </div>
      </div>
      
      <Tabs defaultValue="watchlist" className="w-full">
        <TabsList className={`mb-4 w-full grid h-auto ${isPremium ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="watchlist" className={`text-xs px-2 py-2 ${isMobile ? 'text-xs' : 'text-sm px-4'}`}>
            Quero Assistir
          </TabsTrigger>
          <TabsTrigger value="watched" className={`text-xs px-2 py-2 ${isMobile ? 'text-xs' : 'text-sm px-4'}`}>
            Assistidos
          </TabsTrigger>
          {isPremium && (
            <TabsTrigger value="recommended" className={`text-xs px-2 py-2 ${isMobile ? 'text-xs' : 'text-sm px-4'}`}>
              Recomendados
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="watchlist" className="w-full">
          <AnimeListTab
            animes={watchlistAnimes}
            isLoading={loadingWatchlist}
            onRemoveAnime={handleRemoveAnime}
            onMoveToWatched={handleMoveToWatched}
          />
        </TabsContent>
        
        <TabsContent value="watched" className="w-full">
          <AnimeListTab
            animes={watchedAnimes}
            isLoading={loadingWatched}
            isWatched={true}
            onRemoveAnime={handleRemoveAnime}
            onRateAnime={handleRateAnime}
          />
        </TabsContent>

        {isPremium && (
          <TabsContent value="recommended" className="w-full">
            <div className="text-center py-10">
               <p className="text-muted-foreground">Conteúdo de recomendações para usuários Premium.</p>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ListsPage;
