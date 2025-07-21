import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  count,
  getCountFromServer
} from 'firebase/firestore';
import { db } from './firebase-config';
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

// Get comprehensive dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('📊 Fetching dashboard statistics...');
    
    // Get counts from different collections
    const [clinicalLogicCount, parameterValidationCount, analyticsCount] = await Promise.all([
      getCountFromServer(collection(db, 'clinicalLogic')),
      getCountFromServer(collection(db, 'comprehensiveParameterValidation')),
      getCountFromServer(collection(db, 'advancedClinicalAnalytics'))
    ]);

    const totalForms = clinicalLogicCount.data().count + parameterValidationCount.data().count + analyticsCount.data().count;
    
    // Get recent submissions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSubmissionsQuery = query(
      collection(db, 'clinicalLogic'),
      where('submissionDate', '>=', sevenDaysAgo),
      orderBy('submissionDate', 'desc')
    );
    
    const recentSubmissionsSnapshot = await getDocs(recentSubmissionsQuery);
    const recentSubmissions = recentSubmissionsSnapshot.size;

    // Get top diseases
    const allSubmissionsQuery = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(100)
    );
    
    const submissionsSnapshot = await getDocs(allSubmissionsQuery);
    const diseaseCounts = new Map<string, number>();
    
    submissionsSnapshot.forEach(doc => {
      const data = doc.data();
      const diseaseName = data.diseaseName?.clinical || data.diseaseName || 'Unknown Disease';
      diseaseCounts.set(diseaseName, (diseaseCounts.get(diseaseName) || 0) + 1);
    });

    const topDiseases = Array.from(diseaseCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate completion rate (simplified)
    const completionRate = totalForms > 0 ? Math.round((recentSubmissions / totalForms) * 100) : 0;

    // Get monthly contributions
    const monthlyCounts = new Map<string, number>();
    submissionsSnapshot.forEach(doc => {
      const data = doc.data();
      const date = data.submissionDate?.toDate() || new Date();
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
    });

    const monthlyContributions = Array.from(monthlyCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    // Mock user activity (in real app, you'd query user profiles)
    const userActivity = [
      { userId: 'user1', displayName: 'Dr. Sarah Johnson', submissions: 12, lastActive: new Date() },
      { userId: 'user2', displayName: 'Dr. Michael Chen', submissions: 8, lastActive: new Date() },
      { userId: 'user3', displayName: 'Dr. Emily Davis', submissions: 6, lastActive: new Date() }
    ];

    const stats: DashboardStats = {
      totalForms,
      totalUsers: userActivity.length, // Mock for now
      totalDataPoints: totalForms * 50, // Estimate
      completionRate,
      recentSubmissions,
      activeCollaborations: 3, // Mock
      topDiseases,
      monthlyContributions,
      userActivity,
      systemHealth: {
        isConnected: true,
        cacheSize: 0,
        lastUpdate: new Date()
      }
    };

    console.log('✅ Dashboard statistics loaded:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error fetching dashboard statistics:', error);
    throw new Error('Failed to load dashboard statistics');
  }
}

// Get recent activity
export async function getRecentActivity(limitCount = 10): Promise<RecentActivity[]> {
  try {
    console.log('📊 Fetching recent activity...');
    
    const recentSubmissionsQuery = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(recentSubmissionsQuery);
    const activities: RecentActivity[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        type: 'form_submitted',
        title: 'New Clinical Data Submitted',
        description: `Disease: ${data.diseaseName?.clinical || data.diseaseName || 'Unknown'}`,
        timestamp: data.submissionDate?.toDate() || new Date(),
        userId: data.userId,
        userName: data.physicianName,
        metadata: {
          diseaseName: data.diseaseName,
          institution: data.institution
        }
      });
    });

    console.log('✅ Recent activity loaded:', activities.length, 'items');
    return activities;
  } catch (error) {
    console.error('❌ Error fetching recent activity:', error);
    throw new Error('Failed to load recent activity');
  }
}

// Subscribe to real-time dashboard updates
export function subscribeToDashboardUpdates(
  callback: (stats: DashboardStats) => void,
  errorCallback?: (error: Error) => void
) {
  try {
    console.log('📡 Setting up dashboard real-time subscription...');
    
    // Subscribe to clinical logic submissions
    const clinicalLogicQuery = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(
      clinicalLogicQuery,
      async () => {
        try {
          const stats = await getDashboardStats();
          callback(stats);
        } catch (error) {
          console.error('❌ Dashboard subscription error:', error);
          if (errorCallback) errorCallback(error as Error);
        }
      },
      (error) => {
        console.error('❌ Dashboard subscription setup error:', error);
        if (errorCallback) errorCallback(error);
      }
    );

    console.log('✅ Dashboard real-time subscription set up');
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up dashboard subscription:', error);
    if (errorCallback) errorCallback(error as Error);
    return () => {};
  }
}

// Get system metrics for admin
export async function getSystemMetrics(): Promise<SystemMetrics> {
  try {
    console.log('📊 Fetching system metrics...');
    
    const stats = await getDashboardStats();
    const recentActivity = await getRecentActivity(5);
    
    // Calculate top contributors
    const topContributors = stats.userActivity
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 5)
      .map(user => ({
        userId: user.userId,
        name: user.displayName,
        submissions: user.submissions
      }));

    const metrics: SystemMetrics = {
      totalSubmissions: stats.totalForms,
      uniqueUsers: stats.totalUsers,
      averageCompletionRate: stats.completionRate,
      topContributors,
      recentActivity,
      systemStatus: 'healthy' // You could add logic to determine this
    };

    console.log('✅ System metrics loaded:', metrics);
    return metrics;
  } catch (error) {
    console.error('❌ Error fetching system metrics:', error);
    throw new Error('Failed to load system metrics');
  }
}

// Export data for admin
export async function exportDashboardData(): Promise<any> {
  try {
    console.log('📊 Exporting dashboard data...');
    
    const [stats, recentActivity, systemMetrics] = await Promise.all([
      getDashboardStats(),
      getRecentActivity(50),
      getSystemMetrics()
    ]);

    const exportData = {
      exportDate: new Date().toISOString(),
      stats,
      recentActivity,
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