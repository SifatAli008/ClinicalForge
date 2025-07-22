'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Database,
  ArrowRight,
  CheckCircle,
  Shield,
  BarChart3,
  Globe,
  Zap,
  Award,
  Heart,
  Microscope,
  BookOpen,
  TrendingUp,
  Lock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false);


  useEffect(() => {
    // Simulate loading effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-rotate through features
    const interval = setInterval(() => {
      // Feature rotation logic removed for now
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Smart Data Collection",
      description: "Create and deploy intelligent forms that adapt to your research needs.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Monitor data collection progress, generate insights, and track research outcomes.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Enable seamless collaboration between researchers, clinicians, and healthcare professionals.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: Shield,
      title: "Data Security",
      description: "HIPAA-compliant data handling with enterprise-grade security.",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      icon: Zap,
      title: "Automated Workflows",
      description: "Streamline your research processes with automated data validation and quality checks.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      icon: Globe,
      title: "Global Research",
      description: "Connect with researchers worldwide and contribute to global healthcare knowledge.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
    }
  ];

  const keyFeatures = [
    {
      icon: FileText,
      title: "Dynamic Form Builder",
      description: "Create custom forms with drag-and-drop interface. Support for multiple data types, conditional logic, and validation rules.",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor data collection progress in real-time. Track completion rates, identify bottlenecks, and optimize your research workflow.",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Lock,
      title: "Role-based Access",
      description: "Granular permissions system. Control who can view, edit, or manage data based on their role in the research project.",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Generate comprehensive reports and visualizations. Export data in multiple formats for further analysis in statistical software.",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    },
    {
      icon: Microscope,
      title: "Research Templates",
      description: "Pre-built templates for common research studies. Customize existing templates or create your own for specific research protocols.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20"
    },
    {
      icon: Heart,
      title: "Patient-Centric Design",
      description: "User-friendly interface for both researchers and participants. Mobile-responsive design for data collection on any device.",
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20"
    }
  ];

  const userTypes = [
    {
      icon: Users,
      title: "Clinical Researchers",
      description: "Conduct studies, collect data, and analyze results efficiently",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      icon: Heart,
      title: "Healthcare Providers",
      description: "Improve patient care through better data collection and analysis",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      icon: Award,
      title: "Academic Institutions",
      description: "Support research initiatives and student projects",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      icon: Microscope,
      title: "Pharmaceutical Companies",
      description: "Streamline clinical trials and regulatory compliance",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20"
    }
  ];

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Database className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-48 mx-auto"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-in fade-in duration-1000">
            <div className="relative mb-8">
              <Badge variant="secondary" className="mb-6 animate-in slide-in-from-top-4 duration-700">
                <Database className="h-4 w-4 mr-2" />
                ClinicalForge Platform
              </Badge>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 blur-3xl -z-10"></div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-in slide-in-from-bottom-4 duration-700">
              Revolutionizing Clinical Data Collection
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-200">
              ClinicalForge is a comprehensive platform designed to streamline medical data collection, 
              analysis, and collaboration. We empower healthcare professionals to gather, organize, and 
              analyze clinical data efficiently while maintaining the highest standards of data security and privacy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-4 duration-700 delay-300">
              <Link href="/forms">
                <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden">
                  <FileText className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  Get Started
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Button>
              </Link>
              <Link href="/findings">
                <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                  <BookOpen className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  Learn More
                  <ArrowUpRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                  <Users className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                  Login
                  <ArrowUpRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="mb-20 animate-in fade-in duration-1000 delay-300">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What We Do
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                ClinicalForge bridges the gap between traditional paper-based clinical data collection 
                and modern digital solutions, making research and patient care more efficient and accurate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card 
                    key={index}
                    className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-700 delay-${index * 100}`}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Key Features Section */}
          <div className="mb-20 animate-in fade-in duration-1000 delay-500">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Key Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover the powerful tools that make ClinicalForge the preferred choice for clinical research
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                {keyFeatures.slice(0, 3).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 group animate-in slide-in-from-left-4 duration-700 delay-${index * 200}">
                      <div className={`flex-shrink-0 p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-8">
                {keyFeatures.slice(3, 6).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4 group animate-in slide-in-from-right-4 duration-700 delay-${index * 200}">
                      <div className={`flex-shrink-0 p-3 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="mb-20 animate-in fade-in duration-1000 delay-700">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Who Uses ClinicalForge?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our platform serves diverse healthcare and research communities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userTypes.map((userType, index) => {
                const Icon = userType.icon;
                return (
                  <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in slide-in-from-bottom-4 duration-700 delay-${index * 100}">
                    <CardContent className="pt-6">
                      <div className={`w-16 h-16 ${userType.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-8 w-8 ${userType.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2 text-lg">{userType.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {userType.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-12 animate-in fade-in duration-1000 delay-900">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary mr-2" />
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                    Ready to Transform Your Clinical Research?
                  </h2>
                  <Sparkles className="h-6 w-6 text-primary ml-2" />
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Join thousands of healthcare professionals who trust ClinicalForge for their data collection needs. 
                  Start your journey today and experience the difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/forms">
                    <Button size="lg" className="w-full sm:w-auto group relative overflow-hidden bg-primary hover:bg-primary/90">
                      <FileText className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                      Get Started
                      <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Button>
                  </Link>
                  <Link href="/findings">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto group">
                      <Users className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" />
                      Join Research Community
                      <ArrowUpRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </Link>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-8">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Firebase-powered</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                  <div className="flex items-center space-x-1">
                    <Zap className="h-4 w-4 text-yellow-600" />
                    <span>Real-time Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 