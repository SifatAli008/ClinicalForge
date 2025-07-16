import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  onSnapshot,
  enableNetwork,
  disableNetwork
} from 'firebase/firestore';
import { db, checkConnection, optimizeConnection } from './firebase';
import { ClinicalLogic, Contributor, DashboardAnalytics } from './types';

// Cache for performance optimization
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache management
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

const clearCache = () => {
  cache.clear();
};

// Collection names
const COLLECTIONS = {
  CLINICAL_LOGIC: 'clinicalLogic',
  CONTRIBUTORS: 'contributors',
  ANALYTICS: 'analytics',
} as const;

// Submit clinical logic data with connection optimization
export async function submitClinicalLogic(data: ClinicalLogic): Promise<string> {
  try {
    // Check connection before submitting
    await optimizeConnection();
    
    const docRef = await addDoc(collection(db, COLLECTIONS.CLINICAL_LOGIC), {
      ...data,
      submissionDate: Timestamp.fromDate(data.submissionDate),
      createdAt: Timestamp.now(),
    });
    
    // Update contributor stats
    await updateContributorStats(data.physicianName, data.institution, data.specialty);
    
    // Clear cache to ensure fresh data
    clearCache();
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting clinical logic:', error);
    
    // Try to reconnect and retry once
    try {
      await checkConnection();
      const docRef = await addDoc(collection(db, COLLECTIONS.CLINICAL_LOGIC), {
        ...data,
        submissionDate: Timestamp.fromDate(data.submissionDate),
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      throw new Error('Failed to submit clinical logic after retry');
    }
  }
}

// Get all clinical logic submissions with caching
export async function getClinicalLogicSubmissions(): Promise<ClinicalLogic[]> {
  const cacheKey = 'clinical_logic_submissions';
  
  // Check cache first
  const cached = getCachedData(cacheKey);
  if (cached) {
    return cached;
  }
  
  try {
    await optimizeConnection();
    
    const q = query(
      collection(db, COLLECTIONS.CLINICAL_LOGIC),
      orderBy('submissionDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: ClinicalLogic[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        ...data,
        submissionDate: data.submissionDate.toDate(),
      } as ClinicalLogic);
    });
    
    // Cache the results
    setCachedData(cacheKey, submissions);
    
    return submissions;
  } catch (error) {
    console.error('Error fetching clinical logic:', error);
    
    // Try to reconnect and retry once
    try {
      await checkConnection();
      const q = query(
        collection(db, COLLECTIONS.CLINICAL_LOGIC),
        orderBy('submissionDate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const submissions: ClinicalLogic[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        submissions.push({
          ...data,
          submissionDate: data.submissionDate.toDate(),
        } as ClinicalLogic);
      });
      
      setCachedData(cacheKey, submissions);
      return submissions;
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      throw new Error('Failed to fetch clinical logic after retry');
    }
  }
}

// Get contributors
export async function getContributors(): Promise<Contributor[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONTRIBUTORS),
      orderBy('lastSubmission', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const contributors: Contributor[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      contributors.push({
        id: doc.id,
        ...data,
        lastSubmission: data.lastSubmission.toDate(),
      } as Contributor);
    });
    
    return contributors;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    throw new Error('Failed to fetch contributors');
  }
}

// Update contributor statistics
async function updateContributorStats(
  physicianName: string, 
  institution: string, 
  specialty: string
): Promise<void> {
  try {
    // Check if contributor exists
    const contributorQuery = query(
      collection(db, COLLECTIONS.CONTRIBUTORS),
      where('name', '==', physicianName),
      where('institution', '==', institution)
    );
    
    const contributorSnapshot = await getDocs(contributorQuery);
    
    if (contributorSnapshot.empty) {
      // Create new contributor
      await addDoc(collection(db, COLLECTIONS.CONTRIBUTORS), {
        name: physicianName,
        institution,
        specialty,
        submissionCount: 1,
        lastSubmission: Timestamp.now(),
        attributionConsent: true, // Default to true, can be updated later
      });
    } else {
      // Update existing contributor
      const contributorDoc = contributorSnapshot.docs[0];
      const currentData = contributorDoc.data();
      
      await updateDoc(doc(db, COLLECTIONS.CONTRIBUTORS, contributorDoc.id), {
        submissionCount: currentData.submissionCount + 1,
        lastSubmission: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Error updating contributor stats:', error);
  }
}

// Get dashboard analytics
export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  try {
    const submissions = await getClinicalLogicSubmissions();
    
    // Calculate analytics
    const totalSubmissions = submissions.length;
    const averageOnsetAge = submissions.length > 0 
      ? submissions.reduce((sum, sub) => sum + sub.typicalOnsetAge, 0) / submissions.length 
      : 0;
    
    // Calculate comorbidity frequency
    const comorbidityCounts: { [key: string]: number } = {};
    submissions.forEach(sub => {
      if (sub.commonComorbidities) {
        sub.commonComorbidities.forEach(comorbidity => {
          comorbidityCounts[comorbidity] = (comorbidityCounts[comorbidity] || 0) + 1;
        });
      }
    });
    
    const mostCommonComorbidities = Object.entries(comorbidityCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calculate location distribution
    const urbanCount = submissions.filter(sub => sub.urbanRuralBias === 'Urban').length;
    const ruralCount = submissions.filter(sub => sub.urbanRuralBias === 'Rural').length;
    
    // Calculate disease type distribution
    const diseaseTypeCounts: { [key: string]: number } = {};
    submissions.forEach(sub => {
      diseaseTypeCounts[sub.diseaseType] = (diseaseTypeCounts[sub.diseaseType] || 0) + 1;
    });
    
    const diseaseTypeDistribution = Object.entries(diseaseTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
    
    return {
      totalSubmissions,
      averageOnsetAge: Math.round(averageOnsetAge * 10) / 10,
      mostCommonComorbidities,
      submissionLocations: {
        urban: urbanCount,
        rural: ruralCount,
      },
      diseaseTypeDistribution,
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    throw new Error('Failed to calculate analytics');
  }
}

// Export data as JSON
export async function exportData(): Promise<string> {
  try {
    const submissions = await getClinicalLogicSubmissions();
    const contributors = await getContributors();
    const analytics = await getDashboardAnalytics();
    
    const exportData = {
      submissions,
      contributors,
      analytics,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    throw new Error('Failed to export data');
  }
}

// Get contributor by ID
export async function getContributorById(id: string): Promise<Contributor | null> {
  try {
    const docRef = doc(db, COLLECTIONS.CONTRIBUTORS, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        lastSubmission: data.lastSubmission.toDate(),
      } as Contributor;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching contributor:', error);
    throw new Error('Failed to fetch contributor');
  }
}

// Update contributor attribution consent
export async function updateAttributionConsent(
  contributorId: string, 
  consent: boolean
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTIONS.CONTRIBUTORS, contributorId);
    await updateDoc(docRef, {
      attributionConsent: consent,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating attribution consent:', error);
    throw new Error('Failed to update attribution consent');
  }
} 

// Get clinical logic submissions by physician name
export async function getClinicalLogicByPhysician(physicianName: string): Promise<ClinicalLogic[]> {
  try {
    const q = query(
      collection(db, COLLECTIONS.CLINICAL_LOGIC),
      where('physicianName', '==', physicianName),
      orderBy('submissionDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const submissions: ClinicalLogic[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      submissions.push({
        ...data,
        submissionDate: data.submissionDate.toDate(),
      } as ClinicalLogic);
    });
    
    return submissions;
  } catch (error) {
    console.error('Error fetching clinical logic by physician:', error);
    throw new Error('Failed to fetch clinical logic by physician');
  }
}

// Real-time data listeners
export function subscribeToClinicalLogic(
  callback: (submissions: ClinicalLogic[]) => void,
  errorCallback?: (error: Error) => void
): () => void {
  try {
    const q = query(
      collection(db, COLLECTIONS.CLINICAL_LOGIC),
      orderBy('submissionDate', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const submissions: ClinicalLogic[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        submissions.push({
          ...data,
          submissionDate: data.submissionDate.toDate(),
        } as ClinicalLogic);
      });
      
      // Update cache with real-time data
      setCachedData('clinical_logic_submissions', submissions);
      callback(submissions);
    }, (error) => {
      console.error('Real-time listener error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up real-time listener:', error);
    if (errorCallback) {
      errorCallback(error as Error);
    }
    return () => {}; // Return empty unsubscribe function
  }
}

// Real-time contributor updates
export function subscribeToContributors(
  callback: (contributors: Contributor[]) => void,
  errorCallback?: (error: Error) => void
): () => void {
  try {
    const q = query(
      collection(db, COLLECTIONS.CONTRIBUTORS),
      orderBy('lastSubmission', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const contributors: Contributor[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        contributors.push({
          id: doc.id,
          ...data,
          lastSubmission: data.lastSubmission.toDate(),
        } as Contributor);
      });
      
      // Update cache with real-time data
      setCachedData('contributors', contributors);
      callback(contributors);
    }, (error) => {
      console.error('Real-time contributor listener error:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up contributor listener:', error);
    if (errorCallback) {
      errorCallback(error as Error);
    }
    return () => {}; // Return empty unsubscribe function
  }
}

// Performance monitoring
export const getConnectionStatus = () => {
  return {
    isConnected: true, // This would be updated by the connection management
    cacheSize: cache.size,
    cacheKeys: Array.from(cache.keys())
  };
};

// Clear cache function for manual cache management
export const clearFirebaseCache = () => {
  clearCache();
}; 