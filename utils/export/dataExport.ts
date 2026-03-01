/**
 * Data Export/Import System
 * Handles backup and restore of all localStorage data
 */

export interface ExportData {
  version: string;
  exportDate: string;
  data: {
    savedJobs?: string[];
    jobStatuses?: Record<string, string>;
    jobPreferences?: any;
    filterPresets?: any[];
    recentSearches?: string[];
    placementReadiness?: any;
    resumeData?: any;
    userSettings?: any;
  };
}

/**
 * Export all application data to JSON
 */
export function exportAllData(): ExportData {
  const exportData: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    data: {},
  };

  // Export saved jobs
  const savedJobs = localStorage.getItem('savedJobs');
  if (savedJobs) {
    try {
      exportData.data.savedJobs = JSON.parse(savedJobs);
    } catch (e) {
      console.error('Error parsing savedJobs:', e);
    }
  }

  // Export job statuses
  const jobStatuses = localStorage.getItem('jobStatuses');
  if (jobStatuses) {
    try {
      exportData.data.jobStatuses = JSON.parse(jobStatuses);
    } catch (e) {
      console.error('Error parsing jobStatuses:', e);
    }
  }

  // Export job preferences
  const jobPreferences = localStorage.getItem('jobPreferences');
  if (jobPreferences) {
    try {
      exportData.data.jobPreferences = JSON.parse(jobPreferences);
    } catch (e) {
      console.error('Error parsing jobPreferences:', e);
    }
  }

  // Export filter presets
  const filterPresets = localStorage.getItem('filterPresets');
  if (filterPresets) {
    try {
      exportData.data.filterPresets = JSON.parse(filterPresets);
    } catch (e) {
      console.error('Error parsing filterPresets:', e);
    }
  }

  // Export recent searches
  const recentSearches = localStorage.getItem('recentSearches');
  if (recentSearches) {
    try {
      exportData.data.recentSearches = JSON.parse(recentSearches);
    } catch (e) {
      console.error('Error parsing recentSearches:', e);
    }
  }

  // Export placement readiness data
  const placementReadiness = localStorage.getItem('placementReadiness');
  if (placementReadiness) {
    try {
      exportData.data.placementReadiness = JSON.parse(placementReadiness);
    } catch (e) {
      console.error('Error parsing placementReadiness:', e);
    }
  }

  // Export resume data
  const resumeData = localStorage.getItem('resumeData');
  if (resumeData) {
    try {
      exportData.data.resumeData = JSON.parse(resumeData);
    } catch (e) {
      console.error('Error parsing resumeData:', e);
    }
  }

  // Export user settings
  const userSettings = localStorage.getItem('userSettings');
  if (userSettings) {
    try {
      exportData.data.userSettings = JSON.parse(userSettings);
    } catch (e) {
      console.error('Error parsing userSettings:', e);
    }
  }

  return exportData;
}

/**
 * Download exported data as JSON file
 */
export function downloadDataAsJSON(filename: string = 'placementconnect-backup'): void {
  const data = exportAllData();
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export function importDataFromJSON(
  file: File,
  onSuccess: (data: ExportData) => void,
  onError: (error: string) => void
): void {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const content = e.target?.result as string;
      const importedData: ExportData = JSON.parse(content);

      // Validate data structure
      if (!importedData.version || !importedData.data) {
        throw new Error('Invalid backup file format');
      }

      // Restore data to localStorage
      if (importedData.data.savedJobs) {
        localStorage.setItem('savedJobs', JSON.stringify(importedData.data.savedJobs));
      }

      if (importedData.data.jobStatuses) {
        localStorage.setItem('jobStatuses', JSON.stringify(importedData.data.jobStatuses));
      }

      if (importedData.data.jobPreferences) {
        localStorage.setItem('jobPreferences', JSON.stringify(importedData.data.jobPreferences));
      }

      if (importedData.data.filterPresets) {
        localStorage.setItem('filterPresets', JSON.stringify(importedData.data.filterPresets));
      }

      if (importedData.data.recentSearches) {
        localStorage.setItem('recentSearches', JSON.stringify(importedData.data.recentSearches));
      }

      if (importedData.data.placementReadiness) {
        localStorage.setItem('placementReadiness', JSON.stringify(importedData.data.placementReadiness));
      }

      if (importedData.data.resumeData) {
        localStorage.setItem('resumeData', JSON.stringify(importedData.data.resumeData));
      }

      if (importedData.data.userSettings) {
        localStorage.setItem('userSettings', JSON.stringify(importedData.data.userSettings));
      }

      onSuccess(importedData);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to import data');
    }
  };

  reader.onerror = () => {
    onError('Failed to read file');
  };

  reader.readAsText(file);
}

/**
 * Clear all application data
 */
export function clearAllData(): void {
  const keysToRemove = [
    'savedJobs',
    'jobStatuses',
    'jobPreferences',
    'filterPresets',
    'recentSearches',
    'placementReadiness',
    'resumeData',
    'userSettings',
  ];

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/**
 * Get storage size in bytes
 */
export function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Auto-backup to localStorage with timestamp
 */
export function autoBackup(): void {
  const data = exportAllData();
  const backupKey = `autoBackup_${Date.now()}`;
  
  try {
    localStorage.setItem(backupKey, JSON.stringify(data));
    
    // Keep only last 3 auto-backups
    const allKeys = Object.keys(localStorage);
    const backupKeys = allKeys
      .filter((key) => key.startsWith('autoBackup_'))
      .sort()
      .reverse();
    
    // Remove old backups
    backupKeys.slice(3).forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Auto-backup failed:', error);
  }
}

/**
 * Get list of auto-backups
 */
export function getAutoBackups(): Array<{ key: string; date: Date; size: number }> {
  const allKeys = Object.keys(localStorage);
  const backupKeys = allKeys.filter((key) => key.startsWith('autoBackup_'));
  
  return backupKeys.map((key) => {
    const timestamp = parseInt(key.replace('autoBackup_', ''));
    const data = localStorage.getItem(key) || '';
    
    return {
      key,
      date: new Date(timestamp),
      size: data.length,
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Restore from auto-backup
 */
export function restoreFromAutoBackup(backupKey: string): boolean {
  try {
    const backupData = localStorage.getItem(backupKey);
    if (!backupData) return false;
    
    const importedData: ExportData = JSON.parse(backupData);
    
    // Restore data
    Object.entries(importedData.data).forEach(([key, value]) => {
      if (value !== undefined) {
        localStorage.setItem(key === 'savedJobs' ? 'savedJobs' : 
                           key === 'jobStatuses' ? 'jobStatuses' :
                           key === 'jobPreferences' ? 'jobPreferences' :
                           key === 'filterPresets' ? 'filterPresets' :
                           key === 'recentSearches' ? 'recentSearches' :
                           key === 'placementReadiness' ? 'placementReadiness' :
                           key === 'resumeData' ? 'resumeData' :
                           key === 'userSettings' ? 'userSettings' : key, 
                           JSON.stringify(value));
      }
    });
    
    return true;
  } catch (error) {
    console.error('Failed to restore from auto-backup:', error);
    return false;
  }
}
