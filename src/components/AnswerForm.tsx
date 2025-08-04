import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ImageUpload } from "./ImageUpload";

interface AnswerFormProps {
  questionId: string;
  onAnswerSubmitted: () => void;
}

const AnswerForm = ({ questionId, onAnswerSubmitted }: AnswerFormProps) => {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему",
        variant: "destructive",
      });
      return;
    }

    if (content.trim().length < 50) {
      toast({
        title: "Слишком короткий ответ",
        description: "Ответ должен содержать минимум 50 символов",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("answers").insert({
        content: content.trim(),
        question_id: questionId,
        user_id: user.id,
        ...(imageUrl && { image_url: imageUrl })
      });

      if (error) throw error;

      toast({
        title: "Успешно!",
        description: "Ваш ответ опубликован",
      });

      setContent("");
      setImageUrl("");
      onAnswerSubmitted();
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">Войдите, чтобы ответить на вопрос</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="answer-content">Ваш ответ</Label>
        <Textarea
          id="answer-content"
          placeholder="Поделитесь своими знаниями... (минимум 50 символов)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          rows={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Прикрепить изображение (опционально)</Label>
        <ImageUpload
          onImageUploaded={setImageUrl}
          onImageRemoved={() => setImageUrl("")}
          uploadedImage={imageUrl}
        />
      </div>

      <Button 
        type="submit" 
        disabled={loading || content.trim().length < 50}
        className="w-full"
      >
        {loading ? "Отправка..." : "Отправить ответ"}
      </Button>
    </form>
  );
};

export default AnswerForm;