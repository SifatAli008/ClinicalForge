import { submitArticle, ArticleData } from './article-service';

// Sample article data to populate Firebase
const sampleArticles: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: 'As a physician, why is your participation in the creation and use of clinical synthetic data in Bangladesh necessary?',
    description: 'Comprehensive analysis of disease prevalence, clinical diversity, and the necessity of physician participation in creating contextually appropriate health datasets for Bangladesh.',
    category: 'Public Health Research',
    tags: ['Clinical Data', 'Physician Participation', 'Bangladesh Healthcare', 'Disease Prevalence', 'Synthetic Data', 'Diabetes', 'CKD'],
    author: 'Team Bionic',
    institution: 'ClinicalForge Platform',
    impact: 'Established framework for physician-driven clinical data collection in Bangladesh',
    methodology: 'Comprehensive literature review and analysis of national health statistics from 2021-2024',
    keyFindings: [
      'Diabetes prevalence: 14.2% with 61.5% unawareness rate',
      'CKD prevalence: 22-22.5% (twice global average)',
      'Only 32% follow-up rate due to economic barriers',
      'Regional variations in disease patterns require local expertise',
      'Women often conceal symptoms due to cultural factors',
      'Urban vs rural disparities in healthcare access'
    ],
    datasetSize: 'Literature Review & National Statistics',
    contributors: 1,
    citations: 8,
    readTime: '25 min read',
    status: 'published',
    publishDate: '2024-01-20'
  }
];

// Function to populate Firebase with sample articles
export const populateArticles = async () => {
  try {
    console.log('🚀 Starting to populate articles...');
    
    for (const article of sampleArticles) {
      const articleId = await submitArticle(article);
      console.log(`✅ Article "${article.title.substring(0, 50)}..." added with ID: ${articleId}`);
    }
    
    console.log('🎉 All articles populated successfully!');
  } catch (error) {
    console.error('❌ Error populating articles:', error);
    throw error;
  }
};

// Function to check if articles exist
export const checkArticlesExist = async () => {
  try {
    const { getArticles } = await import('./article-service');
    const articles = await getArticles();
    console.log(`📊 Found ${articles.length} articles in database`);
    return articles.length > 0;
  } catch (error) {
    console.error('❌ Error checking articles:', error);
    return false;
  }
}; 