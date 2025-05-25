
import { useQuery } from '@tanstack/react-query';
import { useAnimeLists } from '@/hooks/use-anime-lists';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarOption } from '@/types/avatar';

export const useAvatarUnlocks = (availableAvatars: AvatarOption[]) => {
  const { user } = useAuth();
  const { data: completedAnimes } = useAnimeLists('completed');
  const isPremium = user?.user_metadata?.is_premium;

  return useQuery({
    queryKey: ['avatar-unlocks', availableAvatars.length, completedAnimes?.length, isPremium],
    queryFn: () => {
      if (!availableAvatars.length) return [];

      return availableAvatars.map(avatar => {
        if (!avatar.isPremium) {
          return { ...avatar, isUnlocked: true };
        }

        if (!isPremium) {
          return { ...avatar, isUnlocked: false };
        }

        // Para avatares premium, verificar se o usuário assistiu o anime correspondente
        if (avatar.animeId && completedAnimes) {
          const hasWatchedAnime = completedAnimes.some(
            anime => anime.anime_id === avatar.animeId
          );
          return { ...avatar, isUnlocked: hasWatchedAnime };
        }

        // Se não tem animeId associado, liberar para usuários premium
        return { ...avatar, isUnlocked: true };
      });
    },
    enabled: true,
  });
};
