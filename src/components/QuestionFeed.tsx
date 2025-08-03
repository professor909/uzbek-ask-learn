import { useState, useMemo } from "react";
import { MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import QuestionCard from "./QuestionCard";
import CreateQuestionDialog from "./CreateQuestionDialog";
import SearchAndFilter from "./SearchAndFilter";
import QuestionSidebar from "./QuestionSidebar";
import { useQuestions } from "@/hooks/useQuestions";
import { useLanguage } from "@/hooks/useLanguage";

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
  const { questions, loading, voteOnQuestion, refetch } = useQuestions();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort questions
  const filteredQuestions = useMemo(() => {
    let filtered = questions.filter(question => {
      const matchesSearch = searchQuery.trim() === "" || 
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || question.category === selectedCategory;
      const matchesLanguage = question.language === language;
      return matchesSearch && matchesCategory && matchesLanguage;
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
  }, [questions, searchQuery, selectedCategory, sortBy, language]);

  return (
    <main className="flex-1">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-accent-warm bg-clip-text text-transparent">{t('questions.title')}</h1>
              <p className="text-muted-foreground mt-1">{t('questions.subtitle')}</p>
            </div>
            <div className="flex-shrink-0 animate-scale-in">
              <CreateQuestionDialog />
            </div>
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
                  {searchQuery || selectedCategory !== "all" ? t('questions.noQuestions') : t('questions.noQuestions')}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all" 
                    ? t('questions.noQuestionsDesc')
                    : t('questions.noQuestionsDesc')
                  }
                </p>
                {!searchQuery && selectedCategory === "all" && <CreateQuestionDialog />}
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
                  authorId={question.user_id}
                  onVote={voteOnQuestion}
                  onDeleted={refetch}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats sidebar */}
        {/* Боковая панель с блоками - переносится вниз на мобильных, на планшетах сбоку */}
        <QuestionSidebar 
          questionsCount={questions.length} 
          onCategoryClick={(category) => setSelectedCategory(category)}
        />
      </div>
    </main>
  );
};

export default QuestionFeed;