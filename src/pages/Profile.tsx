import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";
import { 
  User, Edit, Save, X, Camera, Star, MessageCircle, Trophy, 
  Heart, Award, BookOpen, Calendar, Crown
} from "lucide-react";

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
  updated_at: string;
}

interface UserStats {
  questionsCount: number;
  answersCount: number;
  totalLikes: number;
  bestAnswers: number;
}

interface Question {
  id: string;
  title: string;
  content: string;
  category: string;
  points: number;
  created_at: string;
  answers_count?: number;
  likes_count?: number;
}

interface Answer {
  id: string;
  content: string;
  created_at: string;
  is_best_answer: boolean;
  question: {
    title: string;
    id: string;
  } | null;
}

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    questionsCount: 0,
    answersCount: 0,
    totalLikes: 0,
    bestAnswers: 0,
  });
  const [userQuestions, setUserQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: "",
    username: "",
    bio: "",
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
      fetchUserQuestions();
      fetchUserAnswers();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditForm({
        display_name: data.display_name || "",
        username: data.username || "",
        bio: data.bio || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      // Fetch questions count
      const { count: questionsCount } = await supabase
        .from("questions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch answers count  
      const { count: answersCount } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch best answers count
      const { count: bestAnswers } = await supabase
        .from("answers")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_best_answer", true);

      setStats({
        questionsCount: questionsCount || 0,
        answersCount: answersCount || 0,
        totalLikes: 0,
        bestAnswers: bestAnswers || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUserQuestions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setUserQuestions(data || []);
    } catch (error) {
      console.error("Error fetching user questions:", error);
    }
  };

  const fetchUserAnswers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("answers")
        .select(`
          id,
          content,
          created_at,
          is_best_answer,
          question_id
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Fetch question titles for answers
      const answersWithQuestions = await Promise.all(
        (data || []).map(async (answer) => {
          const { data: questionData } = await supabase
            .from("questions")
            .select("id, title")
            .eq("id", answer.question_id)
            .single();
          
          return {
            ...answer,
            question: questionData
          };
        })
      );
      
      setUserAnswers(answersWithQuestions);
    } catch (error) {
      console.error("Error fetching user answers:", error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: editForm.display_name,
          username: editForm.username,
          bio: editForm.bio,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfile({
        ...profile,
        display_name: editForm.display_name,
        username: editForm.username,
        bio: editForm.bio,
      });

      setIsEditing(false);
      toast({
        title: "Профиль обновлён!",
        description: "Ваши изменения сохранены.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить профиль.",
        variant: "destructive",
      });
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user) return;

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    setUploading(true);

    try {
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);

      toast({
        title: "Аватар обновлён!",
        description: "Ваша фотография успешно загружена.",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить аватар.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getReputationColor = (level: string) => {
    switch (level) {
      case "expert": return "text-expert";
      case "advanced": return "text-accent-warm";
      case "intermediate": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getReputationLabel = (level: string) => {
    switch (level) {
      case "expert": return "Эксперт";
      case "advanced": return "Продвинутый";
      case "intermediate": return "Опытный";
      default: return "Новичок";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Вход требуется</h1>
          <p className="text-muted-foreground">Войдите в аккаунт для просмотра профиля</p>
        </div>
      </div>
    );
  }

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <Card className="mb-6 shadow-card border-border/50 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <Avatar className="w-24 h-24 ring-4 ring-primary/20">
                  <AvatarImage 
                    src={profile.avatar_url || undefined} 
                    alt={profile.display_name || profile.username || "Avatar"}
                  />
                  <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                    {(profile.display_name || profile.username || "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload Avatar Button */}
                <label 
                  htmlFor="avatar-upload"
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                      {profile.display_name || profile.username}
                    </h1>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="outline" 
                        className={`${getReputationColor(profile.reputation_level)} border-current`}
                      >
                        <Crown className="w-3 h-3 mr-1" />
                        {getReputationLabel(profile.reputation_level)}
                      </Badge>
                      <Badge variant="secondary">
                        {profile.points} баллов
                      </Badge>
                    </div>
                    {profile.bio && (
                      <p className="text-muted-foreground">{profile.bio}</p>
                    )}
                  </div>
                  
                  <Button
                    variant={isEditing ? "ghost" : "outline"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="self-start"
                  >
                    {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
                    {isEditing ? "Отмена" : "Редактировать"}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
                    <div className="text-lg font-bold text-primary">{stats.questionsCount}</div>
                    <div className="text-xs text-muted-foreground">Вопросов</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-success mx-auto mb-1" />
                    <div className="text-lg font-bold text-success">{stats.answersCount}</div>
                    <div className="text-xs text-muted-foreground">Ответов</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-accent-warm/10 to-accent-warm/5 rounded-lg">
                    <Heart className="w-5 h-5 text-accent-warm mx-auto mb-1" />
                    <div className="text-lg font-bold text-accent-warm">{stats.totalLikes}</div>
                    <div className="text-xs text-muted-foreground">Лайков</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-br from-expert/10 to-expert/5 rounded-lg">
                    <Trophy className="w-5 h-5 text-expert mx-auto mb-1" />
                    <div className="text-lg font-bold text-expert">{stats.bestAnswers}</div>
                    <div className="text-xs text-muted-foreground">Лучших</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="mt-6 pt-6 border-t border-border/50 animate-fade-in">
                <div className="grid gap-4 max-w-2xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="display-name">Отображаемое имя</Label>
                      <Input
                        id="display-name"
                        placeholder="Ваше имя"
                        value={editForm.display_name}
                        onChange={(e) => setEditForm({...editForm, display_name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Имя пользователя</Label>
                      <Input
                        id="username"
                        placeholder="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">О себе</Label>
                    <Textarea
                      id="bio"
                      placeholder="Расскажите о себе..."
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="questions" className="animate-fade-in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="questions">Мои вопросы ({stats.questionsCount})</TabsTrigger>
            <TabsTrigger value="answers">Мои ответы ({stats.answersCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4 mt-6">
            {userQuestions.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Нет вопросов</h3>
                  <p className="text-muted-foreground">Вы ещё не задавали вопросов</p>
                </CardContent>
              </Card>
            ) : (
              userQuestions.map((question, index) => (
                <Card 
                  key={question.id} 
                  className="shadow-card hover:shadow-elevated transition-all duration-200 animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{question.category}</Badge>
                          <Badge variant="outline">{question.points} баллов</Badge>
                        </div>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {question.title}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {question.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(question.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="answers" className="space-y-4 mt-6">
            {userAnswers.length === 0 ? (
              <Card className="shadow-card">
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Нет ответов</h3>
                  <p className="text-muted-foreground">Вы ещё не отвечали на вопросы</p>
                </CardContent>
              </Card>
            ) : (
              userAnswers.map((answer, index) => (
                <Card 
                  key={answer.id} 
                  className={`shadow-card hover:shadow-elevated transition-all duration-200 animate-fade-in cursor-pointer ${
                    answer.is_best_answer ? 'ring-2 ring-success/50 bg-success/5' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {answer.is_best_answer && (
                            <Badge className="bg-success text-success-foreground">
                              <Star className="w-3 h-3 mr-1" />
                              Лучший ответ
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {answer.question?.title || "Вопрос удалён"}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                      {answer.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(answer.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;