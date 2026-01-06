import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const AboutSection = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, title: t.about.tabs.clarity.title, content: t.about.tabs.clarity.content },
    { id: 1, title: t.about.tabs.thinking.title, content: t.about.tabs.thinking.content },
    { id: 2, title: t.about.tabs.technical.title, content: t.about.tabs.technical.content },
  ];

  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
          {t.about.title}
        </h2>

        {/* Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(index)}
              className={`p-6 rounded-xl text-left transition-all duration-300 border ${
                activeTab === index
                  ? 'bg-accent border-accent-foreground/20 shadow-lg'
                  : 'bg-background border-border hover:border-primary/30'
              }`}
            >
              <span className="text-xs text-muted-foreground mb-2 block">
                0{index + 1}
              </span>
              <h3 className="font-semibold leading-snug">{tab.title}</h3>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-3xl space-y-6">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`transition-all duration-500 ${
                activeTab === index ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <p className="text-lg leading-relaxed">
                <span className="font-semibold">{tab.title}</span>{' '}
                {tab.content}
              </p>
            </div>
          ))}

          <div className="mt-8 p-6 bg-accent/50 rounded-xl border-l-4 border-primary">
            <p className="text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4">
                {t.about.tabs.technical.title.split(',')[0]}:
              </span>{' '}
              {t.about.tabs.technical.content}
            </p>
          </div>

          <p className="text-muted-foreground leading-relaxed mt-6">
            {t.about.practice}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
