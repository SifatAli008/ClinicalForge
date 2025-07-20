'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Heart, 
  TrendingUp, 
  Award,
  Globe,
  Lightbulb,
  Shield,
  Database,
  FileText,
  CheckCircle,
  ArrowRight,
  Star,
  Target,
  Zap,
  BarChart3,
  UserCheck,
  Building,
  GraduationCap,
  MapPin,
  Clock,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  impact: string;
  color: string;
}

interface ImpactStat {
  number: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const benefits: BenefitCard[] = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Improve Patient Care',
    description: 'Your clinical expertise helps create more accurate diagnostic tools and treatment protocols that directly benefit patients worldwide.',
    impact: 'Enhanced diagnostic accuracy, Personalized treatment plans, Better patient outcomes',
    color: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Advance Medical Research',
    description: 'Contribute to building comprehensive databases that enable breakthrough research in disease understanding and treatment protocols.',
    impact: 'Accelerated medical discoveries, Evidence-based practices, Research collaboration',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Bridge Healthcare Gaps',
    description: 'Help address healthcare disparities by creating accessible, localized medical knowledge for underserved regions and communities.',
    impact: 'Reduced healthcare inequalities, Improved access to care, Global health equity',
    color: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: 'Innovate Healthcare Technology',
    description: 'Your insights drive the development of AI-powered diagnostic tools and clinical decision support systems for the future.',
    impact: 'Next-generation healthcare technology, AI-powered diagnostics, Clinical decision support',
    color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Ensure Data Quality',
    description: 'Validate and improve clinical data models to ensure accuracy and reliability in medical applications and research.',
    impact: 'High-quality clinical data, Validated research models, Reliable medical applications',
    color: 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800'
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Build Professional Network',
    description: 'Connect with fellow healthcare professionals and researchers working on similar clinical challenges and opportunities.',
    impact: 'Expanded professional network, Collaborative opportunities, Knowledge sharing',
    color: 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800'
  }
];

const personalGains: BenefitCard[] = [
  {
    icon: <Award className="h-6 w-6" />,
    title: 'Professional Recognition',
    description: 'Receive dataset acknowledgment and access to synthetic data for research. Build your professional reputation in the emerging field of medical innovation.',
    impact: 'Dataset collaboration recognition, Synthetic data access, Professional profile enhancement',
    color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Career Advancement',
    description: 'Access to cutting-edge clinical insights and data that can enhance your clinical practice and research capabilities.',
    impact: 'Early access to clinical insights, Research collaboration opportunities, Professional development',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Global Impact',
    description: 'Contribute to healthcare solutions that will improve patient outcomes for millions of patients worldwide.',
    impact: 'Global healthcare impact, Cross-border collaboration, International recognition',
    color: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Data Ethics & Privacy',
    description: 'Your contributions are protected by strict privacy protocols. No personal patient data is collected - only structured clinical knowledge.',
    impact: 'Zero patient data collection, HIPAA compliant, Complete anonymity option',
    color: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
  }
];

const impactStats: ImpactStat[] = [
  {
    number: '500+',
    label: 'Healthcare Professionals',
    description: 'Actively contributing to our platform',
    icon: <UserCheck className="h-5 w-5" />
  },
  {
    number: '50+',
    label: 'Disease Categories',
    description: 'Comprehensively covered with clinical expertise',
    icon: <Database className="h-5 w-5" />
  },
  {
    number: '10,000+',
    label: 'Data Points',
    description: 'Validated and collected for research',
    icon: <FileText className="h-5 w-5" />
  },
  {
    number: '25+',
    label: 'Medical Institutions',
    description: 'Participating in global collaboration',
    icon: <Building className="h-5 w-5" />
  }
];

const testimonials = [
  {
    name: 'Dr. Sarah Ahmed',
    role: 'Endocrinologist',
    institution: 'Dhaka Medical Center',
    quote: 'Contributing to this platform has allowed me to share my expertise in diabetes management while learning from colleagues worldwide. The collaborative approach is transforming how we approach patient care and research.',
    rating: 5
  },
  {
    name: 'Dr. Mohammad Rahman',
    role: 'Cardiologist',
    institution: 'Chittagong General Hospital',
    quote: 'The validation process ensures that our clinical knowledge is accurately represented in digital systems. This is crucial for maintaining quality in AI-powered healthcare tools and diagnostic accuracy.',
    rating: 5
  },
  {
    name: 'Dr. Fatima Khan',
    role: 'Pediatrician',
    institution: 'Sylhet Medical College',
    quote: 'Being part of this initiative has opened up new research opportunities and helped me connect with specialists in my field. The impact on patient care and global health outcomes is tangible.',
    rating: 5
  },
  {
    name: 'Dr. Aisha Patel',
    role: 'Neurologist',
    institution: 'Rajshahi Medical College',
    quote: 'The platform\'s focus on data quality and validation has improved my clinical decision-making process. The collaborative environment fosters continuous learning and professional growth.',
    rating: 5
  },
  {
    name: 'Dr. Omar Hassan',
    role: 'Oncologist',
    institution: 'Khulna Medical Center',
    quote: 'Being able to contribute to global healthcare research while maintaining patient privacy is remarkable. This platform bridges the gap between clinical practice and technological advancement.',
    rating: 5
  },
  {
    name: 'Dr. Nusrat Jahan',
    role: 'Psychiatrist',
    institution: 'Barisal Mental Health Institute',
    quote: 'The validation process has enhanced my understanding of how clinical data can be structured for research. It\'s rewarding to see my contributions making a difference in healthcare technology.',
    rating: 5
  },
  {
    name: 'Dr. Kamal Hossain',
    role: 'Emergency Medicine',
    institution: 'Rangpur Medical College',
    quote: 'The real-time collaboration features have improved our emergency protocols. The platform\'s commitment to data security gives me confidence in contributing my clinical insights.',
    rating: 5
  },
  {
    name: 'Dr. Rezaul Karim',
    role: 'Radiologist',
    institution: 'Comilla Medical Center',
    quote: 'The structured approach to clinical data collection has revolutionized how we think about diagnostic accuracy. This platform is truly advancing the future of healthcare.',
    rating: 5
  }
];

export default function CollaboratePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    // Load effect
    setIsLoaded(true);

    // Intersection Observer for scroll effects
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(Array.from(prev).concat(entry.target.id)));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Auto-slider effect for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prevIndex) => 
        (prevIndex + 1) % testimonials.length
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div 
          id="hero"
          data-section="hero"
          className={`text-center mb-12 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4">
              <Users className="h-4 w-4 mr-2" />
              Join the Movement
            </Badge>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Collaborate with ClinicalForge?
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your clinical expertise is the foundation of better healthcare. Join hundreds of healthcare professionals 
              who are already making a difference in patient care through collaborative data collection and validation.
            </p>
          </div>

          {/* About Section - Key Features */}
          <div className="mt-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* No Patient Data Required */}
              <Card className="border-2 bg-green-50 dark:bg-green-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">No Patient Data Required</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">Only structured clinical knowledge</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* HIPAA Compliant */}
              <Card className="border-2 bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200">HIPAA Compliant</h3>
                      <p className="text-sm text-blue-700 dark:text-blue-300">Enterprise-grade security</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Recognition */}
              <Card className="border-2 bg-purple-50 dark:bg-purple-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-purple-800 dark:text-purple-200">Professional Recognition</h3>
                      <p className="text-sm text-purple-700 dark:text-purple-300">Dataset acknowledgment & access</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/forms">
              <Button size="lg" className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Start Contributing</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="lg" className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>View Your Impact</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Impact Statistics */}
        <div 
          id="stats"
          data-section="stats"
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 ${
            visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {impactStats.map((stat, index) => (
            <Card key={index} className="border-2 text-center">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="font-medium text-gray-900 dark:text-white mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

               {/* Benefits Grid */}
         <div 
           id="benefits"
           data-section="benefits"
           className={`mb-12 transition-all duration-1000 ${
             visibleSections.has('benefits') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
           }`}
         >
           <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
               Your Impact Matters
             </h2>
             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
               Every contribution you make has a ripple effect across the healthcare ecosystem. 
               Here's how your expertise creates lasting change:
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {benefits.map((benefit, index) => (
               <Card key={index} className={`border-2 ${benefit.color} hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                 <CardHeader>
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="p-2 bg-white dark:bg-gray-800 rounded-lg group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                       {benefit.icon}
                     </div>
                     <CardTitle className="text-lg">{benefit.title}</CardTitle>
                   </div>
                   <CardDescription className="text-base">
                     {benefit.description}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                     <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                       Impact:
                     </p>
                     <ul className="space-y-1">
                       {benefit.impact.split(', ').map((impact, idx) => (
                         <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                           <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                           <span>{impact}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>

         {/* What You Gain from Collaboration */}
         <div 
           id="gains"
           data-section="gains"
           className={`mb-12 transition-all duration-1000 ${
             visibleSections.has('gains') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
           }`}
         >
           <div className="text-center mb-8">
             <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
               What You Gain from Collaboration
             </h2>
             <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
               Your clinical expertise is invaluable. Here's how collaboration benefits you and the global healthcare community.
             </p>
           </div>

           {/* Warning Note */}
           <div className="mb-8">
             <Alert className="max-w-2xl mx-auto">
               <AlertTriangle className="h-4 w-4" />
               <AlertDescription>
                 <strong>Note:</strong> Recognition is only provided when information is properly filled and validated.
               </AlertDescription>
             </Alert>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
             {personalGains.map((gain, index) => (
               <Card key={index} className={`border-2 ${gain.color} hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                 <CardHeader>
                   <div className="flex items-center space-x-3 mb-3">
                     <div className="p-2 bg-white dark:bg-gray-800 rounded-lg group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-300">
                       {gain.icon}
                     </div>
                     <CardTitle className="text-lg">{gain.title}</CardTitle>
                   </div>
                   <CardDescription className="text-base">
                     {gain.description}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                     <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                       Benefits:
                     </p>
                     <ul className="space-y-1">
                       {gain.impact.split(', ').map((benefit, idx) => (
                         <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                           <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                           <span>{benefit}</span>
                         </li>
                       ))}
                     </ul>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
         </div>

        {/* How It Works */}
        <Card className="border-2 mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How Collaboration Works
            </CardTitle>
            <CardDescription className="text-lg">
              Simple steps to make a big impact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                           <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <FileText className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-semibold mb-2">1. Validate Forms</h3>
                 <p className="text-gray-600 dark:text-gray-300">
                   Review and validate clinical data collection forms to ensure they capture all necessary information for comprehensive research.
                 </p>
               </div>
               
               <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Database className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-semibold mb-2">2. Contribute Data</h3>
                 <p className="text-gray-600 dark:text-gray-300">
                   Fill in parameter validation forms with your clinical expertise and real-world experience for accurate data modeling.
                 </p>
               </div>
               
               <div className="text-center">
                 <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <TrendingUp className="h-8 w-8 text-primary" />
                 </div>
                 <h3 className="text-xl font-semibold mb-2">3. Drive Impact</h3>
                 <p className="text-gray-600 dark:text-gray-300">
                   Watch as your contributions improve healthcare technology and patient outcomes worldwide through validated clinical insights.
                 </p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* The Collaboration Impact Chain */}
        <div 
          id="impact-chain"
          data-section="impact-chain"
          className={`mb-12 transition-all duration-1000 ${
            visibleSections.has('impact-chain') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              The Collaboration Impact Chain
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how your contributions create a ripple effect across the healthcare ecosystem, from data validation to global impact.
            </p>
          </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1: Clinical Expertise */}
            <Card className="border-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
             <CardHeader className="text-center">
                              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 group-hover:scale-110 transition-all duration-300">
                  <UserCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
               <CardTitle className="text-lg">1. Clinical Expertise</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                 Healthcare professionals contribute validated clinical knowledge and real-world experience
               </p>
             </CardContent>
           </Card>

                      {/* Step 2: Data Validation */}
            <Card className="border-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 group-hover:scale-110 transition-all duration-300">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
               <CardTitle className="text-lg">2. Data Validation</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                 Clinical insights are validated and structured into high-quality datasets for research
               </p>
             </CardContent>
           </Card>

                      {/* Step 3: Technology Development */}
            <Card className="border-2 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 group-hover:scale-110 transition-all duration-300">
                  <Lightbulb className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
               <CardTitle className="text-lg">3. Technology Development</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                 Validated data powers AI-powered diagnostic tools and clinical decision support systems
               </p>
             </CardContent>
           </Card>

                      {/* Step 4: Global Impact */}
            <Card className="border-2 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 group-hover:scale-110 transition-all duration-300">
                  <Globe className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
               <CardTitle className="text-lg">4. Global Impact</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                 Improved healthcare technology reaches millions of patients worldwide, enhancing diagnostic accuracy and treatment outcomes
               </p>
             </CardContent>
           </Card>
        </div>

        {/* Impact Chain Visualization */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="ml-2">Clinical Expertise</span>
            </div>
            <ArrowRight className="h-4 w-4" />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="ml-2">Data Validation</span>
            </div>
            <ArrowRight className="h-4 w-4" />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="ml-2">Technology Development</span>
            </div>
            <ArrowRight className="h-4 w-4" />
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="ml-2">Global Impact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div 
        id="testimonials"
        data-section="testimonials"
        className={`mb-12 transition-all duration-1000 ${
          visibleSections.has('testimonials') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Contributors Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Hear from healthcare professionals who are already making a difference
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentTestimonialIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.slice(index, index + 3).map((t, i) => (
                    <Card key={i} className="border-2 h-full">
                      <CardContent className="pt-6">
                        <div className="flex items-center mb-4">
                          {[...Array(t.rating)].map((_, starIndex) => (
                            <Star key={starIndex} className="h-4 w-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                          "{t.quote}"
                        </blockquote>
                        <div className="border-t pt-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {t.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {t.role} • {t.institution}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentTestimonialIndex === index
                    ? 'bg-primary scale-110'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <Card 
        id="cta"
        data-section="cta"
        className={`border-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 transition-all duration-1000 ${
          visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
               Ready to Make a Difference?
             </h2>
             <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
               Join hundreds of healthcare professionals who are already contributing to the future of healthcare technology and research. 
               Your expertise can help improve patient care and diagnostic accuracy for millions of people worldwide.
             </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/forms">
                <Button size="lg" className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Start Contributing Now</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Data Security:</strong> All contributions are anonymized and protected by enterprise-grade security. 
            Your privacy and the confidentiality of your clinical insights are our top priority.
          </AlertDescription>
        </Alert>
        
        <Alert>
          <Award className="h-4 w-4" />
          <AlertDescription>
            <strong>Recognition:</strong> Contributors receive dataset acknowledgment and access to synthetic data for research purposes. No research paper acknowledgments or certificates provided.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
} 