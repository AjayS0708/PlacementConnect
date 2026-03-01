/**
 * Soft Skills Assessment System
 */

export interface SoftSkill {
  id: string;
  name: string;
  description: string;
  category: 'communication' | 'leadership' | 'teamwork' | 'problemSolving' | 'adaptability' | 'timeManagement';
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  skillId: string;
  options: {
    value: number; // 1-5 scale
    label: string;
  }[];
}

export interface AssessmentAnswer {
  questionId: string;
  skillId: string;
  value: number;
}

export interface AssessmentResult {
  skillScores: Record<string, number>; // skillId -> average score (1-5)
  categoryScores: Record<string, number>; // category -> average score (1-5)
  completedAt: Date;
  answers: AssessmentAnswer[];
}

export interface SavedAssessment {
  id: string;
  result: AssessmentResult;
  createdAt: Date;
}

const SOFT_SKILLS: SoftSkill[] = [
  {
    id: 'verbal-communication',
    name: 'Verbal Communication',
    description: 'Ability to express ideas clearly and effectively in spoken form',
    category: 'communication',
  },
  {
    id: 'written-communication',
    name: 'Written Communication',
    description: 'Ability to convey information clearly in written documents',
    category: 'communication',
  },
  {
    id: 'active-listening',
    name: 'Active Listening',
    description: 'Ability to fully concentrate and understand what others are saying',
    category: 'communication',
  },
  {
    id: 'decision-making',
    name: 'Decision Making',
    description: 'Ability to make informed and timely decisions',
    category: 'leadership',
  },
  {
    id: 'delegation',
    name: 'Delegation',
    description: 'Ability to assign tasks effectively and empower team members',
    category: 'leadership',
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Ability to mediate disagreements and find solutions',
    category: 'leadership',
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    description: 'Ability to work effectively with others toward common goals',
    category: 'teamwork',
  },
  {
    id: 'empathy',
    name: 'Empathy',
    description: 'Ability to understand and share the feelings of others',
    category: 'teamwork',
  },
  {
    id: 'accountability',
    name: 'Accountability',
    description: 'Taking responsibility for your actions and commitments',
    category: 'teamwork',
  },
  {
    id: 'critical-thinking',
    name: 'Critical Thinking',
    description: 'Ability to analyze situations and think logically',
    category: 'problemSolving',
  },
  {
    id: 'creativity',
    name: 'Creativity',
    description: 'Ability to think outside the box and generate innovative ideas',
    category: 'problemSolving',
  },
  {
    id: 'analytical-skills',
    name: 'Analytical Skills',
    description: 'Ability to break down complex problems into manageable parts',
    category: 'problemSolving',
  },
  {
    id: 'flexibility',
    name: 'Flexibility',
    description: 'Ability to adjust to new conditions and changing priorities',
    category: 'adaptability',
  },
  {
    id: 'resilience',
    name: 'Resilience',
    description: 'Ability to recover quickly from difficulties',
    category: 'adaptability',
  },
  {
    id: 'learning-agility',
    name: 'Learning Agility',
    description: 'Ability to learn from experience and apply knowledge to new situations',
    category: 'adaptability',
  },
  {
    id: 'prioritization',
    name: 'Prioritization',
    description: 'Ability to identify and focus on the most important tasks',
    category: 'timeManagement',
  },
  {
    id: 'organization',
    name: 'Organization',
    description: 'Ability to keep tasks, files, and information well-structured',
    category: 'timeManagement',
  },
  {
    id: 'deadline-management',
    name: 'Deadline Management',
    description: 'Ability to complete tasks within specified timeframes',
    category: 'timeManagement',
  },
];

const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  // Communication
  {
    id: 'q1',
    question: 'When presenting ideas in meetings, I can clearly articulate my thoughts and keep the audience engaged.',
    skillId: 'verbal-communication',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q2',
    question: 'I can write clear, concise emails and documents that are easy for others to understand.',
    skillId: 'written-communication',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q3',
    question: 'When others are speaking, I give them my full attention and ask clarifying questions.',
    skillId: 'active-listening',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  // Leadership
  {
    id: 'q4',
    question: 'I can make difficult decisions quickly when needed, even with incomplete information.',
    skillId: 'decision-making',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q5',
    question: 'I trust team members with important tasks and provide them with autonomy.',
    skillId: 'delegation',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q6',
    question: 'When conflicts arise, I can mediate effectively and help find win-win solutions.',
    skillId: 'conflict-resolution',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  // Teamwork
  {
    id: 'q7',
    question: 'I actively contribute to team discussions and support my colleagues\' ideas.',
    skillId: 'collaboration',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q8',
    question: 'I can understand others\' perspectives and respond with compassion.',
    skillId: 'empathy',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q9',
    question: 'I take ownership of my work and follow through on commitments.',
    skillId: 'accountability',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  // Problem Solving
  {
    id: 'q10',
    question: 'I can analyze complex problems systematically and identify root causes.',
    skillId: 'critical-thinking',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q11',
    question: 'I can come up with innovative solutions to challenges.',
    skillId: 'creativity',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q12',
    question: 'I can break down complex problems into smaller, manageable steps.',
    skillId: 'analytical-skills',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  // Adaptability
  {
    id: 'q13',
    question: 'I adapt quickly when priorities change or unexpected challenges arise.',
    skillId: 'flexibility',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q14',
    question: 'I bounce back quickly from setbacks and stay motivated.',
    skillId: 'resilience',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q15',
    question: 'I actively seek opportunities to learn new skills and technologies.',
    skillId: 'learning-agility',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  // Time Management
  {
    id: 'q16',
    question: 'I can identify high-priority tasks and focus on them first.',
    skillId: 'prioritization',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q17',
    question: 'I keep my workspace and digital files well-organized.',
    skillId: 'organization',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
  {
    id: 'q18',
    question: 'I consistently meet deadlines without last-minute rushing.',
    skillId: 'deadline-management',
    options: [
      { value: 1, label: 'Rarely' },
      { value: 2, label: 'Sometimes' },
      { value: 3, label: 'Often' },
      { value: 4, label: 'Very Often' },
      { value: 5, label: 'Always' },
    ],
  },
];

const STORAGE_KEY = 'softSkillsAssessments';

/**
 * Get all soft skills
 */
export function getAllSoftSkills(): SoftSkill[] {
  return SOFT_SKILLS;
}

/**
 * Get all assessment questions
 */
export function getAssessmentQuestions(): AssessmentQuestion[] {
  return ASSESSMENT_QUESTIONS;
}

/**
 * Calculate assessment result from answers
 */
export function calculateAssessmentResult(answers: AssessmentAnswer[]): AssessmentResult {
  const skillScores: Record<string, number> = {};
  const skillCounts: Record<string, number> = {};
  const categoryScores: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  // Calculate average score for each skill
  answers.forEach((answer) => {
    const skill = SOFT_SKILLS.find((s) => s.id === answer.skillId);
    if (!skill) return;

    // Update skill scores
    skillScores[answer.skillId] = (skillScores[answer.skillId] || 0) + answer.value;
    skillCounts[answer.skillId] = (skillCounts[answer.skillId] || 0) + 1;

    // Update category scores
    categoryScores[skill.category] = (categoryScores[skill.category] || 0) + answer.value;
    categoryCounts[skill.category] = (categoryCounts[skill.category] || 0) + 1;
  });

  // Calculate averages
  Object.keys(skillScores).forEach((skillId) => {
    skillScores[skillId] = skillScores[skillId] / skillCounts[skillId];
  });

  Object.keys(categoryScores).forEach((category) => {
    categoryScores[category] = categoryScores[category] / categoryCounts[category];
  });

  return {
    skillScores,
    categoryScores,
    completedAt: new Date(),
    answers,
  };
}

/**
 * Save assessment result
 */
export function saveAssessmentResult(result: AssessmentResult): string {
  if (typeof window === 'undefined') return '';

  const assessments = getSavedAssessments();
  const id = `assessment_${Date.now()}`;
  const saved: SavedAssessment = {
    id,
    result,
    createdAt: new Date(),
  };

  assessments.push(saved);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));

  return id;
}

/**
 * Get all saved assessments
 */
export function getSavedAssessments(): SavedAssessment[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    return parsed.map((assessment: any) => ({
      ...assessment,
      createdAt: new Date(assessment.createdAt),
      result: {
        ...assessment.result,
        completedAt: new Date(assessment.result.completedAt),
      },
    }));
  } catch (error) {
    console.error('Failed to load assessments:', error);
    return [];
  }
}

/**
 * Get latest assessment
 */
export function getLatestAssessment(): SavedAssessment | null {
  const assessments = getSavedAssessments();
  if (assessments.length === 0) return null;

  return assessments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
}

/**
 * Get recommendations based on assessment result
 */
export function getRecommendations(result: AssessmentResult): string[] {
  const recommendations: string[] = [];
  const skillsToImprove: string[] = [];

  // Find skills with scores below 3
  Object.entries(result.skillScores).forEach(([skillId, score]) => {
    if (score < 3) {
      const skill = SOFT_SKILLS.find((s) => s.id === skillId);
      if (skill) {
        skillsToImprove.push(skill.name);
      }
    }
  });

  if (skillsToImprove.length > 0) {
    recommendations.push(`Focus on improving: ${skillsToImprove.join(', ')}`);
  }

  // Category-specific recommendations
  if (result.categoryScores.communication && result.categoryScores.communication < 3.5) {
    recommendations.push('Practice public speaking or join a toastmasters club');
    recommendations.push('Write blog posts or technical documentation to improve written communication');
  }

  if (result.categoryScores.leadership && result.categoryScores.leadership < 3.5) {
    recommendations.push('Volunteer to lead small projects or team initiatives');
    recommendations.push('Take online courses on leadership and management');
  }

  if (result.categoryScores.teamwork && result.categoryScores.teamwork < 3.5) {
    recommendations.push('Participate in group projects or hackathons');
    recommendations.push('Practice active listening in team meetings');
  }

  if (result.categoryScores.problemSolving && result.categoryScores.problemSolving < 3.5) {
    recommendations.push('Solve coding challenges on platforms like LeetCode or HackerRank');
    recommendations.push('Read case studies and analyze problem-solving approaches');
  }

  if (result.categoryScores.adaptability && result.categoryScores.adaptability < 3.5) {
    recommendations.push('Step out of your comfort zone and try new technologies');
    recommendations.push('Practice mindfulness to improve stress management');
  }

  if (result.categoryScores.timeManagement && result.categoryScores.timeManagement < 3.5) {
    recommendations.push('Use time-blocking techniques and productivity tools');
    recommendations.push('Break large tasks into smaller, manageable chunks');
  }

  return recommendations;
}
