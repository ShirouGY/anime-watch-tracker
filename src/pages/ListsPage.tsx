
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Eye, Plus, Search, Star, Trash, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AddAnimeDialog } from "@/components/AddAnimeDialog";
import { useAnimeLists, useUpdateAnime, useDeleteAnime } from "@/hooks/use-anime-lists";

const ListsPage = () => {
  const { toast } = useToast();
  const { data: watchlistAnimes, isLoading: loadingWatchlist } = useAnimeLists('plan_to_watch');
  const { data: watchedAnimes, isLoading: loadingWatched } = useAnimeLists('completed');
  const updateAnimeMutation = useUpdateAnime();
  const deleteAnimeMutation = useDeleteAnime();

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
        </TabsList>
        
        <TabsContent value="watchlist">
          {loadingWatchlist ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Carregando sua lista...</p>
            </div>
          ) : watchlistAnimes && watchlistAnimes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {watchlistAnimes.map((anime) => (
                <Card key={anime.id} className="overflow-hidden anime-card">
                  <div className="relative">
                    <img 
                      src={anime.image || 'https://via.placeholder.com/300x450?text=Sem+Imagem'} 
                      alt={anime.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <h3 className="text-white font-medium">{anime.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <span>{anime.episodes || '?'} episódios</span>
                        {anime.year && (
                          <>
                            <span>•</span>
                            <span>{anime.year}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                      onClick={() => handleMoveToWatched(anime.id)}
                    >
                      <Check size={16} className="mr-1" />
                      Já assisti
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveAnime(anime.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-md">
              <List className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Sua lista está vazia</h3>
              <p className="text-muted-foreground mb-4">
                Adicione animes que você deseja assistir
              </p>
              <AddAnimeDialog />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="watched">
          {loadingWatched ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-muted-foreground">Carregando sua lista...</p>
            </div>
          ) : watchedAnimes && watchedAnimes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {watchedAnimes.map((anime) => (
                <Card key={anime.id} className="overflow-hidden anime-card">
                  <div className="relative">
                    <img 
                      src={anime.image || 'https://via.placeholder.com/300x450?text=Sem+Imagem'} 
                      alt={anime.title} 
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                      }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <h3 className="text-white font-medium">{anime.title}</h3>
                      <div className="flex items-center gap-1 text-xs text-white/80">
                        <span>{anime.episodes || '?'} episódios</span>
                        {anime.year && (
                          <>
                            <span>•</span>
                            <span>{anime.year}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium text-white">{anime.rating || '-'}</span>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 text-muted-foreground"
                      onClick={() => {
                        toast({
                          description: `Avalie ${anime.title}.`,
                        });
                      }}
                    >
                      <Star size={16} className="mr-1" />
                      Avaliar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleRemoveAnime(anime.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed rounded-md">
              <Eye className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Nenhum anime assistido</h3>
              <p className="text-muted-foreground mb-4">
                Marque animes como assistidos para vê-los aqui
              </p>
              <AddAnimeDialog />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListsPage;
