import { Job } from '@/data/jobs'

export interface JobPreferences {
  roleKeywords: string[] // parsed from comma-separated
  preferredLocations: string[]
  preferredMode: string[] // ['Remote', 'Hybrid', 'Onsite']
  experienceLevel: string
  skills: string[] // parsed from comma-separated
  minMatchScore: number
}

/**
 * Calculate match score for a job based on user preferences
 * 
 * Scoring rules with better granularity:
 * +25 if any roleKeyword appears in job.title (case-insensitive)
 * +15 if any roleKeyword appears in job.description
 * +15 if job.location matches preferredLocations
 * +10 if job.mode matches preferredMode
 * +10 if job.experience matches experienceLevel
 * +15 if overlap between job.skills and user.skills (scaled by overlap count)
 * +5 if postedDaysAgo <= 2
 * +5 if source is LinkedIn
 * 
 * Cap score at 100
 */
export function calculateMatchScore(job: Job, preferences: JobPreferences | null): number {
  if (!preferences) {
    return 0
  }

  let score = 0
  let maxPossibleScore = 0

  // Title keyword match: +25 (can match multiple keywords for higher score)
  if (preferences.roleKeywords.length > 0) {
    maxPossibleScore += 25
    const titleLower = job.title.toLowerCase()
    const matchingKeywords = preferences.roleKeywords.filter(keyword => 
      titleLower.includes(keyword.toLowerCase().trim())
    )
    if (matchingKeywords.length > 0) {
      // Scale based on how many keywords match (up to 3 for full points)
      score += Math.min(25, matchingKeywords.length * 10)
    }
  }

  // Description keyword match: +15
  if (preferences.roleKeywords.length > 0) {
    maxPossibleScore += 15
    const descriptionLower = job.description.toLowerCase()
    const matchingKeywords = preferences.roleKeywords.filter(keyword => 
      descriptionLower.includes(keyword.toLowerCase().trim())
    )
    if (matchingKeywords.length > 0) {
      score += Math.min(15, matchingKeywords.length * 5)
    }
  }

  // Location match: +15
  if (preferences.preferredLocations.length > 0) {
    maxPossibleScore += 15
    if (preferences.preferredLocations.includes(job.location)) {
      score += 15
    }
  } else {
    // If no location preference, give partial credit
    score += 5
    maxPossibleScore += 15
  }

  // Mode match: +10
  if (preferences.preferredMode.length > 0) {
    maxPossibleScore += 10
    if (preferences.preferredMode.includes(job.mode)) {
      score += 10
    }
  } else {
    // If no mode preference, give partial credit
    score += 3
    maxPossibleScore += 10
  }

  // Experience match: +10
  if (preferences.experienceLevel && preferences.experienceLevel !== '') {
    maxPossibleScore += 10
    if (job.experience === preferences.experienceLevel) {
      score += 10
    }
  } else {
    // If no experience preference, give partial credit
    score += 3
    maxPossibleScore += 10
  }

  // Skills match: +15 (scaled by number of matching skills)
  if (preferences.skills.length > 0) {
    maxPossibleScore += 15
    const matchingSkills = job.skills.filter(jobSkill => 
      preferences.skills.some(userSkill => 
        jobSkill.toLowerCase().trim() === userSkill.toLowerCase().trim()
      )
    )
    if (matchingSkills.length > 0) {
      // Scale: 1 skill = 5pts, 2 skills = 10pts, 3+ skills = 15pts
      score += Math.min(15, matchingSkills.length * 5)
    }
  }

  // Recency bonus: +5
  maxPossibleScore += 5
  if (job.postedDaysAgo === 0) {
    score += 5
  } else if (job.postedDaysAgo === 1) {
    score += 4
  } else if (job.postedDaysAgo <= 2) {
    score += 3
  } else if (job.postedDaysAgo <= 5) {
    score += 1
  }

  // Source bonus: +5
  maxPossibleScore += 5
  if (job.source === 'LinkedIn') {
    score += 5
  } else if (job.source === 'Naukri') {
    score += 3
  } else {
    score += 2
  }

  // Normalize to 100 scale
  if (maxPossibleScore > 0) {
    score = Math.round((score / maxPossibleScore) * 100)
  }

  // Cap score at 100
  return Math.min(score, 100)
}

/**
 * Get badge color and styles based on match score
 */
export function getMatchScoreBadgeStyle(score: number): { backgroundColor: string; color: string } {
  if (score >= 80) return { backgroundColor: '#16a34a', color: '#ffffff' } // vibrant green
  if (score >= 60) return { backgroundColor: '#f97316', color: '#ffffff' } // bright orange
  if (score >= 40) return { backgroundColor: '#3b82f6', color: '#ffffff' } // bright blue
  if (score >= 20) return { backgroundColor: '#eab308', color: '#000000' } // bright yellow
  return { backgroundColor: '#d1d5db', color: '#374151' } // light grey
}

/**
 * Parse comma-separated string into array of trimmed strings
 */
export function parseCommaSeparated(input: string): string[] {
  return input
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0)
}

/**
 * Get preferences from localStorage
 */
export function getPreferencesFromStorage(): JobPreferences | null {
  if (typeof window === 'undefined') return null
  
  const stored = localStorage.getItem('jobTrackerPreferences')
  if (!stored) return null
  
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

/**
 * Save preferences to localStorage
 */
export function savePreferencesToStorage(preferences: JobPreferences): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('jobTrackerPreferences', JSON.stringify(preferences))
}
