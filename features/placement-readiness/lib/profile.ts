import { getSelectedOrLatestAnalysis } from './storage';

const PROFILE_KEY = 'placement_readiness_profile_v1';

export interface PlacementProfile {
  fullName: string;
  email: string;
  phone: string;
  targetCompany: string;
  targetRole: string;
  graduationYear: string;
  preferredLocations: string;
  weeklyHours: number;
  strengths: string;
  weakAreas: string;
}

function clampWeeklyHours(value: number): number {
  return Math.min(40, Math.max(1, value));
}

function coerceProfile(raw: unknown): PlacementProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const data = raw as Record<string, unknown>;

  const weeklyHoursRaw = typeof data.weeklyHours === 'number'
    ? data.weeklyHours
    : Number(data.weeklyHours);

  return {
    fullName: typeof data.fullName === 'string' ? data.fullName : '',
    email: typeof data.email === 'string' ? data.email : '',
    phone: typeof data.phone === 'string' ? data.phone : '',
    targetCompany: typeof data.targetCompany === 'string' ? data.targetCompany : '',
    targetRole: typeof data.targetRole === 'string' ? data.targetRole : '',
    graduationYear: typeof data.graduationYear === 'string' ? data.graduationYear : '',
    preferredLocations: typeof data.preferredLocations === 'string' ? data.preferredLocations : '',
    weeklyHours: Number.isFinite(weeklyHoursRaw) ? clampWeeklyHours(Math.round(weeklyHoursRaw)) : 8,
    strengths: typeof data.strengths === 'string' ? data.strengths : '',
    weakAreas: typeof data.weakAreas === 'string' ? data.weakAreas : '',
  };
}

export function getDefaultProfile(): PlacementProfile {
  const active = getSelectedOrLatestAnalysis();

  return {
    fullName: '',
    email: '',
    phone: '',
    targetCompany: active?.company || '',
    targetRole: active?.role || '',
    graduationYear: '',
    preferredLocations: '',
    weeklyHours: 8,
    strengths: '',
    weakAreas: '',
  };
}

export function loadPlacementProfile(): PlacementProfile {
  if (typeof window === 'undefined') {
    return getDefaultProfile();
  }

  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) {
    return getDefaultProfile();
  }

  try {
    const parsed = JSON.parse(raw);
    const profile = coerceProfile(parsed);
    return profile || getDefaultProfile();
  } catch {
    return getDefaultProfile();
  }
}

export function savePlacementProfile(profile: PlacementProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getProfileCompletion(profile: PlacementProfile): { completed: number; total: number; percentage: number } {
  const requiredFields: Array<keyof PlacementProfile> = [
    'fullName',
    'email',
    'targetRole',
    'graduationYear',
    'preferredLocations',
    'strengths',
    'weakAreas',
  ];

  const completed = requiredFields.reduce((count, key) => {
    const value = profile[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return count + 1;
    }
    return count;
  }, 0);

  const total = requiredFields.length;
  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
}
