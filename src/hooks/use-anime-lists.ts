
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export type AnimeStatus = 'watching' | 'completed' | 'plan_to_watch';

export interface Anime {
  id: string;
  anime_id: string;
  title: string;
  image: string | null;
  episodes: number | null;
  year: number | null;
  status: AnimeStatus;
  rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Busca listas de animes para o usuário atual
export const useAnimeLists = (status?: AnimeStatus) => {
  return useQuery({
    queryKey: ['anime-lists', status],
    queryFn: async () => {
      let query = supabase
        .from('anime_lists')
        .select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('updated_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      return data as Anime[];
    },
  });
};

// Adiciona um novo anime à lista
export const useAddAnime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (newAnime: Omit<Anime, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('User must be logged in');
      
      const { data, error } = await supabase
        .from('anime_lists')
        .insert({
          ...newAnime,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Invalida a cache das listas de anime
      queryClient.invalidateQueries({ queryKey: ['anime-lists'] });
      // Invalida a cache das recomendações para forçar atualização
      queryClient.invalidateQueries({ queryKey: ['smart-recommendations'] });
      
      toast({
        title: "Anime adicionado",
        description: `${data.title} foi adicionado à sua lista.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar anime",
        description: error.message || "Ocorreu um erro ao adicionar o anime.",
        variant: "destructive",
      });
    },
  });
};

// Atualiza um anime na lista
export const useUpdateAnime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (anime: Partial<Anime> & { id: string }) => {
      const { data, error } = await supabase
        .from('anime_lists')
        .update(anime)
        .eq('id', anime.id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Invalida a cache das listas de anime
      queryClient.invalidateQueries({ queryKey: ['anime-lists'] });
      // Invalida a cache das recomendações para forçar atualização
      queryClient.invalidateQueries({ queryKey: ['smart-recommendations'] });
      
      toast({
        title: "Anime atualizado",
        description: `${data.title} foi atualizado.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar anime",
        description: error.message || "Ocorreu um erro ao atualizar o anime.",
        variant: "destructive",
      });
    },
  });
};

// Remove um anime da lista
export const useDeleteAnime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (animeId: string) => {
      const { error } = await supabase
        .from('anime_lists')
        .delete()
        .eq('id', animeId);
      
      if (error) {
        throw error;
      }
      
      return animeId;
    },
    onSuccess: (_data, variables, context) => {
      // Invalida a cache das listas de anime
      queryClient.invalidateQueries({ queryKey: ['anime-lists'] });
      // Invalida a cache das recomendações para forçar atualização
      queryClient.invalidateQueries({ queryKey: ['smart-recommendations'] });
      
      toast({
        description: "Anime removido da sua lista.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover anime",
        description: error.message || "Ocorreu um erro ao remover o anime.",
        variant: "destructive",
      });
    },
  });
};
