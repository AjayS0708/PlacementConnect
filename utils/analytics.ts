// Analytics & Reporting Utilities

export interface AnalyticsData {
  jobs: {
    total: number;
    applied: number;
    saved: number;
    matched: number;
    averageMatchScore: number;
  };
  resume: {
    totalResumes: number;
    lastUpdated: Date | null;
    completionRate: number;
  };
  skills: {
    assessed: number;
    total: number;
    averageScore: number;
    topSkills: Array<{ name: string; score: number }>;
    weakSkills: Array<{ name: string; score: number }>;
  };
  interviews: {
    totalQuestions: number;
    practiced: number;
    averageConfidence: number;
    readyCategories: string[];
    needWorkCategories: string[];
  };
  activity: {
    totalActivities: number;
    lastActivityDate: Date | null;
    activeDays: number;
    streakDays: number;
  };
}

export interface ActivityLogEntry {
  id: string;
  type: 'job_applied' | 'job_saved' | 'resume_updated' | 'skill_assessed' | 'question_practiced' | 'analysis_completed';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TimeSeriesData {
  date: string;
  jobsApplied: number;
  resumeUpdates: number;
  assessmentsCompleted: number;
  questionsPracticed: number;
}

// Storage keys
const STORAGE_KEY_ACTIVITY_LOG = 'placement-connect-activity-log';
const STORAGE_KEY_ANALYTICS_CACHE = 'placement-connect-analytics-cache';

/**
 * Collect analytics data from all modules
 */
export function collectAnalyticsData(): AnalyticsData {
  if (typeof window === 'undefined') {
    return getEmptyAnalytics();
  }

  try {
    // Jobs data
    const savedJobsRaw = localStorage.getItem('job-notifications-saved');
    const savedJobs = savedJobsRaw ? JSON.parse(savedJobsRaw) : [];
    const appliedJobsRaw = localStorage.getItem('job-notifications-applied');
    const appliedJobs = appliedJobsRaw ? JSON.parse(appliedJobsRaw) : [];
    
    // Calculate match scores
    let totalMatchScore = 0;
    let jobsWithScores = 0;
    savedJobs.forEach((job: any) => {
      if (job.matchScore) {
        totalMatchScore += job.matchScore;
        jobsWithScores++;
      }
    });

    // Resume data
    const resumeCollectionRaw = localStorage.getItem('resume-builder-collection');
    const resumeCollection = resumeCollectionRaw ? JSON.parse(resumeCollectionRaw) : { resumes: [] };
    const resumes = resumeCollection.resumes || [];
    let lastResumeUpdate: Date | null = null;
    
    if (resumes.length > 0) {
      const dates = resumes.map((r: any) => new Date(r.updatedAt || r.createdAt));
      lastResumeUpdate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));
    }

    // Skills assessment data
    const skillsAssessmentRaw = localStorage.getItem('placement-readiness-skill-assessments');
    const skillsAssessments = skillsAssessmentRaw ? JSON.parse(skillsAssessmentRaw) : [];
    
    let averageSkillScore = 0;
    let topSkills: Array<{ name: string; score: number }> = [];
    let weakSkills: Array<{ name: string; score: number }> = [];
    
    if (skillsAssessments.length > 0) {
      const latestAssessment = skillsAssessments[skillsAssessments.length - 1].result;
      const skillScores = latestAssessment.skillScores || {};
      const scores = Object.entries(skillScores).map(([name, score]) => ({
        name: name.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        score: score as number,
      }));
      
      scores.sort((a, b) => b.score - a.score);
      topSkills = scores.slice(0, 5);
      weakSkills = scores.slice(-5).reverse();
      
      const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
      averageSkillScore = totalScore / scores.length;
    }

    // Interview questions data
    const interviewProgressRaw = localStorage.getItem('placement-readiness-interview-progress');
    const interviewProgress = interviewProgressRaw ? JSON.parse(interviewProgressRaw) : {};
    const practicedQuestions = Object.keys(interviewProgress).filter(
      (id) => interviewProgress[id].practiced
    );
    
    let averageConfidence = 0;
    if (practicedQuestions.length > 0) {
      const confidenceSum = practicedQuestions.reduce(
        (sum, id) => sum + (interviewProgress[id].confidence || 0),
        0
      );
      averageConfidence = confidenceSum / practicedQuestions.length;
    }

    // Activity data
    const activityLog = getActivityLog();
    const now = new Date();
    const activeDays = new Set(
      activityLog.map((a) => new Date(a.timestamp).toDateString())
    ).size;
    
    // Calculate streak
    let streakDays = 0;
    const sortedDates = Array.from(
      new Set(activityLog.map((a) => new Date(a.timestamp).toDateString()))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    for (let i = 0; i < sortedDates.length; i++) {
      const date = new Date(sortedDates[i]);
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === i) {
        streakDays++;
      } else {
        break;
      }
    }

    return {
      jobs: {
        total: savedJobs.length,
        applied: appliedJobs.length,
        saved: savedJobs.length,
        matched: jobsWithScores,
        averageMatchScore: jobsWithScores > 0 ? totalMatchScore / jobsWithScores : 0,
      },
      resume: {
        totalResumes: resumes.length,
        lastUpdated: lastResumeUpdate,
        completionRate: resumes.length > 0 ? 85 : 0, // Simplified
      },
      skills: {
        assessed: skillsAssessments.length,
        total: 18,
        averageScore: averageSkillScore,
        topSkills,
        weakSkills,
      },
      interviews: {
        totalQuestions: 33,
        practiced: practicedQuestions.length,
        averageConfidence,
        readyCategories: [],
        needWorkCategories: [],
      },
      activity: {
        totalActivities: activityLog.length,
        lastActivityDate: activityLog.length > 0 ? new Date(activityLog[0].timestamp) : null,
        activeDays,
        streakDays,
      },
    };
  } catch (error) {
    console.error('Error collecting analytics:', error);
    return getEmptyAnalytics();
  }
}

function getEmptyAnalytics(): AnalyticsData {
  return {
    jobs: {
      total: 0,
      applied: 0,
      saved: 0,
      matched: 0,
      averageMatchScore: 0,
    },
    resume: {
      totalResumes: 0,
      lastUpdated: null,
      completionRate: 0,
    },
    skills: {
      assessed: 0,
      total: 18,
      averageScore: 0,
      topSkills: [],
      weakSkills: [],
    },
    interviews: {
      totalQuestions: 33,
      practiced: 0,
      averageConfidence: 0,
      readyCategories: [],
      needWorkCategories: [],
    },
    activity: {
      totalActivities: 0,
      lastActivityDate: null,
      activeDays: 0,
      streakDays: 0,
    },
  };
}

/**
 * Log activity
 */
export function logActivity(
  type: ActivityLogEntry['type'],
  title: string,
  description: string,
  metadata?: Record<string, any>
): void {
  if (typeof window === 'undefined') return;

  try {
    const log = getActivityLog();
    const entry: ActivityLogEntry = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      description,
      timestamp: new Date(),
      metadata,
    };

    log.unshift(entry); // Add to beginning

    // Keep only last 100 activities
    if (log.length > 100) {
      log.splice(100);
    }

    localStorage.setItem(STORAGE_KEY_ACTIVITY_LOG, JSON.stringify(log));
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

/**
 * Get activity log
 */
export function getActivityLog(): ActivityLogEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY_ACTIVITY_LOG);
    if (!stored) return [];

    const log: ActivityLogEntry[] = JSON.parse(stored);
    
    // Restore Date objects
    log.forEach((entry) => {
      entry.timestamp = new Date(entry.timestamp);
    });

    return log;
  } catch (error) {
    console.error('Error getting activity log:', error);
    return [];
  }
}

/**
 * Get time series data for charts
 */
export function getTimeSeriesData(days: number = 30): TimeSeriesData[] {
  if (typeof window === 'undefined') return [];

  try {
    const log = getActivityLog();
    const now = new Date();
    const data: TimeSeriesData[] = [];

    // Initialize data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      data.push({
        date: dateStr,
        jobsApplied: 0,
        resumeUpdates: 0,
        assessmentsCompleted: 0,
        questionsPracticed: 0,
      });
    }

    // Count activities by day
    log.forEach((entry) => {
      const dateStr = new Date(entry.timestamp).toISOString().split('T')[0];
      const dayData = data.find((d) => d.date === dateStr);
      
      if (dayData) {
        switch (entry.type) {
          case 'job_applied':
            dayData.jobsApplied++;
            break;
          case 'resume_updated':
            dayData.resumeUpdates++;
            break;
          case 'skill_assessed':
            dayData.assessmentsCompleted++;
            break;
          case 'question_practiced':
            dayData.questionsPracticed++;
            break;
        }
      }
    });

    return data;
  } catch (error) {
    console.error('Error getting time series data:', error);
    return [];
  }
}

/**
 * Get activity by type
 */
export function getActivitiesByType(type: ActivityLogEntry['type']): ActivityLogEntry[] {
  return getActivityLog().filter((entry) => entry.type === type);
}

/**
 * Get recent activities
 */
export function getRecentActivities(limit: number = 10): ActivityLogEntry[] {
  return getActivityLog().slice(0, limit);
}

/**
 * Clear all activity logs
 */
export function clearActivityLog(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_ACTIVITY_LOG);
}

/**
 * Get analytics summary for reports
 */
export function getAnalyticsSummary(): string {
  const data = collectAnalyticsData();
  const now = new Date();

  return `
PLACEMENT CONNECT - ANALYTICS REPORT
Generated: ${now.toLocaleString()}

═══════════════════════════════════════════════════════════

JOB SEARCH PROGRESS
-------------------
Total Jobs Tracked: ${data.jobs.total}
Applications Submitted: ${data.jobs.applied}
Jobs Saved: ${data.jobs.saved}
Average Match Score: ${data.jobs.averageMatchScore.toFixed(1)}%

RESUME STATUS
-------------
Total Resumes: ${data.resume.totalResumes}
Last Updated: ${data.resume.lastUpdated?.toLocaleDateString() || 'Never'}
Completion: ${data.resume.completionRate}%

SKILLS ASSESSMENT
-----------------
Assessments Taken: ${data.skills.assessed}
Average Score: ${data.skills.averageScore.toFixed(2)}/5
Top Skills: ${data.skills.topSkills.map((s) => `${s.name} (${s.score.toFixed(1)})`).join(', ') || 'None'}
Areas to Improve: ${data.skills.weakSkills.map((s) => `${s.name} (${s.score.toFixed(1)})`).join(', ') || 'None'}

INTERVIEW PREPARATION
---------------------
Questions Practiced: ${data.interviews.practiced}/${data.interviews.totalQuestions}
Average Confidence: ${data.interviews.averageConfidence.toFixed(1)}/5
Practice Rate: ${((data.interviews.practiced / data.interviews.totalQuestions) * 100).toFixed(1)}%

ACTIVITY SUMMARY
----------------
Total Activities: ${data.activity.totalActivities}
Active Days: ${data.activity.activeDays}
Current Streak: ${data.activity.streakDays} days
Last Activity: ${data.activity.lastActivityDate?.toLocaleString() || 'Never'}

═══════════════════════════════════════════════════════════
  `.trim();
}
