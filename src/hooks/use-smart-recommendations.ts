
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

async function fetchRecommendationsByGenre(genres: string[]): Promise<RecommendationAnime[]> {
  console.log('Buscando recomendações para gêneros:', genres);
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
        
        console.log(`Encontrados ${animes.length} animes para gênero ${genre}`);
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
  
  console.log('Recomendações únicas encontradas:', uniqueRecommendations.length);
  return uniqueRecommendations.slice(0, 20);
}

async function fetchTrendingAnimes(): Promise<RecommendationAnime[]> {
  try {
    console.log('Buscando animes em alta...');
    const response = await fetch(`${JIKAN_API_BASE}/top/anime?limit=20`);
    if (response.ok) {
      const data = await response.json();
      const trending = data.data?.map((anime: any) => ({
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
      
      console.log('Animes em alta encontrados:', trending.length);
      return trending;
    }
  } catch (error) {
    console.error('Erro ao buscar animes em alta:', error);
  }
  return [];
}

async function fetchPopularAnimes(): Promise<RecommendationAnime[]> {
  try {
    console.log('Buscando animes populares como fallback...');
    const response = await fetch(`${JIKAN_API_BASE}/anime?order_by=popularity&limit=15&min_score=6`);
    if (response.ok) {
      const data = await response.json();
      const popular = data.data?.map((anime: any) => ({
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
      
      console.log('Animes populares encontrados:', popular.length);
      return popular;
    }
  } catch (error) {
    console.error('Erro ao buscar animes populares:', error);
  }
  return [];
}

function extractUserGenres(userAnimes: any[]): string[] {
  console.log('Analisando gêneros dos animes do usuário:', userAnimes.length);
  
  if (!userAnimes || userAnimes.length === 0) {
    console.log('Usuário não tem animes, retornando gêneros padrão');
    return ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy'];
  }

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
  const topGenres = Object.entries(genreCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([genre]) => genre);
    
  console.log('Gêneros identificados do usuário:', topGenres);
  
  // Se não encontrou gêneros suficientes, adiciona alguns padrão
  if (topGenres.length < 3) {
    topGenres.push('Action', 'Adventure', 'Comedy');
  }
  
  return topGenres;
}

function getSimulatedGenres(title: string): string[] {
  // Simula gêneros baseados em palavras-chave no título
  const lowerTitle = title.toLowerCase();
  const genres: string[] = [];
  
  if (lowerTitle.includes('love') || lowerTitle.includes('heart') || lowerTitle.includes('romance')) genres.push('Romance');
  if (lowerTitle.includes('dragon') || lowerTitle.includes('battle') || lowerTitle.includes('fight') || lowerTitle.includes('war')) genres.push('Action');
  if (lowerTitle.includes('school') || lowerTitle.includes('high') || lowerTitle.includes('student')) genres.push('School');
  if (lowerTitle.includes('magic') || lowerTitle.includes('fantasy') || lowerTitle.includes('demon') || lowerTitle.includes('witch')) genres.push('Fantasy');
  if (lowerTitle.includes('funny') || lowerTitle.includes('comedy') || lowerTitle.includes('gag')) genres.push('Comedy');
  if (lowerTitle.includes('slice') || lowerTitle.includes('life') || lowerTitle.includes('daily')) genres.push('Slice of Life');
  if (lowerTitle.includes('adventure') || lowerTitle.includes('journey') || lowerTitle.includes('quest')) genres.push('Adventure');
  if (lowerTitle.includes('mystery') || lowerTitle.includes('detective') || lowerTitle.includes('crime')) genres.push('Mystery');
  if (lowerTitle.includes('sport') || lowerTitle.includes('game') || lowerTitle.includes('team')) genres.push('Sports');
  if (lowerTitle.includes('mecha') || lowerTitle.includes('robot') || lowerTitle.includes('gundam')) genres.push('Mecha');
  
  // Se não encontrou nenhum gênero específico, adiciona alguns padrão baseado em padrões comuns
  if (genres.length === 0) {
    // Verifica se parece com anime shounen típico
    if (lowerTitle.includes('hero') || lowerTitle.includes('power') || lowerTitle.includes('strong')) {
      genres.push('Action', 'Adventure');
    }
    // Verifica se parece com anime escolar
    else if (lowerTitle.includes('academy') || lowerTitle.includes('class') || lowerTitle.includes('student')) {
      genres.push('School', 'Comedy');
    }
    // Padrão geral
    else {
      genres.push('Drama', 'Comedy');
    }
  }
  
  return genres;
}

export function useSmartRecommendations(isPremium: boolean) {
  const { data: userAnimes } = useAnimeLists();
  
  const query = useQuery({
    queryKey: ['smart-recommendations', userAnimes?.length, isPremium],
    queryFn: async () => {
      console.log('Iniciando busca de recomendações...', { isPremium, userAnimesCount: userAnimes?.length });
      
      if (!isPremium) {
        console.log('Usuário não é premium, retornando dados vazios');
        return {
          recommendations: [],
          trendingAnimes: [],
          genres: []
        };
      }

      let recommendations: RecommendationAnime[] = [];
      const trendingAnimes = await fetchTrendingAnimes();
      let genres: string[] = [];

      try {
        const userGenres = extractUserGenres(userAnimes || []);
        genres = userGenres;
        
        // Tenta buscar por gêneros do usuário
        recommendations = await fetchRecommendationsByGenre(userGenres);
        
        // Se não conseguiu recomendações suficientes, busca animes populares
        if (recommendations.length < 5) {
          console.log('Poucas recomendações encontradas, buscando animes populares...');
          const popularAnimes = await fetchPopularAnimes();
          recommendations = [...recommendations, ...popularAnimes];
          
          // Remove duplicatas
          recommendations = recommendations.reduce((acc, current) => {
            const exists = acc.find(item => item.mal_id === current.mal_id);
            if (!exists) {
              acc.push(current);
            }
            return acc;
          }, [] as RecommendationAnime[]);
        }
        
        // Remove animes que o usuário já tem na lista
        if (userAnimes && userAnimes.length > 0) {
          const userAnimeIds = userAnimes.map(anime => anime.anime_id);
          recommendations = recommendations.filter(rec => 
            !userAnimeIds.includes(rec.mal_id.toString())
          );
          console.log('Após filtrar animes já assistidos:', recommendations.length);
        }
        
      } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
        // Em caso de erro, busca animes populares como fallback
        recommendations = await fetchPopularAnimes();
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

      console.log('Resultado final:', {
        recommendations: recommendations.length,
        trending: trendingAnimes.length,
        genres: Array.from(allGenres).length
      });

      return {
        recommendations: recommendations.slice(0, 20),
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
