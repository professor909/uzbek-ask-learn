import QuestionCard from "./QuestionCard";
import { useQuestions } from "@/hooks/useQuestions";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (loading) {
    return (
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Последние вопросы</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Сортировать:</span>
            <select className="text-sm bg-background border border-border rounded-md px-3 py-1">
              <option>Новые</option>
              <option>Популярные</option>
              <option>Без ответов</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6 border border-border rounded-lg space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Последние вопросы</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Сортировать:</span>
          <select className="text-sm bg-background border border-border rounded-md px-3 py-1">
            <option>Новые</option>
            <option>Популярные</option>
            <option>Без ответов</option>
          </select>
        </div>
      </div>
      
      <div className="space-y-4">
        {questions.length > 0 ? (
          questions.map((question) => (
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
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Пока нет вопросов</p>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <div className="text-center pt-6">
          <button className="text-primary hover:text-primary-glow font-medium transition-colors">
            Загрузить еще вопросы...
          </button>
        </div>
      )}
    </div>
  );
};

export default QuestionFeed;