import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Medal, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useAnimeLists, Anime } from "@/hooks/use-anime-lists";

const DashboardPage = () => {
  const [progressValue, setProgressValue] = useState(0);
  
  {/* Busca todos os dados das listas de animes do usuário */}
  const { data: allAnimes, isLoading } = useAnimeLists();
  
  {/* Busca especificamente os animes completados */}
  const { data: watchedAnimes } = useAnimeLists('completed');
  
  {/* Cálculo de estatísticas */}
  {/* Total de animes assistidos */}
  const totalWatched = watchedAnimes?.length || 0;
  
  {/* Calcula o total de horas assistidas (assumindo ~24 minutos por episódio) */}
  const totalHours = watchedAnimes?.reduce((acc, anime) => 
    acc + (anime.episodes || 0) * 0.4, 0
  ).toFixed(1) || "0.0";
  
  {/* Calcula a nota média dos animes avaliados */}
  const averageRating = watchedAnimes?.length 
    ? (watchedAnimes.reduce((acc, anime) => acc + (anime.rating || 0), 0) / 
       watchedAnimes.filter(anime => anime.rating != null).length).toFixed(1)
    : "0.0";
  
  {/* Calcula o nível de otaku (1 nível a cada 5 animes assistidos) */}
  const currentLevel = Math.floor(totalWatched / 5) || 0;
  
  {/* Calcula o progresso para o próximo nível */}
  const nextLevelProgress = totalWatched ? ((totalWatched % 5) / 5) * 100 : 0;
  
  {/* Animes recentes (últimos 4 assistidos) */}
  const recentAnimes = watchedAnimes?.slice(0, 4) || [];
  
  {/* Animes recomendados (animes com status 'plan_to_watch') */}
  const recommendedAnimes = allAnimes?.filter(anime => anime.status === 'plan_to_watch')?.slice(0, 4) || [];
  
  useEffect(() => {
    const timer = setTimeout(() => setProgressValue(nextLevelProgress), 500);
    return () => clearTimeout(timer);
  }, [nextLevelProgress]);

  {/* Renderiza o dashboard */}
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Olá, Otaku!</h1>
        <p className="text-muted-foreground">Bem-vindo de volta ao seu perfil de anime.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Assistidos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assistidos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalWatched}</div>
                <p className="text-xs text-muted-foreground">
                  Animes completados
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Horas Assistidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Horas Assistidas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalHours} hrs</div>
                <p className="text-xs text-muted-foreground">
                  ~24 min por episódio
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Nota Média */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {watchedAnimes?.some(anime => anime.rating != null) ? averageRating : "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  De todos os animes avaliados
                </p>
              </>
            )}
          </CardContent>
        </Card>
        
        {/* Nível de Otaku */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nível de Otaku</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">Nível {currentLevel}</div>
                <div className="mt-2">
                  <Progress value={progressValue} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Faltam {5 - (totalWatched % 5)} animes para o próximo nível
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recentemente Assistidos</TabsTrigger>
          <TabsTrigger value="recommended">Recomendados</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          {/* Recentemente Assistidos */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="anime-card">
                  <Skeleton className="w-full h-40" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentAnimes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {recentAnimes.map((anime) => (
                <div key={anime.id} className="anime-card">
                  <img 
                    src={anime.image || 'https://via.placeholder.com/300x450?text=Sem+Imagem'} 
                    alt={anime.title} 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                    }}
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{anime.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">{anime.episodes || '?'} eps</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-medium">{anime.rating || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Você ainda não completou nenhum anime.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="recommended" className="mt-4">
          {/* Recomendados */}
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="anime-card">
                  <Skeleton className="w-full h-40" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendedAnimes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {recommendedAnimes.map((anime) => (
                <div key={anime.id} className="anime-card">
                  <img 
                    src={anime.image || 'https://via.placeholder.com/300x450?text=Sem+Imagem'} 
                    alt={anime.title} 
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                    }}
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-1">{anime.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-muted-foreground">{anime.episodes || '?'} eps</span>
                      {anime.year && <span className="text-xs text-muted-foreground">{anime.year}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">Nenhum anime planejado para assistir.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
