
import { useQuery } from '@tanstack/react-query';

// Jikan API is a free API for MyAnimeList
const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

export interface AnimeSearchResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    },
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    }
  };
  episodes: number;
  year: number;
  score: number;
  synopsis: string;
}

export async function searchAnimeByName(query: string): Promise<AnimeSearchResult[]> {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    {/* Adiciona um pequeno delay para evitar a limitação de taxa */}
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const response = await fetch(`${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&limit=10`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching anime:", error);
    throw error;
  }
}

{/* Hook para buscar animes por nome */}
export function useAnimeSearch(query: string) {
  return useQuery({
    queryKey: ['anime-search', query],
    queryFn: () => searchAnimeByName(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

{/* Função para obter a URL da imagem do anime */}
export function getAnimeImageUrl(anime: AnimeSearchResult): string {
  return anime.images.jpg.image_url || anime.images.webp.image_url || '';
}
