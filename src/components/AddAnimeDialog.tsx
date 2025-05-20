
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAnimeSearch, getAnimeImageUrl, AnimeSearchResult } from "@/services/animeServices";
import { useAddAnime, AnimeStatus } from "@/hooks/use-anime-lists";
import { Loader2, Plus, Search, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

interface AddAnimeDialogProps {
  onClose?: () => void;
}

const manualAnimeSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  episodes: z.number().int().min(0).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  image: z.string().url().optional(),
});

export function AddAnimeDialog({ onClose }: AddAnimeDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnime, setSelectedAnime] = useState<AnimeSearchResult | null>(null);
  const { toast } = useToast();
  
  const { data: searchResults, isLoading, error } = useAnimeSearch(searchQuery);
  const addAnimeMutation = useAddAnime();
  
  const form = useForm<z.infer<typeof manualAnimeSchema>>({
    resolver: zodResolver(manualAnimeSchema),
    defaultValues: {
      title: "",
      episodes: undefined,
      year: undefined,
      image: "",
    },
  });
  
  const handleDialogChange = (open: boolean) => {
    setOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useAnimeSearch hook
  };
  
  const handleSelectAnime = (anime: AnimeSearchResult) => {
    setSelectedAnime(anime);
  };
  
  const handleAddToList = () => {
    if (!selectedAnime) return;
    
    addAnimeMutation.mutate({
      anime_id: selectedAnime.mal_id.toString(),
      title: selectedAnime.title,
      image: getAnimeImageUrl(selectedAnime),
      episodes: selectedAnime.episodes || null,
      year: selectedAnime.year || null,
      status: "plan_to_watch" as AnimeStatus,
      rating: null,
      notes: null,
    });
    
    setOpen(false);
    setSearchQuery("");
    setSelectedAnime(null);
  };
  
  const handleManualSubmit = (values: z.infer<typeof manualAnimeSchema>) => {
    addAnimeMutation.mutate({
      anime_id: `manual-${Date.now()}`,
      title: values.title,
      image: values.image || null,
      episodes: values.episodes || null,
      year: values.year || null,
      status: "plan_to_watch" as AnimeStatus,
      rating: null,
      notes: null,
    });
    
    setOpen(false);
    form.reset();
  };
  
  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="anime-button-primary">
          <Plus size={16} />
          Adicionar Anime
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Anime</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || searchQuery.length < 3}>
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2">
            {error && (
              <div className="p-4 text-center text-red-500 border border-red-300 rounded-md">
                Erro ao buscar animes. Por favor, tente novamente.
              </div>
            )}
            
            {searchResults && searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.map((anime) => (
                  <div 
                    key={anime.mal_id} 
                    className={`flex items-center gap-3 border p-2 rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedAnime?.mal_id === anime.mal_id ? 'bg-accent' : ''}`}
                    onClick={() => handleSelectAnime(anime)}
                  >
                    <img 
                      src={getAnimeImageUrl(anime)} 
                      alt={anime.title} 
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x150?text=Sem+Imagem';
                      }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{anime.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {anime.episodes ? `${anime.episodes} episódios` : 'Episódios desconhecidos'} 
                        {anime.year ? ` • ${anime.year}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery.length > 2 && !isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="mx-auto h-8 w-8 mb-2" />
                Nenhum resultado encontrado. Tente outra busca.
              </div>
            ) : searchQuery.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="mx-auto h-8 w-8 mb-2" />
                Digite o nome de um anime para buscar
              </div>
            ) : null}
          </div>
          
          {selectedAnime && (
            <div className="p-4 border rounded-md">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">Anime selecionado</h4>
                <Button variant="ghost" size="sm" onClick={() => setSelectedAnime(null)}>
                  <X size={16} />
                </Button>
              </div>
              
              <div className="flex gap-3">
                <img
                  src={getAnimeImageUrl(selectedAnime)}
                  alt={selectedAnime.title}
                  className="w-20 h-auto object-cover rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x150?text=Sem+Imagem';
                  }}
                />
                <div>
                  <h5>{selectedAnime.title}</h5>
                  <p className="text-sm text-muted-foreground">
                    {selectedAnime.episodes ? `${selectedAnime.episodes} episódios` : 'Episódios desconhecidos'} 
                    {selectedAnime.year ? ` • ${selectedAnime.year}` : ''}
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={handleAddToList} 
                className="w-full mt-3"
                disabled={addAnimeMutation.isPending}
              >
                {addAnimeMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <Plus size={16} className="mr-2" />
                )}
                Adicionar à Lista
              </Button>
            </div>
          )}
          
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
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleManualSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do anime" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="episodes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Episódios</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="12" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          min={0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ano</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2023" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          min={1900}
                          max={new Date().getFullYear() + 1}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da imagem (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full mt-2"
                disabled={addAnimeMutation.isPending}
              >
                {addAnimeMutation.isPending ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <Plus size={16} className="mr-2" />
                )}
                Adicionar Manualmente
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
