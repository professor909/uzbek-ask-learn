import { AlertTriangle, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const BlockedUserMessage = () => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card border-destructive/20">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Аккаунт заблокирован
            </h1>
            <p className="text-muted-foreground">
              Ваш аккаунт был временно заблокирован администрацией сайта.
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Mail className="w-4 h-4" />
              <span>Для разблокировки</span>
            </div>
            <p className="text-sm text-foreground">
              Обратитесь к администрации по адресу:{" "}
              <a 
                href="mailto:admin@site.ru" 
                className="text-primary hover:underline font-medium"
              >
                admin@site.ru
              </a>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Если вы считаете, что блокировка произошла по ошибке, 
              свяжитесь с администрацией для выяснения ситуации.
            </p>
            <Button 
              onClick={signOut}
              variant="outline" 
              className="w-full"
            >
              Выйти из аккаунта
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockedUserMessage;