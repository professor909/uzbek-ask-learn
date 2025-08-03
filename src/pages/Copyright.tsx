import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Copyright = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            {t('copyright.title')}
          </h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('copyright.ownership.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('copyright.ownership.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('copyright.userContent.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('copyright.userContent.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('copyright.infringement.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('copyright.infringement.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('copyright.procedure.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('copyright.procedure.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('copyright.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('copyright.contact.content')}
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              © 2024 ForSkull. {t('copyright.allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Copyright;