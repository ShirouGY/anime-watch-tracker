
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SmartRecommendationCardProps {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
      };
    };
    score: number;
    episodes: number;
    year: number;
    genres: Array<{ name: string }>;
    synopsis: string;
    matchPercentage?: number;
  };
  onAddToList: (anime: any) => void;
}

export function SmartRecommendationCard({ anime, onAddToList }: SmartRecommendationCardProps) {
  const [showSynopsis, setShowSynopsis] = useState(false);
  const { toast } = useToast();

  const handleAddToList = () => {
    const animeData = {
      anime_id: anime.mal_id.toString(),
      title: anime.title,
      image: anime.images.jpg.image_url,
      episodes: anime.episodes,
      year: anime.year,
      status: 'plan_to_watch',
      rating: null,
      notes: null,
    };
    
    onAddToList(animeData);
    toast({
      title: "Adicionado à Lista!",
      description: `${anime.title} foi adicionado à sua lista "Quero Assistir".`,
    });
  };

  const truncatedSynopsis = anime.synopsis?.length > 100 
    ? anime.synopsis.substring(0, 100) + "..."
    : anime.synopsis;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <img 
          src={anime.images.jpg.image_url} 
          alt={anime.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        
        {/* Match Percentage */}
        {anime.matchPercentage && (
          <div className="absolute top-2 left-2 bg-green-500/90 px-2 py-1 rounded-md">
            <span className="text-white text-xs font-bold">
              {anime.matchPercentage}% Match
            </span>
          </div>
        )}
        
        {/* Score */}
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-white text-xs font-medium">
            {anime.score.toFixed(1)}
          </span>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
            {anime.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-white/80">
            <span>{anime.episodes} eps</span>
            {anime.year && (
              <>
                <span>•</span>
                <span>{anime.year}</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-3">
        {/* Genres */}
        <div className="flex flex-wrap gap-1 mb-3">
          {anime.genres.slice(0, 3).map((genre, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {genre.name}
            </Badge>
          ))}
        </div>
        
        {/* Synopsis */}
        {anime.synopsis && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {showSynopsis ? anime.synopsis : truncatedSynopsis}
            </p>
            {anime.synopsis.length > 100 && (
              <button 
                onClick={() => setShowSynopsis(!showSynopsis)}
                className="text-xs text-primary hover:underline mt-1"
              >
                {showSynopsis ? "Ver menos" : "Ver mais"}
              </button>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={handleAddToList}
          >
            <Plus className="w-3 h-3 mr-1" />
            Adicionar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setShowSynopsis(!showSynopsis)}
          >
            <Info className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
