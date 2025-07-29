import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Trophy, MessageSquare, ThumbsUp, Settings, Edit } from "lucide-react";
import Header from "@/components/Header";

interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  points: number;
  reputation_level: string;
  role: string;
  created_at: string;
}

interface UserStats {
  questionsCount: number;
  answersCount: number;
  totalLikes: number;
  bestAnswers: number;
}

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats>({ questionsCount: 0, answersCount: 0, totalLikes: 0, bestAnswers: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    username: '',
    bio: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditForm({
        display_name: data.display_name || '',
        username: data.username || '',
        bio: data.bio || '',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить профиль',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Get questions count
      const { count: questionsCount } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get answers count
      const { count: answersCount } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Get best answers count
      const { count: bestAnswers } = await supabase
        .from('answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_best_answer', true);

      // Get total likes on questions and answers
      const { data: questionIds } = await supabase
        .from('questions')
        .select('id')
        .eq('user_id', user.id);

      const { data: answerIds } = await supabase
        .from('answers')
        .select('id')
        .eq('user_id', user.id);

      let totalLikes = 0;

      if (questionIds && questionIds.length > 0) {
        const { count: questionLikes } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .in('question_id', questionIds.map(q => q.id))
          .eq('vote_type', 1);
        totalLikes += questionLikes || 0;
      }

      if (answerIds && answerIds.length > 0) {
        const { count: answerLikes } = await supabase
          .from('votes')
          .select('*', { count: 'exact', head: true })
          .in('answer_id', answerIds.map(a => a.id))
          .eq('vote_type', 1);
        totalLikes += answerLikes || 0;
      }

      setStats({
        questionsCount: questionsCount || 0,
        answersCount: answersCount || 0,
        totalLikes,
        bestAnswers: bestAnswers || 0,
      });
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name.trim() || null,
          username: editForm.username.trim() || null,
          bio: editForm.bio.trim() || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Успешно!',
        description: 'Профиль обновлен',
      });

      setEditing(false);
      fetchProfile(); // Refresh profile
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getReputationColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-500';
      case 'advanced': return 'bg-blue-500';
      case 'intermediate': return 'bg-green-500';
      case 'beginner': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getReputationLabel = (level: string) => {
    switch (level) {
      case 'expert': return 'Эксперт';
      case 'advanced': return 'Продвинутый';
      case 'intermediate': return 'Средний';
      case 'beginner': return 'Начинающий';
      default: return 'Новичок';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Профиль не найден</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              Вернуться на главную
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6 shadow-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-xl">
                  {(profile.display_name || profile.username || user?.email || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile.display_name || profile.username || 'Пользователь'}
                    </h1>
                    {profile.username && profile.display_name && (
                      <p className="text-muted-foreground">@{profile.username}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={`${getReputationColor(profile.reputation_level)} text-white`}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {getReputationLabel(profile.reputation_level)}
                      </Badge>
                      <Badge variant="secondary">
                        {profile.points} баллов
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {editing ? 'Отмена' : 'Редактировать'}
                  </Button>
                </div>

                {profile.bio && !editing && (
                  <p className="text-muted-foreground mt-4">{profile.bio}</p>
                )}

                {editing && (
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="display_name">Отображаемое имя</Label>
                        <Input
                          id="display_name"
                          value={editForm.display_name}
                          onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                          placeholder="Ваше имя"
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Имя пользователя</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder="username"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bio">О себе</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Расскажите о себе..."
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile}>
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={() => setEditing(false)}>
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.questionsCount}</div>
              <div className="text-sm text-muted-foreground">Вопросов</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.answersCount}</div>
              <div className="text-sm text-muted-foreground">Ответов</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <ThumbsUp className="w-8 h-8 text-accent-warm mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.totalLikes}</div>
              <div className="text-sm text-muted-foreground">Лайков</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-card border-border/50">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-accent-warm mx-auto mb-2" />
              <div className="text-2xl font-bold text-foreground">{stats.bestAnswers}</div>
              <div className="text-sm text-muted-foreground">Лучших ответов</div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Мои вопросы</TabsTrigger>
            <TabsTrigger value="answers">Мои ответы</TabsTrigger>
          </TabsList>
          
          <TabsContent value="questions">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Мои вопросы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Здесь будут отображаться ваши вопросы
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="answers">
            <Card className="shadow-card border-border/50">
              <CardHeader>
                <CardTitle>Мои ответы</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Здесь будут отображаться ваши ответы
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;