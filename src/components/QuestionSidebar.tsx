import { useState, useEffect } from "react";
import { TrendingUp, Users, Hash, Star, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

interface QuestionSidebarProps {
  questionsCount: number;
  onCategoryClick?: (category: string) => void;
}

interface CategoryData {
  key: string;
  name: string;
  count: number;
  color: string;
  bgColor: string;
}

interface TopUser {
  name: string;
  points: number;
  answers: number;
  rank: string;
  avatarUrl?: string;
}

const getCategoriesData = (t: (key: string) => string): CategoryData[] => [
  { key: "math", name: t("category.math"), count: 0, color: "hsl(217, 91%, 60%)", bgColor: "hsl(217, 91%, 95%)" },
  { key: "physics", name: t("category.physics"), count: 0, color: "hsl(142, 76%, 36%)", bgColor: "hsl(142, 76%, 95%)" },
  { key: "informatics", name: t("category.informatics"), count: 0, color: "hsl(271, 91%, 65%)", bgColor: "hsl(271, 91%, 95%)" },
  { key: "chemistry", name: t("category.chemistry"), count: 0, color: "hsl(0, 84%, 60%)", bgColor: "hsl(0, 84%, 95%)" },
  { key: "biology", name: t("category.biology"), count: 0, color: "hsl(48, 96%, 53%)", bgColor: "hsl(48, 96%, 95%)" },
  { key: "literature", name: t("category.literature"), count: 0, color: "hsl(25, 95%, 53%)", bgColor: "hsl(25, 95%, 95%)" },
];

const QuestionSidebar = ({ questionsCount, onCategoryClick }: QuestionSidebarProps) => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<CategoryData[]>(getCategoriesData(t));
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [activeUsersCount, setActiveUsersCount] = useState(0);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        // Fetch all categories once and aggregate on the client for reliability
        const { data } = await supabase
          .from('questions')
          .select('category');

        const countsMap = new Map<string, number>();
        (data as Array<{ category: string }> | null || []).forEach((row) => {
          const key = row.category;
          countsMap.set(key, (countsMap.get(key) || 0) + 1);
        });

        // Known colors for popular categories; others will use defaults
        const colorMap: Record<string, { color: string; bgColor: string }> = {
          math: { color: 'hsl(217, 91%, 60%)', bgColor: 'hsl(217, 91%, 95%)' },
          physics: { color: 'hsl(142, 76%, 36%)', bgColor: 'hsl(142, 76%, 95%)' },
          informatics: { color: 'hsl(271, 91%, 65%)', bgColor: 'hsl(271, 91%, 95%)' },
          chemistry: { color: 'hsl(0, 84%, 60%)', bgColor: 'hsl(0, 84%, 95%)' },
          biology: { color: 'hsl(48, 96%, 53%)', bgColor: 'hsl(48, 96%, 95%)' },
          literature: { color: 'hsl(25, 95%, 53%)', bgColor: 'hsl(25, 95%, 95%)' },
        };

        const allCategories: CategoryData[] = Array.from(countsMap.entries()).map(
          ([key, count]) => ({
            key,
            name: t(`category.${key}`) || key,
            count,
            color: colorMap[key]?.color || 'hsl(217, 91%, 60%)',
            bgColor: colorMap[key]?.bgColor || 'hsl(217, 91%, 95%)',
          })
        );

        if (allCategories.length === 0) {
          // Fallback to predefined list (keeps UI populated even with no data)
          setCategories(getCategoriesData(t));
          return;
        }

        // Show top 6 by question count
        const top = allCategories.sort((a, b) => b.count - a.count).slice(0, 6);
        setCategories(top);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    const fetchTopUsers = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        // Get top 5 users by monthly points
        const { data: monthlyData } = await supabase
          .from('monthly_points')
          .select(`
            user_id,
            points,
            profiles!inner (
              id,
              display_name,
              username,
              role,
              avatar_url
            )
          `)
          .eq('year', currentYear)
          .eq('month', currentMonth)
          .order('points', { ascending: false })
          .limit(5);

        if (monthlyData) {
          const usersWithAnswers = await Promise.all(
            monthlyData.map(async (record: any) => {
              const profile = record.profiles;
              const { count: answersCount } = await supabase
                .from('answers')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', profile.id)
                .gte('created_at', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
                .lt('created_at', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

              return {
                name: profile.display_name || profile.username || 'Пользователь',
                points: record.points || 0,
                answers: answersCount || 0,
                rank: profile.role || 'novice',
                avatarUrl: profile.avatar_url
              };
            })
          );
          setTopUsers(usersWithAnswers);
        }
      } catch (error) {
        console.error('Error fetching top users:', error);
      }
    };

    const fetchActiveUsersCount = async () => {
      try {
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        setActiveUsersCount(count || 0);
      } catch (error) {
        console.error('Error fetching active users count:', error);
      }
    };

    fetchCategoryCounts();
    fetchTopUsers();
    fetchActiveUsersCount();
  }, [t]);
  
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
            <span className="font-semibold">{activeUsersCount}</span>
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
              onClick={() => onCategoryClick?.(category.key)}
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
          {topUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              {t("sidebar.noUsers")}
            </p>
          ) : (
            topUsers.map((user, index) => (
            <div key={user.name} className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                 <div className="relative">
                   <Avatar className="w-8 h-8">
                     {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
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
            ))
          )}
        </CardContent>
      </Card>
    </aside>
  );
};

export default QuestionSidebar;