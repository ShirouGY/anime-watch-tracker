
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star, Clock, BookOpen, Lock, Crown, CheckCircle } from "lucide-react";
import { useUserAchievements } from "@/hooks/use-anime-progress";
import { useAnimeLists } from "@/hooks/use-anime-lists";
import { useAuth } from "@/contexts/AuthContext";
import { usePremiumAvatarProgress } from "@/hooks/use-avatar-unlocks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AchievementsSection() {
  const { user } = useAuth();
  const { data: userAchievements } = useUserAchievements();
  const { data: watchedAnimes } = useAnimeLists('completed');
  const { data: watchingAnimes } = useAnimeLists('watching');
  const { data: planToWatchAnimes } = useAnimeLists('plan_to_watch');
  const { data: premiumAvatarProgress } = usePremiumAvatarProgress();
  
  const totalWatched = watchedAnimes ? watchedAnimes.length : 0;
  const totalHours = watchedAnimes 
    ? watchedAnimes.reduce((acc, anime) => acc + ((anime.episodes || 0) * 0.4), 0) 
    : 0;
  const ratedAnimes = watchedAnimes 
    ? watchedAnimes.filter(anime => anime.rating).length 
    : 0;
  
  const isPremium = user?.user_metadata?.is_premium;

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
  
  // Verificar quais conquistas o usuário já desbloqueou
  const unlockedAchievementIds = userAchievements?.map(a => a.achievement_type) || [];
  
  const achievementsWithStatus = allAchievements.map(achievement => {
    const isAchieved = achievement.current >= achievement.requirement;
    const isUnlocked = unlockedAchievementIds.includes(achievement.id) || 
                     (achievement.type === 'watched_count' && isAchieved) ||
                     (achievement.type === 'ratings_count' && isAchieved) ||
                     (achievement.type === 'hours_watched' && isAchieved) ||
                     (achievement.type === 'total_collection' && isAchieved);
    
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
      {isPremium && premiumAvatarProgress && premiumAvatarProgress.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-anime-purple flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Progresso de Avatares Premium
          </h4>
          <Card className="border-anime-purple/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Desbloqueie avatares assistindo animes</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {premiumAvatarProgress.filter(a => a.isUnlocked).length} / {premiumAvatarProgress.length}
                </span>
              </div>
              <Progress 
                value={(premiumAvatarProgress.filter(a => a.isUnlocked).length / premiumAvatarProgress.length) * 100} 
                className="h-2" 
              />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-3 md:grid-cols-2">
                {premiumAvatarProgress.map((avatar, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    avatar.isUnlocked 
                      ? 'border-anime-purple/50 bg-anime-purple/5' 
                      : 'border-border bg-background hover:border-anime-purple/30'
                  }`}>
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={avatar.avatarUrl} alt={avatar.avatarName} />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      {avatar.isUnlocked && (
                        <div className="absolute -top-1 -right-1 bg-anime-purple rounded-full p-1">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      )}
                      {!avatar.isUnlocked && (
                        <div className="absolute -top-1 -right-1 bg-gray-500 rounded-full p-1">
                          <Lock className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {avatar.animeTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {avatar.isUnlocked ? (
                          <span className="text-anime-purple font-medium">✓ Desbloqueado</span>
                        ) : (
                          "Assista para desbloquear"
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {premiumAvatarProgress.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Crown className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum avatar premium encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {!isPremium && (
        <div className="space-y-3">
          <h4 className="font-medium text-anime-purple flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Avatares Premium
          </h4>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="p-4 text-center">
              <Crown className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <p className="text-sm font-medium mb-1">Desbloqueie Avatares Exclusivos</p>
              <p className="text-xs text-muted-foreground mb-3">
                Torne-se Premium para desbloquear avatares únicos assistindo seus animes favoritos
              </p>
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                Upgrade para Premium
              </Badge>
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
