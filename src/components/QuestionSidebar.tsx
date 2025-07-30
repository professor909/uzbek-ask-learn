import { TrendingUp, Users, Hash, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface QuestionSidebarProps {
  questionsCount: number;
}

const categories = [
  { name: "Математика", count: 45, color: "bg-blue-500" },
  { name: "Физика", count: 32, color: "bg-green-500" },
  { name: "Информатика", count: 28, color: "bg-purple-500" },
  { name: "Химия", count: 24, color: "bg-red-500" },
  { name: "Биология", count: 19, color: "bg-yellow-500" },
  { name: "История", count: 15, color: "bg-orange-500" },
];

const topUsers = [
  { name: "Алексей К.", points: 2450, answers: 89, rank: "Эксперт" },
  { name: "Мария В.", points: 1950, answers: 67, rank: "Профи" },
  { name: "Дмитрий С.", points: 1720, answers: 54, rank: "Профи" },
  { name: "Анна М.", points: 1500, answers: 45, rank: "Активист" },
  { name: "Игорь Л.", points: 1280, answers: 38, rank: "Активист" },
];

const QuestionSidebar = ({ questionsCount }: QuestionSidebarProps) => {
  return (
    <aside className="xl:w-80 space-y-6">
      {/* Статистика */}
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
              <Hash className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Вопросов</span>
            </div>
            <span className="font-semibold">{questionsCount}</span>
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

      {/* Популярные категории */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Hash className="w-5 h-5 mr-2 text-primary" />
            Популярные категории
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${category.color}`} />
                <span className="text-sm font-medium">{category.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {category.count}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Топ участники */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Star className="w-5 h-5 mr-2 text-primary" />
            Топ участники
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
                    <span>{user.points} баллов</span>
                    <span>•</span>
                    <span>{user.answers} ответов</span>
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