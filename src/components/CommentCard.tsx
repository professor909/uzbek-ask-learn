import { useState } from "react";
import { MessageCircle, Reply, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

interface CommentCardProps {
  id: string;
  content: string;
  authorName: string;
  authorRank: string;
  timeAgo: string;
  userId: string;
  onEdit?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
}

const CommentCard = ({
  id,
  content,
  authorName,
  authorRank,
  timeAgo,
  userId,
  onEdit,
  onDelete,
}: CommentCardProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const isOwnComment = user?.id === userId;

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  return (
    <Card className="border-l-4 border-l-muted bg-muted/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-7 h-7">
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {authorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{authorName}</span>
              <Badge variant="outline" className="text-xs">
                {authorRank}
              </Badge>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>

          {isOwnComment && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete?.(id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Ваш комментарий..."
              className="min-h-[80px] resize-none"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                Отмена
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                Сохранить
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground leading-relaxed">{content}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CommentCard;