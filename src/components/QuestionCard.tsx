import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Heart, MessageCircle, Star, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  onVote: (questionId: string, voteType: 1 | -1) => void;
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
  onVote
}: QuestionCardProps) => {
  const navigate = useNavigate();
  
  const handleVote = (voteType: 1 | -1) => {
    onVote(id, voteType);
  };
  return (
    <Card className="group hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-card/50 border-border/50 hover:border-primary/20 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {category}
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
          {isBestAnswer && (
            <Star className="w-5 h-5 text-accent-warm fill-accent-warm" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="py-2">
        <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
          {content}
        </p>
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
            <span className="font-medium">{authorName}</span>
            <Badge variant="outline" className="text-xs">
              {authorRank}
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