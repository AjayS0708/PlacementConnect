import { Job } from '@/features/job-notification/data/jobs';
import { JobPreferences } from './matchScore';

/**
 * Configurable weight system for match scoring
 */
export interface MatchWeights {
  titleKeywordMatch: number; // default: 25
  descriptionKeywordMatch: number; // default: 15
  locationMatch: number; // default: 15
  modeMatch: number; // default: 10
  experienceMatch: number; // default: 10
  skillsMatch: number; // default: 15
  recencyBonus: number; // default: 5
  sourceBonus: number; // default: 5
}

export const DEFAULT_MATCH_WEIGHTS: MatchWeights = {
  titleKeywordMatch: 25,
  descriptionKeywordMatch: 15,
  locationMatch: 15,
  modeMatch: 10,
  experienceMatch: 10,
  skillsMatch: 15,
  recencyBonus: 5,
  sourceBonus: 5,
};

/**
 * Breakdown of what contributed to the match score
 */
export interface MatchBreakdown {
  titleKeywordScore: number;
  titleKeywordMatches: string[];
  descriptionKeywordScore: number;
  descriptionKeywordMatches: string[];
  locationScore: number;
  locationMatch: boolean;
  modeScore: number;
  modeMatch: boolean;
  experienceScore: number;
  experienceMatch: boolean;
  skillsScore: number;
  matchingSkills: string[];
  recencyScore: number;
  sourceScore: number;
  totalScore: number;
  maxPossibleScore: number;
  normalizedScore: number;
}

/**
 * Calculate match score with detailed breakdown
 */
export function calculateMatchScoreWithBreakdown(
  job: Job,
  preferences: JobPreferences | null,
  weights: MatchWeights = DEFAULT_MATCH_WEIGHTS
): MatchBreakdown {
  const breakdown: MatchBreakdown = {
    titleKeywordScore: 0,
    titleKeywordMatches: [],
    descriptionKeywordScore: 0,
    descriptionKeywordMatches: [],
    locationScore: 0,
    locationMatch: false,
    modeScore: 0,
    modeMatch: false,
    experienceScore: 0,
    experienceMatch: false,
    skillsScore: 0,
    matchingSkills: [],
    recencyScore: 0,
    sourceScore: 0,
    totalScore: 0,
    maxPossibleScore: 0,
    normalizedScore: 0,
  };

  if (!preferences) {
    return breakdown;
  }

  let score = 0;
  let maxPossibleScore = 0;

  // Title keyword match
  if (preferences.roleKeywords.length > 0) {
    maxPossibleScore += weights.titleKeywordMatch;
    const titleLower = job.title.toLowerCase();
    const matchingKeywords = preferences.roleKeywords.filter((keyword) =>
      titleLower.includes(keyword.toLowerCase().trim())
    );
    breakdown.titleKeywordMatches = matchingKeywords;
    if (matchingKeywords.length > 0) {
      const calculatedScore = Math.min(weights.titleKeywordMatch, matchingKeywords.length * 10);
      breakdown.titleKeywordScore = calculatedScore;
      score += calculatedScore;
    }
  }

  // Description keyword match
  if (preferences.roleKeywords.length > 0) {
    maxPossibleScore += weights.descriptionKeywordMatch;
    const descriptionLower = job.description.toLowerCase();
    const matchingKeywords = preferences.roleKeywords.filter((keyword) =>
      descriptionLower.includes(keyword.toLowerCase().trim())
    );
    breakdown.descriptionKeywordMatches = matchingKeywords;
    if (matchingKeywords.length > 0) {
      const calculatedScore = Math.min(weights.descriptionKeywordMatch, matchingKeywords.length * 5);
      breakdown.descriptionKeywordScore = calculatedScore;
      score += calculatedScore;
    }
  }

  // Location match
  if (preferences.preferredLocations.length > 0) {
    maxPossibleScore += weights.locationMatch;
    if (preferences.preferredLocations.includes(job.location)) {
      breakdown.locationMatch = true;
      breakdown.locationScore = weights.locationMatch;
      score += weights.locationMatch;
    }
  } else {
    // If no location preference, give partial credit
    breakdown.locationScore = 5;
    score += 5;
    maxPossibleScore += weights.locationMatch;
  }

  // Mode match
  if (preferences.preferredMode.length > 0) {
    maxPossibleScore += weights.modeMatch;
    if (preferences.preferredMode.includes(job.mode)) {
      breakdown.modeMatch = true;
      breakdown.modeScore = weights.modeMatch;
      score += weights.modeMatch;
    }
  } else {
    // If no mode preference, give partial credit
    breakdown.modeScore = 3;
    score += 3;
    maxPossibleScore += weights.modeMatch;
  }

  // Experience match
  if (preferences.experienceLevel && preferences.experienceLevel !== '') {
    maxPossibleScore += weights.experienceMatch;
    if (job.experience === preferences.experienceLevel) {
      breakdown.experienceMatch = true;
      breakdown.experienceScore = weights.experienceMatch;
      score += weights.experienceMatch;
    }
  } else {
    // If no experience preference, give partial credit
    breakdown.experienceScore = 3;
    score += 3;
    maxPossibleScore += weights.experienceMatch;
  }

  // Skills match
  if (preferences.skills.length > 0) {
    maxPossibleScore += weights.skillsMatch;
    const matchingSkills = job.skills.filter((jobSkill) =>
      preferences.skills.some(
        (userSkill) => jobSkill.toLowerCase().trim() === userSkill.toLowerCase().trim()
      )
    );
    breakdown.matchingSkills = matchingSkills;
    if (matchingSkills.length > 0) {
      const calculatedScore = Math.min(weights.skillsMatch, matchingSkills.length * 5);
      breakdown.skillsScore = calculatedScore;
      score += calculatedScore;
    }
  }

  // Recency bonus
  maxPossibleScore += weights.recencyBonus;
  if (job.postedDaysAgo === 0) {
    breakdown.recencyScore = weights.recencyBonus;
    score += weights.recencyBonus;
  } else if (job.postedDaysAgo === 1) {
    breakdown.recencyScore = Math.floor(weights.recencyBonus * 0.8);
    score += breakdown.recencyScore;
  } else if (job.postedDaysAgo <= 2) {
    breakdown.recencyScore = Math.floor(weights.recencyBonus * 0.6);
    score += breakdown.recencyScore;
  } else if (job.postedDaysAgo <= 5) {
    breakdown.recencyScore = Math.floor(weights.recencyBonus * 0.2);
    score += breakdown.recencyScore;
  }

  // Source bonus
  maxPossibleScore += weights.sourceBonus;
  if (job.source === 'LinkedIn') {
    breakdown.sourceScore = weights.sourceBonus;
    score += weights.sourceBonus;
  } else if (job.source === 'Naukri') {
    breakdown.sourceScore = Math.floor(weights.sourceBonus * 0.6);
    score += breakdown.sourceScore;
  } else {
    breakdown.sourceScore = Math.floor(weights.sourceBonus * 0.4);
    score += breakdown.sourceScore;
  }

  // Store raw scores
  breakdown.totalScore = score;
  breakdown.maxPossibleScore = maxPossibleScore;

  // Normalize to 100 scale
  if (maxPossibleScore > 0) {
    breakdown.normalizedScore = Math.round((score / maxPossibleScore) * 100);
  }

  // Cap at 100
  breakdown.normalizedScore = Math.min(breakdown.normalizedScore, 100);

  return breakdown;
}

/**
 * Get/set custom weights from localStorage
 */
export function getCustomWeights(): MatchWeights {
  if (typeof window === 'undefined') return DEFAULT_MATCH_WEIGHTS;

  const stored = localStorage.getItem('jobMatchWeights');
  if (!stored) return DEFAULT_MATCH_WEIGHTS;

  try {
    return { ...DEFAULT_MATCH_WEIGHTS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_MATCH_WEIGHTS;
  }
}

export function saveCustomWeights(weights: MatchWeights): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('jobMatchWeights', JSON.stringify(weights));
}

export function resetWeightsToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('jobMatchWeights');
}
