
import { useQuery } from '@tanstack/react-query';
import { useAnimeLists } from './use-anime-lists';

interface RecommendationAnime {
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
}

const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

// Mapeia gêneros em português para inglês para a API
const genreMap: Record<string, string> = {
  'Ação': 'Action',
  'Romance': 'Romance', 
  'Comédia': 'Comedy',
  'Fantasia': 'Fantasy',
  'Drama': 'Drama',
  'Sci-Fi': 'Sci-Fi',
  'Terror': 'Horror',
  'Thriller': 'Thriller',
  'Slice of Life': 'Slice of Life',
  'Aventura': 'Adventure'
};

async function fetchRecommendationsByGenre(genres: string[]): Promise<RecommendationAnime[]> {
  const recommendations: RecommendationAnime[] = [];
  
  // Para cada gênero, busca animes populares
  for (const genre of genres.slice(0, 3)) { // Limita a 3 gêneros para não sobrecarregar
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Rate limiting
      
      const response = await fetch(
        `${JIKAN_API_BASE}/anime?genres=${genre}&order_by=score&sort=desc&limit=8&min_score=7`
      );
      
      if (response.ok) {
        const data = await response.json();
        const animes = data.data?.map((anime: any) => ({
          mal_id: anime.mal_id,
          title: anime.title,
          images: anime.images,
          score: anime.score || 0,
          episodes: anime.episodes || 0,
          year: anime.year,
          genres: anime.genres || [],
          synopsis: anime.synopsis || '',
          matchPercentage: Math.floor(Math.random() * 30) + 70 // Simula % de match
        })) || [];
        
        recommendations.push(...animes);
      }
    } catch (error) {
      console.error(`Erro ao buscar recomendações para gênero ${genre}:`, error);
    }
  }
  
  // Remove duplicatas e limita a 20 recomendações
  const uniqueRecommendations = recommendations.reduce((acc, current) => {
    const exists = acc.find(item => item.mal_id === current.mal_id);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, [] as RecommendationAnime[]);
  
  return uniqueRecommendations.slice(0, 20);
}

async function fetchTrendingAnimes(): Promise<RecommendationAnime[]> {
  try {
    const response = await fetch(`${JIKAN_API_BASE}/top/anime?limit=20`);
    if (response.ok) {
      const data = await response.json();
      return data.data?.map((anime: any) => ({
        mal_id: anime.mal_id,
        title: anime.title,
        images: anime.images,
        score: anime.score || 0,
        episodes: anime.episodes || 0,
        year: anime.year,
        genres: anime.genres || [],
        synopsis: anime.synopsis || '',
        matchPercentage: Math.floor(Math.random() * 20) + 80
      })) || [];
    }
  } catch (error) {
    console.error('Erro ao buscar animes em alta:', error);
  }
  return [];
}

function extractUserGenres(userAnimes: any[]): string[] {
  const genreCount: Record<string, number> = {};
  
  // Conta os gêneros dos animes que o usuário assistiu/está assistindo
  userAnimes.forEach(anime => {
    // Simula gêneros baseados no título (em um app real, você teria esses dados)
    const simulatedGenres = getSimulatedGenres(anime.title);
    simulatedGenres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });
  
  // Retorna os gêneros mais populares do usuário
  return Object.entries(genreCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);
}

function getSimulatedGenres(title: string): string[] {
  // Simula gêneros baseados em palavras-chave no título
  const lowerTitle = title.toLowerCase();
  const genres: string[] = [];
  
  if (lowerTitle.includes('love') || lowerTitle.includes('heart')) genres.push('Romance');
  if (lowerTitle.includes('dragon') || lowerTitle.includes('battle') || lowerTitle.includes('fight')) genres.push('Action');
  if (lowerTitle.includes('school') || lowerTitle.includes('high')) genres.push('Slice of Life');
  if (lowerTitle.includes('magic') || lowerTitle.includes('fantasy')) genres.push('Fantasy');
  if (lowerTitle.includes('funny') || lowerTitle.includes('comedy')) genres.push('Comedy');
  
  // Se não encontrou nenhum gênero específico, adiciona alguns padrão
  if (genres.length === 0) {
    genres.push('Action', 'Adventure');
  }
  
  return genres;
}

export function useSmartRecommendations(isPremium: boolean) {
  const { data: userAnimes } = useAnimeLists();
  
  const query = useQuery({
    queryKey: ['smart-recommendations', userAnimes?.length, isPremium],
    queryFn: async () => {
      if (!isPremium) {
        return {
          recommendations: [],
          trendingAnimes: [],
          genres: []
        };
      }

      let recommendations: RecommendationAnime[] = [];
      const trendingAnimes = await fetchTrendingAnimes();
      let genres: string[] = [];

      if (!userAnimes || userAnimes.length === 0) {
        // Se usuário não tem animes, retorna recomendações populares gerais
        const response = await fetch(`${JIKAN_API_BASE}/anime?order_by=popularity&limit=15`);
        if (response.ok) {
          const data = await response.json();
          recommendations = data.data?.map((anime: any) => ({
            mal_id: anime.mal_id,
            title: anime.title,
            images: anime.images,
            score: anime.score || 0,
            episodes: anime.episodes || 0,
            year: anime.year,
            genres: anime.genres || [],
            synopsis: anime.synopsis || '',
            matchPercentage: Math.floor(Math.random() * 20) + 60
          })) || [];
        }
      } else {
        const userGenres = extractUserGenres(userAnimes);
        genres = userGenres;
        const mappedGenres = userGenres.map(genre => genreMap[genre] || genre);
        recommendations = await fetchRecommendationsByGenre(mappedGenres);
      }

      // Extrai todos os gêneros únicos das recomendações
      const allGenres = new Set<string>();
      recommendations.forEach(anime => {
        anime.genres.forEach(genre => {
          allGenres.add(genre.name);
        });
      });
      trendingAnimes.forEach(anime => {
        anime.genres.forEach(genre => {
          allGenres.add(genre.name);
        });
      });

      return {
        recommendations,
        trendingAnimes,
        genres: Array.from(allGenres)
      };
    },
    enabled: true,
    staleTime: 1000 * 60 * 30, // 30 minutos
    refetchOnWindowFocus: false,
  });

  return {
    recommendations: query.data?.recommendations || [],
    trendingAnimes: query.data?.trendingAnimes || [],
    isLoading: query.isLoading,
    error: query.error?.message,
    genres: query.data?.genres || []
  };
}
