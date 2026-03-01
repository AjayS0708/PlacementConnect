/**
 * Error Logging and Monitoring System
 * 
 * Centralized error handling, logging, and reporting
 */

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorCategory {
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  RUNTIME = 'runtime',
  UI = 'ui',
  DATA = 'data',
  UNKNOWN = 'unknown',
}

export interface ErrorLog {
  id: string;
  timestamp: string;
  message: string;
  stack?: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  context?: Record<string, unknown>;
  userAgent?: string;
  url?: string;
  userId?: string;
}

class ErrorLogger {
  private maxLogs = 50;
  private storageKey = 'error-logs';
  private errorCallbacks: Array<(error: ErrorLog) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalErrorHandlers();
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers() {
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        category: ErrorCategory.RUNTIME,
        severity: ErrorSeverity.HIGH,
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        category: ErrorCategory.RUNTIME,
        severity: ErrorSeverity.HIGH,
        context: {
          reason: event.reason,
        },
      });
    });

    // Console error override for debugging
    if (process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error;
      console.error = (...args: any[]) => {
        originalConsoleError.apply(console, args);
        
        // Log non-React errors
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
        ).join(' ');
        
        if (!message.includes('Warning:') && !message.includes('React')) {
          this.logError({
            message,
            category: ErrorCategory.RUNTIME,
            severity: ErrorSeverity.LOW,
          });
        }
      };
    }
  }

  /**
   * Log an error
   */
  logError({
    message,
    stack,
    category = ErrorCategory.UNKNOWN,
    severity = ErrorSeverity.MEDIUM,
    context,
  }: {
    message: string;
    stack?: string;
    category?: ErrorCategory;
    severity?: ErrorSeverity;
    context?: Record<string, unknown>;
  }): string {
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      message,
      stack,
      category,
      severity,
      context,
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    };

    // Store in localStorage
    this.storeError(errorLog);

    // Trigger callbacks
    this.errorCallbacks.forEach(callback => {
      try {
        callback(errorLog);
      } catch (e) {
        console.error('Error in error callback:', e);
      }
    });

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error [${severity}] - ${category}`);
      console.error('Message:', message);
      if (stack) console.error('Stack:', stack);
      if (context) console.log('Context:', context);
      console.groupEnd();
    }

    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production' && severity !== ErrorSeverity.LOW) {
      this.sendToMonitoring(errorLog);
    }

    return errorLog.id;
  }

  /**
   * Log a network error
   */
  logNetworkError(url: string, status: number, statusText: string, context?: Record<string, unknown>) {
    return this.logError({
      message: `Network error: ${status} ${statusText} at ${url}`,
      category: ErrorCategory.NETWORK,
      severity: status >= 500 ? ErrorSeverity.HIGH : ErrorSeverity.MEDIUM,
      context: {
        url,
        status,
        statusText,
        ...context,
      },
    });
  }

  /**
   * Log a validation error
   */
  logValidationError(field: string, message: string, context?: Record<string, unknown>) {
    return this.logError({
      message: `Validation error in ${field}: ${message}`,
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      context: {
        field,
        ...context,
      },
    });
  }

  /**
   * Store error in localStorage
   */
  private storeError(errorLog: ErrorLog) {
    if (typeof window === 'undefined') return;
    
    try {
      const existingLogs = this.getStoredErrors();
      existingLogs.unshift(errorLog);
      
      // Keep only the most recent errors
      const trimmedLogs = existingLogs.slice(0, this.maxLogs);
      
      localStorage.setItem(this.storageKey, JSON.stringify(trimmedLogs));
    } catch (e) {
      console.error('Failed to store error log:', e);
    }
  }

  /**
   * Get stored errors
   */
  getStoredErrors(): ErrorLog[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to retrieve error logs:', e);
      return [];
    }
  }

  /**
   * Clear stored errors
   */
  clearStoredErrors() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.error('Failed to clear error logs:', e);
    }
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: ErrorSeverity): ErrorLog[] {
    return this.getStoredErrors().filter(log => log.severity === severity);
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: ErrorCategory): ErrorLog[] {
    return this.getStoredErrors().filter(log => log.category === category);
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit: number = 10): ErrorLog[] {
    return this.getStoredErrors().slice(0, limit);
  }

  /**
   * Subscribe to error events
   */
  onError(callback: (error: ErrorLog) => void) {
    this.errorCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.errorCallbacks.indexOf(callback);
      if (index > -1) {
        this.errorCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Send error to monitoring service (placeholder)
   */
  private sendToMonitoring(errorLog: ErrorLog) {
    // In production, send to services like Sentry, LogRocket, etc.
    // For now, just a placeholder
    if (process.env.NEXT_PUBLIC_ERROR_MONITORING_ENDPOINT) {
      fetch(process.env.NEXT_PUBLIC_ERROR_MONITORING_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorLog),
      }).catch(err => {
        console.error('Failed to send error to monitoring:', err);
      });
    }
  }

  /**
   * Export errors as JSON
   */
  exportErrorsAsJSON(): string {
    return JSON.stringify(this.getStoredErrors(), null, 2);
  }

  /**
   * Export errors as CSV
   */
  exportErrorsAsCSV(): string {
    const errors = this.getStoredErrors();
    const headers = ['ID', 'Timestamp', 'Severity', 'Category', 'Message', 'URL'];
    const rows = errors.map(error => [
      error.id,
      error.timestamp,
      error.severity,
      error.category,
      error.message.replace(/"/g, '""'), // Escape quotes
      error.url || '',
    ]);

    return [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const errors = this.getStoredErrors();
    
    const bySeverity = errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<ErrorSeverity, number>);

    const byCategory = errors.reduce((acc, error) => {
      acc[error.category] = (acc[error.category] || 0) + 1;
      return acc;
    }, {} as Record<ErrorCategory, number>);

    return {
      total: errors.length,
      bySeverity,
      byCategory,
      mostRecent: errors[0],
      oldestStored: errors[errors.length - 1],
    };
  }
}

// Singleton instance
export const errorLogger = new ErrorLogger();

// Convenience functions
export function logError(message: string, context?: Record<string, unknown>) {
  return errorLogger.logError({
    message,
    category: ErrorCategory.RUNTIME,
    severity: ErrorSeverity.MEDIUM,
    context,
  });
}

export function logNetworkError(url: string, status: number, statusText: string) {
  return errorLogger.logNetworkError(url, status, statusText);
}

export function logValidationError(field: string, message: string) {
  return errorLogger.logValidationError(field, message);
}

export function getErrorLogs() {
  return errorLogger.getStoredErrors();
}

export function clearErrorLogs() {
  errorLogger.clearStoredErrors();
}
