import { Search, Bell, User, Skull, LogOut, Globe, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import CreateQuestionDialog from "./CreateQuestionDialog";
import { useNotifications } from "@/hooks/useNotifications";

const Header = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Skull className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ForSkull</span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4 lg:mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t('search.placeholder')}
                className="pl-10 bg-muted/50 border-0 focus:bg-background transition-colors text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 lg:space-x-2">
            {/* Language Switcher - only on desktop */}
            {!isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs font-medium">{language.toUpperCase()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage('ru')}>
                    🇷🇺 Русский
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('uz')}>
                    🇺🇿 O'zbek
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {user ? (
              <>
                {/* Ask Question - only on desktop */}
                {!isMobile && <CreateQuestionDialog />}
                
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="w-4 h-4" />
                      {unreadCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-2 border-b">
                      <h3 className="font-medium">Уведомления</h3>
                    </div>
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        Уведомлений нет
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.slice(0, 5).map((notification) => (
                          <DropdownMenuItem 
                            key={notification.id}
                            className="flex flex-col items-start p-3 cursor-pointer"
                            onClick={() => {
                              markAsRead(notification.id);
                              if (notification.related_question_id) {
                                navigate(`/question/${notification.related_question_id}`);
                              }
                            }}
                          >
                            <div className="flex items-start justify-between w-full">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {notification.content}
                                </p>
                              </div>
                              {!notification.is_read && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2 mt-1" />
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* User Profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      {!isMobile && (
                        <div className="flex flex-col items-start">
                          <span className="text-xs text-muted-foreground">0 {t('header.points')}</span>
                          <span className="text-sm font-medium">{t('profile.reputation.novice')}</span>
                        </div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* Mobile-only items */}
                    {isMobile && (
                      <>
                        <DropdownMenuItem asChild>
                          <CreateQuestionDialog />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setLanguage('ru')}>
                          <Globe className="w-4 h-4 mr-2" />
                          🇷🇺 Русский
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setLanguage('uz')}>
                          <Globe className="w-4 h-4 mr-2" />
                          🇺🇿 O'zbek
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('header.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="secondary" size="sm" className="font-medium text-sm">
                  {t('header.login')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;