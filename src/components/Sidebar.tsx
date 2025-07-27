import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calculator, Globe, Microscope, Palette, Trophy, TrendingUp } from "lucide-react";

const categories = [
  { name: "Математика", icon: Calculator, count: 234, color: "bg-blue-500" },
  { name: "Физика", icon: Microscope, count: 189, color: "bg-purple-500" },
  { name: "Языки", icon: Globe, count: 156, color: "bg-green-500" },
  { name: "Литература", icon: BookOpen, count: 124, color: "bg-orange-500" },
  { name: "Искусство", icon: Palette, count: 89, color: "bg-pink-500" },
];

const topUsers = [
  { name: "Анна Петрова", rank: "PhD", points: 2450, trend: "+45" },
  { name: "Марк Иванов", rank: "Магистр", points: 2210, trend: "+38" },
  { name: "Елена Козлова", rank: "Магистр", points: 1980, trend: "+52" },
  { name: "Дмитрий Смирнов", rank: "Бакалавр", points: 1750, trend: "+29" },
  { name: "Ольга Волкова", rank: "Бакалавр", points: 1650, trend: "+33" },
];

const Sidebar = () => {
  return (
    <aside className="w-80 space-y-6 p-6">
      {/* Categories */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-primary" />
            Категории
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <Button
              key={category.name}
              variant="ghost"
              className="w-full justify-between p-3 h-auto hover:bg-muted/50 group"
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center mr-3`}>
                  <category.icon className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium group-hover:text-primary transition-colors">
                  {category.name}
                </span>
              </div>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {category.count}
              </Badge>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-accent-warm" />
            Топ участники месяца
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topUsers.map((user, index) => (
            <div key={user.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-sm font-bold mr-3">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">{user.points}</div>
                <div className="text-xs text-success flex items-center">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {user.trend}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="shadow-card border-border/50 bg-gradient-subtle">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-xs text-muted-foreground">Вопросов</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-warm">3,891</div>
              <div className="text-xs text-muted-foreground">Ответов</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;