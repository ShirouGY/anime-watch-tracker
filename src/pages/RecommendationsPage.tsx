
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Star, TrendingUp, Filter, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/use-subscription";
import { useSmartRecommendations } from "@/hooks/use-smart-recommendations";
import { SmartRecommendationCard } from "@/components/recommendations/SmartRecommendationCard";
import { useAnimeLists } from "@/hooks/use-anime-lists";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RecommendationsPage = () => {
  const { user, session } = useAuth();
  const { subscriptionData } = useSubscription();
  const { toast } = useToast();
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  
  const isPremium = subscriptionData?.subscribed || false;
  
  const { data: watchedAnimes } = useAnimeLists('completed');
  const { data: watchingAnimes } = useAnimeLists('watching');
  
  const {
    recommendations,
    trendingAnimes,
    isLoading,
    error,
    genres
  } = useSmartRecommendations(isPremium);

  const addToList = async (animeData: any) => {
    if (!user || !session) {
      toast({
        title: "Login necessário",
        description: "Faça login para adicionar animes à sua lista",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('anime_lists')
        .insert({
          user_id: user.id,
          anime_id: animeData.anime_id,
          title: animeData.title,
          image: animeData.image,
          episodes: animeData.episodes,
          year: animeData.year,
          status: animeData.status,
          rating: animeData.rating,
          notes: animeData.notes,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: `${animeData.title} foi adicionado à sua lista!`,
      });
    } catch (error: any) {
      console.error('Error adding anime to list:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar anime à lista",
        variant: "destructive",
      });
    }
  };

  if (!isPremium) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mb-6">
            <Crown className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Recomendações Premium</h1>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubra animes personalizados baseados no seu histórico de visualização. 
            Nosso algoritmo inteligente analisa seus gostos e sugere títulos perfeitos para você.
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Recursos Premium
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Recomendações inteligentes baseadas em IA</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Análise de compatibilidade personalizada</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Filtros avançados por gênero</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">Animes em alta atualizados diariamente</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2">Analisando seus gostos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Erro ao carregar recomendações: {error}</p>
        <Button onClick={() => window.location.reload()}>Tentar Novamente</Button>
      </div>
    );
  }

  const filteredRecommendations = selectedGenre 
    ? recommendations.filter(anime => 
        anime.genres.some(genre => genre.name.toLowerCase() === selectedGenre.toLowerCase())
      )
    : recommendations;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-yellow-500" />
            Recomendações Premium
          </h1>
          <p className="text-muted-foreground mt-2">
            Animes selecionados especialmente para você baseados no seu histórico
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
          Premium Ativo
        </Badge>
      </div>

      {/* Genre Filter */}
      {genres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filtrar por Gênero
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedGenre === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre("")}
              >
                Todos
              </Button>
              {genres.slice(0, 10).map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre)}
                >
                  {genre}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="personalized" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personalized">Para Você</TabsTrigger>
          <TabsTrigger value="trending">Em Alta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personalized" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Personalizadas</CardTitle>
              <CardDescription>
                Baseado em {watchedAnimes?.length || 0} animes assistidos e {watchingAnimes?.length || 0} animes assistindo
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRecommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredRecommendations.map((anime) => (
                    <SmartRecommendationCard
                      key={anime.mal_id}
                      anime={anime}
                      onAddToList={addToList}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    {selectedGenre 
                      ? `Nenhuma recomendação encontrada para o gênero "${selectedGenre}"`
                      : "Nenhuma recomendação encontrada. Assista mais animes para receber sugestões personalizadas!"
                    }
                  </p>
                  {selectedGenre && (
                    <Button variant="outline" onClick={() => setSelectedGenre("")}>
                      Limpar Filtro
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Animes em Alta
              </CardTitle>
              <CardDescription>
                Os animes mais populares e bem avaliados da temporada
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trendingAnimes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {trendingAnimes.map((anime) => (
                    <SmartRecommendationCard
                      key={anime.mal_id}
                      anime={anime}
                      onAddToList={addToList}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Carregando animes em alta...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationsPage;
