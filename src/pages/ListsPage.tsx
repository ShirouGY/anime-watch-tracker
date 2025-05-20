
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Check, Eye, Plus, Search, Star, Trash, X } from "lucide-react";
import { sampleAnimesWatchlist, sampleAnimesWatched } from "@/data/sampleData";
import { useToast } from "@/hooks/use-toast";

const ListsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const { toast } = useToast();
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulando busca na API
    setTimeout(() => {
      // Mock de resultados (seria substituído pela chamada real à API)
      setSearchResults(sampleAnimesWatched.slice(0, 3));
      setIsSearching(false);
    }, 1000);
  };
  
  const handleAddAnime = (anime: any) => {
    toast({
      title: "Anime adicionado",
      description: `${anime.title} foi adicionado à sua lista.`,
    });
    setOpenDialog(false);
  };

  const handleRemoveAnime = (anime: any) => {
    toast({
      description: `${anime.title} foi removido da sua lista.`,
    });
  };

  const handleMoveToWatched = (anime: any) => {
    toast({
      description: `${anime.title} foi marcado como assistido.`,
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Minhas Listas</h1>
        
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button className="anime-button-primary">
              <Plus size={16} />
              Adicionar Anime
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Novo Anime</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? "Buscando..." : "Buscar"}
                </Button>
              </div>
              
              <div className="mt-4 space-y-2">
                {searchResults.length > 0 ? (
                  searchResults.map((anime) => (
                    <div key={anime.id} className="flex items-center gap-3 border p-2 rounded-md">
                      <img 
                        src={anime.image} 
                        alt={anime.title} 
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{anime.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {anime.episodes} episódios
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleAddAnime(anime)}>
                        <Plus size={16} />
                      </Button>
                    </div>
                  ))
                ) : isSearching ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Buscando...
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="mx-auto h-8 w-8 mb-2" />
                    Nenhum resultado encontrado. Tente outra busca.
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="mx-auto h-8 w-8 mb-2" />
                    Digite o nome de um anime para buscar
                  </div>
                )}
              </div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou adicione manualmente
                  </span>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label htmlFor="manual-title">Título</label>
                  <Input id="manual-title" placeholder="Nome do anime" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="manual-episodes">Episódios</label>
                    <Input id="manual-episodes" type="number" placeholder="12" />
                  </div>
                  <div>
                    <label htmlFor="manual-year">Ano</label>
                    <Input id="manual-year" type="number" placeholder="2023" />
                  </div>
                </div>
                <Button className="w-full mt-2"
                  onClick={() => {
                    toast({
                      title: "Anime adicionado",
                      description: "O anime foi adicionado manualmente à sua lista.",
                    });
                    setOpenDialog(false);
                  }}
                >
                  Adicionar Manualmente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="watchlist" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="watchlist">Quero Assistir</TabsTrigger>
          <TabsTrigger value="watched">Assistidos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="watchlist">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sampleAnimesWatchlist.map((anime) => (
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
                </div>
                <div className="p-3 flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1"
                    onClick={() => handleMoveToWatched(anime)}
                  >
                    <Check size={16} className="mr-1" />
                    Já assisti
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveAnime(anime)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="watched">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sampleAnimesWatched.map((anime) => (
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
                </div>
                <div className="p-3 flex justify-between gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-muted-foreground"
                    onClick={() => {
                      // Aqui entraria a lógica para editar a avaliação
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
                    onClick={() => handleRemoveAnime(anime)}
                  >
                    <Trash size={16} />
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

export default ListsPage;
