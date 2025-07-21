import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase-config';
import { ClinicalLogic, UserProfile } from './types';

export interface UserStatistics {
  formsCompleted: number;
  formsIncomplete: number;
  totalContributions: number;
  completionRate: number;
  recentActivity: Array<{
    id: string;
    formType: string;
    diseaseName: string;
    status: 'completed' | 'in_progress' | 'draft';
    submittedAt: Date;
    description: string;
  }>;
  topDiseases: Array<{
    diseaseName: string;
    count: number;
  }>;
  monthlyContributions: Array<{
    month: string;
    count: number;
  }>;
}

export interface ProfileAnalytics {
  userProfile: UserProfile;
  statistics: UserStatistics;
  isRealData: boolean;
}

// Get user's form submissions
export async function getUserFormSubmissions(userId: string): Promise<ClinicalLogic[]> {
  try {
    console.log('🔍 Fetching clinical logic submissions for user:', userId);
    
    // Try to query by userId first
    let q = query(
      collection(db, 'clinicalLogic'),
      where('userId', '==', userId),
      orderBy('submissionDate', 'desc')
    );
    
    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
      console.log('✅ Clinical logic query with userId successful, found:', querySnapshot.size, 'documents');
    } catch (error) {
      console.log('⚠️ Clinical logic query with userId failed, falling back to all documents:', error);
      // If userId query fails, try without userId filter (for existing data)
      q = query(
        collection(db, 'clinicalLogic'),
        orderBy('submissionDate', 'desc')
      );
      querySnapshot = await getDocs(q);
      console.log('✅ Clinical logic fallback query successful, found:', querySnapshot.size, 'documents');
    }
    
    const submissions: ClinicalLogic[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        ...data,
        id: doc.id,
        submissionDate: data.submissionDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as any);
    });
    
    console.log('📊 Processed clinical logic submissions:', submissions.length);
    return submissions;
  } catch (error) {
    console.error('❌ Error fetching user form submissions:', error);
    return [];
  }
}

// Get user's comprehensive parameter validation submissions
export async function getUserParameterSubmissions(userId: string): Promise<any[]> {
  try {
    console.log('🔍 Fetching parameter validation submissions for user:', userId);
    
    // Try to query by userId first
    let q = query(
      collection(db, 'comprehensiveParameterValidation'),
      where('userId', '==', userId),
      orderBy('submissionDate', 'desc')
    );
    
    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
      console.log('✅ Parameter validation query with userId successful, found:', querySnapshot.size, 'documents');
    } catch (error) {
      console.log('⚠️ Parameter validation query with userId failed, falling back to all documents:', error);
      // If userId query fails, try without userId filter (for existing data)
      q = query(
        collection(db, 'comprehensiveParameterValidation'),
        orderBy('submissionDate', 'desc')
      );
      querySnapshot = await getDocs(q);
      console.log('✅ Parameter validation fallback query successful, found:', querySnapshot.size, 'documents');
    }
    
    const submissions: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        ...data,
        id: doc.id,
        submissionDate: data.submissionDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    console.log('📊 Processed parameter validation submissions:', submissions.length);
    return submissions;
  } catch (error) {
    console.error('❌ Error fetching user parameter submissions:', error);
    return [];
  }
}

// Get user's advanced analytics submissions
export async function getUserAnalyticsSubmissions(userId: string): Promise<any[]> {
  try {
    console.log('🔍 Fetching analytics submissions for user:', userId);
    
    // Try to query by userId first
    let q = query(
      collection(db, 'advancedClinicalAnalytics'),
      where('userId', '==', userId),
      orderBy('submissionDate', 'desc')
    );
    
    let querySnapshot;
    try {
      querySnapshot = await getDocs(q);
      console.log('✅ Analytics query with userId successful, found:', querySnapshot.size, 'documents');
    } catch (error) {
      console.log('⚠️ Analytics query with userId failed, falling back to all documents:', error);
      // If userId query fails, try without userId filter (for existing data)
      q = query(
        collection(db, 'advancedClinicalAnalytics'),
        orderBy('submissionDate', 'desc')
      );
      querySnapshot = await getDocs(q);
      console.log('✅ Analytics fallback query successful, found:', querySnapshot.size, 'documents');
    }
    
    const submissions: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        ...data,
        id: doc.id,
        submissionDate: data.submissionDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      });
    });
    
    console.log('📊 Processed analytics submissions:', submissions.length);
    return submissions;
  } catch (error) {
    console.error('❌ Error fetching user analytics submissions:', error);
    return [];
  }
}

// Calculate user statistics
export function calculateUserStatistics(
  clinicalSubmissions: ClinicalLogic[],
  parameterSubmissions: any[],
  analyticsSubmissions: any[]
): UserStatistics {
  console.log('📈 Calculating statistics from:', {
    clinical: clinicalSubmissions.length,
    parameter: parameterSubmissions.length,
    analytics: analyticsSubmissions.length
  });

  const allSubmissions = [
    ...clinicalSubmissions.map(s => ({ ...s, formType: 'Clinical Logic Collection' })),
    ...parameterSubmissions.map(s => ({ ...s, formType: 'Parameter Validation' })),
    ...analyticsSubmissions.map(s => ({ ...s, formType: 'Advanced Analytics' }))
  ];

  const formsCompleted = allSubmissions.length;
  const formsIncomplete = 0; // We don't track incomplete forms yet
  const totalContributions = allSubmissions.length;
  const completionRate = formsCompleted > 0 ? Math.round((formsCompleted / (formsCompleted + formsIncomplete)) * 100) : 0;

  // Get recent activity (last 5 submissions)
  const recentActivity = allSubmissions
    .slice(0, 5)
    .map(submission => ({
      id: submission.id || '',
      formType: submission.formType,
      diseaseName: submission.diseaseName || 'Unknown Disease',
      status: 'completed' as const,
      submittedAt: submission.submissionDate || new Date(),
      description: `${submission.formType} - ${submission.diseaseName || 'Clinical Data'}`
    }));

  // Get top diseases
  const diseaseCounts = new Map<string, number>();
  allSubmissions.forEach(submission => {
    const diseaseName = submission.diseaseName || 'Unknown Disease';
    diseaseCounts.set(diseaseName, (diseaseCounts.get(diseaseName) || 0) + 1);
  });

  const topDiseases = Array.from(diseaseCounts.entries())
    .map(([diseaseName, count]) => ({ diseaseName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Get monthly contributions
  const monthlyCounts = new Map<string, number>();
  allSubmissions.forEach(submission => {
    const date = submission.submissionDate || new Date();
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) || 0) + 1);
  });

  const monthlyContributions = Array.from(monthlyCounts.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6); // Last 6 months

  const statistics = {
    formsCompleted,
    formsIncomplete,
    totalContributions,
    completionRate,
    recentActivity,
    topDiseases,
    monthlyContributions
  };

  console.log('📊 Calculated statistics:', statistics);
  return statistics;
}

// Get comprehensive profile analytics
export async function getProfileAnalytics(userId: string): Promise<ProfileAnalytics> {
  try {
    console.log('🚀 Starting profile analytics for user:', userId);
    
    // Fetch all user submissions
    const [clinicalSubmissions, parameterSubmissions, analyticsSubmissions] = await Promise.all([
      getUserFormSubmissions(userId),
      getUserParameterSubmissions(userId),
      getUserAnalyticsSubmissions(userId)
    ]);

    // Calculate statistics
    const statistics = calculateUserStatistics(
      clinicalSubmissions,
      parameterSubmissions,
      analyticsSubmissions
    );

    // Get user profile (this would come from auth context)
    const userProfile: UserProfile = {
      uid: userId,
      email: '',
      displayName: '',
      photoURL: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = {
      userProfile,
      statistics,
      isRealData: true
    };

    console.log('✅ Profile analytics completed:', result);
    return result;
  } catch (error) {
    console.error('❌ Error getting profile analytics:', error);
    
    // Return fallback data
    const fallbackResult = {
      userProfile: {
        uid: userId,
        email: '',
        displayName: '',
        photoURL: '',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      statistics: {
        formsCompleted: 0,
        formsIncomplete: 0,
        totalContributions: 0,
        completionRate: 0,
        recentActivity: [],
        topDiseases: [],
        monthlyContributions: []
      },
      isRealData: false
    };

    console.log('⚠️ Returning fallback analytics:', fallbackResult);
    return fallbackResult;
  }
}

// Real-time subscription to user statistics
export function subscribeToUserStatistics(
  userId: string,
  callback: (analytics: ProfileAnalytics) => void,
  errorCallback?: (error: Error) => void
) {
  try {
    console.log('📡 Setting up real-time subscriptions for user:', userId);
    
    // Subscribe to clinical logic submissions
    const clinicalQuery = query(
      collection(db, 'clinicalLogic'),
      orderBy('submissionDate', 'desc')
    );

    const unsubscribeClinical = onSnapshot(
      clinicalQuery,
      async (snapshot) => {
        try {
          console.log('📡 Clinical logic subscription update, documents:', snapshot.size);
          const analytics = await getProfileAnalytics(userId);
          callback(analytics);
        } catch (error) {
          console.error('❌ Clinical logic subscription error:', error);
          if (errorCallback) errorCallback(error as Error);
        }
      },
      (error) => {
        console.error('❌ Clinical logic subscription setup error:', error);
        if (errorCallback) errorCallback(error);
      }
    );

    // Subscribe to parameter validation submissions
    const parameterQuery = query(
      collection(db, 'comprehensiveParameterValidation'),
      orderBy('submissionDate', 'desc')
    );

    const unsubscribeParameter = onSnapshot(
      parameterQuery,
      async (snapshot) => {
        try {
          console.log('📡 Parameter validation subscription update, documents:', snapshot.size);
          const analytics = await getProfileAnalytics(userId);
          callback(analytics);
        } catch (error) {
          console.error('❌ Parameter validation subscription error:', error);
          if (errorCallback) errorCallback(error as Error);
        }
      },
      (error) => {
        console.error('❌ Parameter validation subscription setup error:', error);
        if (errorCallback) errorCallback(error);
      }
    );

    // Subscribe to analytics submissions
    const analyticsQuery = query(
      collection(db, 'advancedClinicalAnalytics'),
      orderBy('submissionDate', 'desc')
    );

    const unsubscribeAnalytics = onSnapshot(
      analyticsQuery,
      async (snapshot) => {
        try {
          console.log('📡 Analytics subscription update, documents:', snapshot.size);
          const analytics = await getProfileAnalytics(userId);
          callback(analytics);
        } catch (error) {
          console.error('❌ Analytics subscription error:', error);
          if (errorCallback) errorCallback(error as Error);
        }
      },
      (error) => {
        console.error('❌ Analytics subscription setup error:', error);
        if (errorCallback) errorCallback(error);
      }
    );

    console.log('✅ Real-time subscriptions set up successfully');
    
    // Return unsubscribe function
    return () => {
      console.log('🔌 Unsubscribing from real-time updates');
      unsubscribeClinical();
      unsubscribeParameter();
      unsubscribeAnalytics();
    };
  } catch (error) {
    console.error('❌ Error setting up real-time subscriptions:', error);
    if (errorCallback) errorCallback(error as Error);
    return () => {};
  }
} 