import { useLanguage } from '@/contexts/LanguageContext';

const technicalSkills = [
  { category: 'Languages', items: ['Python', 'SQL', 'JavaScript (React)', 'HTML', 'CSS'] },
  { category: 'BI Tools', items: ['Power BI', 'Tableau', 'Looker', 'QlikView'] },
  { category: 'Data Platforms', items: ['Azure', 'GCP', 'AWS', 'Teradata'] },
  { category: 'Dev Tools', items: ['VS Code', 'GitHub', 'Anaconda', 'Deepnote'] },
];

const softSkills = [
  'Continuous Learning',
  'Problem Solving',
  'Visual Creativity',
  'User Empathy',
  'Tools Adaptability',
];

const SkillsSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
          {t.skills.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Technical Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">
              {t.skills.technical}
            </h3>
            <div className="space-y-6">
              {technicalSkills.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <p className="text-sm text-muted-foreground mb-3">
                    {skillGroup.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 bg-accent rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors duration-300 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">
              {t.skills.soft}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {softSkills.map((skill, index) => (
                <div
                  key={skill}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-300"
                >
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {index + 1}
                  </span>
                  <span className="font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
