import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            {t('terms.title')}
          </h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('terms.acceptance.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.acceptance.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('terms.services.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.services.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('terms.userConduct.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.userConduct.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('terms.intellectualProperty.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.intellectualProperty.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('terms.limitation.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.limitation.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('terms.changes.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('terms.changes.content')}
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              {t('terms.lastUpdated')}: 2024
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;