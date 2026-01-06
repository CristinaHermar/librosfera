import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Mail, Linkedin, Phone } from 'lucide-react';

const ContactSection = () => {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-foreground text-background relative overflow-hidden">
      {/* Decorative circle */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-primary/20 -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
            {t.contact.title}
          </h2>
          <p className="text-background/70 text-lg mb-10">
            {t.contact.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="contact" size="lg" asChild>
              <a href="mailto:cristina.hermar@gmail.com">
                <Mail className="mr-2 w-5 h-5" />
                {t.contact.cta}
              </a>
            </Button>
            
            <Button variant="contactOutline" size="lg" asChild>
              <a href="https://www.linkedin.com/in/cristina-hermar" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 w-5 h-5" />
                LinkedIn
              </a>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-background/60 text-sm">
            <a href="mailto:cristina.hermar@gmail.com" className="hover:text-background transition-colors">
              cristina.hermar@gmail.com
            </a>
            <span>•</span>
            <a href="tel:+525588068950" className="hover:text-background transition-colors">
              +52 55 8806 8950
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
