import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageSquare, ThumbsUp, Trophy, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useAnswers } from "@/hooks/useAnswers";
import { useQuestions } from "@/hooks/useQuestions";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { ImageUpload } from "@/components/ImageUpload";
import { UserAvatar } from "@/components/UserAvatar";
import { ImageZoomModal } from "@/components/ImageZoomModal";

// SEO Hook for updating page metadata
const useSEO = (title: string, description: string, url: string) => {
  useEffect(() => {
    // Update page title
    document.title = `${title} - ForSkull`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags
    const updateOGTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };

    updateOGTag('og:title', title);
    updateOGTag('og:description', description);
    updateOGTag('og:url', url);
    updateOGTag('og:type', 'article');
    updateOGTag('og:site_name', 'ForSkull');

    // Update Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', 'summary');
    updateTwitterTag('twitter:title', title);
    updateTwitterTag('twitter:description', description);

    // Add structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      "mainEntity": {
        "@type": "Question",
        "name": title,
        "text": description,
        "url": url,
        "author": {
          "@type": "Person",
          "name": "ForSkull User"
        }
      }
    };

    let scriptTag = document.querySelector('script[type="application/ld+json"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      document.title = 'ForSkull - Платформа вопросов и ответов';
    };
  }, [title, description, url]);
};

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { questions, voteOnQuestion } = useQuestions();
  const { answers, loading: answersLoading, createAnswer, voteOnAnswer } = useAnswers(id || '');
  const [newAnswer, setNewAnswer] = useState("");
  const [answerImage, setAnswerImage] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const question = questions.find(q => q.id === id);

  // SEO optimization
  const questionTitle = question?.title || 'Вопрос не найден';
  const questionDescription = question?.content?.substring(0, 160) + '...' || 'Вопрос не найден на ForSkull';
  const currentUrl = window.location.href;
  
  useSEO(questionTitle, questionDescription, currentUrl);

  // Убираем принудительную авторизацию - вопросы доступны всем

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Вопрос не найден</h1>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к вопросам
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setSubmitting(true);
    try {
      await createAnswer(newAnswer.trim(), answerImage);
      setNewAnswer("");
      setAnswerImage("");
      toast({
        title: "Ответ опубликован!",
        description: "Спасибо за вклад в сообщество. Ваш ответ поможет другим студентам.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Button 
          onClick={() => navigate("/")} 
          variant="ghost" 
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к вопросам
        </Button>

        {/* Question Card */}
        <Card className="mb-6 shadow-card border-border/50 animate-fade-in">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-3">{question.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <UserAvatar 
                      avatarUrl={question.profiles?.avatar_url}
                      displayName={question.profiles?.display_name}
                      username={question.profiles?.username}
                      size="sm"
                    />
                    <span>{question.profiles?.display_name || question.profiles?.username || 'Аноним'}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDate(question.created_at)}
                  </div>
                  <Badge variant="secondary">{question.category}</Badge>
                  {question.is_expert && (
                    <Badge variant="secondary" className="bg-accent-warm/10 text-accent-warm border-accent-warm/20">
                      <Trophy className="w-3 h-3 mr-1" />
                      Экспертный
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => voteOnQuestion(question.id, 1)}
                  className={`p-2 ${question.user_vote === 1 ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium">{question.likes_count || 0}</span>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{question.points}</div>
                  <div className="text-xs text-muted-foreground">баллов</div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray max-w-none">
              <p className="text-foreground whitespace-pre-wrap">{question.content}</p>
              {question.image_url && (
                <div className="mt-4">
                  <ImageZoomModal imageUrl={question.image_url} alt="Question image">
                    <img 
                      src={question.image_url} 
                      alt="Question image" 
                      className="max-w-full h-auto max-h-96 object-contain rounded-lg border"
                    />
                  </ImageZoomModal>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Answers Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-primary" />
            Ответы ({answers.length})
          </h2>

          {answersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Загрузка ответов...</p>
            </div>
          ) : answers.length === 0 ? (
            <Card className="shadow-card border-border/50">
              <CardContent className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Пока нет ответов на этот вопрос</p>
                <p className="text-sm text-muted-foreground mt-2">Будьте первым, кто поможет найти решение!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {answers.map((answer, index) => (
                <Card 
                  key={answer.id} 
                  className={`shadow-card border-border/50 animate-fade-in ${answer.is_best_answer ? 'ring-2 ring-success/50 bg-success/5' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => voteOnAnswer(answer.id, 1)}
                          className={`p-2 ${answer.user_vote === 1 ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'}`}
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium">{answer.likes_count || 0}</span>
                        {answer.is_best_answer && (
                          <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                            <Trophy className="w-3 h-3 mr-1" />
                            Лучший
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="prose prose-gray max-w-none mb-4">
                          <p className="text-foreground whitespace-pre-wrap">{answer.content}</p>
                          {answer.image_url && (
                            <div className="mt-3">
                              <ImageZoomModal imageUrl={answer.image_url} alt="Answer image">
                                <img 
                                  src={answer.image_url} 
                                  alt="Answer image" 
                                  className="max-w-full h-auto max-h-64 object-contain rounded-lg border"
                                />
                              </ImageZoomModal>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <UserAvatar 
                            avatarUrl={answer.profiles?.avatar_url}
                            displayName={answer.profiles?.display_name}
                            username={answer.profiles?.username}
                            size="sm"
                          />
                          <span>{answer.profiles?.display_name || answer.profiles?.username || 'Аноним'}</span>
                          <span className="mx-2">•</span>
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(answer.created_at)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Answer Form */}
        {user ? (
          <Card className="shadow-card border-border/50 animate-scale-in">
            <CardHeader>
              <h3 className="text-lg font-semibold text-foreground">Ваш ответ</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <Textarea
                  placeholder="Поделитесь своими знаниями и помогите найти решение..."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={6}
                  disabled={submitting}
                  required
                />
                
                <ImageUpload
                  onImageUploaded={setAnswerImage}
                  onImageRemoved={() => setAnswerImage("")}
                  uploadedImage={answerImage}
                  maxSize={2 * 1024 * 1024} // 2MB for answers
                />
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={submitting || !newAnswer.trim()}
                    className="min-w-[120px]"
                  >
                    {submitting ? "Отправка..." : "Ответить"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card border-border/50">
            <CardContent className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Хотите ответить на вопрос?</h3>
              <p className="text-muted-foreground mb-4">Войдите в свой аккаунт, чтобы поделиться знаниями</p>
              <Button onClick={() => navigate("/auth")}>
                Войти в систему
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;