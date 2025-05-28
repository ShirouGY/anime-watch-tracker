
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
  const { subscriptionData, isLoading: subscriptionLoading, checkSubscription, createCheckout } = useSubscription();
  const { toast } = useToast();
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  
  const isPremium = subscriptionData?.subscribed || false;
  
  const { data: watchedAnimes } = useAnimeLists('completed');
  const { data: watchingAnimes } = useAnimeLists('watching');
  const { data: allUserAnimes } = useAnimeLists(); // Todos os animes do usuário
  
  const {
    recommendations,
    trendingAnimes,
    isLoading,
    error,
    genres
  } = useSmartRecommendations(isPremium);

  // Log para debug
  useEffect(() => {
    console.log('Estado atual da página:', {
      isPremium,
      recommendations: recommendations.length,
      trendingAnimes: trendingAnimes.length,
      userAnimes: allUserAnimes?.length || 0,
      isLoading,
      error
    });
  }, [isPremium, recommendations, trendingAnimes, allUserAnimes, isLoading, error]);

  {/* Força verificação da assinatura quando a página carrega */}
  useEffect(() => {
    if (user && session && !subscriptionLoading) {
      console.log('Verificando status da assinatura...', { subscribed: subscriptionData?.subscribed });
      checkSubscription();
    }
  }, [user, session]);

  {/* Adiciona um anime à lista */}
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

  {/* Renderiza a página de recomendações */}
  if (subscriptionLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2">Verificando sua assinatura...</p>
      </div>
    );
  }

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
          
          <div className="flex gap-4 justify-center mb-8">
            <Button onClick={checkSubscription} variant="outline">
              Verificar Status Premium
            </Button>
            <Button 
              onClick={createCheckout}
              disabled={subscriptionLoading}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
            >
              <Crown className="h-4 w-4 mr-2" />
              {subscriptionLoading ? "Processando..." : "Assinar Premium"}
            </Button>
          </div>
          
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

  {/* Função para filtrar animes por gênero (corrigida) */}
  const filterAnimesByGenre = (animes: any[], genre: string) => {
    if (!genre) return animes;
    
    return animes.filter(anime => 
      anime.genres && anime.genres.some((g: any) => 
        g.name && g.name.toLowerCase().includes(genre.toLowerCase())
      )
    );
  };

  const filteredRecommendations = filterAnimesByGenre(recommendations, selectedGenre);
  const filteredTrendingAnimes = filterAnimesByGenre(trendingAnimes, selectedGenre);

  {/* Função para obter gêneros únicos e limitar a quantidade */}
  const getUniqueGenres = () => {
    const allGenres = new Set<string>();
    
    [...recommendations, ...trendingAnimes].forEach(anime => {
      if (anime.genres) {
        anime.genres.forEach((genre: any) => {
          if (genre.name) {
            allGenres.add(genre.name);
          }
        });
      }
    });
    
    return Array.from(allGenres).slice(0, 12); {/* Limita a 12 gêneros */}
  };

  const availableGenres = getUniqueGenres();

  {/* Renderiza a página de recomendações */}
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

  {/* Renderiza a página de recomendações */}
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

      {/* Informações sobre como funciona a recomendação */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center gap-2">
            <Star className="h-5 w-5" />
            Como funcionam as recomendações personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-700 dark:text-blue-300">
          <div className="space-y-2">
            <p>• <strong>Análise de gêneros:</strong> O sistema identifica os gêneros dos animes que você mais assiste</p>
            <p>• <strong>Padrões de avaliação:</strong> Considera suas notas e animes favoritos</p>
            <p>• <strong>Match inteligente:</strong> Busca animes similares com alta pontuação na base de dados</p>
            <p>• <strong>Filtros automáticos:</strong> Remove animes que você já assistiu ou tem na sua lista</p>
          </div>
          {allUserAnimes && allUserAnimes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <p className="font-medium">
                Baseado em {allUserAnimes.length} animes na sua lista ({watchedAnimes?.length || 0} assistidos, {watchingAnimes?.length || 0} assistindo)
              </p>
            </div>
          )}
          {(!allUserAnimes || allUserAnimes.length === 0) && (
            <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
              <p className="font-medium text-amber-600 dark:text-amber-400">
                💡 Adicione alguns animes à sua lista para receber recomendações mais personalizadas!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filtro de Gênero */}
      {availableGenres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filtrar por Gênero
            </CardTitle>
            <CardDescription>
              {selectedGenre ? `Mostrando resultados para: ${selectedGenre}` : 'Selecione um gênero para filtrar'}
            </CardDescription>
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
              {availableGenres.map((genre) => (
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

      {/* Tabs */}
      <Tabs defaultValue="personalized" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personalized">Para Você</TabsTrigger>
          <TabsTrigger value="trending">Em Alta</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personalized" className="space-y-4">
          {/* Recomendações Personalizadas */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendações Personalizadas</CardTitle>
              <CardDescription>
                {allUserAnimes && allUserAnimes.length > 0 
                  ? `Baseado em ${allUserAnimes.length} animes na sua lista (${watchedAnimes?.length || 0} assistidos, ${watchingAnimes?.length || 0} assistindo)`
                  : 'Adicione animes à sua lista para receber recomendações personalizadas'
                }
                {selectedGenre && ` • Filtrado por: ${selectedGenre}`}
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
                  <div className="mb-4">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground mb-2">
                      {selectedGenre 
                        ? `Nenhuma recomendação encontrada para o gênero "${selectedGenre}"`
                        : (!allUserAnimes || allUserAnimes.length === 0)
                          ? "Comece adicionando alguns animes à sua lista!"
                          : "Carregando suas recomendações personalizadas..."
                      }
                    </p>
                    {!allUserAnimes || allUserAnimes.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Vá para a página "Listas" e adicione animes que você já assistiu ou quer assistir. 
                        Isso nos ajudará a entender seus gostos e sugerir animes perfeitos para você!
                      </p>
                    ) : null}
                  </div>
                  {selectedGenre && (
                    <Button variant="outline" onClick={() => setSelectedGenre("")}>
                      Limpar Filtro
                    </Button>
                  )}
                  {(!allUserAnimes || allUserAnimes.length === 0) && (
                    <Button onClick={() => window.location.href = '/listas'} className="ml-2">
                      Ir para Listas
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-4">
          {/* Animes em Alta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Animes em Alta
              </CardTitle>
              <CardDescription>
                Os animes mais populares e bem avaliados da temporada
                {selectedGenre && ` • Filtrado por: ${selectedGenre}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTrendingAnimes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredTrendingAnimes.map((anime) => (
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
                      ? `Nenhum anime em alta encontrado para o gênero "${selectedGenre}"`
                      : "Carregando animes em alta..."
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
      </Tabs>
    </div>
  );
};

export default RecommendationsPage;
