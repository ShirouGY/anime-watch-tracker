import { Anime } from "@/hooks/use-anime-lists";
import { AnimeCard } from "./AnimeCard";
import { EmptyState } from "./EmptyState";
import { Eye, List as ListIcon } from "lucide-react";

interface AnimeListTabProps {
  animes: Anime[] | undefined;
  isLoading: boolean;
  isWatched?: boolean;
  onRemoveAnime: (animeId: string) => void;
  onMoveToWatched?: (animeId: string) => void;
  onRateAnime?: (animeId: string) => void;
}

export function AnimeListTab({
  animes,
  isLoading,
  isWatched = false,
  onRemoveAnime,
  onMoveToWatched,
  onRateAnime
}: AnimeListTabProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Carregando sua lista...</p>
      </div>
    );
  }

  if (!animes || animes.length === 0) {
    return (
      <EmptyState
        icon={isWatched ? Eye : ListIcon}
        title={isWatched ? "Nenhum anime assistido" : "Sua lista está vazia"}
        description={
          isWatched 
            ? "Marque animes como assistidos para vê-los aqui" 
            : "Adicione animes que você deseja assistir"
        }
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {animes.map((anime) => (
        <AnimeCard
          key={anime.id}
          anime={anime}
          isWatched={isWatched}
          onRemove={onRemoveAnime}
          onMarkAsWatched={onMoveToWatched}
          onRate={onRateAnime}
        />
      ))}
    </div>
  );
}
