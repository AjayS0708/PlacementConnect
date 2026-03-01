'use client';

import { CSSProperties, useEffect, useMemo, useState } from 'react';
import { ResumeManager } from '@/features/resume-builder/components/ResumeManager';
import {
  computeAtsV1,
  computeTopImprovements,
  createEmptyResumeData,
  getAllSkills,
  hasAnyPreviewContent,
  hasNumericIndicator,
  loadResumeAccent,
  loadResumeData,
  loadResumeTemplate,
  RESUME_ACCENTS,
  RESUME_TEMPLATES,
  saveResumeAccent,
  saveResumeData,
  saveResumeTemplate,
  splitBullets,
  splitDescriptionPoints,
  startsWithActionVerb,
  type ResumeAccentKey,
  type ResumeBuilderData,
  type ResumeTemplate
} from '@/features/resume-builder/lib/resumeData';

const sampleData = (): ResumeBuilderData => ({
  personal: {
    name: 'Alex Carter',
    email: 'alex.carter@email.com',
    phone: '+1 (555) 100-2000',
    location: 'Austin, TX'
  },
  summary:
    'Product-focused software engineer with experience building full-stack applications, improving developer workflows, and shipping user-facing features with measurable outcomes across frontend and backend systems. Strong in React, TypeScript, Node.js, and API design with a focus on reliable delivery and clean architecture.',
  education: [{ school: 'State University', degree: 'B.S. Computer Science', year: '2024' }],
  experience: [
    {
      company: 'Nexa Labs',
      role: 'Software Engineer',
      duration: '2024 - Present',
      highlights: 'Improved page load speed by 32% across core workflows.\nReduced incident count by 18% using release guardrails.'
    }
  ],
  projects: [
    {
      title: 'Portfolio Platform',
      description: 'Built modular web experience for client showcases and content operations.',
      techStack: ['React', 'TypeScript'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/example/portfolio',
      highlights: 'Improved engagement by 24%'
    }
  ],
  skillsByCategory: {
    technical: ['React', 'TypeScript', 'Node.js'],
    soft: ['Problem Solving'],
    tools: ['Git']
  },
  skills: '',
  github: 'https://github.com/example',
  linkedin: 'https://linkedin.com/in/example'
});

type SkillCategoryKey = 'technical' | 'soft' | 'tools';

const CATEGORY_META: Array<{ key: SkillCategoryKey; label: string }> = [
  { key: 'technical', label: 'Technical Skills' },
  { key: 'soft', label: 'Soft Skills' },
  { key: 'tools', label: 'Tools & Technologies' }
];

const TEMPLATE_LABELS: Record<ResumeTemplate, string> = {
  classic: 'Classic',
  modern: 'Modern',
  minimal: 'Minimal'
};

const updateListItem = <T,>(items: T[], index: number, next: T): T[] =>
  items.map((item, i) => (i === index ? next : item));

const isEducationVisible = (entry: ResumeBuilderData['education'][number]): boolean =>
  [entry.school, entry.degree, entry.year].some((value) => value.trim().length > 0);

const isExperienceVisible = (entry: ResumeBuilderData['experience'][number]): boolean =>
  [entry.company, entry.role, entry.duration, entry.highlights].some((value) => value.trim().length > 0);

const isProjectVisible = (entry: ResumeBuilderData['projects'][number]): boolean =>
  [entry.title, entry.description, entry.liveUrl, entry.githubUrl, entry.highlights].some((value) => value.trim().length > 0) || entry.techStack.length > 0;

const scoreTone = (score: number): 'low' | 'mid' | 'high' => {
  if (score < 40) {
    return 'low';
  }
  if (score < 75) {
    return 'mid';
  }
  return 'high';
};

const projectGuidance = (description: string): { needsVerb: boolean; needsNumber: boolean } | null => {
  const text = description.trim();
  if (!text) {
    return null;
  }
  const needsVerb = !startsWithActionVerb(text);
  const needsNumber = !hasNumericIndicator(text);
  if (!needsVerb && !needsNumber) {
    return null;
  }
  return { needsVerb, needsNumber };
};

const uniquePush = (arr: string[], value: string): string[] => {
  const normalized = value.trim();
  if (!normalized) {
    return arr;
  }
  if (arr.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
    return arr;
  }
  return [...arr, normalized];
};

const getTemplateStyle = (accentHsl: string): CSSProperties => ({
  ['--resume-accent' as string]: accentHsl
});

export default function BuilderPage() {
  const [data, setData] = useState<ResumeBuilderData>(() => {
    if (typeof window === 'undefined') {
      return createEmptyResumeData();
    }
    return loadResumeData();
  });
  const [template, setTemplate] = useState<ResumeTemplate>(() => {
    if (typeof window === 'undefined') {
      return 'classic';
    }
    return loadResumeTemplate();
  });
  const [accent, setAccent] = useState<ResumeAccentKey>(() => {
    if (typeof window === 'undefined') {
      return 'teal';
    }
    return loadResumeAccent();
  });
  const [skillDrafts, setSkillDrafts] = useState<Record<SkillCategoryKey, string>>({
    technical: '',
    soft: '',
    tools: ''
  });
  const [projectTechDrafts, setProjectTechDrafts] = useState<Record<number, string>>({});
  const [skillSuggestLoading, setSkillSuggestLoading] = useState<boolean>(false);
  const [openProjects, setOpenProjects] = useState<number[]>([0]);

  useEffect(() => {
    saveResumeData(data);
  }, [data]);

  useEffect(() => {
    saveResumeTemplate(template);
  }, [template]);

  useEffect(() => {
    saveResumeAccent(accent);
  }, [accent]);

  const accentTheme = RESUME_ACCENTS.find((item) => item.key === accent) ?? RESUME_ACCENTS[0];
  const skillsList = useMemo(() => getAllSkills(data), [data]);
  const ats = useMemo(() => computeAtsV1(data), [data]);
  const topImprovements = useMemo(() => computeTopImprovements(data), [data]);
  const previewHasContent = useMemo(() => hasAnyPreviewContent(data), [data]);

  const visibleEducation = useMemo(() => data.education.filter(isEducationVisible), [data.education]);
  const visibleExperience = useMemo(() => data.experience.filter(isExperienceVisible), [data.experience]);
  const visibleProjects = useMemo(() => data.projects.filter(isProjectVisible), [data.projects]);

  const clearEducationEntry = (index: number) => {
    setData({ ...data, education: updateListItem(data.education, index, { school: '', degree: '', year: '' }) });
  };

  const deleteEducationEntry = (index: number) => {
    if (data.education.length === 1) {
      clearEducationEntry(index);
      return;
    }
    setData({ ...data, education: data.education.filter((_, i) => i !== index) });
  };

  const clearExperienceEntry = (index: number) => {
    setData({
      ...data,
      experience: updateListItem(data.experience, index, { company: '', role: '', duration: '', highlights: '' })
    });
  };

  const deleteExperienceEntry = (index: number) => {
    if (data.experience.length === 1) {
      clearExperienceEntry(index);
      return;
    }
    setData({ ...data, experience: data.experience.filter((_, i) => i !== index) });
  };

  const clearProjectEntry = (index: number) => {
    setData({
      ...data,
      projects: updateListItem(data.projects, index, {
        title: '',
        description: '',
        techStack: [],
        liveUrl: '',
        githubUrl: '',
        highlights: ''
      })
    });
  };

  const deleteProjectEntry = (index: number) => {
    if (data.projects.length === 1) {
      clearProjectEntry(index);
      return;
    }
    setData({ ...data, projects: data.projects.filter((_, i) => i !== index) });
    setProjectTechDrafts((prev) => {
      const next: Record<number, string> = {};
      Object.keys(prev).forEach((key) => {
        const current = Number(key);
        if (current < index) {
          next[current] = prev[current] ?? '';
        }
        if (current > index) {
          next[current - 1] = prev[current] ?? '';
        }
      });
      return next;
    });
    setOpenProjects((prev) => prev.filter((i) => i !== index).map((i) => (i > index ? i - 1 : i)));
  };

  const addSkill = (category: SkillCategoryKey, rawSkill: string) => {
    const skill = rawSkill.trim();
    if (!skill) {
      return;
    }
    setData({
      ...data,
      skillsByCategory: {
        ...data.skillsByCategory,
        [category]: uniquePush(data.skillsByCategory[category], skill)
      }
    });
    setSkillDrafts({ ...skillDrafts, [category]: '' });
  };

  const removeSkill = (category: SkillCategoryKey, skill: string) => {
    setData({
      ...data,
      skillsByCategory: {
        ...data.skillsByCategory,
        [category]: data.skillsByCategory[category].filter((item) => item !== skill)
      }
    });
  };

  const addProjectTech = (index: number, rawTech: string) => {
    const tech = rawTech.trim();
    if (!tech) {
      return;
    }
    const entry = data.projects[index];
    setData({
      ...data,
      projects: updateListItem(data.projects, index, {
        ...entry,
        techStack: uniquePush(entry.techStack, tech)
      })
    });
    setProjectTechDrafts({ ...projectTechDrafts, [index]: '' });
  };

  const removeProjectTech = (index: number, tech: string) => {
    const entry = data.projects[index];
    setData({
      ...data,
      projects: updateListItem(data.projects, index, {
        ...entry,
        techStack: entry.techStack.filter((item) => item !== tech)
      })
    });
  };

  const toggleProject = (index: number) => {
    setOpenProjects((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const addProjectEntry = () => {
    const nextIndex = data.projects.length;
    setData({
      ...data,
      projects: [...data.projects, { title: '', description: '', techStack: [], liveUrl: '', githubUrl: '', highlights: '' }]
    });
    setOpenProjects((prev) => [...prev, nextIndex]);
  };

  const renderCommonMainContent = () => (
    <>
      {data.summary.trim().length > 0 && (
        <section className="resume-section-enhanced">
          <h2 className="section-heading">
            <span className="section-heading-line"></span>
            <span className="section-heading-text">Professional Summary</span>
            <span className="section-heading-line"></span>
          </h2>
          <p className="summary-text">{data.summary}</p>
        </section>
      )}

      {visibleEducation.length > 0 && (
        <section className="resume-section-enhanced">
          <h2 className="section-heading">
            <span className="section-heading-line"></span>
            <span className="section-heading-text">Education</span>
            <span className="section-heading-line"></span>
          </h2>
          <div className="section-content">
            {visibleEducation.map((entry, index) => (
              <div key={`prev-edu-${index}`} className="education-entry">
                <div className="entry-header">
                  <div className="entry-left">
                    {entry.degree.trim() && <h3 className="entry-title">{entry.degree.trim()}</h3>}
                    {entry.school.trim() && <p className="entry-subtitle">{entry.school.trim()}</p>}
                  </div>
                  {entry.year.trim() && <span className="entry-year">{entry.year.trim()}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {visibleExperience.length > 0 && (
        <section className="resume-section-enhanced">
          <h2 className="section-heading">
            <span className="section-heading-line"></span>
            <span className="section-heading-text">Professional Experience</span>
            <span className="section-heading-line"></span>
          </h2>
          <div className="section-content">
            {visibleExperience.map((entry, index) => (
              <div key={`prev-exp-${index}`} className="experience-entry">
                <div className="entry-header">
                  <div className="entry-left">
                    {entry.role.trim() && <h3 className="entry-title">{entry.role.trim()}</h3>}
                    <div className="entry-meta">
                      {entry.company.trim() && <span className="entry-company">{entry.company.trim()}</span>}
                      {entry.duration.trim() && <span className="entry-duration">{entry.duration.trim()}</span>}
                    </div>
                  </div>
                </div>
                {splitBullets(entry.highlights).length > 0 && (
                  <ul className="entry-bullets">
                    {splitBullets(entry.highlights).map((line, lineIndex) => (
                      <li key={`${index}-${lineIndex}`}>{line}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {visibleProjects.length > 0 && (
        <section className="resume-section-enhanced">
          <h2 className="section-heading">
            <span className="section-heading-line"></span>
            <span className="section-heading-text">Projects</span>
            <span className="section-heading-line"></span>
          </h2>
          <div className="section-content">
            {visibleProjects.map((entry, index) => (
              <article key={`prev-proj-${index}`} className="project-entry">
                <div className="entry-header">
                  {entry.title.trim().length > 0 && <h3 className="entry-title">{entry.title.trim()}</h3>}
                  <div className="project-links-inline">
                    {entry.liveUrl.trim().length > 0 && (
                      <a href={entry.liveUrl.trim()} target="_blank" rel="noreferrer" className="project-link-badge">
                        <svg className="link-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    )}
                    {entry.githubUrl.trim().length > 0 && (
                      <a href={entry.githubUrl.trim()} target="_blank" rel="noreferrer" className="project-link-badge">
                        <svg className="link-icon" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
                {entry.description.trim().length > 0 && (
                  <p className="project-description">{entry.description.trim()}</p>
                )}
                {entry.techStack.length > 0 && (
                  <div className="tech-stack-row">
                    {entry.techStack.map((tech) => (
                      <span key={`${entry.title}-${tech}`} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );

  const renderSkillsGrouped = () => (
    <section className="resume-section-enhanced">
      <h2 className="section-heading">
        <span className="section-heading-line"></span>
        <span className="section-heading-text">Skills & Expertise</span>
        <span className="section-heading-line"></span>
      </h2>
      <div className="section-content">
        {CATEGORY_META.map((meta) => (
          <div key={`preview-${meta.key}`} className="skills-category-preview">
            {data.skillsByCategory[meta.key].length > 0 && (
              <>
                <h4 className="skills-category-heading">{meta.label}</h4>
                <div className="skills-badges">
                  {data.skillsByCategory[meta.key].map((skill) => (
                    <span key={`preview-${meta.key}-${skill}`} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );

  const renderClassicOrMinimal = () => (
    <>
      {(data.personal.name || data.personal.email || data.personal.phone || data.personal.location) && (
        <header className="resume-header-enhanced">
          {data.personal.name && <h1 className="resume-name">{data.personal.name}</h1>}
          <div className="contact-bar">
            {data.personal.email && (
              <span className="contact-item">
                <svg className="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {data.personal.email.trim()}
              </span>
            )}
            {data.personal.phone && (
              <span className="contact-item">
                <svg className="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {data.personal.phone.trim()}
              </span>
            )}
            {data.personal.location && (
              <span className="contact-item">
                <svg className="contact-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {data.personal.location.trim()}
              </span>
            )}
          </div>
          {(data.github.trim().length > 0 || data.linkedin.trim().length > 0) && (
            <div className="social-links-bar">
              {data.github.trim().length > 0 && (
                <a href={data.github.trim()} target="_blank" rel="noreferrer" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  {data.github.trim().replace(/https?:\/\/(www\.)?/, '')}
                </a>
              )}
              {data.linkedin.trim().length > 0 && (
                <a href={data.linkedin.trim()} target="_blank" rel="noreferrer" className="social-link">
                  <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  {data.linkedin.trim().replace(/https?:\/\/(www\.)?/, '')}
                </a>
              )}
            </div>
          )}
        </header>
      )}

      {renderCommonMainContent()}

      {skillsList.length > 0 && renderSkillsGrouped()}
    </>
  );

  const renderModern = () => (
    <div className="modern-layout-enhanced">
      <aside className="modern-sidebar-enhanced">
        {data.personal.name && <h1 className="sidebar-name">{data.personal.name}</h1>}
        
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h4 className="sidebar-title">Contact</h4>
          </div>
          <div className="sidebar-content">
            {data.personal.email.trim().length > 0 && (
              <div className="sidebar-item">
                <svg className="sidebar-item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{data.personal.email.trim()}</span>
              </div>
            )}
            {data.personal.phone.trim().length > 0 && (
              <div className="sidebar-item">
                <svg className="sidebar-item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{data.personal.phone.trim()}</span>
              </div>
            )}
            {data.personal.location.trim().length > 0 && (
              <div className="sidebar-item">
                <svg className="sidebar-item-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{data.personal.location.trim()}</span>
              </div>
            )}
          </div>
        </div>

        {skillsList.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h4 className="sidebar-title">Skills</h4>
            </div>
            <div className="sidebar-content">
              {CATEGORY_META.map((meta) => (
                <div key={`sidebar-${meta.key}`} className="sidebar-skill-group">
                  {data.skillsByCategory[meta.key].length > 0 && (
                    <>
                      <p className="skill-category-label">{meta.label}</p>
                      <div className="sidebar-chips">
                        {data.skillsByCategory[meta.key].map((skill) => (
                          <span key={`sidebar-${meta.key}-${skill}`} className="sidebar-chip">{skill}</span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {(data.github.trim().length > 0 || data.linkedin.trim().length > 0) && (
          <div className="sidebar-section">
            <div className="sidebar-section-header">
              <svg className="sidebar-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h4 className="sidebar-title">Links</h4>
            </div>
            <div className="sidebar-content">
              {data.github.trim().length > 0 && (
                <a href={data.github.trim()} target="_blank" rel="noreferrer" className="sidebar-link">
                  <svg className="sidebar-link-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              )}
              {data.linkedin.trim().length > 0 && (
                <a href={data.linkedin.trim()} target="_blank" rel="noreferrer" className="sidebar-link">
                  <svg className="sidebar-link-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        )}
      </aside>
      <section className="modern-main-enhanced">{renderCommonMainContent()}</section>
    </div>
  );

  return (
    <main className="page page-builder">
      <section className="builder-grid">
        <section className="builder-form-card">
          {/* Modern Header with Gradient */}
          <div className="modern-builder-header">
            <div className="header-content">
              <div className="header-title-group">
                <div className="title-icon-wrapper">
                  <svg className="title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="modern-title">Resume Builder</h1>
                  <p className="modern-subtitle">Create your professional resume in minutes</p>
                </div>
              </div>
              <div className="header-actions">
                <ResumeManager onResumeChange={(resume) => {
                  setData(resume.data);
                  setTemplate(resume.template as ResumeTemplate);
                  setAccent(resume.accent as ResumeAccentKey);
                }} />
                <button type="button" className="modern-btn modern-btn-secondary" onClick={() => setData(sampleData())}>
                  <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Load Sample
                </button>
                <button type="button" className="modern-btn modern-btn-ghost" onClick={() => setData(createEmptyResumeData())}>
                  <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Modern ATS Card */}
          <section className="modern-ats-card" aria-live="polite">
            <div className="ats-header-modern">
              <div className="ats-icon-wrapper">
                <svg className="ats-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ats-title-group">
                <h2 className="ats-title-modern">ATS Readiness Score</h2>
                <p className="ats-desc">Optimize for applicant tracking systems</p>
              </div>
              <div className="ats-score-badge">
                <span className="score-number">{ats.score}</span>
                <span className="score-max">/100</span>
              </div>
            </div>
            
            <div className="ats-meter-modern" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={ats.score}>
              <div className={`ats-fill-modern ${scoreTone(ats.score)}`} style={{ width: `${ats.score}%` }}>
                <div className="ats-fill-shine" />
              </div>
            </div>

            {ats.suggestions.length > 0 && (
              <div className="ats-section-modern">
                <h3 className="ats-section-title">
                  <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Suggestions
                </h3>
                <ul className="ats-list-modern">
                  {ats.suggestions.map((item) => (
                    <li key={item}>
                      <svg className="list-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {topImprovements.length > 0 && (
              <div className="ats-section-modern">
                <h3 className="ats-section-title">
                  <svg className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Top Improvements
                </h3>
                <ul className="ats-list-modern">
                  {topImprovements.map((item) => (
                    <li key={item}>
                      <svg className="list-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ats.suggestions.length === 0 && topImprovements.length === 0 && (
              <div className="ats-success-message">
                <svg className="success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Excellent! Your resume is optimized for ATS systems.</p>
              </div>
            )}
          </section>

          {/* Modern Form Section */}
          <div className="modern-form-section">
            <div className="form-section-header">
              <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h2 className="form-section-title">Personal Information</h2>
            </div>
            <div className="modern-form-grid">
              <div className="modern-input-group">
                <label className="modern-label">Full Name</label>
                <input
                  className="modern-input"
                  placeholder="John Doe"
                  value={data.personal.name}
                  onChange={(e) => setData({ ...data, personal: { ...data.personal, name: e.target.value } })}
                />
              </div>
              <div className="modern-input-group">
                <label className="modern-label">Email Address</label>
                <input
                  className="modern-input"
                  type="email"
                  placeholder="john@example.com"
                  value={data.personal.email}
                  onChange={(e) => setData({ ...data, personal: { ...data.personal, email: e.target.value } })}
                />
              </div>
              <div className="modern-input-group">
                <label className="modern-label">Phone Number</label>
                <input
                  className="modern-input"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={data.personal.phone}
                  onChange={(e) => setData({ ...data, personal: { ...data.personal, phone: e.target.value } })}
                />
              </div>
              <div className="modern-input-group">
                <label className="modern-label">Location</label>
                <input
                  className="modern-input"
                  placeholder="City, State"
                  value={data.personal.location}
                  onChange={(e) => setData({ ...data, personal: { ...data.personal, location: e.target.value } })}
                />
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="modern-form-section">
            <div className="form-section-header">
              <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="form-section-title">Professional Summary</h2>
            </div>
            <div className="modern-input-group">
              <label className="modern-label">Highlight your key achievements and skills</label>
              <textarea
                className="modern-textarea"
                placeholder="Write a compelling summary that showcases your expertise..."
                rows={4}
                value={data.summary}
                onChange={(e) => setData({ ...data, summary: e.target.value })}
              />
            </div>
          </div>

          {/* Modern Education Section */}
          <div className="modern-form-section">
            <div className="form-section-header">
              <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              <h2 className="form-section-title">Education</h2>
            </div>

            {data.education.map((entry, index) => (
              <div key={`edu-${index}`} className="modern-entry-card">
                <div className="entry-card-header">
                  <span className="entry-number">Entry {index + 1}</span>
                  <button 
                    type="button" 
                    className="entry-delete-btn" 
                    onClick={() => deleteEducationEntry(index)}
                    title="Delete entry"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="modern-form-grid">
                  <div className="modern-input-group">
                    <label className="modern-label">School/University</label>
                    <input
                      className="modern-input"
                      placeholder="e.g., Stanford University"
                      value={entry.school}
                      onChange={(e) =>
                        setData({
                          ...data,
                          education: updateListItem(data.education, index, { ...entry, school: e.target.value })
                        })
                      }
                    />
                  </div>
                  <div className="modern-input-group">
                    <label className="modern-label">Degree & Major</label>
                    <input
                      className="modern-input"
                      placeholder="e.g., Bachelor of Science in Computer Science"
                      value={entry.degree}
                      onChange={(e) =>
                        setData({
                          ...data,
                          education: updateListItem(data.education, index, { ...entry, degree: e.target.value })
                        })
                      }
                    />
                  </div>
                  <div className="modern-input-group">
                    <label className="modern-label">Graduation Year</label>
                    <input
                      className="modern-input"
                      placeholder="e.g., 2024"
                      value={entry.year}
                      onChange={(e) =>
                        setData({
                          ...data,
                          education: updateListItem(data.education, index, { ...entry, year: e.target.value })
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button
              type="button"
              className="modern-btn modern-btn-secondary"
              onClick={() => setData({ ...data, education: [...data.education, { school: '', degree: '', year: '' }] })}
            >
              <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Education
            </button>
          </div>

          {/* Modern Experience Section */}
          <div className="modern-form-section">
            <div className="form-section-header">
              <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <h2 className="form-section-title">Work Experience</h2>
            </div>

            {data.experience.map((entry, index) => {
              const guidanceItems = splitBullets(entry.highlights)
                .map((line) => ({ line, needsVerb: !startsWithActionVerb(line), needsNumber: !hasNumericIndicator(line) }))
                .filter((item) => item.needsVerb || item.needsNumber);
              return (
                <div key={`exp-${index}`} className="modern-entry-card">
                  <div className="entry-card-header">
                    <span className="entry-number">Experience {index + 1}</span>
                    <button 
                      type="button" 
                      className="entry-delete-btn" 
                      onClick={() => deleteExperienceEntry(index)}
                      title="Delete entry"
                    >
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="modern-form-grid">
                    <div className="modern-input-group">
                      <label className="modern-label">Company Name</label>
                      <input
                        className="modern-input"
                        placeholder="e.g., Google Inc."
                        value={entry.company}
                        onChange={(e) =>
                          setData({
                            ...data,
                            experience: updateListItem(data.experience, index, { ...entry, company: e.target.value })
                          })
                        }
                      />
                    </div>
                    <div className="modern-input-group">
                      <label className="modern-label">Job Title</label>
                      <input
                        className="modern-input"
                        placeholder="e.g., Senior Software Engineer"
                        value={entry.role}
                        onChange={(e) =>
                          setData({
                            ...data,
                            experience: updateListItem(data.experience, index, { ...entry, role: e.target.value })
                          })
                        }
                      />
                    </div>
                    <div className="modern-input-group">
                      <label className="modern-label">Duration</label>
                      <input
                        className="modern-input"
                        placeholder="e.g., Jan 2020 - Present"
                        value={entry.duration}
                        onChange={(e) =>
                          setData({
                            ...data,
                            experience: updateListItem(data.experience, index, { ...entry, duration: e.target.value })
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="modern-input-group">
                    <label className="modern-label">Key Achievements (one per line)</label>
                    <textarea
                      className="modern-textarea"
                      placeholder="• Led team of 5 engineers to deliver product on time&#10;• Improved performance by 40% through optimization&#10;• Mentored junior developers"
                      rows={5}
                      value={entry.highlights}
                      onChange={(e) =>
                        setData({
                          ...data,
                          experience: updateListItem(data.experience, index, { ...entry, highlights: e.target.value })
                        })
                      }
                    />
                  </div>
                  {guidanceItems.length > 0 && (
                    <div className="modern-guidance-card">
                      <div className="guidance-header">
                        <svg className="guidance-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Suggestions to improve your bullets</span>
                      </div>
                      <ul className="guidance-list">
                        {guidanceItems.map((item, bulletIndex) => (
                          <li key={`${index}-exp-${bulletIndex}`}>
                            <span className="guidance-bullet">"{item.line}"</span>
                            <div className="guidance-tips">
                              {item.needsVerb && <span>→ Start with a strong action verb</span>}
                              {item.needsNumber && <span>→ Add measurable impact (numbers/metrics)</span>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
            
            <button
              type="button"
              className="modern-btn modern-btn-secondary"
              onClick={() =>
                setData({
                  ...data,
                  experience: [...data.experience, { company: '', role: '', duration: '', highlights: '' }]
                })
              }
            >
              <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Experience
            </button>
          </div>

          {/* Modern Skills Section */}
          <div className="modern-form-section">
            <div className="form-section-header">
              <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h2 className="form-section-title">Skills</h2>
              <button
                type="button"
                className="suggest-btn"
                onClick={() => {
                  if (skillSuggestLoading) {
                    return;
                  }
                  setSkillSuggestLoading(true);
                  window.setTimeout(() => {
                    setData((prev) => ({
                      ...prev,
                      skillsByCategory: {
                        technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'].reduce(
                          (acc, skill) => uniquePush(acc, skill),
                          prev.skillsByCategory.technical
                        ),
                        soft: ['Team Leadership', 'Problem Solving'].reduce(
                          (acc, skill) => uniquePush(acc, skill),
                          prev.skillsByCategory.soft
                        ),
                        tools: ['Git', 'Docker', 'AWS'].reduce(
                          (acc, skill) => uniquePush(acc, skill),
                          prev.skillsByCategory.tools
                        )
                      }
                    }));
                    setSkillSuggestLoading(false);
                  }, 1000);
                }}
              >
                <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {skillSuggestLoading ? 'Suggesting...' : 'Suggest Skills'}
              </button>
            </div>

            {CATEGORY_META.map((meta) => (
              <div key={meta.key} className="modern-skill-category">
                <div className="skill-category-header">
                  <h3 className="skill-category-title">{meta.label}</h3>
                  <span className="skill-count-badge">{data.skillsByCategory[meta.key].length}</span>
                </div>
                <div className="modern-chip-container">
                  {data.skillsByCategory[meta.key].map((skill) => (
                    <span key={`${meta.key}-${skill}`} className="modern-chip">
                      {skill}
                      <button 
                        type="button" 
                        className="chip-remove-btn" 
                        onClick={() => removeSkill(meta.key, skill)}
                        title="Remove skill"
                      >
                        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="modern-input-group">
                  <input
                    className="modern-input"
                    placeholder={`Add ${meta.label.toLowerCase()} (press Enter)`}
                    value={skillDrafts[meta.key]}
                    onChange={(e) => setSkillDrafts({ ...skillDrafts, [meta.key]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill(meta.key, skillDrafts[meta.key]);
                      }
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Modern Projects Section */}
          <div className="modern-form-section">
            <div className="form-section-header">
              <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h2 className="form-section-title">Projects</h2>
            </div>

            {data.projects.map((entry, index) => {
              const isOpen = openProjects.includes(index);
              const guidance = projectGuidance(entry.description);
              return (
                <div key={`proj-${index}`} className="modern-project-card">
                  <button 
                    type="button" 
                    className="project-card-toggle" 
                    onClick={() => toggleProject(index)}
                  >
                    <div className="project-toggle-left">
                      <svg className="project-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      <span className="project-title-display">
                        {entry.title.trim().length > 0 ? entry.title.trim() : `Project ${index + 1}`}
                      </span>
                    </div>
                    <svg 
                      className={`project-chevron ${isOpen ? 'open' : ''}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="project-card-content">
                      <div className="modern-input-group">
                        <label className="modern-label">Project Title</label>
                        <input
                          className="modern-input"
                          placeholder="e.g., E-commerce Platform with Real-time Chat"
                          value={entry.title}
                          onChange={(e) =>
                            setData({
                              ...data,
                              projects: updateListItem(data.projects, index, { ...entry, title: e.target.value })
                            })
                          }
                        />
                      </div>

                      <div className="modern-input-group">
                        <label className="modern-label">Project Description</label>
                        <textarea
                          className="modern-textarea"
                          placeholder="Describe what you built and the impact it had..."
                          maxLength={200}
                          rows={3}
                          value={entry.description}
                          onChange={(e) =>
                            setData({
                              ...data,
                              projects: updateListItem(data.projects, index, {
                                ...entry,
                                description: e.target.value.slice(0, 200)
                              })
                            })
                          }
                        />
                        <div className="char-counter">{entry.description.length}/200</div>
                      </div>

                      {guidance && (
                        <div className="modern-guidance-card">
                          <div className="guidance-header">
                            <svg className="guidance-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Tips to improve description</span>
                          </div>
                          <ul className="guidance-list">
                            {guidance.needsVerb && <li>→ Start with a strong action verb</li>}
                            {guidance.needsNumber && <li>→ Add measurable impact (numbers/metrics)</li>}
                          </ul>
                        </div>
                      )}

                      <div className="modern-input-group">
                        <label className="modern-label">Tech Stack</label>
                        <div className="modern-chip-container">
                          {entry.techStack.map((tech) => (
                            <span key={`${index}-${tech}`} className="modern-chip">
                              {tech}
                              <button 
                                type="button" 
                                className="chip-remove-btn" 
                                onClick={() => removeProjectTech(index, tech)}
                                title="Remove tech"
                              >
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          className="modern-input"
                          placeholder="Add technology (press Enter)"
                          value={projectTechDrafts[index] ?? ''}
                          onChange={(e) => setProjectTechDrafts({ ...projectTechDrafts, [index]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addProjectTech(index, projectTechDrafts[index] ?? '');
                            }
                          }}
                        />
                      </div>

                      <div className="modern-form-grid">
                        <div className="modern-input-group">
                          <label className="modern-label">Live URL (optional)</label>
                          <input
                            className="modern-input"
                            placeholder="https://example.com"
                            value={entry.liveUrl}
                            onChange={(e) =>
                              setData({
                                ...data,
                                projects: updateListItem(data.projects, index, { ...entry, liveUrl: e.target.value })
                              })
                            }
                          />
                        </div>
                        <div className="modern-input-group">
                          <label className="modern-label">GitHub URL (optional)</label>
                          <input
                            className="modern-input"
                            placeholder="https://github.com/username/repo"
                            value={entry.githubUrl}
                            onChange={(e) =>
                              setData({
                                ...data,
                                projects: updateListItem(data.projects, index, { ...entry, githubUrl: e.target.value })
                              })
                            }
                          />
                        </div>
                      </div>

                      <button 
                        type="button" 
                        className="modern-btn modern-btn-danger" 
                        onClick={() => deleteProjectEntry(index)}
                      >
                        <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
            
            <button
              type="button"
              className="modern-btn modern-btn-secondary"
              onClick={addProjectEntry}
            >
              <svg className="btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </button>
          </div>

          {/* Modern Links Section */}
          <div className="modern-form-section">
            <div className="form-section-header">
              <svg className="section-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <h2 className="form-section-title">Professional Links</h2>
            </div>
            
            <div className="modern-form-grid">
              <div className="modern-input-group">
                <label className="modern-label">
                  <svg className="label-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub Profile
                </label>
                <input
                  className="modern-input"
                  placeholder="https://github.com/username"
                  value={data.github}
                  onChange={(e) => setData({ ...data, github: e.target.value })}
                />
              </div>
              <div className="modern-input-group">
                <label className="modern-label">
                  <svg className="label-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn Profile
                </label>
                <input
                  className="modern-input"
                  placeholder="https://linkedin.com/in/username"
                  value={data.linkedin}
                  onChange={(e) => setData({ ...data, linkedin: e.target.value })}
                />
              </div>
            </div>
          </div>
        </section>

        <aside className="builder-preview-card">
          {/* Modern Preview Header */}
          <div className="modern-preview-header">
            <div className="preview-header-content">
              <svg className="preview-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <div>
                <h2 className="preview-title">Live Preview</h2>
                <p className="preview-subtitle">Real-time resume updates</p>
              </div>
            </div>
          </div>

          {/* Modern Template Picker */}
          <div className="modern-template-section">
            <label className="template-section-label">Choose Template</label>
            <div className="modern-template-picker" aria-label="Template picker">
            {RESUME_TEMPLATES.map((item) => (
              <button
                key={item}
                type="button"
                className={item === template ? 'modern-template-btn active' : 'modern-template-btn'}
                onClick={() => setTemplate(item)}
              >
                <span className="template-label-modern">{TEMPLATE_LABELS[item]}</span>
                <span className={`template-preview template-preview-${item}`}>
                  <span />
                  <span />
                  <span />
                </span>
                {item === template && (
                  <span className="template-check-badge">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
          </div>

          {/* Modern Color Picker */}
          <div className="modern-color-section">
            <label className="template-section-label">Accent Color</label>
            <div className="modern-color-picker" aria-label="Accent color picker">
              {RESUME_ACCENTS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={item.key === accent ? 'modern-color-btn active' : 'modern-color-btn'}
                  style={{ background: item.hsl }}
                  title={item.label}
                  onClick={() => setAccent(item.key)}
                >
                  {item.key === accent && (
                    <svg className="color-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Resume Preview */}
          <div className="modern-preview-wrapper">
            <div className={`resume-shell template-${template}`} style={getTemplateStyle(accentTheme.hsl)}>
              {previewHasContent ? (
                template === 'modern' ? renderModern() : renderClassicOrMinimal()
              ) : (
                <div className="preview-empty-state">
                  <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="empty-text">Start filling the form to see your resume preview</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}




