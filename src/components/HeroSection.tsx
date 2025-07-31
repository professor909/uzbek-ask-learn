import { useState } from "react";
import { BookOpen, Users, Award, TrendingUp, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import CreateQuestionDialog from "./CreateQuestionDialog";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animateStats, setAnimateStats] = useState(false);

  const stats = [
    { icon: BookOpen, label: "Активных вопросов", value: "1,247", color: "text-primary" },
    { icon: Users, label: "Участников", value: "3,891", color: "text-accent-warm" },
    { icon: Award, label: "Экспертов", value: "127", color: "text-expert" },
    { icon: TrendingUp, label: "Решённых задач", value: "892", color: "text-success" },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-hero rounded-2xl p-8 lg:p-12 mb-8">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent-warm/10 animate-pulse-glow"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-accent-warm/20 to-transparent rounded-full -translate-y-36 translate-x-36"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/20 to-transparent rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Badge 
                variant="outline" 
                className="bg-white/10 border-white/20 text-white backdrop-blur-sm animate-fade-in"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Лучший образовательный форум
              </Badge>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight animate-scale-in">
                Место, где{" "}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  знания
                </span>{" "}
                встречают{" "}
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  любопытство
                </span>
              </h1>
            </div>
            
            <p className="text-lg lg:text-xl text-white/90 leading-relaxed animate-fade-in">
              Задавайте вопросы, получайте качественные ответы от экспертов и делитесь знаниями 
              с сообществом студентов и преподавателей.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-right">
              {user ? (
                <CreateQuestionDialog />
              ) : (
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90 font-semibold px-8"
                  onClick={() => navigate("/auth")}
                >
                  Начать задавать вопросы
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => {
                  const element = document.getElementById('questions-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Изучить вопросы
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={stat.label}
                  className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setAnimateStats(true)}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${stat.color} ${animateStats ? 'animate-bounce' : ''}`} />
                    <div className="text-2xl font-bold text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-white/80">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <BookOpen className="w-6 h-6 text-white/80 mx-auto" />
              <h3 className="font-medium text-white">Задавайте вопросы</h3>
              <p className="text-sm text-white/70">Получите помощь от экспертов</p>
            </div>
            <div className="space-y-2">
              <Users className="w-6 h-6 text-white/80 mx-auto" />
              <h3 className="font-medium text-white">Помогайте другим</h3>
              <p className="text-sm text-white/70">Делитесь своими знаниями</p>
            </div>
            <div className="space-y-2">
              <Award className="w-6 h-6 text-white/80 mx-auto" />
              <h3 className="font-medium text-white">Зарабатывайте баллы</h3>
              <p className="text-sm text-white/70">Становитесь экспертом</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;