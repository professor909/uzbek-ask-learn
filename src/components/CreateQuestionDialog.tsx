import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useQuestions } from "@/hooks/useQuestions";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const categories = [
  "Математика",
  "Физика", 
  "Языки",
  "Литература",
  "Искусство",
  "История",
  "Биология",
  "Химия",
  "Информатика",
  "Психология"
];

const pointOptions = [
  { value: 10, label: "10 баллов - простой вопрос" },
  { value: 25, label: "25 баллов - средний вопрос" },
  { value: 50, label: "50 баллов - сложный вопрос" },
  { value: 75, label: "75 баллов - очень сложный вопрос" },
  { value: 100, label: "100 баллов - экспертный вопрос" }
];

const CreateQuestionDialog = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState(25);
  const [loading, setLoading] = useState(false);
  
  const { createQuestion } = useQuestions();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category) {
      return;
    }

    setLoading(true);
    try {
      await createQuestion({
        title: title.trim(),
        content: content.trim(),
        category,
        points,
        is_expert: points >= 75
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setPoints(25);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  // Если пользователь не авторизован, показываем кнопку входа
  if (!user) {
    return (
      <Button 
        variant="secondary" 
        size="sm" 
        className="font-medium"
        onClick={() => navigate("/auth")}
      >
        <Plus className="w-4 h-4 mr-2" />
        Войти и задать вопрос
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="font-medium">
          <Plus className="w-4 h-4 mr-2" />
          Задать вопрос
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Задать новый вопрос</DialogTitle>
          <DialogDescription>
            Опишите ваш вопрос подробно, чтобы получить качественный ответ
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок вопроса</Label>
            <Input
              id="title"
              placeholder="Кратко опишите ваш вопрос..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Подробное описание</Label>
            <Textarea
              id="content"
              placeholder="Подробно опишите ваш вопрос, добавьте контекст, что вы уже пробовали..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={6}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select value={category} onValueChange={setCategory} disabled={loading} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">Баллы за ответ</Label>
              <Select value={points.toString()} onValueChange={(value) => setPoints(parseInt(value))} disabled={loading}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pointOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading || !title.trim() || !content.trim() || !category}>
              {loading ? "Создание..." : "Создать вопрос"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionDialog;