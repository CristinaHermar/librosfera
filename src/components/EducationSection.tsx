import { useLanguage } from '@/contexts/LanguageContext';

const education = [
  {
    degree: 'Full Stack Python Developer',
    institution: 'EBAC',
    period: 'In Progress',
    icon: '💻',
  },
  {
    degree: 'Master\'s Degree in Data Science',
    institution: 'Universidad Panamericana',
    period: '2020 - In Progress',
    icon: '📊',
  },
  {
    degree: 'B.A. in Philosophy',
    institution: 'Universidad Panamericana',
    period: '2011 - 2016',
    icon: '📚',
  },
];

const courses = [
  { name: 'User Interface Design', institution: 'EBAC', year: '2025' },
  { name: 'Power BI for Business Intelligence', institution: 'EBAC', year: '2025' },
  { name: 'Data Analytics', institution: 'Ironhack', year: '2021' },
];

const EducationSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
          {t.education.title}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Education */}
          <div className="space-y-6">
            {education.map((edu) => (
              <div
                key={edu.degree}
                className="p-6 rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 bg-card group"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{edu.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{edu.degree}</h3>
                    <p className="text-muted-foreground mb-2">{edu.institution}</p>
                    <span className={`text-sm px-3 py-1 rounded-full inline-block ${
                      edu.period.includes('Progress')
                        ? 'bg-primary/10 text-primary'
                        : 'bg-accent text-muted-foreground'
                    }`}>
                      {edu.period.includes('In Progress') 
                        ? edu.period.replace('In Progress', t.education.inProgress)
                        : edu.period}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Courses */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-primary">
              Courses & Certifications
            </h3>
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.name}
                  className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors duration-300"
                >
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-muted-foreground">{course.institution}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{course.year}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
