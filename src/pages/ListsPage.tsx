import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { AddAnimeDialog } from "@/components/AddAnimeDialog";
import { useAnimeLists, useUpdateAnime, useDeleteAnime } from "@/hooks/use-anime-lists";
import { AnimeListTab } from "@/components/anime/AnimeListTab";
import { useAuth } from '@/contexts/AuthContext';

const ListsPage = () => {
  const { toast } = useToast();
  const { data: watchlistAnimes, isLoading: loadingWatchlist } = useAnimeLists('plan_to_watch');
  const { data: watchedAnimes, isLoading: loadingWatched } = useAnimeLists('completed');
  const updateAnimeMutation = useUpdateAnime();
  const deleteAnimeMutation = useDeleteAnime();
  const { user } = useAuth();

  const isPremium = user?.user_metadata?.is_premium;

  const handleRemoveAnime = (animeId: string) => {
    deleteAnimeMutation.mutate(animeId);
  };

  const handleMoveToWatched = (animeId: string) => {
    updateAnimeMutation.mutate({
      id: animeId,
      status: 'completed'
    });
    
    toast({
      description: "Anime marcado como assistido.",
    });
  };
  
  const handleRateAnime = (animeId: string, rating: number) => {
    updateAnimeMutation.mutate({
      id: animeId,
      rating: rating,
    });

    toast({
      description: `Anime avaliado com ${rating} estrelas.`,
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minhas Listas</h1>
        <AddAnimeDialog />
      </div>
      
      <Tabs defaultValue="watchlist" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="watchlist">Quero Assistir</TabsTrigger>
          <TabsTrigger value="watched">Assistidos</TabsTrigger>
          {isPremium && (
            <TabsTrigger value="recommended">Recomendados</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="watchlist">
          <AnimeListTab
            animes={watchlistAnimes}
            isLoading={loadingWatchlist}
            onRemoveAnime={handleRemoveAnime}
            onMoveToWatched={handleMoveToWatched}
          />
        </TabsContent>
        
        <TabsContent value="watched">
          <AnimeListTab
            animes={watchedAnimes}
            isLoading={loadingWatched}
            isWatched={true}
            onRemoveAnime={handleRemoveAnime}
            onRateAnime={handleRateAnime}
          />
        </TabsContent>

        {isPremium && (
          <TabsContent value="recommended">
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
