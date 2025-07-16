'use client';

import React from 'react';
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Globe, 
  Download, 
  Eye, 
  UserCheck, 
  AlertTriangle,
  Heart,
  Activity,
  Calendar,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/language-context';

export default function DashboardPage() {
  const { t } = useLanguage();

  const stats = [
    {
      title: t.dashboard.totalSubmissions,
      value: '1,247',
      change: '+12%',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      title: t.dashboard.avgOnsetAge,
      value: '45.2',
      change: '+2.1',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      title: t.dashboard.activeContributors,
      value: '89',
      change: '+8',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      title: t.dashboard.urbanRuralRatio,
      value: '2.3:1',
      change: 'Urban',
      icon: Globe,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  const contributors = [
    {
      name: 'Dr. Sarah Johnson',
      institution: 'Mayo Clinic',
      specialty: 'Endocrinology',
      submissions: 15,
      lastSubmission: '2024-01-15',
      isPublic: true,
    },
    {
      name: 'Dr. Michael Chen',
      institution: 'Stanford Medical',
      specialty: 'Cardiology',
      submissions: 12,
      lastSubmission: '2024-01-12',
      isPublic: true,
    },
    {
      name: 'Dr. Priya Patel',
      institution: 'Johns Hopkins',
      specialty: 'Neurology',
      submissions: 8,
      lastSubmission: '2024-01-10',
      isPublic: false,
    },
    {
      name: 'Dr. Carlos Rodriguez',
      institution: 'UCLA Medical',
      specialty: 'Oncology',
      submissions: 6,
      lastSubmission: '2024-01-08',
      isPublic: true,
    },
  ];

  const aiInsights = [
    {
      title: 'High Risk Assessment',
      description: 'Type 2 Diabetes shows increased prevalence in urban areas with sedentary lifestyle patterns.',
      risk: 'high',
      factors: ['Urban lifestyle', 'Diet patterns', 'Physical inactivity'],
    },
    {
      title: 'Medium Risk Assessment',
      description: 'Hypertension correlation with stress levels and work environment factors.',
      risk: 'medium',
      factors: ['Stress levels', 'Work environment', 'Sleep patterns'],
    },
    {
      title: 'Low Risk Assessment',
      description: 'Asthma management shows good adherence in pediatric populations.',
      risk: 'low',
      factors: ['Pediatric care', 'Family support', 'Education programs'],
    },
  ];

  const syntheticProfile = {
    demographics: {
      age: 52,
      gender: 'Female',
      location: 'Urban',
      occupation: 'Office Worker',
    },
    clinicalProfile: {
      primaryDiagnosis: 'Type 2 Diabetes Mellitus',
      comorbidities: ['Hypertension', 'Dyslipidemia'],
      medications: ['Metformin 500mg BID', 'Lisinopril 10mg daily'],
      symptoms: ['Polyuria', 'Polydipsia', 'Fatigue'],
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {t.dashboard.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.dashboard.subtitle}
              </p>
            </div>
            <Button className="flex items-center gap-3 h-11 px-6 text-base font-semibold transition-colors duration-200">
              <Download className="h-5 w-5" />
              {t.dashboard.exportData}
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 slide-in">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="clinical-card step-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-2">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm font-medium text-green-600 dark:text-green-400">
                        {stat.change}
                      </p>
                    </div>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor} shadow-sm`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contributors */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t.dashboard.contributors}
                </CardTitle>
                <CardDescription>
                  Recent contributors and their activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contributors.map((contributor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                          <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{contributor.name}</p>
                          <p className="text-sm text-muted-foreground">{contributor.institution}</p>
                          <p className="text-xs text-muted-foreground">{contributor.specialty}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{contributor.submissions} {t.dashboard.submissions}</p>
                        <p className="text-xs text-muted-foreground">{contributor.lastSubmission}</p>
                        <Badge variant={contributor.isPublic ? "default" : "secondary"}>
                          {contributor.isPublic ? t.dashboard.public : t.dashboard.anonymous}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {t.dashboard.insights}
                </CardTitle>
                <CardDescription>
                  AI-generated risk assessments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <Badge 
                          variant={
                            insight.risk === 'high' ? 'destructive' : 
                            insight.risk === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {insight.risk === 'high' ? t.dashboard.highRisk :
                           insight.risk === 'medium' ? t.dashboard.mediumRisk : t.dashboard.lowRisk}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {t.dashboard.keyFactors}:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {insight.factors.map((factor, factorIndex) => (
                            <Badge key={factorIndex} variant="outline" className="text-xs">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Synthetic Patient Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              {t.dashboard.syntheticPatientProfile}
            </CardTitle>
            <CardDescription>
              AI-generated patient profile based on collected clinical logic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Demographics */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  {t.dashboard.demographics}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.dashboard.age}:</span>
                    <span className="font-medium">{syntheticProfile.demographics.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t.dashboard.gender}:</span>
                    <span className="font-medium">{syntheticProfile.demographics.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{syntheticProfile.demographics.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Occupation:</span>
                    <span className="font-medium">{syntheticProfile.demographics.occupation}</span>
                  </div>
                </div>
              </div>

              {/* Clinical Profile */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  {t.dashboard.clinicalProfile}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Primary Diagnosis:</p>
                    <p className="text-sm">{syntheticProfile.clinicalProfile.primaryDiagnosis}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t.dashboard.comorbidities}:</p>
                    <div className="flex flex-wrap gap-1">
                      {syntheticProfile.clinicalProfile.comorbidities.map((comorbidity, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {comorbidity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t.dashboard.medications}:</p>
                    <div className="space-y-1">
                      {syntheticProfile.clinicalProfile.medications.map((medication, index) => (
                        <p key={index} className="text-sm">{medication}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{t.dashboard.symptoms}:</p>
                    <div className="flex flex-wrap gap-1">
                      {syntheticProfile.clinicalProfile.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 