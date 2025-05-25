import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Crown, Medal, Star, Trophy, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnimeLists, Anime } from "@/hooks/use-anime-lists";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AvatarSelector } from "@/components/profile/AvatarSelector";
import { AchievementsSection } from "@/components/profile/AchievementsSection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AVATAR_ANIME_MAPPING } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProfileData {
  username: string | null;
  avatar_url: string | null;
  is_premium: boolean | null;
}

const ProfilePage = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [showAchievementsDialog, setShowAchievementsDialog] = useState(false);
  
  // Novo estado para armazenar avatares premium com URLs públicas
  const [premiumAvatarsWithUrls, setPremiumAvatarsWithUrls] = useState<Array<{ filename: string; url: string }>>([]);
  const [loadingAvatars, setLoadingAvatars] = useState(true); // Estado de loading para os avatares
  
  const { data: watchedAnimes, isLoading: loadingWatched } = useAnimeLists('completed');
  const { data: watchingAnimes, isLoading: loadingWatching } = useAnimeLists('watching');
  const { data: planToWatchAnimes, isLoading: loadingPlanToWatch } = useAnimeLists('plan_to_watch');
  
  const completedAnimeIdsSet = useMemo(() => {
    if (!watchedAnimes) return new Set<string>();
    return new Set(watchedAnimes.map(anime => anime.anime_id));
  }, [watchedAnimes]);
  
  useEffect(() => {
    if (user) {
      // Fetch user profile
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('username, avatar_url, is_premium')
            .eq('id', user.id)
            .single<ProfileData>();
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setUsername(data.username);
            setAvatar(data.avatar_url);
            setIsPremium(data.is_premium || false);
          } else {
            setUsername(null);
            setAvatar(null);
            setIsPremium(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };
      
      // Nova função para buscar avatares premium do Storage
      const fetchPremiumAvatars = async () => {
        setLoadingAvatars(true);
        try {
          const { data, error } = await supabase.storage
            .from('avatar-icons') // Substitua 'avatar-icons' pelo nome do seu bucket, se for diferente
            .list('icons_premium');

          if (error) throw error;

          const avatarsWithUrls = data.map((file) => {
            const { data: { publicUrl } } = supabase.storage
              .from('avatar-icons') // Substitua 'avatar-icons' pelo nome do seu bucket, se for diferente
              .getPublicUrl(`icons_premium/${file.name}`);
            return { filename: file.name, url: publicUrl };
          });
          setPremiumAvatarsWithUrls(avatarsWithUrls);
        } catch (error) {
          console.error('Error fetching premium avatars:', error);
          toast({
            variant: "destructive",
            description: "Erro ao carregar avatares premium.",
          });
        } finally {
          setLoadingAvatars(false);
        }
      };

      fetchUserProfile();
      fetchPremiumAvatars(); // Chame a nova função de busca de avatares
    }
  }, [user, isPremium, watchedAnimes]);
  
  const isLoading = loadingWatched || loadingWatching || loadingPlanToWatch;
  
  // Calculate statistics
  const allAnimes = [...(watchedAnimes || []), ...(watchingAnimes || []), ...(planToWatchAnimes || [])];
  const totalWatched = watchedAnimes ? watchedAnimes.length : 0;
  const totalHours = watchedAnimes 
    ? watchedAnimes.reduce((acc, anime) => acc + ((anime.episodes || 0) * 0.4), 0).toFixed(1) 
    : "0.0";
  
  const averageRating = watchedAnimes && watchedAnimes.length > 0 
    ? (watchedAnimes.reduce((acc, anime) => acc + (anime.rating || 0), 0) / totalWatched).toFixed(1) 
    : "0.0";
  
  // Calculate otaku level based on watched anime count
  const getOtakuLevel = () => {
    if (totalWatched >= 25) return 5;
    if (totalWatched >= 15) return 4;
    if (totalWatched >= 10) return 3;
    if (totalWatched >= 5) return 2;
    if (totalWatched >= 1) return 1;
    return 0;
  };
  
  const otakuLevel = getOtakuLevel();
  
  const handleUpgradeToPremium = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Usuário não autenticado.",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('id', user.id);

      if (error) throw error;

      // Se a atualização no DB for bem-sucedida:
      setIsPremium(true); // Atualiza o estado local
      toast({
        title: "Parabéns!",
        description: "Você foi atualizado para o plano Premium.",
      });
    } catch (error: any) {
      console.error('Erro ao atualizar para premium:', error);
      toast({
        variant: "destructive",
        description: `Erro ao atualizar para premium: ${error.message || 'Erro desconhecido'}`,
      });
    }
  };

  const handleAvatarChange = (url: string) => {
    setAvatar(url);
  };
  
  // Filtra avatares premium com animeId para as conquistas
  const animeLinkedPremiumAvatars = useMemo(() => {
    // Usamos o estado premiumAvatarsWithUrls que agora contém as URLs corretas
    return premiumAvatarsWithUrls
      .map(avatarFile => {
        const mapping = AVATAR_ANIME_MAPPING[avatarFile.filename];
        // Filtra apenas avatares que estão no mapeamento E têm um animeId associado
        if (mapping && mapping.animeId) {
          return {
            filename: avatarFile.filename,
            url: avatarFile.url, // Usa a URL obtida do Storage
            animeId: mapping.animeId,
            animeTitle: mapping.animeTitle,
            // Lógica de desbloqueio: Premium E assistiu o anime
            isUnlocked: isPremium && completedAnimeIdsSet.has(mapping.animeId),
          };
        }
        return null; // Ignora avatares no Storage que não estão mapeados ou não têm animeId
      })
      .filter(avatar => avatar !== null); // Remove os itens nulos
  }, [premiumAvatarsWithUrls, isPremium, completedAnimeIdsSet]); // Adiciona premiumAvatarsWithUrls às dependências

  // Calcula o progresso
  const totalAnimeLinkedAvatars = animeLinkedPremiumAvatars.length;
  const unlockedAnimeLinkedAvatars = animeLinkedPremiumAvatars.filter(avatar => avatar.isUnlocked).length;
  const avatarProgressPercentage = totalAnimeLinkedAvatars > 0 ? (unlockedAnimeLinkedAvatars / totalAnimeLinkedAvatars) * 100 : 0;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="ml-2">Carregando seu perfil...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-80 flex-shrink-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatar || "https://i.imgur.com/7LdpJKQ.png"} alt="Foto de perfil" />
                  <AvatarFallback>{username?.substring(0, 2) || "OU"}</AvatarFallback>
                </Avatar>
                <AvatarSelector 
                  currentAvatar={avatar} 
                  onAvatarChange={handleAvatarChange}
                  isPremium={isPremium}
                  completedAnimeIds={completedAnimeIdsSet}
                />
              </div>
              <h2 className="mt-4 text-xl font-bold">{username || "Otaku User"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email || "otaku@example.com"}</p>
              
              <div className="flex items-center mt-2 gap-2">
                <Badge variant="outline" className="flex items-center gap-1 border-anime-purple">
                  <Medal className="h-3 w-3 text-anime-purple" />
                  <span>Nível {otakuLevel}</span>
                </Badge>
                
                {isPremium && (
                  <Badge className="flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white">
                    <Crown className="h-3 w-3" />
                    <span>Premium</span>
                  </Badge>
                )}
              </div>
              
              {!isPremium && (
                <div className="mt-6 w-full">
                  <Button 
                    onClick={handleUpgradeToPremium}
                    className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Virar Premium
                  </Button>
                  <p className="text-xs text-center mt-2 text-muted-foreground">
                    Remova anúncios e desbloqueie recursos exclusivos
                  </p>
                </div>
              )}
              
              <div className="w-full mt-6 space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowAchievementsDialog(true)}
                >
                  <Trophy size={16} className="mr-2" />
                  Conquistas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
              <CardDescription>Sua jornada de animes em números</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Assistidos</span>
                  <div className="flex items-center gap-2">
                    <BookOpen className="text-anime-purple h-5 w-5" />
                    <span className="text-2xl font-bold">{totalWatched}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Horas Assistidas</span>
                  <div className="flex items-center gap-2">
                    <Clock className="text-anime-blue h-5 w-5" />
                    <span className="text-2xl font-bold">{totalHours}</span>
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Nota Média</span>
                  <div className="flex items-center gap-2">
                    <Star className="text-yellow-500 h-5 w-5" />
                    <span className="text-2xl font-bold">{averageRating}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="conquistas">
            <TabsList>
              <TabsTrigger value="conquistas">Conquistas</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              {isPremium && (
                <TabsTrigger value="premium">Recursos Premium</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="conquistas" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sistema de Conquistas</CardTitle>
                  <CardDescription>Desbloqueie medalhas conforme sua jornada no mundo dos animes</CardDescription>
                </CardHeader>
                <CardContent>
                  <AchievementsSection />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Atividades</CardTitle>
                  <CardDescription>Suas ações recentes no AnimeList</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {watchedAnimes && watchedAnimes.length > 0 ? (
                      watchedAnimes.slice(0, 5).map((anime, index) => (
                        <div key={anime.id} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <img src={anime.image || '/placeholder.svg'} alt={anime.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{anime.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {index === 0 ? 'Adicionado à lista de assistidos' : 
                               index === 1 ? `Avaliado com ${anime.rating || 0} estrelas` :
                               'Adicionado à lista de assistidos'}
                            </p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {index === 0 ? 'Hoje' : 
                             index === 1 ? 'Ontem' : 
                             `${index + 1} dias atrás`}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-muted-foreground">
                        <p>Nenhuma atividade recente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {isPremium && (
              <TabsContent value="premium" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recursos Premium</CardTitle>
                    <CardDescription>Desfrute de todos os benefícios exclusivos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="border border-anime-purple/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-anime-purple/20 text-anime-purple">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Exportar Listas</h4>
                              <p className="text-xs text-muted-foreground">Exporte suas listas para CSV ou JSON</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-anime-purple/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-anime-purple/20 text-anime-purple">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 9H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20 15H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 6H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 18H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <rect x="14" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <rect x="14" y="15" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Temas Customizáveis</h4>
                              <p className="text-xs text-muted-foreground">Mude as cores e o visual do app</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-anime-purple/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-anime-purple/20 text-anime-purple">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 21L12 16L5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Sem Anúncios</h4>
                              <p className="text-xs text-muted-foreground">Experiência livre de propaganda</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="border border-anime-purple/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-anime-purple/20 text-anime-purple">
                              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M9 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M15 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-medium">Backup na Nuvem</h4>
                              <p className="text-xs text-muted-foreground">Sincronize entre dispositivos</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
      <Dialog open={showAchievementsDialog} onOpenChange={setShowAchievementsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Conquistas de Avatar Premium</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px] py-4">
             {loadingAvatars ? (
                <div className="flex items-center justify-center h-32">
                   <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                   <p className="ml-2 text-muted-foreground">Carregando avatares...</p>
                </div>
             ) : (
            <div className="px-4 space-y-6">
              <div className="text-center space-y-2">
                <h4 className="text-lg font-bold">Progresso dos Avatares Desbloqueáveis</h4>
                <p className="text-sm text-muted-foreground">
                  Assista animes associados e seja Premium para desbloquear estes avatares exclusivos!
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="text-xl font-bold text-anime-purple">{unlockedAnimeLinkedAvatars}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground text-xl font-bold">{totalAnimeLinkedAvatars}</span>
                </div>
                <Progress value={avatarProgressPercentage} className="w-full mt-2" />
              </div>

              <div className="grid grid-cols-4 gap-4">
                {animeLinkedPremiumAvatars.map((avatar, index) => (
                  <div key={avatar.filename} className="flex flex-col items-center gap-1">
                    <div className={cn("relative rounded-full overflow-hidden",
                       avatar.isUnlocked ? "border-2 border-anime-purple" : "border-2 border-transparent opacity-50"
                    )}>
                       {/* TODO: Otimizar URL ou usar hook de avatar do storage se necessário */}
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={avatar.url} alt={avatar.animeTitle} />
                        <AvatarFallback>{avatar.animeTitle?.substring(0,2) || '??'}</AvatarFallback>
                      </Avatar>
                      {!avatar.isUnlocked && (
                         <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                           <Lock className="h-6 w-6 text-white" />
                         </div>
                      )}
                    </div>
                    <p className="text-xs text-center text-muted-foreground line-clamp-2">{avatar.animeTitle}</p>
                  </div>
                ))}
                 {totalAnimeLinkedAvatars === 0 && (
                    <p className="text-center text-muted-foreground col-span-4">Nenhum avatar premium vinculado a anime encontrado.</p>
                 )}
              </div>
            </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
