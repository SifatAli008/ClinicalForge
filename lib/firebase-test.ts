import { 
  submitClinicalLogic, 
  getClinicalLogicSubmissions, 
  subscribeToClinicalLogic,
  getConnectionStatus,
  clearFirebaseCache
} from './firebase-service';
import { ClinicalLogic } from './types';

// Test data for performance testing
const testClinicalData: ClinicalLogic = {
  diseaseName: "Type 2 Diabetes Mellitus",
  diseaseType: "Chronic",
  typicalOnsetAge: 45,
  genderBias: "Equal",
  urbanRuralBias: "Urban",
  physicianName: "Dr. Test Physician",
  institution: "Test Medical Center",
  specialty: "Endocrinology",
  submissionDate: new Date(),
  commonComorbidities: ["Hypertension", "Dyslipidemia"],
  familyHistoryRelevance: true,
  stages: [
    {
      description: "Initial diagnosis",
      duration: "Immediate",
      triggers: "Elevated blood glucose"
    }
  ],
  consentGiven: true,
  attributionConsent: true
};

export async function runFirebasePerformanceTest() {
  console.log('🧪 Starting Firebase Performance Test...');
  
  try {
    // Test 1: Connection Status
    console.log('\n1. Testing Connection Status...');
    const status = getConnectionStatus();
    console.log('✅ Connection Status:', status);
    
    // Test 2: Submit Test Data
    console.log('\n2. Testing Data Submission...');
    const startTime = Date.now();
    const docId = await submitClinicalLogic(testClinicalData);
    const submissionTime = Date.now() - startTime;
    console.log(`✅ Data submitted in ${submissionTime}ms with ID: ${docId}`);
    
    // Test 3: Fetch Data with Caching
    console.log('\n3. Testing Data Fetching (with cache)...');
    const fetchStartTime = Date.now();
    const submissions = await getClinicalLogicSubmissions();
    const fetchTime = Date.now() - fetchStartTime;
    console.log(`✅ Fetched ${submissions.length} submissions in ${fetchTime}ms`);
    
    // Test 4: Real-time Listener
    console.log('\n4. Testing Real-time Listener...');
    let listenerCalled = false;
    const unsubscribe = subscribeToClinicalLogic(
      (data) => {
        if (!listenerCalled) {
          console.log(`✅ Real-time listener working - ${data.length} items received`);
          listenerCalled = true;
          unsubscribe();
        }
      },
      (error) => {
        console.error('❌ Real-time listener error:', error);
      }
    );
    
    // Wait for listener to trigger
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 5: Cache Management
    console.log('\n5. Testing Cache Management...');
    const cacheStatus = getConnectionStatus();
    console.log('✅ Cache Status:', {
      size: cacheStatus.cacheSize,
      keys: cacheStatus.cacheKeys
    });
    
    // Test 6: Clear Cache
    console.log('\n6. Testing Cache Clear...');
    clearFirebaseCache();
    const clearedStatus = getConnectionStatus();
    console.log('✅ Cache cleared - New size:', clearedStatus.cacheSize);
    
    console.log('\n🎉 All Firebase performance tests passed!');
    return {
      success: true,
      submissionTime,
      fetchTime,
      cacheSize: cacheStatus.cacheSize
    };
    
  } catch (error) {
    console.error('❌ Firebase performance test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Performance benchmarks
export const performanceBenchmarks = {
  submissionTime: {
    excellent: 1000, // < 1 second
    good: 2000,      // < 2 seconds
    acceptable: 5000  // < 5 seconds
  },
  fetchTime: {
    excellent: 500,   // < 0.5 seconds
    good: 1000,      // < 1 second
    acceptable: 2000  // < 2 seconds
  }
};

export function evaluatePerformance(results: any) {
  console.log('\n📊 Performance Evaluation:');
  
  if (results.submissionTime <= performanceBenchmarks.submissionTime.excellent) {
    console.log('✅ Submission Time: EXCELLENT');
  } else if (results.submissionTime <= performanceBenchmarks.submissionTime.good) {
    console.log('✅ Submission Time: GOOD');
  } else if (results.submissionTime <= performanceBenchmarks.submissionTime.acceptable) {
    console.log('⚠️ Submission Time: ACCEPTABLE');
  } else {
    console.log('❌ Submission Time: NEEDS IMPROVEMENT');
  }
  
  if (results.fetchTime <= performanceBenchmarks.fetchTime.excellent) {
    console.log('✅ Fetch Time: EXCELLENT');
  } else if (results.fetchTime <= performanceBenchmarks.fetchTime.good) {
    console.log('✅ Fetch Time: GOOD');
  } else if (results.fetchTime <= performanceBenchmarks.fetchTime.acceptable) {
    console.log('⚠️ Fetch Time: ACCEPTABLE');
  } else {
    console.log('❌ Fetch Time: NEEDS IMPROVEMENT');
  }
  
  console.log(`📈 Cache Efficiency: ${results.cacheSize} items cached`);
} 