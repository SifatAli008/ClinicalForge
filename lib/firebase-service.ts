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
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { ClinicalLogic, Contributor, DashboardAnalytics } from './types';

// Collection names
const COLLECTIONS = {
  CLINICAL_LOGIC: 'clinicalLogic',
  CONTRIBUTORS: 'contributors',
  ANALYTICS: 'analytics',
} as const;

// Submit clinical logic data
export async function submitClinicalLogic(data: ClinicalLogic): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CLINICAL_LOGIC), {
      ...data,
      submissionDate: Timestamp.fromDate(data.submissionDate),
      createdAt: Timestamp.now(),
    });
    
    // Update contributor stats
    await updateContributorStats(data.physicianName, data.institution, data.specialty);
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting clinical logic:', error);
    throw new Error('Failed to submit clinical logic');
  }
}

// Get all clinical logic submissions
export async function getClinicalLogicSubmissions(): Promise<ClinicalLogic[]> {
  try {
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
    
    return submissions;
  } catch (error) {
    console.error('Error fetching clinical logic:', error);
    throw new Error('Failed to fetch clinical logic');
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