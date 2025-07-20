// Mock data service for better performance - replaces Firebase
import { useState, useEffect, useCallback } from 'react';
import { ClinicalLogic } from './types';

// Mock data storage
const mockData = {
  clinicalLogic: [
    {
      diseaseName: 'Diabetes Type 2',
      commonName: 'Type 2 Diabetes',
      diseaseType: 'Chronic' as const,
      typicalOnsetAge: 50,
      genderBias: 'Equal' as const,
      urbanRuralBias: 'Higher in urban areas',
      physicianName: 'Dr. Sarah Johnson',
      institution: 'City General Hospital',
      specialty: 'Endocrinology',
      location: 'New York',
      submissionDate: new Date('2024-01-15'),
      completionPercentage: 100,
      consentGiven: true,
      isDraft: false,
    },
    {
      diseaseName: 'Hypertension',
      commonName: 'High Blood Pressure',
      diseaseType: 'Chronic' as const,
      typicalOnsetAge: 60,
      genderBias: 'Male' as const,
      urbanRuralBias: 'Similar prevalence',
      physicianName: 'Dr. Michael Chen',
      institution: 'Rural Medical Center',
      specialty: 'Cardiology',
      location: 'Texas',
      submissionDate: new Date('2024-01-14'),
      completionPercentage: 95,
      consentGiven: true,
      isDraft: false,
    },
  ] as ClinicalLogic[],
  contributors: [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      institution: 'City General Hospital',
      specialty: 'Endocrinology',
      submissions: 15,
      lastActive: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      institution: 'Rural Medical Center',
      specialty: 'Cardiology',
      submissions: 8,
      lastActive: new Date('2024-01-14'),
    },
  ],
};

// Mock profile data
export interface ProfileData {
  uid: string;
  displayName: string;
  email: string;
  institution: string;
  specialty: string;
  location: string;
  bio: string;
  avatarUrl: string;
  photoURL?: string;
  profilePicture?: string;
  phoneNumber?: string;
  designation?: string;
  socialMedia?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileStats {
  totalSubmissions: number;
  averageCompletionRate: number;
  lastSubmissionDate: Date;
  favoriteDiseaseTypes: string[];
  contributionStreak: number;
  lastSubmission?: string;
  lastActive?: string;
  numberOfContributions?: number;
  diseaseTypes?: number;
  pending?: number;
}

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const getClinicalLogicSubmissions = async (): Promise<ClinicalLogic[]> => {
  await delay(500); // Simulate network delay
  return mockData.clinicalLogic;
};

export const submitClinicalLogic = async (data: Partial<ClinicalLogic>): Promise<string> => {
  await delay(1000); // Simulate network delay
  
  const newSubmission: ClinicalLogic = {
    diseaseName: data.diseaseName || '',
    commonName: data.commonName,
    diseaseType: data.diseaseType || 'Chronic',
    typicalOnsetAge: data.typicalOnsetAge || 0,
    genderBias: data.genderBias || 'Equal',
    urbanRuralBias: data.urbanRuralBias,
    physicianName: data.physicianName || '',
    institution: data.institution || '',
    specialty: data.specialty || '',
    location: data.location,
    submissionDate: new Date(),
    completionPercentage: data.completionPercentage || 0,
    consentGiven: data.consentGiven || false,
    isDraft: data.isDraft || false,
  };
  
  mockData.clinicalLogic.unshift(newSubmission);
  return Date.now().toString(); // Return mock ID
};

export const getContributors = async () => {
  await delay(300);
  return mockData.contributors;
};

// Mock profile functions
export const subscribeToProfileData = (callback: (data: ProfileData) => void) => {
  const mockProfile: ProfileData = {
    uid: 'mock-user-123',
    displayName: 'Dr. Test User',
    email: 'test@example.com',
    institution: 'Test Hospital',
    specialty: 'General Medicine',
    location: 'Test City',
    bio: 'Mock user profile for testing',
    avatarUrl: '/default-avatar.svg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  };
  
  setTimeout(() => callback(mockProfile), 100);
  return () => {}; // Return unsubscribe function
};

export const subscribeToProfileStats = (callback: (stats: ProfileStats) => void) => {
  const mockStats: ProfileStats = {
    totalSubmissions: 15,
    averageCompletionRate: 85,
    lastSubmissionDate: new Date('2024-01-15'),
    favoriteDiseaseTypes: ['Chronic', 'Acute'],
    contributionStreak: 7,
  };
  
  setTimeout(() => callback(mockStats), 100);
  return () => {}; // Return unsubscribe function
};

export const updateProfileFields = async (updates: Partial<ProfileData>) => {
  await delay(500);
  console.log('Profile updated:', updates);
  return true;
};

export const updateProfileStats = async (updates: Partial<ProfileStats>) => {
  await delay(300);
  console.log('Profile stats updated:', updates);
  return true;
};

// Mock auth functions
export const mockSignIn = async () => {
  await delay(800);
  return {
    uid: 'mock-user-123',
    displayName: 'Dr. Test User',
    email: 'test@example.com',
  };
};

export const mockSignOut = async () => {
  await delay(300);
  return true;
};

// Mock user data
export const mockUser = {
  uid: 'mock-user-123',
  displayName: 'Dr. Test User',
  email: 'test@example.com',
};

// Hook for clinical logic submissions
export const useClinicalLogicSubmissions = () => {
  const [data, setData] = useState<ClinicalLogic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissions = await getClinicalLogicSubmissions();
        setData(submissions);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const mutate = useCallback(async () => {
    setIsLoading(true);
    try {
      const submissions = await getClinicalLogicSubmissions();
      setData(submissions);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    submissions: data,
    isLoading,
    isError: error,
    mutate,
  };
};

// Hook for contributors
export const useContributors = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contributors = await getContributors();
        setData(contributors);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    contributors: data,
    isLoading,
    isError: error,
  };
};

// Mock auth hook
export const useAuth = () => {
  const [user, setUser] = useState<any>(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async () => {
    setIsLoading(true);
    try {
      await mockSignIn();
      // User is already set to mockUser
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await mockSignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signIn,
    signOut,
  };
}; 