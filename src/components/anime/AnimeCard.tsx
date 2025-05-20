
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Star, Trash } from "lucide-react";
import { Anime } from "@/hooks/use-anime-lists";

interface AnimeCardProps {
  anime: Anime;
  onRemove: (animeId: string) => void;
  onMarkAsWatched?: (animeId: string) => void;
  onRate?: (animeId: string) => void;
  isWatched?: boolean;
}

export function AnimeCard({
  anime,
  onRemove,
  onMarkAsWatched,
  onRate,
  isWatched = false
}: AnimeCardProps) {
  return (
    <Card className="overflow-hidden anime-card">
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
        {isWatched && (
          <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-md flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium text-white">{anime.rating || '-'}</span>
          </div>
        )}
      </div>
      <div className="p-3 flex justify-between gap-2">
        {isWatched ? (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-muted-foreground"
            onClick={() => onRate && onRate(anime.id)}
          >
            <Star size={16} className="mr-1" />
            Avaliar
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="flex-1"
            onClick={() => onMarkAsWatched && onMarkAsWatched(anime.id)}
          >
            <Check size={16} className="mr-1" />
            Já assisti
          </Button>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onRemove(anime.id)}
        >
          <Trash size={16} />
        </Button>
      </div>
    </Card>
  );
}
