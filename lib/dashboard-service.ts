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
  getCountFromServer,
  DocumentData,
  QueryDocumentSnapshot
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

// Helper function to check if data is test/dummy
function isTestData(data: any): boolean {
  const diseaseName = data.diseaseName?.clinical || data.diseaseName || '';
  
  // Check for empty or invalid disease names
  if (!diseaseName || diseaseName.trim() === '' || diseaseName === 'Unknown') {
    return true;
  }
  
  // Check for test-related keywords
  const testKeywords = ['test', 'dummy', 'sample', 'example', 'demo', 'fake'];
  const lowerDiseaseName = diseaseName.toLowerCase();
  
  if (testKeywords.some(keyword => lowerDiseaseName.includes(keyword))) {
    return true;
  }
  
  // Check for specific test disease names
  const testDiseases = [
    'Test Disease',
    'Lupus',
    'Fibromyalgia', 
    'Alzheimer\'s Disease',
    'Parkinson\'s Disease',
    'Multiple Sclerosis',
    'Test Lupus',
    'Test Fibromyalgia'
  ];
  
  if (testDiseases.includes(diseaseName)) {
    return true;
  }
  
  // Check for test user names
  const userName = data.physicianName || '';
  if (userName.toLowerCase().includes('test') || userName.toLowerCase().includes('demo')) {
    return true;
  }
  
  // Check for test institutions
  const institution = data.institution || '';
  if (institution.toLowerCase().includes('test') || institution.toLowerCase().includes('demo')) {
    return true;
  }
  
  return false;
}

// Get comprehensive dashboard statistics
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('📊 Fetching dashboard statistics...');
    
    // Get counts from different collections - only count real data
    const [clinicalLogicCount, parameterValidationCount, analyticsCount] = await Promise.all([
      getCountFromServer(collection(db, 'clinicalLogic')),
      getCountFromServer(collection(db, 'comprehensiveParameterValidation')),
      getCountFromServer(collection(db, 'advancedClinicalAnalytics'))
    ]);

    // Get all submissions to filter out test data
    const allSubmissionsQuery = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(1000) // Get more to ensure we have enough real data
    );
    
    const allSubmissionsSnapshot = await getDocs(allSubmissionsQuery);
    
    // Filter out test data and count real submissions
    let realSubmissionsCount = 0;
    allSubmissionsSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      if (!isTestData(data)) {
        realSubmissionsCount++;
      }
    });

    const totalForms = realSubmissionsCount;
    
    // Get recent submissions (last 7 days) - only real data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentSubmissionsQuery = query(
      collection(db, 'clinicalLogic'),
      where('submissionDate', '>=', sevenDaysAgo),
      orderBy('submissionDate', 'desc')
    );
    
    const recentSubmissionsSnapshot = await getDocs(recentSubmissionsQuery);
    let recentSubmissions = 0;
    recentSubmissionsSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      if (!isTestData(data)) {
        recentSubmissions++;
      }
    });

    // Get top diseases - only real data
    const diseaseCounts = new Map<string, number>();
    
    allSubmissionsSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      if (!isTestData(data)) {
        const diseaseName = data.diseaseName?.clinical || data.diseaseName || '';
        if (diseaseName && diseaseName.trim() !== '') {
          diseaseCounts.set(diseaseName, (diseaseCounts.get(diseaseName) || 0) + 1);
        }
      }
    });

    const topDiseases = Array.from(diseaseCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate completion rate based on real data
    const completionRate = totalForms > 0 ? Math.round((recentSubmissions / totalForms) * 100) : 0;

    // Get monthly contributions - only real data
    const monthlyCounts = new Map<string, number>();
    allSubmissionsSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      if (!isTestData(data)) {
        const date = data.submissionDate?.toDate() || new Date();
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
      }
    });

    const monthlyContributions = Array.from(monthlyCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    // Get user activity from real data only
    const userActivity: Array<{ userId: string; displayName: string; submissions: number; lastActive: Date }> = [];
    
    if (allSubmissionsSnapshot.size > 0) {
      const userSubmissions = new Map<string, { submissions: number; lastActive: Date; displayName: string }>();
      
      allSubmissionsSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        if (!isTestData(data)) {
          const userId = data.userId || 'unknown';
          const displayName = data.physicianName || 'Unknown User';
          const submissionDate = data.submissionDate?.toDate() || new Date();
          
          if (userSubmissions.has(userId)) {
            const existing = userSubmissions.get(userId)!;
            existing.submissions += 1;
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
        }
      });
      
      userActivity.push(...Array.from(userSubmissions.entries())
        .map(([userId, data]) => ({
          userId,
          displayName: data.displayName,
          submissions: data.submissions,
          lastActive: data.lastActive
        }))
        .sort((a, b) => b.submissions - a.submissions)
        .slice(0, 5)
      );
    }

    // Calculate real data points from actual submissions
    let totalDataPoints = 0;
    allSubmissionsSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      if (!isTestData(data)) {
        // Count actual data fields from the submission
        const dataFields = Object.keys(data).length;
        totalDataPoints += dataFields;
      }
    });

    // Calculate active collaborations from real data
    let activeCollaborations = 0;
    if (allSubmissionsSnapshot.size > 0) {
      // Count unique institutions as a proxy for collaborations
      const uniqueInstitutions = new Set<string>();
      allSubmissionsSnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data();
        if (!isTestData(data) && data.institution) {
          uniqueInstitutions.add(data.institution);
        }
      });
      activeCollaborations = uniqueInstitutions.size;
    }

    const stats: DashboardStats = {
      totalForms,
      totalUsers: userActivity.length,
      totalDataPoints,
      completionRate,
      recentSubmissions,
      activeCollaborations,
      topDiseases,
      monthlyContributions,
      userActivity,
      systemHealth: {
        isConnected: allSubmissionsSnapshot.size >= 0, // True if we can access the database
        cacheSize: 0,
        lastUpdate: new Date()
      }
    };

    console.log('✅ Dashboard statistics loaded:', stats);
    return stats;
  } catch (error) {
    console.warn('⚠️ Firebase permission error, showing empty data:', error);
    
    // Return empty data when Firebase permissions fail
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

// Get recent activity
export async function getRecentActivity(limitCount = 10): Promise<RecentActivity[]> {
  try {
    console.log('📊 Fetching recent activity...');
    
    const recentSubmissionsQuery = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc'),
      limit(limitCount * 3) // Get more to filter out test data
    );
    
    const snapshot = await getDocs(recentSubmissionsQuery);
    const activities: RecentActivity[] = [];
    
    snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      
      // Only include real, meaningful submissions
      if (!isTestData(data)) {
        const diseaseName = data.diseaseName?.clinical || data.diseaseName || '';
        if (diseaseName && diseaseName.trim() !== '') {
          activities.push({
            id: doc.id,
            type: 'form_submitted',
            title: 'New Clinical Data Submitted',
            description: `Disease: ${diseaseName}`,
            timestamp: data.submissionDate?.toDate() || new Date(),
            userId: data.userId,
            userName: data.physicianName,
            metadata: {
              diseaseName: data.diseaseName,
              institution: data.institution
            }
          });
        }
      }
    });

    // Limit to requested count after filtering
    const filteredActivities = activities.slice(0, limitCount);

    console.log('✅ Recent activity loaded:', filteredActivities.length, 'real items (filtered out test data)');
    return filteredActivities;
  } catch (error) {
    console.warn('⚠️ Firebase permission error, showing empty recent activity:', error);
    
    // Return empty recent activity when Firebase permissions fail
    const emptyActivities: RecentActivity[] = [];

    console.log('✅ Empty recent activity loaded');
    return emptyActivities;
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
          console.warn('⚠️ Dashboard subscription error, showing empty data:', error);
          // Provide empty data when subscription fails
          const emptyStats = await getDashboardStats(); // This will return empty data
          callback(emptyStats);
        }
      },
      (error) => {
        console.warn('⚠️ Dashboard subscription setup error, showing empty data:', error);
        // Provide empty data when subscription setup fails
        getDashboardStats().then(emptyStats => callback(emptyStats));
        if (errorCallback) errorCallback(error);
      }
    );

    console.log('✅ Dashboard real-time subscription set up');
    return unsubscribe;
  } catch (error) {
    console.warn('⚠️ Error setting up dashboard subscription, showing empty data:', error);
    // Provide empty data when setup fails
    getDashboardStats().then(emptyStats => callback(emptyStats));
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
      recentActivity,
      systemStatus
    };

    console.log('✅ System metrics loaded:', metrics);
    return metrics;
  } catch (error) {
    console.warn('⚠️ Firebase permission error, showing empty system metrics:', error);
    
    // Return empty system metrics when Firebase permissions fail
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