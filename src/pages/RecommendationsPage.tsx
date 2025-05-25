import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, RefreshCw, Brain, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useSmartRecommendations } from "@/hooks/use-smart-recommendations";
import { useAddAnime } from "@/hooks/use-anime-lists";
import { SmartRecommendationCard } from "@/components/recommendations/SmartRecommendationCard";
import { sampleRecommendations } from "@/data/sampleData";

const RecommendationsPage = () => {
  const [activeTab, setActiveTab] = useState("smart");
  const { toast } = useToast();
  const { user } = useAuth();
  const { data: smartRecommendations, isLoading: isLoadingRecommendations, refetch } = useSmartRecommendations();
  const addAnimeMutation = useAddAnime();

  const isPremium = user?.user_metadata?.is_premium;

  if (!isPremium) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 text-center max-w-md">
          <Star size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Conteúdo Premium Exclusivo</h2>
          <p className="text-muted-foreground mb-4">
            As recomendações inteligentes estão disponíveis apenas para usuários Premium.
          </p>
          <p className="text-sm text-muted-foreground">
            Atualize para Premium e tenha acesso a recomendações personalizadas baseadas no seu histórico!
          </p>
        </Card>
      </div>
    );
  }

  const handleAddToList = (animeData: any) => {
    addAnimeMutation.mutate(animeData);
  };

  const handleRefreshRecommendations = () => {
    refetch();
    toast({
      title: "Recomendações Atualizadas",
      description: "Buscando novas recomendações baseadas no seu perfil...",
    });
  };
  
  const filteredSampleRecommendations = activeTab === "all" 
    ? sampleRecommendations
    : sampleRecommendations.filter(anime => anime.genre.includes(activeTab));
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="text-primary" />
            Recomendações Inteligentes
          </h1>
          <p className="text-muted-foreground">
            Sugestões personalizadas baseadas no seu histórico e preferências.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefreshRecommendations}
          disabled={isLoadingRecommendations}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingRecommendations ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>
      
      <Tabs defaultValue="smart" className="w-full" onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-4 w-auto inline-flex">
            <TabsTrigger value="smart" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Para Você
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Em Alta
            </TabsTrigger>
            <TabsTrigger value="action">Ação</TabsTrigger>
            <TabsTrigger value="romance">Romance</TabsTrigger>
            <TabsTrigger value="comedy">Comédia</TabsTrigger>
            <TabsTrigger value="fantasy">Fantasia</TabsTrigger>
            <TabsTrigger value="drama">Drama</TabsTrigger>
          </TabsList>
        </div>
        
        {/* Recomendações Inteligentes */}
        <TabsContent value="smart" className="mt-0">
          {isLoadingRecommendations ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                <p className="text-muted-foreground">Analisando suas preferências...</p>
              </div>
            </div>
          ) : smartRecommendations && smartRecommendations.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {smartRecommendations.map((anime) => (
                <SmartRecommendationCard
                  key={anime.mal_id}
                  anime={anime}
                  onAddToList={handleAddToList}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma recomendação encontrada</h3>
              <p className="text-muted-foreground mb-4">
                Adicione alguns animes à sua lista para receber recomendações personalizadas!
              </p>
              <Button onClick={handleRefreshRecommendations}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Em Alta */}
        <TabsContent value="trending" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sampleRecommendations.slice(0, 12).map((anime) => (
              <Card key={anime.id} className="overflow-hidden anime-card">
                <div className="relative">
                  <img 
                    src={anime.image} 
                    alt={anime.title} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <h3 className="text-white font-medium">{anime.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-white/80">
                      <span>{anime.episodes} episódios</span>
                      <span>•</span>
                      <span>{anime.year}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-white">{anime.rating}</span>
                  </div>
                  <div className="absolute top-2 left-2 bg-red-500/90 px-2 py-0.5 rounded text-white text-xs font-medium">
                    🔥 Trending
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {anime.genre.slice(0, 3).map((g) => (
                      <span key={g} className="bg-secondary text-xs px-2 py-0.5 rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      const animeData = {
                        anime_id: anime.id.toString(),
                        title: anime.title,
                        image: anime.image,
                        episodes: anime.episodes,
                        year: anime.year,
                        status: 'plan_to_watch',
                        rating: null,
                        notes: null,
                      };
                      handleAddToList(animeData);
                    }}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar à lista
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Outras abas permanecem iguais */}
        {["action", "romance", "comedy", "fantasy", "drama"].map((category) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredSampleRecommendations.length > 0 ? (
                filteredSampleRecommendations.map((anime) => (
                  <Card key={anime.id} className="overflow-hidden anime-card">
                    <div className="relative">
                      <img 
                        src={anime.image} 
                        alt={anime.title} 
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                        <h3 className="text-white font-medium">{anime.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-white/80">
                          <span>{anime.episodes} episódios</span>
                          <span>•</span>
                          <span>{anime.year}</span>
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs font-medium text-white">{anime.rating}</span>
                      </div>
                      {anime.matchPercentage && (
                        <div className="absolute top-2 left-2 bg-anime-purple/90 px-2 py-0.5 rounded text-white text-xs font-medium">
                          {anime.matchPercentage}% Match
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {anime.genre.slice(0, 3).map((g) => (
                          <span key={g} className="bg-secondary text-xs px-2 py-0.5 rounded-full">
                            {g}
                          </span>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full"
                        onClick={() => handleAddToList(anime)}
                      >
                        <Plus size={16} className="mr-1" />
                        Adicionar à lista
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhum anime de {category} encontrado para recomendar.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default RecommendationsPage;
