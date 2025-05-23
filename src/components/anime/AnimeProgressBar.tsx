
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Play } from "lucide-react";
import { useAnimeProgress, useUpdateProgress } from "@/hooks/use-anime-progress";
import { Anime } from "@/hooks/use-anime-lists";
import { useAuth } from "@/contexts/AuthContext";

interface AnimeProgressBarProps {
  anime: Anime;
}

export function AnimeProgressBar({ anime }: AnimeProgressBarProps) {
  const { user } = useAuth();
  const { data: progress } = useAnimeProgress(anime.id);
  const updateProgressMutation = useUpdateProgress();
  const [isUpdating, setIsUpdating] = useState(false);

  const currentEpisode = progress?.current_episode || 0;
  const totalEpisodes = anime.episodes || 1;
  const progressPercentage = (currentEpisode / totalEpisodes) * 100;
  const isCompleted = progress?.completed || false;
  const isPremium = user?.user_metadata?.is_premium;

  const handleWatchEpisode = async () => {
    if (isUpdating || currentEpisode >= totalEpisodes) return;
    
    setIsUpdating(true);
    try {
      await updateProgressMutation.mutateAsync({
        animeListId: anime.id,
        currentEpisode: currentEpisode + 1,
        totalEpisodes: totalEpisodes,
        animeId: anime.anime_id,
        animeTitle: anime.title,
        animeIcon: anime.image,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Episódio {currentEpisode} de {totalEpisodes}</span>
        {isCompleted && isPremium && (
          <div className="flex items-center gap-1 text-yellow-600">
            <Trophy size={12} />
            <span>Achievement</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        <Progress value={progressPercentage} className="h-2" />
        {isCompleted && isPremium && (
          <Trophy 
            size={16} 
            className="absolute -right-1 -top-1 text-yellow-500 fill-yellow-500" 
          />
        )}
      </div>
      
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWatchEpisode}
          disabled={isUpdating || isCompleted}
          className="text-xs"
        >
          <Play size={12} className="mr-1" />
          {isCompleted ? 'Completo' : `Assistir Ep. ${currentEpisode + 1}`}
        </Button>
      </div>
    </div>
  );
}
