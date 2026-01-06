import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { language, setLanguage, t } = useLanguage();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-foreground flex items-center justify-center">
            <span className="text-background font-display text-lg italic">CH</span>
          </div>
          <span className="font-display text-xl font-semibold">Cristina</span>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollTo('about')}
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              {t.nav.about}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollTo('work')}
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              {t.nav.work}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="text-foreground hover:text-primary transition-colors relative group"
            >
              {t.nav.contact}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-muted rounded-full p-1">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                language === 'en'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('es')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                language === 'es'
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ES
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
