
import { useQuery } from '@tanstack/react-query';
import { useAnimeLists } from '@/hooks/use-anime-lists';
import { useAuth } from '@/contexts/AuthContext';
import { AvatarOption } from '@/types/avatar';
import { supabase } from '@/integrations/supabase/client';

{/* Mapeamento expandido de avatares para animes */}
const AVATAR_ANIME_MAPPING: Record<string, { animeId: string; animeTitle: string }> = {
  'naruto.png': { animeId: '20', animeTitle: 'Naruto' },
  'sasuke.png': { animeId: '20', animeTitle: 'Naruto' },
  'goku.png': { animeId: '223', animeTitle: 'Dragon Ball Z' },
  'vegeta.png': { animeId: '223', animeTitle: 'Dragon Ball Z' },
  'luffy.png': { animeId: '21', animeTitle: 'One Piece' },
  'zoro.png': { animeId: '21', animeTitle: 'One Piece' },
  'ichigo.png': { animeId: '269', animeTitle: 'Bleach' },
  'rukia.png': { animeId: '269', animeTitle: 'Bleach' },
  'natsu.png': { animeId: '6702', animeTitle: 'Fairy Tail' },
  'erza.png': { animeId: '6702', animeTitle: 'Fairy Tail' },
  'edward.png': { animeId: '121', animeTitle: 'Fullmetal Alchemist' },
  'alphonse.png': { animeId: '121', animeTitle: 'Fullmetal Alchemist' },
};

export const useAvatarUnlocks = (availableAvatars: AvatarOption[] = []) => {
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

        {/* Para avatares premium, verificar se o usuário assistiu o anime correspondente */}
        if (avatar.animeId && completedAnimes) {
          const hasWatchedAnime = completedAnimes.some(
            anime => anime.anime_id === avatar.animeId
          );
          return { ...avatar, isUnlocked: hasWatchedAnime };
        }

        {/* Se não tem animeId associado, liberar para usuários premium */}
        return { ...avatar, isUnlocked: true };
      });
    },
    enabled: true,
  });
};

{/* Hook específico para buscar avatares premium e calcular progresso */}
export const usePremiumAvatarProgress = () => {
  const { user } = useAuth();
  const { data: completedAnimes } = useAnimeLists('completed');
  const isPremium = user?.user_metadata?.is_premium;

  return useQuery({
    queryKey: ['premium-avatar-progress', completedAnimes?.length, isPremium],
    queryFn: async () => {
      if (!isPremium) return [];

      try {
        {/* Busca avatares premium do S3 */}
        const { data: premiumFiles, error } = await supabase.storage
          .from('avatar-icons')
          .list('icons_premium');

        if (error) throw error;

        const avatarProgress = premiumFiles?.map(file => {
          const animeMapping = AVATAR_ANIME_MAPPING[file.name];
          const { data: { publicUrl } } = supabase.storage
            .from('avatar-icons')
            .getPublicUrl(`icons_premium/${file.name}`);

          if (!animeMapping) {
            return {
              avatarName: file.name,
              avatarUrl: publicUrl,
              animeId: null,
              animeTitle: 'Anime não mapeado',
              isUnlocked: false,
              hasWatched: false
            };
          }

          const hasWatched = completedAnimes?.some(
            anime => anime.anime_id === animeMapping.animeId
          ) || false;

          return {
            avatarName: file.name,
            avatarUrl: publicUrl,
            animeId: animeMapping.animeId,
            animeTitle: animeMapping.animeTitle,
            isUnlocked: hasWatched,
            hasWatched
          };
        }) || [];

        return avatarProgress;
      } catch (error) {
        console.error('Erro ao buscar progresso de avatares premium:', error);
        return [];
      }
    },
    enabled: isPremium
  });
};
