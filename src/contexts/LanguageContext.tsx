import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface Translations {
  nav: {
    about: string;
    work: string;
    contact: string;
  };
  hero: {
    tagline: string;
    headline: string;
    description: string;
    cta: string;
  };
  about: {
    title: string;
    tabs: {
      clarity: { title: string; content: string };
      thinking: { title: string; content: string };
      technical: { title: string; content: string };
    };
    practice: string;
  };
  skills: {
    title: string;
    technical: string;
    soft: string;
  };
  experience: {
    title: string;
    present: string;
  };
  education: {
    title: string;
    inProgress: string;
  };
  contact: {
    title: string;
    subtitle: string;
    cta: string;
  };
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      about: 'About',
      work: 'Work',
      contact: 'Contact',
    },
    hero: {
      tagline: 'DATA • UX • SYSTEMS THAT MAKE SENSE',
      headline: 'I care about how things are built and how they feel in use.',
      description: 'I work at the intersection of data, UX, and systems. From messy inputs to meaningful interfaces.',
      cta: 'My work',
    },
    about: {
      title: 'How I think about data',
      tabs: {
        clarity: {
          title: "Visual clarity is not decoration — it's function.",
          content: "I design dashboards that help people understand what matters without wasting their time.",
        },
        thinking: {
          title: 'I was trained to think before I was trained to code.',
          content: "Studying philosophy shaped how I approach problems — asking better questions, structuring ideas, and looking for meaning before jumping into solutions.",
        },
        technical: {
          title: "Behind every visualization, I'm deeply involved.",
          content: "Extracting, cleaning, and transforming data in ways that are clear for the people using it and solid for the teams maintaining it.",
        },
      },
      practice: 'In practice, this means working hands-on with Python and SQL to extract, transform, and automate data in production-ready systems.',
    },
    skills: {
      title: 'Skills & Tools',
      technical: 'Technical Skills',
      soft: 'Soft Skills',
    },
    experience: {
      title: 'Professional Experience',
      present: 'Present',
    },
    education: {
      title: 'Education',
      inProgress: 'In Progress',
    },
    contact: {
      title: "Let's work together",
      subtitle: "I'm always open to discussing new projects and opportunities.",
      cta: 'Get in touch',
    },
  },
  es: {
    nav: {
      about: 'Acerca',
      work: 'Trabajo',
      contact: 'Contacto',
    },
    hero: {
      tagline: 'DATOS • UX • SISTEMAS QUE TIENEN SENTIDO',
      headline: 'Me importa cómo se construyen las cosas y cómo se sienten al usarlas.',
      description: 'Trabajo en la intersección de datos, UX y sistemas. De inputs caóticos a interfaces significativas.',
      cta: 'Mi trabajo',
    },
    about: {
      title: 'Cómo pienso sobre los datos',
      tabs: {
        clarity: {
          title: 'La claridad visual no es decoración — es función.',
          content: 'Diseño dashboards que ayudan a las personas a entender lo que importa sin perder su tiempo.',
        },
        thinking: {
          title: 'Fui entrenada para pensar antes de ser entrenada para programar.',
          content: 'Estudiar filosofía moldeó cómo abordo los problemas — haciendo mejores preguntas, estructurando ideas y buscando significado antes de saltar a soluciones.',
        },
        technical: {
          title: 'Detrás de cada visualización, estoy profundamente involucrada.',
          content: 'Extrayendo, limpiando y transformando datos de maneras que son claras para quienes los usan y sólidas para los equipos que los mantienen.',
        },
      },
      practice: 'En la práctica, esto significa trabajar directamente con Python y SQL para extraer, transformar y automatizar datos en sistemas listos para producción.',
    },
    skills: {
      title: 'Habilidades y Herramientas',
      technical: 'Habilidades Técnicas',
      soft: 'Habilidades Blandas',
    },
    experience: {
      title: 'Experiencia Profesional',
      present: 'Presente',
    },
    education: {
      title: 'Educación',
      inProgress: 'En Progreso',
    },
    contact: {
      title: 'Trabajemos juntos',
      subtitle: 'Siempre estoy abierta a discutir nuevos proyectos y oportunidades.',
      cta: 'Contáctame',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
