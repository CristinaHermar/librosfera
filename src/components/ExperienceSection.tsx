import { useLanguage } from '@/contexts/LanguageContext';

const experiences = [
  {
    company: 'PepsiCo',
    roles: [
      {
        title: 'Business Intelligence Engineer',
        period: '2025',
        description: 'Design and implement data models, dashboards, and analytics solutions to support strategic decision-making across business units.',
      },
      {
        title: 'Analytics Engineer',
        period: '2023 - 2025',
        description: 'Data Product Management in a Revenue Management Project. Developed complex SQL queries in Azure to build Gold layer, working with catalogs and conducting detailed query investigations.',
      },
    ],
  },
  {
    company: 'Wiwi',
    roles: [
      {
        title: 'Data Analyst',
        period: '2022 - 2023',
        description: 'Cleaned and analyzed large datasets using SQL and Python. Designed interactive dashboards using Streamlit and QuickSight. Developed predictive models to identify trends.',
      },
    ],
  },
  {
    company: 'Freelance',
    roles: [
      {
        title: 'Data Analysis & BI',
        period: '2022 - 2023',
        description: 'Designed dynamic dashboards in Looker Studio, QlikView, and Power BI to deliver actionable insights for diverse clients.',
      },
    ],
  },
];

const ExperienceSection = () => {
  const { t } = useLanguage();

  return (
    <section id="work" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
          {t.experience.title}
        </h2>

        <div className="space-y-12">
          {experiences.map((exp) => (
            <div key={exp.company} className="relative">
              {/* Company name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <h3 className="font-display text-2xl font-bold">{exp.company}</h3>
              </div>

              {/* Roles */}
              <div className="ml-6 border-l-2 border-border pl-8 space-y-8">
                {exp.roles.map((role) => (
                  <div
                    key={role.title}
                    className="relative group"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[calc(2rem+5px)] top-1 w-2 h-2 rounded-full bg-muted-foreground group-hover:bg-primary transition-colors" />
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                      <h4 className="font-semibold text-lg">{role.title}</h4>
                      <span className="text-sm text-muted-foreground bg-accent px-3 py-1 rounded-full w-fit">
                        {role.period.includes('2025') && !role.period.includes('-')
                          ? `2025 - ${t.experience.present}`
                          : role.period}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
