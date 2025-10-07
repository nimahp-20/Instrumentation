// System Issue Management Utility
// This file handles system issues in a production-safe way

export interface SystemIssue {
  id: string;
  type: 'maintenance' | 'service' | 'payment' | 'inventory' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  userFacing: boolean; // Whether to show to end users
  showInProduction: boolean; // Whether to show in production
  showInDevelopment: boolean; // Whether to show in development
  startTime?: Date;
  endTime?: Date;
  affectedServices?: string[];
}

export class IssueManager {
  private static issues: SystemIssue[] = [];

  // Add a new issue
  static addIssue(issue: Omit<SystemIssue, 'id'>): SystemIssue {
    const newIssue: SystemIssue = {
      ...issue,
      id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      startTime: new Date()
    };
    
    this.issues.push(newIssue);
    return newIssue;
  }

  // Remove an issue by ID
  static removeIssue(id: string): boolean {
    const index = this.issues.findIndex(issue => issue.id === id);
    if (index > -1) {
      this.issues.splice(index, 1);
      return true;
    }
    return false;
  }

  // Get all issues filtered by environment
  static getFilteredIssues(): SystemIssue[] {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return this.issues.filter(issue => {
      if (isDevelopment) {
        return issue.showInDevelopment;
      } else {
        return issue.userFacing && issue.showInProduction;
      }
    });
  }

  // Get issues by severity
  static getIssuesBySeverity(severity: SystemIssue['severity']): SystemIssue[] {
    return this.getFilteredIssues().filter(issue => issue.severity === severity);
  }

  // Get critical issues only
  static getCriticalIssues(): SystemIssue[] {
    return this.getIssuesBySeverity('critical');
  }

  // Check if there are any user-facing issues
  static hasUserFacingIssues(): boolean {
    return this.getFilteredIssues().length > 0;
  }

  // Clear all issues
  static clearAllIssues(): void {
    this.issues = [];
  }

  // Get issue count by type
  static getIssueCountByType(): Record<string, number> {
    const counts: Record<string, number> = {};
    this.getFilteredIssues().forEach(issue => {
      counts[issue.type] = (counts[issue.type] || 0) + 1;
    });
    return counts;
  }

  // Sample issues for development/testing
  static loadSampleIssues(): void {
    this.clearAllIssues();
    
    // Development-only issues (technical details)
    this.addIssue({
      type: 'service',
      severity: 'medium',
      title: 'اتصال به پایگاه داده کند است',
      message: 'Database connection response time is above 2 seconds',
      userFacing: false,
      showInProduction: false,
      showInDevelopment: true,
      affectedServices: ['database', 'api']
    });

    this.addIssue({
      type: 'service',
      severity: 'high',
      title: 'صفحه محصولات بارگذاری نمی‌شود',
      message: 'Products API endpoint returning 500 errors',
      userFacing: false,
      showInProduction: false,
      showInDevelopment: true,
      affectedServices: ['products-api', 'frontend']
    });

    // User-facing issues (production-safe)
    this.addIssue({
      type: 'payment',
      severity: 'critical',
      title: 'سیستم پرداخت موقتاً غیرفعال است',
      message: 'Payment gateway is experiencing issues. Please try again later.',
      userFacing: true,
      showInProduction: true,
      showInDevelopment: true,
      affectedServices: ['payment-gateway']
    });

    this.addIssue({
      type: 'inventory',
      severity: 'low',
      title: 'برخی محصولات موقتاً در دسترس نیستند',
      message: 'Some products are temporarily out of stock',
      userFacing: true,
      showInProduction: true,
      showInDevelopment: true,
      affectedServices: ['inventory-system']
    });

    // Maintenance notice
    this.addIssue({
      type: 'maintenance',
      severity: 'medium',
      title: 'تعمیرات برنامه‌ریزی شده',
      message: 'Scheduled maintenance will occur tonight from 2-4 AM',
      userFacing: true,
      showInProduction: true,
      showInDevelopment: true,
      affectedServices: ['all-services']
    });
  }

  // Production-safe issue creation helpers
  static createUserFacingIssue(
    type: SystemIssue['type'],
    severity: SystemIssue['severity'],
    title: string,
    message: string,
    affectedServices?: string[]
  ): SystemIssue {
    return this.addIssue({
      type,
      severity,
      title,
      message,
      userFacing: true,
      showInProduction: true,
      showInDevelopment: true,
      affectedServices
    });
  }

  static createInternalIssue(
    type: SystemIssue['type'],
    severity: SystemIssue['severity'],
    title: string,
    message: string,
    affectedServices?: string[]
  ): SystemIssue {
    return this.addIssue({
      type,
      severity,
      title,
      message,
      userFacing: false,
      showInProduction: false,
      showInDevelopment: true,
      affectedServices
    });
  }
}

// Environment-specific issue management
export const getIssuesForEnvironment = (): SystemIssue[] => {
  return IssueManager.getFilteredIssues();
};

// Check if we should show issues banner
export const shouldShowIssuesBanner = (): boolean => {
  return IssueManager.hasUserFacingIssues();
};

// Get the highest severity level among current issues
export const getHighestSeverity = (): SystemIssue['severity'] | null => {
  const issues = IssueManager.getFilteredIssues();
  if (issues.length === 0) return null;
  
  const severityOrder = ['low', 'medium', 'high', 'critical'];
  let highestSeverity: SystemIssue['severity'] = 'low';
  
  issues.forEach(issue => {
    const currentIndex = severityOrder.indexOf(issue.severity);
    const highestIndex = severityOrder.indexOf(highestSeverity);
    if (currentIndex > highestIndex) {
      highestSeverity = issue.severity;
    }
  });
  
  return highestSeverity;
};
