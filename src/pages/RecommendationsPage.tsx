import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, Star } from "lucide-react";
import { sampleRecommendations } from "@/data/sampleData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const RecommendationsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  const { user } = useAuth();

  const isPremium = user?.user_metadata?.is_premium;

  if (!isPremium) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="p-8 text-center">
          <Star size={48} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Conteúdo Premium Exclusivo</h2>
          <p className="text-muted-foreground">Esta seção está disponível apenas para usuários Premium.</p>
        </Card>
      </div>
    );
  }
  
  const handleAddToWatchlist = (anime: any) => {
    toast({
      title: "Adicionado à Lista",
      description: `${anime.title} foi adicionado à sua lista de "Quero Assistir".`,
    });
  };
  
  const filteredRecommendations = activeTab === "all" 
    ? sampleRecommendations
    : sampleRecommendations.filter(anime => anime.genre.includes(activeTab));
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Recomendações</h1>
        <p className="text-muted-foreground">
          Sugestões baseadas nos seus gostos e no que você já assistiu.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="mb-4 w-auto inline-flex">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="action">Ação</TabsTrigger>
            <TabsTrigger value="romance">Romance</TabsTrigger>
            <TabsTrigger value="comedy">Comédia</TabsTrigger>
            <TabsTrigger value="fantasy">Fantasia</TabsTrigger>
            <TabsTrigger value="drama">Drama</TabsTrigger>
            <TabsTrigger value="sci-fi">Sci-Fi</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecommendations.map((anime) => (
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
                    onClick={() => handleAddToWatchlist(anime)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar à lista
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="action" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecommendations.map((anime) => (
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
                    onClick={() => handleAddToWatchlist(anime)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar à lista
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="romance" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecommendations.length > 0 ? (
              filteredRecommendations.map((anime) => (
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
                      onClick={() => handleAddToWatchlist(anime)}
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
                  Nenhum anime de romance encontrado para recomendar.
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="comedy" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecommendations.map((anime) => (
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
                    onClick={() => handleAddToWatchlist(anime)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar à lista
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="fantasy" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecommendations.map((anime) => (
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
                    onClick={() => handleAddToWatchlist(anime)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar à lista
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="drama" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecommendations.map((anime) => (
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
                    onClick={() => handleAddToWatchlist(anime)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar à lista
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="sci-fi" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRecommendations.map((anime) => (
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
                    onClick={() => handleAddToWatchlist(anime)}
                  >
                    <Plus size={16} className="mr-1" />
                    Adicionar à lista
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecommendationsPage;
