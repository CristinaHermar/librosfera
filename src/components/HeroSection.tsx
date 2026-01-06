import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const HeroSection = () => {
  const { t } = useLanguage();

  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-background pt-24">
      {/* Decorative circle */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-accent/60 translate-x-1/4 -translate-y-1/4" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl pt-20 md:pt-32">
          <p className="text-muted-foreground text-sm tracking-[0.2em] mb-6 animate-fade-in">
            {t.hero.tagline}
          </p>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {t.hero.headline}
          </h1>
          
          <div className="flex items-start gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="w-1 h-16 bg-primary rounded-full" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              {t.hero.description}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button
              variant="hero"
              size="lg"
              onClick={scrollToWork}
              className="group"
            >
              {t.hero.cta}
              <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <a href="https://www.linkedin.com/in/cristina-hermar" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </section>
  );
};

export default HeroSection;
