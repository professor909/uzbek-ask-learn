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
import Header from "@/components/Header";

const QuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { questions, voteOnQuestion } = useQuestions();
  const { answers, loading: answersLoading, createAnswer, voteOnAnswer } = useAnswers(id || '');
  const [newAnswer, setNewAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const question = questions.find(q => q.id === id);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

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
      await createAnswer(newAnswer.trim());
      setNewAnswer("");
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
        <Card className="mb-6 shadow-card border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-3">{question.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {question.profiles?.display_name || question.profiles?.username || 'Аноним'}
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
              {answers.map((answer) => (
                <Card key={answer.id} className={`shadow-card border-border/50 ${answer.is_best_answer ? 'ring-2 ring-success/50' : ''}`}>
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
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="w-4 h-4 mr-1" />
                          {answer.profiles?.display_name || answer.profiles?.username || 'Аноним'}
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
        {user && (
          <Card className="shadow-card border-border/50">
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
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;