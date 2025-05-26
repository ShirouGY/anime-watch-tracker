
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { AnimeProgress, UserAchievement } from '@/types/database';

{/* Busca o progresso de um anime específico */}
export const useAnimeProgress = (animeListId: string) => {
  return useQuery({
    queryKey: ['anime-progress', animeListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('anime_progress')
        .select('*')
        .eq('anime_list_id', animeListId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }
      
      return data as AnimeProgress | null;
    },
  });
};

{/* Atualiza o progresso de um episódio */}
export const useUpdateProgress = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (params: {
      animeListId: string;
      currentEpisode: number;
      totalEpisodes: number;
      animeId: string;
      animeTitle: string;
      animeIcon?: string;
    }) => {
      if (!user) throw new Error('User must be logged in');
      
      const isCompleted = params.currentEpisode >= params.totalEpisodes;
      
      {/* Atualiza ou cria o progresso */}
      const { data: progressData, error: progressError } = await supabase
        .from('anime_progress')
        .upsert({
          user_id: user.id,
          anime_list_id: params.animeListId,
          current_episode: params.currentEpisode,
          total_episodes: params.totalEpisodes,
          completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (progressError) {
        throw progressError;
      }
      
      {/* Se o anime foi completado e o usuário é premium, cria uma conquista */}
      if (isCompleted && user.user_metadata?.is_premium) {
        const { error: achievementError } = await supabase
          .from('user_achievements')
          .upsert({
            user_id: user.id,
            anime_id: params.animeId,
            anime_title: params.animeTitle,
            anime_icon: params.animeIcon,
            achievement_type: 'completion',
          });
        
        if (achievementError && !achievementError.message.includes('duplicate')) {
          console.error('Error creating achievement:', achievementError);
        }
      }
      
      return progressData;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['anime-progress'] });
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      
      if (data.completed && user?.user_metadata?.is_premium) {
        toast({
          title: "Parabéns! 🎉",
          description: `Você completou ${variables.animeTitle} e ganhou um achievement!`,
        });
      } else if (data.completed) {
        toast({
          title: "Anime completado! 🎉",
          description: `Você completou ${variables.animeTitle}!`,
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar progresso",
        description: error.message || "Ocorreu um erro ao atualizar o progresso.",
        variant: "destructive",
      });
    },
  });
};

{/* Busca as conquistas do usuário */}
export const useUserAchievements = () => {
  return useQuery({
    queryKey: ['user-achievements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .order('unlocked_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as UserAchievement[];
    },
  });
};
