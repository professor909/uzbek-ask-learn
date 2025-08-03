import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Careers = () => {
  const { t } = useLanguage();

  const positions = [
    {
      id: 1,
      title: t('careers.positions.frontend.title'),
      description: t('careers.positions.frontend.description'),
      location: t('careers.locations.remote'),
      type: t('careers.types.fullTime'),
      skills: ['React', 'TypeScript', 'Tailwind CSS']
    },
    {
      id: 2,
      title: t('careers.positions.backend.title'),
      description: t('careers.positions.backend.description'),
      location: t('careers.locations.remote'),
      type: t('careers.types.fullTime'),
      skills: ['Node.js', 'PostgreSQL', 'Supabase']
    },
    {
      id: 3,
      title: t('careers.positions.designer.title'),
      description: t('careers.positions.designer.description'),
      location: t('careers.locations.remote'),
      type: t('careers.types.partTime'),
      skills: ['Figma', 'UI/UX', 'Design Systems']
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
              {t('careers.title')}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('careers.subtitle')}
            </p>
          </div>

          {/* Company Culture */}
          <div className="mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">{t('careers.culture.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t('careers.culture.content')}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Job Positions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              {t('careers.openPositions')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position) => (
                <Card key={position.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{position.type}</Badge>
                      <Badge variant="outline">{position.location}</Badge>
                    </div>
                    <CardTitle className="text-lg">{position.title}</CardTitle>
                    <CardDescription>{position.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">{t('careers.requiredSkills')}:</p>
                      <div className="flex flex-wrap gap-1">
                        {position.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full">
                      {t('careers.apply')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">{t('careers.benefits.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t('careers.benefits.flexible.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('careers.benefits.flexible.description')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('careers.benefits.growth.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('careers.benefits.growth.description')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('careers.benefits.competitive.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('careers.benefits.competitive.description')}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('careers.benefits.team.title')}</h4>
                    <p className="text-muted-foreground text-sm">{t('careers.benefits.team.description')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact */}
          <div className="text-center">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>{t('careers.contact.title')}</CardTitle>
                <CardDescription>{t('careers.contact.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg">
                  {t('careers.contact.button')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Careers;