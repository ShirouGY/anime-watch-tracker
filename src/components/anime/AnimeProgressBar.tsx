
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";
import { useAnimeProgress } from "@/hooks/use-anime-progress";
import { Anime } from "@/hooks/use-anime-lists";
import { useAuth } from "@/contexts/AuthContext";

interface AnimeProgressBarProps {
  anime: Anime;
}

export function AnimeProgressBar({ anime }: AnimeProgressBarProps) {
  const { user } = useAuth();
  const { data: progress } = useAnimeProgress(anime.id);

  const currentEpisode = progress?.current_episode || 0;
  const totalEpisodes = anime.episodes || 1;
  const progressPercentage = (currentEpisode / totalEpisodes) * 100;
  const isCompleted = progress?.completed || false;
  const isPremium = user?.user_metadata?.is_premium;

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
    </div>
  );
}
