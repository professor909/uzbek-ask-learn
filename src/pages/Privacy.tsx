import { useLanguage } from "@/hooks/useLanguage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/50">
          <h1 className="text-3xl font-bold mb-8 text-foreground">
            {t('privacy.title')}
          </h1>
          
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('privacy.collection.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.collection.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('privacy.usage.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.usage.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('privacy.sharing.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.sharing.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('privacy.security.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.security.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('privacy.rights.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.rights.content')}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">{t('privacy.contact.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('privacy.contact.content')}
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              {t('privacy.lastUpdated')}: 2024
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;