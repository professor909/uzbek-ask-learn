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
import { useLanguage } from "@/hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "./ImageUpload";

const categories = [
  "math",
  "physics", 
  "programming",
  "literature",
  "art",
  "history",
  "biology",
  "chemistry",
  "economics",
  "other"
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
  const [language, setLanguageState] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { createQuestion } = useQuestions();
  const { user } = useAuth();
  const { language: currentLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Set default language when dialog opens
  useState(() => {
    if (open && !language) {
      setLanguageState(currentLanguage);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !category || !language) {
      return;
    }

    setLoading(true);
    try {
      const questionData = {
        title: title.trim(),
        content: content.trim(),
        category,
        points,
        language,
        is_expert: points >= 75,
        ...(imageUrl && { image_url: imageUrl })
      };
      
      await createQuestion(questionData);
      
      // Reset form
      setTitle("");
      setContent("");
      setCategory("");
      setPoints(25);
      setLanguageState("");
      setImageUrl("");
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
        {t('header.login')} и {t('questions.askQuestion').toLowerCase()}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen && !language) {
        setLanguageState(currentLanguage);
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm" className="font-medium">
          <Plus className="w-4 h-4 mr-2" />
          {t('questions.askQuestion')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader>
          <DialogTitle>{t('questions.createQuestion')}</DialogTitle>
          <DialogDescription>
            Опишите ваш вопрос подробно, чтобы получить качественный ответ
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('question.title')}</Label>
            <Input
              id="title"
              placeholder={t('question.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">{t('question.content')}</Label>
            <Textarea
              id="content"
              placeholder={t('question.contentPlaceholder')}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              rows={6}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('question.attachImage')}</Label>
            <ImageUpload
              onImageUploaded={setImageUrl}
              onImageRemoved={() => setImageUrl("")}
              uploadedImage={imageUrl}
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">{t('question.category')}</Label>
              <Select value={category} onValueChange={setCategory} disabled={loading} required>
                <SelectTrigger>
                  <SelectValue placeholder={t('question.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`category.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">{t('question.points')}</Label>
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

            <div className="space-y-2">
              <Label htmlFor="language">{t('question.language')}</Label>
              <Select value={language} onValueChange={setLanguageState} disabled={loading} required>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите язык" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                  <SelectItem value="uz">🇺🇿 O'zbek</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading} className="w-full sm:w-auto">
              {t('question.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !title.trim() || !content.trim() || !category || !language} className="w-full sm:w-auto">
              {loading ? t('question.creating') : t('question.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuestionDialog;