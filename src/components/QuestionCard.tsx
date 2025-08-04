import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Star, Award, MoreHorizontal, Trash2, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminActions } from "@/hooks/useAdminActions";
import { useRankTranslation } from "@/hooks/useRankTranslation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionCardProps {
  id: string;
  title: string;
  content: string;
  category: string;
  points: number;
  answersCount: number;
  likesCount: number;
  isExpert?: boolean;
  authorName: string;
  authorRank: string;
  timeAgo: string;
  isBestAnswer?: boolean;
  userVote?: number | null;
  authorId: string;
  imageUrl?: string;
  onVote: (questionId: string, voteType: 1 | -1) => void;
  onDeleted?: () => void;
}

const QuestionCard = ({
  id,
  title,
  content,
  category,
  points,
  answersCount,
  likesCount,
  isExpert = false,
  authorName,
  authorRank,
  timeAgo,
  isBestAnswer = false,
  userVote,
  authorId,
  imageUrl,
  onVote,
  onDeleted
}: QuestionCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteQuestion, blockUser } = useAdminActions();
  const { translateRank, translateCategory } = useRankTranslation();
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  
  const handleVote = (voteType: 1 | -1) => {
    onVote(id, voteType);
  };

  useEffect(() => {
    // Check current user's role for admin/expert actions
    if (user) {
      import('@/integrations/supabase/client').then(({ supabase }) => {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) setCurrentUserRole(data.role || '');
          });
      });
    }
  }, [user]);

  const canManage = user && (
    user.id === authorId || 
    currentUserRole === 'admin' || 
    currentUserRole === 'expert'
  );

  const handleDelete = async () => {
    if (await deleteQuestion(id)) {
      onDeleted?.();
    }
  };

  const handleBlockUser = async () => {
    if (await blockUser(authorId)) {
      // User blocked successfully
    }
  };
  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/20 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {translateCategory(category)}
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs bg-gradient-warm text-accent-warm-foreground border-accent-warm/30"
              >
                {points} баллов
              </Badge>
              {isExpert && (
                <Badge className="text-xs bg-expert text-expert-foreground">
                  <Award className="w-3 h-3 mr-1" />
                  Эксперт
                </Badge>
              )}
            </div>
            <h3 
              className="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer group-hover:scale-[1.01] transition-transform duration-200"
              onClick={() => navigate(`/question/${id}`)}
            >
              {title}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            {isBestAnswer && (
              <Star className="w-5 h-5 text-accent-warm fill-accent-warm" />
            )}
            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить вопрос
                  </DropdownMenuItem>
                  {currentUserRole === 'admin' && user?.id !== authorId && (
                    <DropdownMenuItem onClick={handleBlockUser} className="text-destructive">
                      <UserX className="mr-2 h-4 w-4" />
                      Заблокировать автора
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {content}
        </p>
        {imageUrl && (
          <div className="mt-3">
            <img 
              src={imageUrl} 
              alt="Question image" 
              className="max-w-full h-auto max-h-64 object-contain rounded-lg border"
            />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <MessageCircle className="w-4 h-4 mr-1" />
              {answersCount}/3
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`${userVote === 1 ? 'text-accent-warm' : 'text-muted-foreground hover:text-accent-warm'}`}
              onClick={() => handleVote(1)}
            >
              <Heart className={`w-4 h-4 mr-1 ${userVote === 1 ? 'fill-current' : ''}`} />
              {likesCount}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {authorName.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium">{authorName}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {translateRank(authorRank)}
            </Badge>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default QuestionCard;