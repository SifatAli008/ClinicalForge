const { EnhancedClinicalDatabaseService } = require('../lib/enhanced-clinical-database-service');
const { getUserEnhancedSubmissions, getProfileAnalytics } = require('../lib/profile-analytics-service');

async function debugProfileSubmissions() {
  console.log('🔍 Debugging Profile Submissions...');
  
  try {
    // Test with a sample user ID (you can replace this with an actual user ID)
    const testUserId = 'test-user-id';
    
    console.log('\n1. Testing Enhanced Submissions Fetching...');
    const enhancedService = new EnhancedClinicalDatabaseService();
    
    // First, let's see what submissions exist in the database
    console.log('📊 Checking all submissions in enhancedClinicalDatabase...');
    const allSubmissions = await enhancedService.getApprovedSubmissions(10);
    console.log('✅ Found', allSubmissions.length, 'submissions in database');
    
    if (allSubmissions.length > 0) {
      console.log('📋 Sample submission structure:');
      console.log(JSON.stringify(allSubmissions[0], null, 2));
      
      // Get the actual user ID from the first submission
      const actualUserId = allSubmissions[0].collaboratorId;
      console.log('👤 Using actual user ID:', actualUserId);
      
      console.log('\n2. Testing getUserEnhancedSubmissions...');
      const enhancedSubmissions = await getUserEnhancedSubmissions(actualUserId);
      console.log('✅ Enhanced submissions found:', enhancedSubmissions.length);
      
      console.log('\n3. Testing getProfileAnalytics...');
      const profileAnalytics = await getProfileAnalytics(actualUserId);
      console.log('✅ Profile analytics calculated:');
      console.log('- Forms completed:', profileAnalytics.statistics.formsCompleted);
      console.log('- Recent activity:', profileAnalytics.statistics.recentActivity.length);
      console.log('- Is real data:', profileAnalytics.isRealData);
      
      if (profileAnalytics.statistics.recentActivity.length > 0) {
        console.log('\n📋 Recent activity sample:');
        console.log(JSON.stringify(profileAnalytics.statistics.recentActivity[0], null, 2));
      }
    } else {
      console.log('⚠️ No submissions found in database. Please submit a form first.');
    }
    
  } catch (error) {
    console.error('❌ Error during debugging:', error);
  }
}

// Run the debug function
debugProfileSubmissions().then(() => {
  console.log('\n🎉 Debug completed!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Debug failed:', error);
  process.exit(1);
}); 