// Firebase imports removed - using Mock Data Service instead
import { ClinicalLogic, UserProfile } from './types';

export interface DashboardStats {
  totalForms: number;
  totalUsers: number;
  totalDataPoints: number;
  completionRate: number;
  recentSubmissions: number;
  activeCollaborations: number;
  topDiseases: Array<{ name: string; count: number }>;
  monthlyContributions: Array<{ month: string; count: number }>;
  userActivity: Array<{ userId: string; displayName: string; submissions: number; lastActive: Date }>;
  systemHealth: {
    isConnected: boolean;
    cacheSize: number;
    lastUpdate: Date;
  };
}

export interface RecentActivity {
  id: string;
  type: 'form_submitted' | 'user_registered' | 'collaboration_created' | 'data_exported';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userName?: string;
  metadata?: any;
}

export interface SystemMetrics {
  totalSubmissions: number;
  uniqueUsers: number;
  averageCompletionRate: number;
  topContributors: Array<{ userId: string; name: string; submissions: number }>;
  recentActivity: RecentActivity[];
  systemStatus: 'healthy' | 'warning' | 'error';
}

// Mock data service to eliminate Firebase calls
class MockDataService {
  private mockSubmissions = [
    {
      submissionId: 'mock-1',
      collaboratorId: 'user-1',
      submittedAt: new Date('2024-01-15'),
      comprehensiveData: {
        diseaseOverview: {
          diseaseName: { clinical: 'Diabetes Mellitus Type 2' }
        },
        physicianConsent: {
          physicianName: 'Dr. Sarah Johnson',
          institution: 'City General Hospital'
        }
      }
    },
    {
      submissionId: 'mock-2',
      collaboratorId: 'user-2',
      submittedAt: new Date('2024-01-20'),
      comprehensiveData: {
        diseaseOverview: {
          diseaseName: { clinical: 'Hypertension' }
        },
        physicianConsent: {
          physicianName: 'Dr. Michael Chen',
          institution: 'Regional Medical Center'
        }
      }
    },
    {
      submissionId: 'mock-3',
      collaboratorId: 'user-1',
      submittedAt: new Date('2024-01-25'),
      comprehensiveData: {
        diseaseOverview: {
          diseaseName: { clinical: 'Asthma' }
        },
        physicianConsent: {
          physicianName: 'Dr. Sarah Johnson',
          institution: 'City General Hospital'
        }
      }
    }
  ];

  async getAllSubmissions() {
    return this.mockSubmissions;
  }
}

// Get comprehensive dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('📊 Fetching dashboard statistics from mock data...');
    
    const mockService = new MockDataService();
    const allSubmissions = await mockService.getAllSubmissions();
    
    const totalForms = allSubmissions.length;
    
    // Get recent submissions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSubmissions = allSubmissions.filter(submission => {
      const submissionDate = submission.submittedAt;
      return submissionDate >= sevenDaysAgo;
    });

    // Get top diseases
    const diseaseCounts = new Map<string, number>();
    
    allSubmissions.forEach(submission => {
      const diseaseNameObj = submission.comprehensiveData?.diseaseOverview?.diseaseName;
      const diseaseName = typeof diseaseNameObj === 'string' ? diseaseNameObj : diseaseNameObj?.clinical || '';
      if (diseaseName && diseaseName.trim() !== '') {
        diseaseCounts.set(diseaseName, (diseaseCounts.get(diseaseName) || 0) + 1);
      }
    });

    const topDiseases = Array.from(diseaseCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate completion rate
    const completionRate = totalForms > 0 ? Math.round((recentSubmissions.length / totalForms) * 100) : 0;

    // Get monthly contributions
    const monthlyCounts = new Map<string, number>();
    allSubmissions.forEach(submission => {
      const date = submission.submittedAt;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
    });

    const monthlyContributions = Array.from(monthlyCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    // Get user activity
    const userActivity: Array<{ userId: string; displayName: string; submissions: number; lastActive: Date }> = [];
    
    if (allSubmissions.length > 0) {
      const userSubmissions = new Map<string, { submissions: number; lastActive: Date; displayName: string }>();
      
      allSubmissions.forEach(submission => {
        const userId = submission.collaboratorId || 'unknown';
        const displayName = submission.comprehensiveData?.physicianConsent?.physicianName || 'Unknown User';
        const submissionDate = submission.submittedAt;
        
        if (userSubmissions.has(userId)) {
          const existing = userSubmissions.get(userId)!;
          existing.submissions++;
          if (submissionDate > existing.lastActive) {
            existing.lastActive = submissionDate;
          }
        } else {
          userSubmissions.set(userId, {
            submissions: 1,
            lastActive: submissionDate,
            displayName
          });
        }
      });

      userActivity.push(...Array.from(userSubmissions.entries()).map(([userId, data]) => ({
        userId,
        displayName: data.displayName,
        submissions: data.submissions,
        lastActive: data.lastActive
      })));
    }

    // Calculate total data points
    let totalDataPoints = 0;
    allSubmissions.forEach(submission => {
      if (submission.comprehensiveData) {
        totalDataPoints += Object.keys(submission.comprehensiveData).length;
      }
    });

    // Calculate active collaborations (unique institutions)
    let activeCollaborations = 0;
    if (allSubmissions.length > 0) {
      const uniqueInstitutions = new Set<string>();
      allSubmissions.forEach(submission => {
        const institution = submission.comprehensiveData?.physicianConsent?.institution || '';
        if (institution && institution.trim() !== '') {
          uniqueInstitutions.add(institution);
        }
      });
      activeCollaborations = uniqueInstitutions.size;
    }

    const stats: DashboardStats = {
      totalForms,
      totalUsers: userActivity.length,
      totalDataPoints,
      completionRate,
      recentSubmissions: recentSubmissions.length,
      activeCollaborations,
      topDiseases,
      monthlyContributions,
      userActivity,
      systemHealth: {
        isConnected: true,
        cacheSize: 0,
        lastUpdate: new Date()
      }
    };

    console.log('✅ Mock dashboard statistics loaded:', stats);
    return stats;
  } catch (error) {
    console.warn('⚠️ Error loading mock data, showing empty data:', error);
    
    // Return empty data when mock data fails
    const emptyStats: DashboardStats = {
      totalForms: 0,
      totalUsers: 0,
      totalDataPoints: 0,
      completionRate: 0,
      recentSubmissions: 0,
      activeCollaborations: 0,
      topDiseases: [],
      monthlyContributions: [],
      userActivity: [],
      systemHealth: {
        isConnected: false,
        cacheSize: 0,
        lastUpdate: new Date()
      }
    };

    console.log('✅ Empty dashboard statistics loaded');
    return emptyStats;
  }
}

// Subscribe to real-time dashboard updates (disabled due to Firebase permissions)
export function subscribeToDashboardUpdates(
  callback: (stats: DashboardStats) => void,
  errorCallback?: (error: Error) => void
) {
  // Disabled due to Firebase permission issues
  console.log('📡 Real-time subscription disabled due to Firebase permissions');
  
  // Return a no-op unsubscribe function
  return () => {};
}

// Get system metrics for admin
export async function getSystemMetrics(): Promise<SystemMetrics> {
  try {
    console.log('📊 Fetching system metrics...');
    
    const stats = await getDashboardStats();
    
    // Calculate top contributors
    const topContributors = stats.userActivity
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 5)
      .map(user => ({
        userId: user.userId,
        name: user.displayName,
        submissions: user.submissions
      }));

    // Calculate system status based on real data
    let systemStatus: 'healthy' | 'warning' | 'error' = 'healthy';
    if (stats.totalForms === 0) {
      systemStatus = 'warning'; // No data available
    } else if (stats.completionRate < 50) {
      systemStatus = 'warning'; // Low completion rate
    } else if (stats.completionRate < 25) {
      systemStatus = 'error'; // Very low completion rate
    }

    const metrics: SystemMetrics = {
      totalSubmissions: stats.totalForms,
      uniqueUsers: stats.totalUsers,
      averageCompletionRate: stats.completionRate,
      topContributors,
      recentActivity: [], // Empty array since we removed recent activity
      systemStatus
    };

    console.log('✅ System metrics loaded:', metrics);
    return metrics;
  } catch (error) {
    console.warn('⚠️ Error loading system metrics, showing empty data:', error);
    
    // Return empty system metrics when mock data fails
    const emptyMetrics: SystemMetrics = {
      totalSubmissions: 0,
      uniqueUsers: 0,
      averageCompletionRate: 0,
      topContributors: [],
      recentActivity: [],
      systemStatus: 'error' // Indicates no data available
    };

    console.log('✅ Empty system metrics loaded');
    return emptyMetrics;
  }
}

// Export data for admin
export async function exportDashboardData(): Promise<any> {
  try {
    console.log('📊 Exporting dashboard data...');
    
    const [stats, systemMetrics] = await Promise.all([
      getDashboardStats(),
      getSystemMetrics()
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      stats,
      recentActivity: [], // Empty array since we removed recent activity
      systemMetrics,
      metadata: {
        version: '1.0.0',
        exportType: 'dashboard_data'
      }
    };

    console.log('✅ Dashboard data exported');
    return exportData;
  } catch (error) {
    console.error('❌ Error exporting dashboard data:', error);
    throw new Error('Failed to export dashboard data');
  }
} 