'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { 
  Activity, 
  TrendingUp, 
  Users, 
  Database,
  Zap,

  Bell,
  BarChart3,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';

import { MedicalParamsDashboard } from '@/components/ui/medical-params-dashboard';
import { CompactMedicalParams } from '@/components/ui/compact-medical-params';
import { RealTimeNotifications } from '@/components/ui/real-time-notifications';
import { submitClinicalLogic } from '@/lib/mock-data';
import { ClinicalLogic } from '@/lib/types';

export default function DemoRealTimePage() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationCount, setSimulationCount] = useState(0);

  // Sample data for simulation
  const sampleDiseases = [
    'Type 2 Diabetes',
    'Hypertension',
    'Asthma',
    'Rheumatoid Arthritis',
    'Multiple Sclerosis',
    'Parkinson\'s Disease',
    'Alzheimer\'s Disease',
    'Crohn\'s Disease',
    'Lupus',
    'Fibromyalgia'
  ];

  const samplePhysicians = [
    { name: 'Dr. Sarah Johnson', institution: 'Mayo Clinic', specialty: 'Endocrinology' },
    { name: 'Dr. Michael Chen', institution: 'Johns Hopkins', specialty: 'Cardiology' },
    { name: 'Dr. Emily Rodriguez', institution: 'Stanford Medical', specialty: 'Pulmonology' },
    { name: 'Dr. David Kim', institution: 'Cleveland Clinic', specialty: 'Rheumatology' },
    { name: 'Dr. Lisa Thompson', institution: 'UCLA Medical', specialty: 'Neurology' }
  ];

  const simulateSubmission = async () => {
    const randomDisease = sampleDiseases[Math.floor(Math.random() * sampleDiseases.length)];
    const randomPhysician = samplePhysicians[Math.floor(Math.random() * samplePhysicians.length)];
    const randomAge = Math.floor(Math.random() * 60) + 20;
    const diseaseTypes = ['Acute', 'Chronic', 'Recurrent', 'Congenital'];
    const randomDiseaseType = diseaseTypes[Math.floor(Math.random() * diseaseTypes.length)];

    const sampleData: ClinicalLogic = {
      diseaseName: randomDisease,
      commonName: randomDisease,
      diseaseType: randomDiseaseType as 'Acute' | 'Chronic' | 'Recurrent' | 'Congenital',
      typicalOnsetAge: randomAge,
      genderBias: 'Equal',
      urbanRuralBias: 'Urban',
      subtypes: [],
      subtypeCriteria: [],
      subtypeTreatment: [],
      subtypeNotes: [],
      geneticRiskFactors: [],
      inheritancePatterns: [],
      geneticInfluence: [],
      familyHistoryRelevance: true,
      stages: [
        {
          description: 'Initial stage',
          duration: 'Variable',
          triggers: 'Genetic and environmental factors'
        }
      ],
      stageSymptoms: [],
      commonComorbidities: ['Hypertension', 'Diabetes'],
      comorbidityFrequency: [],
      comorbidityOnset: [],
      comorbidityComplicates: [],
      medicationProtocol: [],
      lifestyleRecommendations: [],
      lifestyleStages: [],
      lifestyleNotes: [],
      pediatricPresentation: '',
      adultPresentation: '',
      emergencyTriggers: [],
      emergencyStages: [],
      emergencyHospitalization: [],
      emergencyActions: [],
      progressionTimeline: [],
      labValues: [],
      monitoringProtocol: [],
      regionalVariations: {
        urban: [],
        rural: []
      },
      contraindications: [],
      contraindicationConditions: [],
      contraindicationNotes: [],
      commonMisdiagnoses: [],
      misdiagnosisDifferentiators: [],
      misdiagnosisNotes: [],
      culturalAspects: '',
      socioeconomicBarriers: '',
      additionalObservations: '',
      physicianName: randomPhysician.name,
      institution: randomPhysician.institution,
      specialty: randomPhysician.specialty,
      location: 'United States',
      consentGiven: true,
      attributionConsent: true,
      submissionDate: new Date()
    };

    try {
      await submitClinicalLogic(sampleData);
      setSimulationCount(prev => prev + 1);
    } catch (error) {
      console.error('Error simulating submission:', error);
    }
  };

  const startSimulation = () => {
    setIsSimulating(true);
    const interval = setInterval(() => {
      simulateSubmission();
    }, 5000); // Submit every 5 seconds

    // Store interval ID for cleanup
          (window as unknown as { simulationInterval?: NodeJS.Timeout }).simulationInterval = interval;
  };

  const stopSimulation = () => {
    setIsSimulating(false);
    if ((window as unknown as { simulationInterval?: NodeJS.Timeout }).simulationInterval) {
      clearInterval((window as unknown as { simulationInterval?: NodeJS.Timeout }).simulationInterval);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold">Real-Time Medical Parameters Demo</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Experience live Firebase real-time features for medical data collection
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Live Updates
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              Firebase Realtime
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Bell className="h-3 w-3" />
              Notifications
            </Badge>
          </div>
        </div>

        {/* Simulation Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Data Simulation
            </CardTitle>
            <CardDescription>
              Simulate real-time medical data submissions to test the live features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button
                onClick={isSimulating ? stopSimulation : startSimulation}
                variant={isSimulating ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isSimulating ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Simulation
                  </>
                )}
              </Button>
              <Button
                onClick={simulateSubmission}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Submit Single Entry
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Simulated submissions:</span>
                <Badge variant="secondary">{simulationCount}</Badge>
              </div>
            </div>
            {isSimulating && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Simulating submissions every 5 seconds...
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-Time Notifications */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Live Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Real-time alerts for new submissions and contributors
            </p>
          </div>
          <div className="flex justify-end">
            <RealTimeNotifications 
              notifications={[]}
              onMarkAsRead={() => {}}
              onDismiss={() => {}}
            />
          </div>
        </div>

        {/* Full Dashboard */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Comprehensive Medical Parameters Dashboard</h2>
          <MedicalParamsDashboard />
        </div>

        {/* Compact Widgets */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Compact Real-Time Widgets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CompactMedicalParams />
            <CompactMedicalParams />
            <CompactMedicalParams />
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Real-Time Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Live synchronization with Firebase Firestore and Realtime Database for instant updates across all connected clients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Smart Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Intelligent notification system that alerts users to new submissions, contributors, and important milestones.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Live Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Real-time analytics and visualizations showing disease distribution, age demographics, and contributor statistics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                Contributor Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Live tracking of active contributors, their submission counts, and recent activity patterns.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                Performance Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connection status monitoring, cache management, and performance optimization for smooth real-time experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-teal-600" />
                Data Persistence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Robust data persistence with automatic retry mechanisms and offline support for reliable data collection.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 