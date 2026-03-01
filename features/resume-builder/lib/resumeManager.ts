import { ResumeBuilderData, createEmptyResumeData } from './resumeData';

/**
 * Resume with metadata for version history
 */
export interface ResumeVersion {
  id: string;
  name: string;
  data: ResumeBuilderData;
  createdAt: Date;
  updatedAt: Date;
  template: string;
  accent: string;
  isActive: boolean;
}

/**
 * Resume collection for managing multiple resumes
 */
export interface ResumeCollection {
  resumes: ResumeVersion[];
  activeResumeId: string | null;
}

const RESUME_COLLECTION_KEY = 'resumeCollection';

/**
 * Generate unique ID for resume
 */
function generateResumeId(): string {
  return `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all resumes from collection
 */
export function getResumeCollection(): ResumeCollection {
  if (typeof window === 'undefined') {
    return { resumes: [], activeResumeId: null };
  }

  try {
    const stored = localStorage.getItem(RESUME_COLLECTION_KEY);
    if (!stored) {
      return { resumes: [], activeResumeId: null };
    }

    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    if (parsed.resumes && Array.isArray(parsed.resumes)) {
      parsed.resumes = parsed.resumes.map((resume: any) => ({
        ...resume,
        createdAt: new Date(resume.createdAt),
        updatedAt: new Date(resume.updatedAt),
      }));
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load resume collection:', error);
    return { resumes: [], activeResumeId: null };
  }
}

/**
 * Save resume collection to localStorage
 */
function saveResumeCollection(collection: ResumeCollection): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(RESUME_COLLECTION_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error('Failed to save resume collection:', error);
  }
}

/**
 * Create a new resume
 */
export function createNewResume(name: string = 'Untitled Resume'): ResumeVersion {
  const newResume: ResumeVersion = {
    id: generateResumeId(),
    name,
    data: createEmptyResumeData(),
    createdAt: new Date(),
    updatedAt: new Date(),
    template: 'classic',
    accent: 'teal',
    isActive: false,
  };

  const collection = getResumeCollection();
  
  // Set as active if it's the first resume
  if (collection.resumes.length === 0) {
    newResume.isActive = true;
    collection.activeResumeId = newResume.id;
  }

  collection.resumes.push(newResume);
  saveResumeCollection(collection);

  return newResume;
}

/**
 * Get active resume
 */
export function getActiveResume(): ResumeVersion | null {
  const collection = getResumeCollection();
  
  if (!collection.activeResumeId) {
    return null;
  }

  return collection.resumes.find((r) => r.id === collection.activeResumeId) || null;
}

/**
 * Set active resume
 */
export function setActiveResume(resumeId: string): boolean {
  const collection = getResumeCollection();
  const resume = collection.resumes.find((r) => r.id === resumeId);

  if (!resume) {
    return false;
  }

  // Update isActive flags
  collection.resumes = collection.resumes.map((r) => ({
    ...r,
    isActive: r.id === resumeId,
  }));

  collection.activeResumeId = resumeId;
  saveResumeCollection(collection);

  return true;
}

/**
 * Update a resume
 */
export function updateResume(
  resumeId: string,
  updates: Partial<Omit<ResumeVersion, 'id' | 'createdAt'>>
): boolean {
  const collection = getResumeCollection();
  const resumeIndex = collection.resumes.findIndex((r) => r.id === resumeId);

  if (resumeIndex === -1) {
    return false;
  }

  collection.resumes[resumeIndex] = {
    ...collection.resumes[resumeIndex],
    ...updates,
    updatedAt: new Date(),
  };

  saveResumeCollection(collection);
  return true;
}

/**
 * Duplicate a resume
 */
export function duplicateResume(resumeId: string, newName?: string): ResumeVersion | null {
  const collection = getResumeCollection();
  const originalResume = collection.resumes.find((r) => r.id === resumeId);

  if (!originalResume) {
    return null;
  }

  const duplicatedResume: ResumeVersion = {
    ...originalResume,
    id: generateResumeId(),
    name: newName || `${originalResume.name} (Copy)`,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: false,
  };

  collection.resumes.push(duplicatedResume);
  saveResumeCollection(collection);

  return duplicatedResume;
}

/**
 * Delete a resume
 */
export function deleteResume(resumeId: string): boolean {
  const collection = getResumeCollection();
  const resumeIndex = collection.resumes.findIndex((r) => r.id === resumeId);

  if (resumeIndex === -1) {
    return false;
  }

  const wasActive = collection.resumes[resumeIndex].isActive;

  // Remove the resume
  collection.resumes.splice(resumeIndex, 1);

  // If the deleted resume was active, set a new active resume
  if (wasActive && collection.resumes.length > 0) {
    collection.resumes[0].isActive = true;
    collection.activeResumeId = collection.resumes[0].id;
  } else if (collection.resumes.length === 0) {
    collection.activeResumeId = null;
  }

  saveResumeCollection(collection);
  return true;
}

/**
 * Import resume from JSON
 */
export function importResumeFromJSON(
  file: File,
  onSuccess: (resume: ResumeVersion) => void,
  onError: (error: string) => void
): void {
  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      const content = event.target?.result as string;
      const parsed = JSON.parse(content);

      // Validate structure
      if (!parsed.data || typeof parsed.data !== 'object') {
        throw new Error('Invalid resume format');
      }

      // Create a new resume with imported data
      const importedResume: ResumeVersion = {
        id: generateResumeId(),
        name: parsed.name || 'Imported Resume',
        data: parsed.data,
        createdAt: new Date(),
        updatedAt: new Date(),
        template: parsed.template || 'classic',
        accent: parsed.accent || 'teal',
        isActive: false,
      };

      const collection = getResumeCollection();
      collection.resumes.push(importedResume);
      saveResumeCollection(collection);

      onSuccess(importedResume);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to import resume');
    }
  };

  reader.onerror = () => {
    onError('Failed to read file');
  };

  reader.readAsText(file);
}

/**
 * Export resume to JSON
 */
export function exportResumeToJSON(resumeId: string): void {
  const collection = getResumeCollection();
  const resume = collection.resumes.find((r) => r.id === resumeId);

  if (!resume) {
    throw new Error('Resume not found');
  }

  const exportData = {
    name: resume.name,
    data: resume.data,
    template: resume.template,
    accent: resume.accent,
    exportedAt: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${resume.name.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Get resume version history (sorted by update date)
 */
export function getResumeHistory(): ResumeVersion[] {
  const collection = getResumeCollection();
  return [...collection.resumes].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );
}

/**
 * Rename resume
 */
export function renameResume(resumeId: string, newName: string): boolean {
  return updateResume(resumeId, { name: newName });
}

/**
 * Get resume count
 */
export function getResumeCount(): number {
  const collection = getResumeCollection();
  return collection.resumes.length;
}

/**
 * Migrate legacy resume data to new collection system
 */
export function migrateLegacyResume(): void {
  if (typeof window === 'undefined') return;

  const collection = getResumeCollection();
  
  // If collection already has resumes, don't migrate
  if (collection.resumes.length > 0) {
    return;
  }

  // Check for legacy resume data
  const legacyData = localStorage.getItem('resumeBuilderData');
  const legacyTemplate = localStorage.getItem('resumeTemplateChoice') || 'classic';
  const legacyAccent = localStorage.getItem('resumeAccentChoice') || 'teal';

  if (legacyData) {
    try {
      const parsed = JSON.parse(legacyData);
      
      const migratedResume: ResumeVersion = {
        id: generateResumeId(),
        name: parsed.personal?.name ? `${parsed.personal.name}'s Resume` : 'My Resume',
        data: parsed,
        createdAt: new Date(),
        updatedAt: new Date(),
        template: legacyTemplate,
        accent: legacyAccent,
        isActive: true,
      };

      collection.resumes = [migratedResume];
      collection.activeResumeId = migratedResume.id;
      saveResumeCollection(collection);

      console.log('Legacy resume migrated successfully');
    } catch (error) {
      console.error('Failed to migrate legacy resume:', error);
    }
  }
}
