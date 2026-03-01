// Interview Questions Bank Library

export type QuestionCategory =
  | 'behavioral'
  | 'technical'
  | 'situational'
  | 'company-research'
  | 'career-goals'
  | 'problem-solving';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface InterviewQuestion {
  id: string;
  question: string;
  category: QuestionCategory;
  difficulty: DifficultyLevel;
  tags: string[];
  sampleAnswer?: string;
  tips: string[];
  commonMistakes?: string[];
}

export interface QuestionProgress {
  questionId: string;
  practiced: boolean;
  lastPracticedAt?: Date;
  confidence: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = very high
  notes: string;
}

export interface PracticeSession {
  id: string;
  questionIds: string[];
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // minutes
}

// Interview Questions Database
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // BEHAVIORAL QUESTIONS
  {
    id: 'beh-001',
    question: 'Tell me about yourself.',
    category: 'behavioral',
    difficulty: 'easy',
    tags: ['introduction', 'common'],
    sampleAnswer: "I'm a [year] student majoring in [major] at [university]. I'm passionate about [relevant passion] and have developed skills in [key skills]. Recently, I [relevant achievement/project]. I'm particularly excited about this opportunity because [why this role/company].",
    tips: [
      'Keep it under 2 minutes',
      'Follow present-past-future structure',
      'Focus on professional/academic highlights',
      'End with why you\'re interested in this role',
      'Practice to sound natural, not rehearsed',
    ],
    commonMistakes: [
      'Rambling about personal life/hobbies',
      'Reciting entire resume chronologically',
      'Being too brief (under 30 seconds)',
      'Not connecting to the role you\'re applying for',
    ],
  },
  {
    id: 'beh-002',
    question: 'Why do you want to work here?',
    category: 'behavioral',
    difficulty: 'medium',
    tags: ['motivation', 'common', 'research'],
    tips: [
      'Research the company beforehand',
      'Mention specific products/projects',
      'Align your goals with company mission',
      'Show genuine enthusiasm',
      'Reference recent company news or achievements',
    ],
    commonMistakes: [
      'Generic answers that work for any company',
      'Only mentioning salary/benefits',
      'Not doing company research',
      'Being too focused on what you\'ll gain',
    ],
  },
  {
    id: 'beh-003',
    question: 'Describe a time you faced a challenge and how you overcame it.',
    category: 'behavioral',
    difficulty: 'medium',
    tags: ['problem-solving', 'resilience', 'star-method'],
    tips: [
      'Use STAR method (Situation, Task, Action, Result)',
      'Choose a relevant professional/academic example',
      'Show your problem-solving process',
      'Quantify results if possible',
      'Reflect on what you learned',
    ],
    commonMistakes: [
      'Choosing a trivial challenge',
      'Focusing on the problem, not the solution',
      'Not showing your specific role/contribution',
      'Blaming others for the challenge',
    ],
  },
  {
    id: 'beh-004',
    question: 'Tell me about a time you worked in a team.',
    category: 'behavioral',
    difficulty: 'easy',
    tags: ['teamwork', 'collaboration', 'star-method'],
    tips: [
      'Highlight your specific role',
      'Show collaboration and communication',
      'Mention how you handled conflicts (if any)',
      'Emphasize team success',
      'Use STAR method',
    ],
    commonMistakes: [
      'Taking all credit for team achievement',
      'Not showing your individual contribution',
      'Avoiding conflict discussion when it was relevant',
      'Speaking negatively about team members',
    ],
  },
  {
    id: 'beh-005',
    question: 'What is your greatest weakness?',
    category: 'behavioral',
    difficulty: 'hard',
    tags: ['self-awareness', 'growth', 'common'],
    tips: [
      'Choose a real weakness, not "I work too hard"',
      'Show self-awareness and growth mindset',
      'Explain steps you\'re taking to improve',
      'Keep it professional, not a critical flaw',
      'Turn it into a learning opportunity',
    ],
    commonMistakes: [
      'Disguising strength as weakness',
      'Mentioning critical job skills as weaknesses',
      'Not showing improvement efforts',
      'Being too honest about major flaws',
    ],
  },
  {
    id: 'beh-006',
    question: 'Describe a time you failed and what you learned from it.',
    category: 'behavioral',
    difficulty: 'hard',
    tags: ['resilience', 'learning', 'star-method'],
    tips: [
      'Be honest but strategic in your choice',
      'Focus more on learning than the failure itself',
      'Show how you\'ve applied the lesson',
      'Demonstrate growth mindset',
      'End with a positive outcome',
    ],
    commonMistakes: [
      'Choosing a catastrophic failure',
      'Not owning the failure',
      'Not showing what you learned',
      'Being defensive or making excuses',
    ],
  },
  {
    id: 'beh-007',
    question: 'How do you handle stress and pressure?',
    category: 'behavioral',
    difficulty: 'medium',
    tags: ['stress-management', 'resilience'],
    tips: [
      'Provide specific strategies you use',
      'Give an example from experience',
      'Show you stay productive under pressure',
      'Mention time management skills',
      'Be honest but positive',
    ],
    commonMistakes: [
      'Saying you never feel stressed',
      'Describing unhealthy coping mechanisms',
      'Not providing concrete examples',
      'Appearing overwhelmed by normal pressure',
    ],
  },
  {
    id: 'beh-008',
    question: 'Tell me about a time you showed leadership.',
    category: 'behavioral',
    difficulty: 'medium',
    tags: ['leadership', 'initiative', 'star-method'],
    tips: [
      'Leadership doesn\'t require a formal title',
      'Show initiative and influence',
      'Demonstrate how you motivated others',
      'Use STAR method',
      'Quantify impact if possible',
    ],
    commonMistakes: [
      'Saying you have no leadership experience',
      'Confusing management with leadership',
      'Not showing the impact of your leadership',
      'Taking all credit without acknowledging team',
    ],
  },

  // TECHNICAL QUESTIONS (General)
  {
    id: 'tech-001',
    question: 'Explain the difference between supervised and unsupervised learning.',
    category: 'technical',
    difficulty: 'easy',
    tags: ['machine-learning', 'data-science'],
    tips: [
      'Define both clearly',
      'Provide examples of each',
      'Mention use cases',
      'Explain labeled vs unlabeled data',
    ],
    commonMistakes: [
      'Confusing the two concepts',
      'Not providing examples',
      'Being too theoretical without practical context',
    ],
  },
  {
    id: 'tech-002',
    question: 'What is the difference between a stack and a queue?',
    category: 'technical',
    difficulty: 'easy',
    tags: ['data-structures', 'computer-science'],
    tips: [
      'Explain LIFO vs FIFO',
      'Mention real-world analogies',
      'Discuss use cases for each',
      'Know time complexity of operations',
    ],
    commonMistakes: [
      'Mixing up LIFO and FIFO',
      'Not explaining practical applications',
      'Forgetting time complexity',
    ],
  },
  {
    id: 'tech-003',
    question: 'Explain object-oriented programming and its key principles.',
    category: 'technical',
    difficulty: 'medium',
    tags: ['programming', 'oop', 'computer-science'],
    tips: [
      'Cover all 4 pillars: encapsulation, abstraction, inheritance, polymorphism',
      'Provide code examples if asked',
      'Explain benefits of OOP',
      'Mention when OOP is appropriate',
    ],
    commonMistakes: [
      'Missing one or more pillars',
      'Being too abstract without examples',
      'Not explaining real-world benefits',
    ],
  },
  {
    id: 'tech-004',
    question: 'What is the difference between GET and POST requests?',
    category: 'technical',
    difficulty: 'easy',
    tags: ['web-development', 'http', 'apis'],
    tips: [
      'Explain data transmission differences',
      'Discuss use cases for each',
      'Mention security implications',
      'Talk about idempotency',
    ],
    commonMistakes: [
      'Not mentioning security differences',
      'Confusing when to use each',
      'Not explaining idempotency',
    ],
  },
  {
    id: 'tech-005',
    question: 'Explain the concept of Big O notation.',
    category: 'technical',
    difficulty: 'medium',
    tags: ['algorithms', 'complexity', 'computer-science'],
    tips: [
      'Define what it measures',
      'Provide common examples (O(1), O(n), O(log n), O(n²))',
      'Explain why it matters',
      'Use simple algorithm examples',
    ],
    commonMistakes: [
      'Being too mathematical without intuition',
      'Not providing concrete examples',
      'Confusing time and space complexity',
    ],
  },

  // SITUATIONAL QUESTIONS
  {
    id: 'sit-001',
    question: 'How would you handle a disagreement with a team member?',
    category: 'situational',
    difficulty: 'medium',
    tags: ['conflict-resolution', 'teamwork'],
    tips: [
      'Show emotional intelligence',
      'Emphasize communication',
      'Focus on finding common ground',
      'Mention escalation only as last resort',
      'Demonstrate respect for different perspectives',
    ],
    commonMistakes: [
      'Being too aggressive or passive',
      'Not showing willingness to compromise',
      'Immediately escalating to authority',
      'Dismissing the other person\'s viewpoint',
    ],
  },
  {
    id: 'sit-002',
    question: 'What would you do if you missed a deadline?',
    category: 'situational',
    difficulty: 'medium',
    tags: ['accountability', 'time-management'],
    tips: [
      'Show accountability',
      'Communicate proactively',
      'Offer solutions, not just problems',
      'Discuss prevention strategies',
      'Demonstrate learning from mistakes',
    ],
    commonMistakes: [
      'Blaming others or circumstances',
      'Hiding the issue',
      'Not taking responsibility',
      'No plan for prevention',
    ],
  },
  {
    id: 'sit-003',
    question: 'How would you approach learning a new technology quickly?',
    category: 'situational',
    difficulty: 'easy',
    tags: ['learning', 'adaptability', 'technical'],
    tips: [
      'Mention structured learning approach',
      'Discuss hands-on practice importance',
      'Reference documentation and resources',
      'Show enthusiasm for learning',
      'Give example of past quick learning',
    ],
    commonMistakes: [
      'Not showing a systematic approach',
      'Overconfidence without acknowledging challenges',
      'Not mentioning practical application',
    ],
  },
  {
    id: 'sit-004',
    question: 'What would you do if you noticed a colleague making a mistake?',
    category: 'situational',
    difficulty: 'medium',
    tags: ['teamwork', 'communication', 'professionalism'],
    tips: [
      'Show tact and professionalism',
      'Emphasize private, respectful communication',
      'Focus on helping, not criticizing',
      'Consider severity and context',
      'Mention following up',
    ],
    commonMistakes: [
      'Ignoring the issue',
      'Publicly calling out the mistake',
      'Going straight to their manager',
      'Being judgmental or condescending',
    ],
  },

  // COMPANY RESEARCH
  {
    id: 'comp-001',
    question: 'What do you know about our company?',
    category: 'company-research',
    difficulty: 'easy',
    tags: ['research', 'common'],
    tips: [
      'Research beforehand thoroughly',
      'Mention products/services',
      'Reference company mission/values',
      'Cite recent news or achievements',
      'Show genuine interest',
    ],
    commonMistakes: [
      'Not doing research',
      'Only mentioning what\'s on the homepage',
      'Confusing with competitor companies',
      'Being too vague or generic',
    ],
  },
  {
    id: 'comp-002',
    question: 'What interests you about this role?',
    category: 'company-research',
    difficulty: 'easy',
    tags: ['motivation', 'common'],
    tips: [
      'Reference specific responsibilities',
      'Connect to your skills and interests',
      'Show understanding of the role',
      'Mention growth opportunities',
      'Be specific, not generic',
    ],
    commonMistakes: [
      'Not understanding the role',
      'Generic answers',
      'Only focusing on resume building',
      'Not showing genuine interest',
    ],
  },

  // CAREER GOALS
  {
    id: 'career-001',
    question: 'Where do you see yourself in 5 years?',
    category: 'career-goals',
    difficulty: 'medium',
    tags: ['goals', 'ambition', 'common'],
    tips: [
      'Show ambition but be realistic',
      'Align goals with company path',
      'Show commitment to growth',
      'Balance ambition with flexibility',
      'Focus on skills, not just titles',
    ],
    commonMistakes: [
      'Saying "I don\'t know"',
      'Goals completely unrelated to the role',
      'Sounding overconfident or entitled',
      'Not showing interest in the company',
    ],
  },
  {
    id: 'career-002',
    question: 'Why did you choose your major/field of study?',
    category: 'career-goals',
    difficulty: 'easy',
    tags: ['motivation', 'passion'],
    tips: [
      'Show genuine interest',
      'Connect to career goals',
      'Mention defining moments/experiences',
      'Show thoughtfulness in decision',
      'Relate to the job you\'re applying for',
    ],
    commonMistakes: [
      '"Because it pays well"',
      'Unable to articulate reasons',
      'No connection to career goals',
      'Expressing regret about the choice',
    ],
  },

  // PROBLEM-SOLVING
  {
    id: 'prob-001',
    question: 'How many golf balls can fit in a school bus?',
    category: 'problem-solving',
    difficulty: 'hard',
    tags: ['estimation', 'logical-thinking'],
    tips: [
      'Think aloud through your process',
      'Make reasonable assumptions',
      'Break problem into smaller parts',
      'Use round numbers for easier math',
      'Focus on approach, not exact answer',
    ],
    commonMistakes: [
      'Refusing to attempt',
      'Guessing without showing work',
      'Getting stuck on details',
      'Not stating assumptions clearly',
    ],
  },
  {
    id: 'prob-002',
    question: 'If you could design the perfect [product], what would it look like?',
    category: 'problem-solving',
    difficulty: 'hard',
    tags: ['creativity', 'product-thinking'],
    tips: [
      'Ask clarifying questions',
      'Consider user needs',
      'Think about tradeoffs',
      'Show structured thinking',
      'Be creative but practical',
    ],
    commonMistakes: [
      'Not asking clarifying questions',
      'Ignoring constraints like cost',
      'Not considering users',
      'Being too abstract or impractical',
    ],
  },

  // Additional Questions
  {
    id: 'beh-009',
    question: 'Describe a time when you had to learn something new quickly.',
    category: 'behavioral',
    difficulty: 'medium',
    tags: ['learning', 'adaptability', 'star-method'],
    tips: [
      'Choose relevant technical or professional learning',
      'Show your learning process',
      'Mention resources you used',
      'Demonstrate successful application',
      'Use STAR method',
    ],
  },
  {
    id: 'beh-010',
    question: 'Tell me about a time you received constructive criticism.',
    category: 'behavioral',
    difficulty: 'medium',
    tags: ['growth', 'feedback', 'star-method'],
    tips: [
      'Show openness to feedback',
      'Demonstrate how you used the feedback',
      'Don\'t be defensive',
      'Show the positive outcome',
      'Express gratitude for learning opportunity',
    ],
  },
  {
    id: 'tech-006',
    question: 'What is the difference between an array and a linked list?',
    category: 'technical',
    difficulty: 'easy',
    tags: ['data-structures', 'computer-science'],
    tips: [
      'Discuss memory allocation differences',
      'Compare access time complexity',
      'Mention insertion/deletion efficiency',
      'Provide use cases for each',
    ],
  },
  {
    id: 'tech-007',
    question: 'Explain the concept of recursion.',
    category: 'technical',
    difficulty: 'medium',
    tags: ['algorithms', 'programming'],
    tips: [
      'Define base case and recursive case',
      'Provide simple example (factorial, fibonacci)',
      'Discuss advantages and disadvantages',
      'Mention stack overflow risk',
    ],
  },
  {
    id: 'tech-008',
    question: 'What is the difference between SQL and NoSQL databases?',
    category: 'technical',
    difficulty: 'medium',
    tags: ['databases', 'backend'],
    tips: [
      'Compare structure (relational vs document/key-value)',
      'Discuss scalability differences',
      'Mention ACID vs BASE',
      'Give use case examples',
    ],
  },
  {
    id: 'sit-005',
    question: 'How would you prioritize multiple urgent tasks?',
    category: 'situational',
    difficulty: 'medium',
    tags: ['time-management', 'prioritization'],
    tips: [
      'Mention assessment criteria (impact, urgency, effort)',
      'Discuss stakeholder communication',
      'Show systematic approach',
      'Mention delegation if applicable',
    ],
  },
  {
    id: 'sit-006',
    question: 'What would you do if you strongly disagreed with your manager\'s decision?',
    category: 'situational',
    difficulty: 'hard',
    tags: ['conflict-resolution', 'professionalism'],
    tips: [
      'Show respect for authority',
      'Emphasize private, professional discussion',
      'Present data/reasoning',
      'Accept final decision gracefully',
      'Know when to escalate (ethical issues)',
    ],
  },
  {
    id: 'career-003',
    question: 'What are you most passionate about?',
    category: 'career-goals',
    difficulty: 'easy',
    tags: ['motivation', 'passion'],
    tips: [
      'Be genuine and specific',
      'Connect to professional interests',
      'Show enthusiasm',
      'Relate to the role/company if possible',
    ],
  },
  {
    id: 'career-004',
    question: 'What kind of work environment do you thrive in?',
    category: 'career-goals',
    difficulty: 'medium',
    tags: ['culture-fit', 'work-style'],
    tips: [
      'Be honest but flexible',
      'Research company culture beforehand',
      'Mention collaboration and independence balance',
      'Show adaptability',
    ],
  },
];

// Storage keys
const STORAGE_KEY_PROGRESS = 'placement-readiness-interview-progress';
const STORAGE_KEY_SESSIONS = 'placement-readiness-interview-sessions';

// Get all questions
export function getAllQuestions(): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS;
}

// Get questions by category
export function getQuestionsByCategory(category: QuestionCategory): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.category === category);
}

// Get questions by difficulty
export function getQuestionsByDifficulty(difficulty: DifficultyLevel): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.difficulty === difficulty);
}

// Get questions by tag
export function getQuestionsByTag(tag: string): InterviewQuestion[] {
  return INTERVIEW_QUESTIONS.filter((q) => q.tags.includes(tag));
}

// Search questions
export function searchQuestions(query: string): InterviewQuestion[] {
  const lowerQuery = query.toLowerCase();
  return INTERVIEW_QUESTIONS.filter(
    (q) =>
      q.question.toLowerCase().includes(lowerQuery) ||
      q.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      q.tips.some((tip) => tip.toLowerCase().includes(lowerQuery))
  );
}

// Generate random practice session
export function generatePracticeSession(
  count: number,
  filters?: {
    category?: QuestionCategory;
    difficulty?: DifficultyLevel;
    tag?: string;
  }
): InterviewQuestion[] {
  let pool = INTERVIEW_QUESTIONS;

  if (filters?.category) {
    pool = pool.filter((q) => q.category === filters.category);
  }
  if (filters?.difficulty) {
    pool = pool.filter((q) => q.difficulty === filters.difficulty);
  }
  if (filters?.tag) {
    const tag = filters.tag;
    pool = pool.filter((q) => q.tags.includes(tag));
  }

  // Shuffle and take count
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Progress tracking
export function getQuestionProgress(questionId: string): QuestionProgress | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(STORAGE_KEY_PROGRESS);
  if (!stored) return null;

  try {
    const allProgress: Record<string, QuestionProgress> = JSON.parse(stored);
    const progress = allProgress[questionId];
    if (!progress) return null;

    // Restore Date objects
    if (progress.lastPracticedAt) {
      progress.lastPracticedAt = new Date(progress.lastPracticedAt);
    }

    return progress;
  } catch {
    return null;
  }
}

export function getAllProgress(): Record<string, QuestionProgress> {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEY_PROGRESS);
  if (!stored) return {};

  try {
    const allProgress: Record<string, QuestionProgress> = JSON.parse(stored);
    
    // Restore Date objects
    Object.values(allProgress).forEach((progress) => {
      if (progress.lastPracticedAt) {
        progress.lastPracticedAt = new Date(progress.lastPracticedAt);
      }
    });

    return allProgress;
  } catch {
    return {};
  }
}

export function saveQuestionProgress(progress: QuestionProgress): void {
  if (typeof window === 'undefined') return;
  
  const allProgress = getAllProgress();
  allProgress[progress.questionId] = {
    ...progress,
    lastPracticedAt: new Date(),
  };
  
  localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(allProgress));
}

// Practice sessions
export function savePracticeSession(session: Omit<PracticeSession, 'id'>): string {
  if (typeof window === 'undefined') return '';
  
  const id = `session_${Date.now()}`;
  const fullSession: PracticeSession = {
    ...session,
    id,
  };

  const sessions = getAllSessions();
  sessions.push(fullSession);
  
  localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
  return id;
}

export function getAllSessions(): PracticeSession[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_SESSIONS);
  if (!stored) return [];

  try {
    const sessions: PracticeSession[] = JSON.parse(stored);
    
    // Restore Date objects
    sessions.forEach((session) => {
      session.startedAt = new Date(session.startedAt);
      if (session.completedAt) {
        session.completedAt = new Date(session.completedAt);
      }
    });

    return sessions;
  } catch {
    return [];
  }
}

export function getLatestSession(): PracticeSession | null {
  const sessions = getAllSessions();
  if (sessions.length === 0) return null;
  
  return sessions.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
}

// Statistics
export function getProgressStats(): {
  totalQuestions: number;
  practicedQuestions: number;
  practicedPercentage: number;
  averageConfidence: number;
  byCategory: Record<QuestionCategory, { total: number; practiced: number }>;
  byDifficulty: Record<DifficultyLevel, { total: number; practiced: number }>;
} {
  const allProgress = getAllProgress();
  const practiced = Object.keys(allProgress).filter((id) => allProgress[id].practiced);

  const byCategory: Record<QuestionCategory, { total: number; practiced: number }> = {
    behavioral: { total: 0, practiced: 0 },
    technical: { total: 0, practiced: 0 },
    situational: { total: 0, practiced: 0 },
    'company-research': { total: 0, practiced: 0 },
    'career-goals': { total: 0, practiced: 0 },
    'problem-solving': { total: 0, practiced: 0 },
  };

  const byDifficulty: Record<DifficultyLevel, { total: number; practiced: number }> = {
    easy: { total: 0, practiced: 0 },
    medium: { total: 0, practiced: 0 },
    hard: { total: 0, practiced: 0 },
  };

  INTERVIEW_QUESTIONS.forEach((q) => {
    byCategory[q.category].total++;
    byDifficulty[q.difficulty].total++;

    if (allProgress[q.id]?.practiced) {
      byCategory[q.category].practiced++;
      byDifficulty[q.difficulty].practiced++;
    }
  });

  const confidenceValues = Object.values(allProgress)
    .filter((p) => p.practiced)
    .map((p) => p.confidence);
  
  const averageConfidence =
    confidenceValues.length > 0
      ? confidenceValues.reduce((sum, c) => sum + c, 0) / confidenceValues.length
      : 0;

  return {
    totalQuestions: INTERVIEW_QUESTIONS.length,
    practicedQuestions: practiced.length,
    practicedPercentage: (practiced.length / INTERVIEW_QUESTIONS.length) * 100,
    averageConfidence,
    byCategory,
    byDifficulty,
  };
}

// Get all unique tags
export function getAllTags(): string[] {
  const tags = new Set<string>();
  INTERVIEW_QUESTIONS.forEach((q) => {
    q.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
