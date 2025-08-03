import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Heart, Lightbulb } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: Target,
      title: t('about.values.mission.title'),
      description: t('about.values.mission.description')
    },
    {
      icon: Heart,
      title: t('about.values.passion.title'),
      description: t('about.values.passion.description')
    },
    {
      icon: Lightbulb,
      title: t('about.values.innovation.title'),
      description: t('about.values.innovation.description')
    },
    {
      icon: Users,
      title: t('about.values.community.title'),
      description: t('about.values.community.description')
    }
  ];

  const team = [
    {
      name: "Алексей Петров",
      position: t('about.team.ceo.position'),
      description: t('about.team.ceo.description')
    },
    {
      name: "Мария Иванова",
      position: t('about.team.cto.position'),
      description: t('about.team.cto.description')
    },
    {
      name: "Дмитрий Сидоров",
      position: t('about.team.lead.position'),
      description: t('about.team.lead.description')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              {t('about.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Mission Statement */}
          <div className="mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t('about.mission.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-center text-lg">
                  {t('about.mission.content')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Story */}
          <div className="mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">{t('about.story.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.story.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.story.paragraph2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('about.story.paragraph3')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Our Values */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
              {t('about.values.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 text-center">
                    <CardHeader>
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Our Team */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground text-center">
              {t('about.team.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 text-center">
                  <CardHeader>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary"></div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="secondary">{member.position}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Statistics */}
          <div className="mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{t('about.stats.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                    <p className="text-muted-foreground">{t('about.stats.users')}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
                    <p className="text-muted-foreground">{t('about.stats.questions')}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">100+</div>
                    <p className="text-muted-foreground">{t('about.stats.experts')}</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">99%</div>
                    <p className="text-muted-foreground">{t('about.stats.satisfaction')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;