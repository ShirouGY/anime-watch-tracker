
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Medal, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sampleAnimesWatched } from "@/data/sampleData";

const DashboardPage = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);
  
  const totalWatched = sampleAnimesWatched.length;
  const totalHours = sampleAnimesWatched.reduce((acc, anime) => acc + anime.episodes * 0.4, 0).toFixed(1);
  const currentLevel = Math.floor(totalWatched / 5);
  const nextLevelProgress = (totalWatched % 5) / 5 * 100;
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Olá, Otaku!</h1>
        <p className="text-muted-foreground">Bem-vindo de volta ao seu perfil de anime.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assistidos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWatched}</div>
            <p className="text-xs text-muted-foreground">
              +3 na última semana
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Horas Assistidas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours} hrs</div>
            <p className="text-xs text-muted-foreground">
              ~24 min por episódio
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2</div>
            <p className="text-xs text-muted-foreground">
              De todos os animes avaliados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nível de Otaku</CardTitle>
            <Medal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Nível {currentLevel}</div>
            <div className="mt-2">
              <Progress value={nextLevelProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Faltam {5 - (totalWatched % 5)} animes para o próximo nível
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recentemente Assistidos</TabsTrigger>
          <TabsTrigger value="recommended">Recomendados</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sampleAnimesWatched.slice(0, 4).map((anime) => (
              <div key={anime.id} className="anime-card">
                <img 
                  src={anime.image} 
                  alt={anime.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{anime.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{anime.episodes} eps</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-medium">{anime.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recommended" className="mt-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {sampleAnimesWatched.slice(4, 8).map((anime) => (
              <div key={anime.id} className="anime-card">
                <img 
                  src={anime.image} 
                  alt={anime.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-1">{anime.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">{anime.episodes} eps</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-medium">{anime.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
