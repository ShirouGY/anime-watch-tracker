
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
  console.log('=== ANÁLISE DE GÊNEROS ===');
  console.log('Animes do usuário recebidos:', userAnimes?.length || 0);
  
  // Mesmo com poucos animes, tenta extrair gêneros
  if (!userAnimes || userAnimes.length === 0) {
    console.log('Usuário não tem animes, usando gêneros populares');
    return ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance'];
  }

  const genreCount: Record<string, number> = {};
  
  // Analisa cada anime do usuário
  userAnimes.forEach((anime, index) => {
    console.log(`Analisando anime ${index + 1}: ${anime.title}`);
    const simulatedGenres = getSimulatedGenres(anime.title);
    console.log(`Gêneros identificados para "${anime.title}":`, simulatedGenres);
    
    simulatedGenres.forEach(genre => {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    });
  });
  
  console.log('Contagem final de gêneros:', genreCount);
  
  // Pega os gêneros mais frequentes
  const topGenres = Object.entries(genreCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6) // Aumenta para 6 gêneros
    .map(([genre]) => genre);
    
  console.log('Top gêneros selecionados:', topGenres);
  
  // Garante pelo menos 3 gêneros mesmo com poucos animes
  const fallbackGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Romance'];
  while (topGenres.length < 3) {
    const nextGenre = fallbackGenres.find(genre => !topGenres.includes(genre));
    if (nextGenre) {
      topGenres.push(nextGenre);
    } else {
      break;
    }
  }
  
  console.log('Gêneros finais (com fallbacks):', topGenres);
  return topGenres;
}

function getSimulatedGenres(title: string): string[] {
  const lowerTitle = title.toLowerCase();
  const genres: string[] = [];
  
  // Análise mais abrangente de gêneros
  if (lowerTitle.includes('love') || lowerTitle.includes('heart') || lowerTitle.includes('romance') || lowerTitle.includes('koi')) {
    genres.push('Romance');
  }
  if (lowerTitle.includes('dragon') || lowerTitle.includes('battle') || lowerTitle.includes('fight') || lowerTitle.includes('war') || lowerTitle.includes('hero') || lowerTitle.includes('power')) {
    genres.push('Action');
  }
  if (lowerTitle.includes('school') || lowerTitle.includes('high') || lowerTitle.includes('student') || lowerTitle.includes('academy') || lowerTitle.includes('class')) {
    genres.push('School');
  }
  if (lowerTitle.includes('magic') || lowerTitle.includes('fantasy') || lowerTitle.includes('demon') || lowerTitle.includes('witch') || lowerTitle.includes('wizard')) {
    genres.push('Fantasy');
  }
  if (lowerTitle.includes('funny') || lowerTitle.includes('comedy') || lowerTitle.includes('gag') || lowerTitle.includes('laugh')) {
    genres.push('Comedy');
  }
  if (lowerTitle.includes('slice') || lowerTitle.includes('life') || lowerTitle.includes('daily') || lowerTitle.includes('everyday')) {
    genres.push('Slice of Life');
  }
  if (lowerTitle.includes('adventure') || lowerTitle.includes('journey') || lowerTitle.includes('quest') || lowerTitle.includes('travel')) {
    genres.push('Adventure');
  }
  if (lowerTitle.includes('mystery') || lowerTitle.includes('detective') || lowerTitle.includes('crime') || lowerTitle.includes('investigation')) {
    genres.push('Mystery');
  }
  if (lowerTitle.includes('sport') || lowerTitle.includes('game') || lowerTitle.includes('team') || lowerTitle.includes('match')) {
    genres.push('Sports');
  }
  if (lowerTitle.includes('mecha') || lowerTitle.includes('robot') || lowerTitle.includes('gundam') || lowerTitle.includes('machine')) {
    genres.push('Mecha');
  }
  if (lowerTitle.includes('supernatural') || lowerTitle.includes('ghost') || lowerTitle.includes('spirit') || lowerTitle.includes('vampire')) {
    genres.push('Supernatural');
  }
  if (lowerTitle.includes('drama') || lowerTitle.includes('emotion') || lowerTitle.includes('tear') || lowerTitle.includes('sad')) {
    genres.push('Drama');
  }
  
  // Se não encontrou gêneros específicos, adiciona baseado em padrões
  if (genres.length === 0) {
    // Tenta identificar por palavras-chave comuns em animes
    if (lowerTitle.includes('no') || lowerTitle.includes('wa') || lowerTitle.includes('ga')) {
      genres.push('Drama', 'Comedy'); // Animes japoneses típicos
    } else if (lowerTitle.includes('attack') || lowerTitle.includes('titan') || lowerTitle.includes('kill')) {
      genres.push('Action', 'Drama');
    } else {
      genres.push('Adventure', 'Comedy'); // Fallback padrão
    }
  }
  
  return genres;
}

export function useSmartRecommendations(isPremium: boolean) {
  const { data: userAnimes } = useAnimeLists();
  
  const query = useQuery({
    queryKey: ['smart-recommendations', userAnimes?.length, isPremium],
    queryFn: async () => {
      console.log('=== INICIANDO BUSCA DE RECOMENDAÇÕES ===');
      console.log('Premium:', isPremium);
      console.log('Total de animes do usuário:', userAnimes?.length || 0);
      
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
        
        console.log('=== BUSCANDO RECOMENDAÇÕES POR GÊNERO ===');
        recommendations = await fetchRecommendationsByGenre(userGenres);
        console.log('Recomendações encontradas por gênero:', recommendations.length);
        
        // Sempre busca animes populares para complementar
        console.log('=== COMPLEMENTANDO COM ANIMES POPULARES ===');
        const popularAnimes = await fetchPopularAnimes();
        console.log('Animes populares encontrados:', popularAnimes.length);
        
        // Combina recomendações por gênero com populares
        const allRecommendations = [...recommendations, ...popularAnimes];
        
        // Remove duplicatas
        recommendations = allRecommendations.reduce((acc, current) => {
          const exists = acc.find(item => item.mal_id === current.mal_id);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, [] as RecommendationAnime[]);
        
        console.log('Total após combinar e remover duplicatas:', recommendations.length);
        
        // Remove animes que o usuário já tem na lista
        if (userAnimes && userAnimes.length > 0) {
          const userAnimeIds = userAnimes.map(anime => anime.anime_id);
          const beforeFilter = recommendations.length;
          recommendations = recommendations.filter(rec => 
            !userAnimeIds.includes(rec.mal_id.toString())
          );
          console.log(`Filtrados ${beforeFilter - recommendations.length} animes já assistidos`);
          console.log('Recomendações finais:', recommendations.length);
        }
        
      } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
        // Em caso de erro, busca animes populares como fallback
        recommendations = await fetchPopularAnimes();
        console.log('Usando fallback - animes populares:', recommendations.length);
      }

      // Extrai gêneros das recomendações e trending
      const allGenres = new Set<string>();
      [...recommendations, ...trendingAnimes].forEach(anime => {
        anime.genres.forEach(genre => {
          allGenres.add(genre.name);
        });
      });

      console.log('=== RESULTADO FINAL ===');
      console.log('Recomendações personalizadas:', recommendations.length);
      console.log('Animes em alta:', trendingAnimes.length);
      console.log('Gêneros únicos encontrados:', Array.from(allGenres).length);

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
