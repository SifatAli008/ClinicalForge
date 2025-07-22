import { db } from './firebase-config';
import { collection, addDoc, getDocs, getDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';

export interface ArticleData {
  id?: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  author: string;
  institution: string;
  impact: string;
  methodology: string;
  keyFindings: string[];
  datasetSize: string;
  contributors: number;
  citations: number;
  readTime: string;
  status: 'published' | 'in-progress' | 'preview';
  publishDate: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ResearchFinding {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: string;
  author: string;
  institution: string;
  impact: string;
  methodology: string;
  keyFindings: string[];
  datasetSize: string;
  contributors: number;
  citations: number;
  status: 'published' | 'in-progress' | 'preview';
}

// Fallback sample article for when Firebase is not available
const fallbackArticle: ResearchFinding = {
  id: 'bangladesh-clinical-dataset-analysis',
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
};

// Submit a new article (admin only)
export const submitArticle = async (articleData: Omit<ArticleData, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const articleWithMetadata: Omit<ArticleData, 'id'> = {
      ...articleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'articles'), articleWithMetadata);
    console.log('✅ Article submitted successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error submitting article:', error);
    console.log('⚠️ Using fallback article instead');
    return 'fallback-article-id';
  }
};

// Get all articles
export const getArticles = async (): Promise<ResearchFinding[]> => {
  try {
    const articlesQuery = query(
      collection(db, 'articles'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(articlesQuery);
    const articles: ResearchFinding[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as ArticleData;
      articles.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
        publishDate: data.publishDate,
        readTime: data.readTime,
        author: data.author,
        institution: data.institution,
        impact: data.impact,
        methodology: data.methodology,
        keyFindings: data.keyFindings,
        datasetSize: data.datasetSize,
        contributors: data.contributors,
        citations: data.citations,
        status: data.status,
      });
    });
    
    console.log('✅ Articles fetched successfully:', articles.length);
    return articles;
  } catch (error) {
    console.error('❌ Error fetching articles:', error);
    console.log('⚠️ Using fallback article instead');
    return [fallbackArticle];
  }
};

// Get articles by status
export const getArticlesByStatus = async (status: 'published' | 'in-progress' | 'preview'): Promise<ResearchFinding[]> => {
  try {
    const articles = await getArticles();
    return articles.filter(article => article.status === status);
  } catch (error) {
    console.error('❌ Error fetching articles by status:', error);
    throw new Error('Failed to fetch articles by status');
  }
};

// Get articles by category
export const getArticlesByCategory = async (category: string): Promise<ResearchFinding[]> => {
  try {
    const articles = await getArticles();
    return articles.filter(article => article.category === category);
  } catch (error) {
    console.error('❌ Error fetching articles by category:', error);
    throw new Error('Failed to fetch articles by category');
  }
};

// Get a single article by ID
export const getArticleById = async (id: string): Promise<ResearchFinding | null> => {
  try {
    const docRef = doc(db, 'articles', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as ArticleData;
      return {
        id: docSnap.id,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: data.tags,
        publishDate: data.publishDate,
        readTime: data.readTime,
        author: data.author,
        institution: data.institution,
        impact: data.impact,
        methodology: data.methodology,
        keyFindings: data.keyFindings,
        datasetSize: data.datasetSize,
        contributors: data.contributors,
        citations: data.citations,
        status: data.status,
      };
    } else {
      console.log('❌ No such article found with ID:', id);
      // Return fallback article if the requested ID matches
      if (id === 'bangladesh-clinical-dataset-analysis') {
        return fallbackArticle;
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching article by ID:', error);
    // Return fallback article if the requested ID matches
    if (id === 'bangladesh-clinical-dataset-analysis') {
      return fallbackArticle;
    }
    throw new Error('Failed to fetch article');
  }
}; 