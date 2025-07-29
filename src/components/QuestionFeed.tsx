import { useState, useMemo } from "react";
import { MessageSquare, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import QuestionCard from "./QuestionCard";
import CreateQuestionDialog from "./CreateQuestionDialog";
import SearchAndFilter from "./SearchAndFilter";
import { useQuestions } from "@/hooks/useQuestions";

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'меньше часа назад';
  if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'час' : diffInHours < 5 ? 'часа' : 'часов'} назад`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} ${diffInDays === 1 ? 'день' : diffInDays < 5 ? 'дня' : 'дней'} назад`;
};

const QuestionFeed = () => {
  const { questions, loading, voteOnQuestion } = useQuestions();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Все категории");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(question => {
      const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           question.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Все категории" || question.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort questions
    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "most_liked":
        filtered.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
        break;
      case "points_high":
        filtered.sort((a, b) => b.points - a.points);
        break;
      case "points_low":
        filtered.sort((a, b) => a.points - b.points);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return filtered;
  }, [questions, searchQuery, selectedCategory, sortBy]);

  return (
    <main className="flex-1">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Вопросы и ответы</h1>
              <p className="text-muted-foreground mt-1">Найдите ответы или поделитесь знаниями</p>
            </div>
            <CreateQuestionDialog />
          </div>

          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-muted rounded w-full mb-2"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card className="shadow-card border-border/50">
              <CardContent className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery || selectedCategory !== "Все категории" ? "Ничего не найдено" : "Пока нет вопросов"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "Все категории" 
                    ? "Попробуйте изменить параметры поиска"
                    : "Станьте первым, кто задаст вопрос!"
                  }
                </p>
                {!searchQuery && selectedCategory === "Все категории" && <CreateQuestionDialog />}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map((question) => (
                <QuestionCard 
                  key={question.id} 
                  id={question.id}
                  title={question.title}
                  content={question.content}
                  category={question.category}
                  points={question.points}
                  answersCount={question.answers_count || 0}
                  likesCount={question.likes_count || 0}
                  isExpert={question.is_expert}
                  authorName={question.profiles?.display_name || question.profiles?.username || 'Неизвестный'}
                  authorRank={question.profiles?.role || 'Пользователь'}
                  timeAgo={formatTimeAgo(question.created_at)}
                  isBestAnswer={question.is_solved}
                  userVote={question.user_vote}
                  onVote={voteOnQuestion}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        <aside className="lg:w-80 space-y-6">
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Вопросов</span>
                </div>
                <span className="font-semibold">{questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Активных пользователей</span>
                </div>
                <span className="font-semibold">247</span>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
};

export default QuestionFeed;