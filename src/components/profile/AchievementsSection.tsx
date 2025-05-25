import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, Clock, BookOpen, Lock, Crown } from "lucide-react";
import { useUserAchievements } from "@/hooks/use-anime-progress";
import { useAnimeLists } from "@/hooks/use-anime-lists";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function AchievementsSection() {
  const { user } = useAuth();
  const { data: userAchievements } = useUserAchievements();
  const { data: watchedAnimes } = useAnimeLists('completed');
  const { data: watchingAnimes } = useAnimeLists('watching');
  const { data: planToWatchAnimes } = useAnimeLists('plan_to_watch');
  
  const totalWatched = watchedAnimes ? watchedAnimes.length : 0;
  const totalHours = watchedAnimes 
    ? watchedAnimes.reduce((acc, anime) => acc + ((anime.episodes || 0) * 0.4), 0) 
    : 0;
  const ratedAnimes = watchedAnimes 
    ? watchedAnimes.filter(anime => anime.rating).length 
    : 0;
  
  const isPremium = user?.user_metadata?.is_premium;

  // Buscar avatares premium para mostrar progresso
  const { data: premiumAvatars } = useQuery({
    queryKey: ['premium-avatars'],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('avatar-icons')
        .list('icons_premium');

      if (error) throw error;

      // Mapeamento simplificado - você pode expandir isso
      const AVATAR_ANIME_MAPPING: Record<string, { animeId: string; animeTitle: string }> = {
        'naruto.png': { animeId: '20', animeTitle: 'Naruto' },
        'sasuke.png': { animeId: '20', animeTitle: 'Naruto' },
        'goku.png': { animeId: '223', animeTitle: 'Dragon Ball Z' },
        'vegeta.png': { animeId: '223', animeTitle: 'Dragon Ball Z' },
        'luffy.png': { animeId: '21', animeTitle: 'One Piece' },
        'zoro.png': { animeId: '21', animeTitle: 'One Piece' },
      };

      return data?.map(file => ({
        name: file.name,
        ...AVATAR_ANIME_MAPPING[file.name]
      })).filter(avatar => avatar.animeId) || [];
    },
    enabled: isPremium
  });

  // Calcular avatares desbloqueados
  const unlockedAvatars = premiumAvatars?.filter(avatar => 
    watchedAnimes?.some(anime => anime.anime_id === avatar.animeId)
  ) || [];

  // Definir todas as conquistas possíveis
  const allAchievements = [
    {
      id: 'first_anime',
      name: "Primeiro Passo",
      description: "Assistiu seu primeiro anime",
      icon: Medal,
      category: "Progresso",
      requirement: 1,
      current: totalWatched,
      type: "watched_count",
      isPremium: false
    },
    {
      id: 'anime_novice',
      name: "Iniciante",
      description: "Assistiu pelo menos 3 animes",
      icon: Medal,
      category: "Progresso",
      requirement: 3,
      current: totalWatched,
      type: "watched_count",
      isPremium: false
    },
    {
      id: 'anime_junior',
      name: "Otaku Júnior",
      description: "Assistiu pelo menos 10 animes",
      icon: Medal,
      category: "Progresso",
      requirement: 10,
      current: totalWatched,
      type: "watched_count",
      isPremium: false
    },
    {
      id: 'anime_senior',
      name: "Otaku Sênior",
      description: "Assistiu pelo menos 25 animes",
      icon: Trophy,
      category: "Progresso",
      requirement: 25,
      current: totalWatched,
      type: "watched_count",
      isPremium: false
    },
    {
      id: 'anime_master',
      name: "Mestre Otaku",
      description: "Assistiu pelo menos 50 animes",
      icon: Trophy,
      category: "Progresso",
      requirement: 50,
      current: totalWatched,
      type: "watched_count",
      isPremium: true
    },
    {
      id: 'critic_beginner',
      name: "Crítico Iniciante",
      description: "Avaliou pelo menos 5 animes",
      icon: Star,
      category: "Avaliações",
      requirement: 5,
      current: ratedAnimes,
      type: "ratings_count",
      isPremium: false
    },
    {
      id: 'critic_master',
      name: "Crítico Mestre",
      description: "Avaliou pelo menos 15 animes",
      icon: Star,
      category: "Avaliações",
      requirement: 15,
      current: ratedAnimes,
      type: "ratings_count",
      isPremium: false
    },
    {
      id: 'time_watcher',
      name: "Observador do Tempo",
      description: "Assistiu pelo menos 24 horas de anime",
      icon: Clock,
      category: "Tempo",
      requirement: 24,
      current: totalHours,
      type: "hours_watched",
      isPremium: false
    },
    {
      id: 'marathoner',
      name: "Maratonista",
      description: "Assistiu pelo menos 50 horas de anime",
      icon: Clock,
      category: "Tempo",
      requirement: 50,
      current: totalHours,
      type: "hours_watched",
      isPremium: false
    },
    {
      id: 'time_master',
      name: "Mestre do Tempo",
      description: "Assistiu pelo menos 100 horas de anime",
      icon: Clock,
      category: "Tempo",
      requirement: 100,
      current: totalHours,
      type: "hours_watched",
      isPremium: true
    },
    {
      id: 'collector',
      name: "Colecionador",
      description: "Tem pelo menos 20 animes em todas as listas",
      icon: BookOpen,
      category: "Coleção",
      requirement: 20,
      current: (watchedAnimes?.length || 0) + (watchingAnimes?.length || 0) + (planToWatchAnimes?.length || 0),
      type: "total_collection",
      isPremium: true
    }
  ];

  // Adicionar conquista de avatares se o usuário for premium
  if (isPremium && premiumAvatars) {
    allAchievements.push({
      id: 'avatar_collector',
      name: "Colecionador de Avatares",
      description: "Desbloqueie avatares premium assistindo animes",
      icon: Crown,
      category: "Avatares",
      requirement: premiumAvatars.length,
      current: unlockedAvatars.length,
      type: "avatar_unlocks",
      isPremium: true
    });
  }
  
  // Verificar quais conquistas o usuário já desbloqueou
  const unlockedAchievementIds = userAchievements?.map(a => a.achievement_type) || [];
  
  const achievementsWithStatus = allAchievements.map(achievement => {
    const isAchieved = achievement.current >= achievement.requirement;
    const isUnlocked = unlockedAchievementIds.includes(achievement.id) || 
                     (achievement.type === 'watched_count' && isAchieved) ||
                     (achievement.type === 'ratings_count' && isAchieved) ||
                     (achievement.type === 'hours_watched' && isAchieved) ||
                     (achievement.type === 'total_collection' && isAchieved) ||
                     (achievement.type === 'avatar_unlocks' && isAchieved);
    
    const progress = Math.min((achievement.current / achievement.requirement) * 100, 100);
    
    return {
      ...achievement,
      isAchieved,
      isUnlocked,
      progress,
      canUnlock: !achievement.isPremium || isPremium
    };
  });
  
  const categories = [...new Set(achievementsWithStatus.map(a => a.category))];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Suas Conquistas</h3>
          <p className="text-sm text-muted-foreground">
            {achievementsWithStatus.filter(a => a.isUnlocked).length} de {achievementsWithStatus.length} conquistadas
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Trophy className="h-3 w-3" />
          {achievementsWithStatus.filter(a => a.isUnlocked).length}
        </Badge>
      </div>

      {/* Seção especial para avatares premium */}
      {isPremium && premiumAvatars && premiumAvatars.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-anime-purple">Progresso de Avatares Premium</h4>
          <Card className="border-anime-purple/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Avatares Desbloqueados</span>
                <span className="text-sm text-muted-foreground">
                  {unlockedAvatars.length} / {premiumAvatars.length}
                </span>
              </div>
              <Progress 
                value={(unlockedAvatars.length / premiumAvatars.length) * 100} 
                className="h-2 mb-3" 
              />
              <div className="space-y-1">
                {premiumAvatars.map((avatar, index) => {
                  const isUnlocked = unlockedAvatars.some(ua => ua.animeId === avatar.animeId);
                  return (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className={isUnlocked ? "text-green-600" : "text-muted-foreground"}>
                        {avatar.animeTitle}
                      </span>
                      {isUnlocked ? (
                        <Crown className="h-3 w-3 text-anime-purple" />
                      ) : (
                        <Lock className="h-3 w-3 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h4 className="font-medium text-anime-purple">{category}</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {achievementsWithStatus
              .filter(achievement => achievement.category === category)
              .map((achievement) => (
                <Card 
                  key={achievement.id} 
                  className={`border transition-all ${
                    achievement.isUnlocked 
                      ? 'border-anime-purple/50 shadow-md bg-anime-purple/5' 
                      : achievement.canUnlock 
                        ? 'border-border hover:border-anime-purple/30' 
                        : 'border-border opacity-60'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full flex-shrink-0 ${
                        achievement.isUnlocked 
                          ? 'bg-anime-purple/20 text-anime-purple' 
                          : achievement.canUnlock 
                            ? 'bg-secondary text-muted-foreground' 
                            : 'bg-secondary/50 text-muted-foreground/50'
                      }`}>
                        {achievement.canUnlock ? (
                          <achievement.icon className="h-4 w-4" />
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm truncate">{achievement.name}</h5>
                          {achievement.isUnlocked && (
                            <Trophy className="h-3 w-3 text-anime-purple flex-shrink-0" />
                          )}
                          {achievement.isPremium && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{achievement.description}</p>
                        
                        {achievement.canUnlock && (
                          <div className="space-y-1">
                            <Progress value={achievement.progress} className="h-1.5" />
                            <p className="text-xs text-muted-foreground">
                              {achievement.isUnlocked ? 'Conquistado!' : 
                               `${Math.round(achievement.current)} / ${achievement.requirement}`}
                            </p>
                          </div>
                        )}
                        
                        {!achievement.canUnlock && (
                          <p className="text-xs text-muted-foreground">
                            Requer plano Premium
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
