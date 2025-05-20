
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Crown, Medal, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { sampleAnimesWatched } from "@/data/sampleData";

const ProfilePage = () => {
  const [isPremium, setIsPremium] = useState(false);
  const { toast } = useToast();
  
  const totalWatched = sampleAnimesWatched.length;
  const totalHours = sampleAnimesWatched.reduce((acc, anime) => acc + anime.episodes * 0.4, 0).toFixed(1);
  const averageRating = (sampleAnimesWatched.reduce((acc, anime) => acc + anime.rating, 0) / totalWatched).toFixed(1);
  
  const medals = [
    {
      id: 1,
      name: "Iniciante",
      description: "Assistiu pelo menos 3 animes",
      icon: Medal,
      achieved: totalWatched >= 3,
      progress: totalWatched >= 3 ? 100 : (totalWatched / 3) * 100
    },
    {
      id: 2,
      name: "Otaku Júnior",
      description: "Assistiu pelo menos 10 animes",
      icon: Medal,
      achieved: totalWatched >= 10,
      progress: totalWatched >= 10 ? 100 : (totalWatched / 10) * 100
    },
    {
      id: 3,
      name: "Otaku Sênior",
      description: "Assistiu pelo menos 25 animes",
      icon: Medal,
      achieved: totalWatched >= 25,
      progress: totalWatched >= 25 ? 100 : (totalWatched / 25) * 100
    },
    {
      id: 4,
      name: "Crítico Mestre",
      description: "Avaliou pelo menos 15 animes",
      icon: Star,
      achieved: false,
      progress: 60
    },
    {
      id: 5,
      name: "Maratonista",
      description: "Assistiu pelo menos 50 horas de anime",
      icon: Clock,
      achieved: parseFloat(totalHours) >= 50,
      progress: Math.min((parseFloat(totalHours) / 50) * 100, 100)
    },
  ];
  
  const handleUpgradeToPremium = () => {
    setIsPremium(true);
    toast({
      title: "Parabéns!",
      description: "Você foi atualizado para o plano Premium.",
    });
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Card className="w-full md:w-80 flex-shrink-0">
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="https://i.pravatar.cc/300" alt="Foto de perfil" />
                <AvatarFallback>OU</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">Otaku User</h2>
              <p className="text-sm text-muted-foreground">otaku@example.com</p>
              
              <div className="flex items-center mt-2 gap-2">
                <Badge variant="outline" className="flex items-center gap-1 border-anime-purple">
                  <Medal className="h-3 w-3 text-anime-purple" />
                  <span>Nível 3</span>
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
                <Button variant="outline" className="w-full justify-start">
                  Editar Perfil
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Configurações
                </Button>
                {isPremium && (
                  <Button variant="outline" className="w-full justify-start">
                    Gerenciar Assinatura
                  </Button>
                )}
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
          
          <Tabs defaultValue="medals">
            <TabsList>
              <TabsTrigger value="medals">Medalhas</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              {isPremium && (
                <TabsTrigger value="premium">Recursos Premium</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="medals" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Suas Conquistas</CardTitle>
                  <CardDescription>Medalhas que você desbloqueou ou está progredindo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {medals.map((medal) => (
                      <Card key={medal.id} className={`border ${medal.achieved ? 'border-anime-purple/50 shadow-md' : 'border-border'}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-full ${medal.achieved ? 'bg-anime-purple/20 text-anime-purple' : 'bg-secondary text-muted-foreground'}`}>
                              <medal.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{medal.name}</h4>
                              <p className="text-xs text-muted-foreground">{medal.description}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Progress value={medal.progress} className="h-1.5" />
                            <p className="text-xs text-muted-foreground text-right mt-1">
                              {medal.achieved ? 'Conquistado!' : `${Math.round(medal.progress)}% completo`}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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
                    {sampleAnimesWatched.slice(0, 5).map((anime, index) => (
                      <div key={anime.id} className="flex items-center gap-3 pb-3 border-b border-border last:border-0">
                        <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{anime.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {index === 0 ? 'Adicionado à lista de assistidos' : 
                             index === 1 ? 'Avaliado com ' + anime.rating + ' estrelas' :
                             'Adicionado à lista de assistidos'}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {index === 0 ? 'Hoje' : 
                           index === 1 ? 'Ontem' : 
                           `${index + 1} dias atrás`}
                        </div>
                      </div>
                    ))}
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
    </div>
  );
};

export default ProfilePage;
