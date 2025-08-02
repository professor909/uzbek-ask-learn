import { TrendingUp, Users, Hash, Star, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

interface QuestionSidebarProps {
  questionsCount: number;
  onCategoryClick?: (category: string) => void;
}

const getCategoriesData = (t: (key: string) => string) => [
  { key: "math", name: t("category.math"), count: 45, color: "hsl(217, 91%, 60%)", bgColor: "hsl(217, 91%, 95%)" },
  { key: "physics", name: t("category.physics"), count: 32, color: "hsl(142, 76%, 36%)", bgColor: "hsl(142, 76%, 95%)" },
  { key: "informatics", name: t("category.informatics"), count: 28, color: "hsl(271, 91%, 65%)", bgColor: "hsl(271, 91%, 95%)" },
  { key: "chemistry", name: t("category.chemistry"), count: 24, color: "hsl(0, 84%, 60%)", bgColor: "hsl(0, 84%, 95%)" },
  { key: "biology", name: t("category.biology"), count: 19, color: "hsl(48, 96%, 53%)", bgColor: "hsl(48, 96%, 95%)" },
  { key: "literature", name: t("category.literature"), count: 15, color: "hsl(25, 95%, 53%)", bgColor: "hsl(25, 95%, 95%)" },
];

const topUsers = [
  { name: "Алексей К.", points: 2450, answers: 89, rank: "Гуру" },
  { name: "Мария В.", points: 1950, answers: 67, rank: "Мастер" },
  { name: "Дмитрий С.", points: 1720, answers: 54, rank: "Знаток" },
  { name: "Анна М.", points: 1500, answers: 45, rank: "Ученик" },
  { name: "Игорь Л.", points: 1280, answers: 38, rank: "Новичок" },
];

const QuestionSidebar = ({ questionsCount, onCategoryClick }: QuestionSidebarProps) => {
  const { t } = useLanguage();
  const categories = getCategoriesData(t);
  
  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Статистика */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            {t("sidebar.statistics")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("sidebar.questions")}</span>
            </div>
            <span className="font-semibold">{questionsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("sidebar.activeUsers")}</span>
            </div>
            <span className="font-semibold">247</span>
          </div>
        </CardContent>
      </Card>

      {/* Популярные категории */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Hash className="w-5 h-5 mr-2 text-primary" />
            {t("sidebar.popularCategories")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category, index) => (
            <Button
              key={category.name}
              variant="ghost"
              className="w-full justify-between h-auto p-3 hover:bg-secondary/80 transition-colors"
              onClick={() => onCategoryClick?.(category.name)}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm font-medium text-left">{category.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Топ участники */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="w-5 h-5 mr-2 text-primary" />
            {t("sidebar.topUsers")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topUsers.map((user, index) => (
            <div key={user.name} className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {index < 3 && (
                    <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{user.points} {t("sidebar.points")}</span>
                    <span>•</span>
                    <span>{user.answers} {t("sidebar.answers")}</span>
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="text-xs">
                {user.rank}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};

export default QuestionSidebar;