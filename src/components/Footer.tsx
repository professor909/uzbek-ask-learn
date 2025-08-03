import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Tablet } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  const footerLinks = [
    { key: 'terms', href: '#' },
    { key: 'copyright', href: '#' },
    { key: 'privacy', href: '#' },
    { key: 'careers', href: '#' },
    { key: 'about', href: '#' }
  ];

  return (
    <footer className="border-t border-border/50 bg-muted/30 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Links Section */}
          <div>
            <h3 className="font-semibold text-lg mb-4">ForSkull</h3>
            <nav className="space-y-2">
              {footerLinks.map((link) => (
                <div key={link.key}>
                  <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground text-sm">
                    {t(`footer.${link.key}`)}
                  </Button>
                </div>
              ))}
            </nav>
          </div>

          {/* App Downloads */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.mobileApps')}</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#" className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{t('footer.downloadOn')}</div>
                    <div className="text-xs text-muted-foreground">Google Play</div>
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="#" className="flex items-center">
                  <Tablet className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="text-sm font-medium">{t('footer.downloadOn')}</div>
                    <div className="text-xs text-muted-foreground">App Store</div>
                  </div>
                </a>
              </Button>
            </div>
          </div>

          {/* Mission Statement */}
          <div>
            <h3 className="font-semibold text-lg mb-4">{t('footer.ourMission')}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.slogan')}
            </p>
          </div>
        </div>

        <Separator className="my-6" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 ForSkull. {t('footer.allRightsReserved')}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('footer.educationalPlatform')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;