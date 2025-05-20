
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

// Fetch anime lists for the current user
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

// Add a new anime to the list
export const useAddAnime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (newAnime: Omit<Anime, 'id' | 'created_at' | 'updated_at'>) => {
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
      queryClient.invalidateQueries({ queryKey: ['anime-lists'] });
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

// Update an anime in the list
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
      queryClient.invalidateQueries({ queryKey: ['anime-lists'] });
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

// Delete an anime from the list
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
      queryClient.invalidateQueries({ queryKey: ['anime-lists'] });
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

// Missing import for useAuth
import { useAuth } from '@/contexts/AuthContext';
