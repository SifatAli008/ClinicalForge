'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Users, 
  TrendingUp, 
  Award, 
  Globe, 
  Shield, 
  Target, 
  Zap,
  CheckCircle,
  Star,
  ArrowRight,
  Lightbulb,
  Database,
  BarChart3,
  ArrowRightCircle,
  Activity,
  Brain,
  Microscope,
  Stethoscope
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Enhanced Cause and Effect Diagram Component with Animations
const CauseEffectDiagram = () => {
  const flowSteps = [
    {
      icon: Users,
      title: "Medical Expertise",
      description: "Doctors & healthcare experts contribute clinical knowledge",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Database,
      title: "Data Collection",
      description: "Systematic gathering of clinical expertise and case knowledge",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20"
    },
    {
      icon: Brain,
      title: "Model Training",
      description: "Machine learning models learn from clinical expertise",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      icon: Microscope,
      title: "Synthetic Data",
              description: "Clinical expertise generates realistic patient scenarios",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    },
    {
      icon: Activity,
      title: "Medical Research",
      description: "Advanced disease detection and treatment analysis",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
    {
      icon: Heart,
      title: "Patient Outcomes",
      description: "Better healthcare delivery and treatment effectiveness",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-500/10",
      borderColor: "border-pink-500/20"
    }
  ];

  const impactMetrics = [
    { value: "89%", label: "Diagnostic Accuracy", icon: TrendingUp },
    { value: "3.2x", label: "Research Efficiency", icon: Zap },
    { value: "45%", label: "Treatment Success", icon: Heart }
  ];

  return (
    <div className="mb-16">
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes arrowFlow {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes iconGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.8);
          }
        }
        
        @keyframes dataFlow {
          0% {
            transform: translateX(-30px) scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(30px) scale(1.2);
            opacity: 0;
          }
        }
        
        @keyframes stepHighlight {
          0%, 100% {
            border-color: rgba(59, 130, 246, 0.2);
            background: rgba(59, 130, 246, 0.05);
          }
          50% {
            border-color: rgba(59, 130, 246, 0.6);
            background: rgba(59, 130, 246, 0.1);
          }
        }
        
        .step-card {
          animation: slideInFromLeft 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .step-card:nth-child(1) { animation-delay: 0.2s; }
        .step-card:nth-child(2) { animation-delay: 0.4s; }
        .step-card:nth-child(3) { animation-delay: 0.6s; }
        .step-card:nth-child(4) { animation-delay: 0.8s; }
        .step-card:nth-child(5) { animation-delay: 1.0s; }
        .step-card:nth-child(6) { animation-delay: 1.2s; }
        
        .icon-container {
          animation: iconGlow 3s ease-in-out infinite;
          position: relative;
        }
        
        .icon-container::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: transparent;
          border: 2px solid rgba(59, 130, 246, 0.3);
          transform: translate(-50%, -50%);
          animation: pulseRing 2s ease-out infinite;
          animation-delay: 1s;
        }
        
        .flow-arrow {
          animation: arrowFlow 2s ease-in-out infinite;
          animation-delay: 1.5s;
        }
        
        .data-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
          animation: dataFlow 3s linear infinite;
        }
        
        .data-particle:nth-child(1) { animation-delay: 0s; }
        .data-particle:nth-child(2) { animation-delay: 0.5s; }
        .data-particle:nth-child(3) { animation-delay: 1s; }
        
        .step-highlight {
          animation: stepHighlight 4s ease-in-out infinite;
        }
        
        .metric-value {
          animation: slideInFromRight 1s ease-out forwards;
          animation-delay: 2s;
          opacity: 0;
        }
        
        .impact-flow {
          animation: slideInFromLeft 1s ease-out forwards;
          animation-delay: 1.5s;
          opacity: 0;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          The Collaboration Impact Chain
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          See how your clinical expertise creates a ripple effect that improves global healthcare outcomes.
        </p>
      </div>

      <Card className="clinical-card p-8">
        <div className="relative">
          {/* Causes of Collaboration Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Causes of Collaboration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {flowSteps.slice(0, 3).map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative step-card">
                    {/* Animated Arrow Connections */}
                    {index < 2 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                        <div className="relative">
                          {/* Arrow Line */}
                          <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-primary/50 transform -translate-y-1/2" />
                          
                          {/* Animated Arrow Head */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            <ArrowRight className="h-4 w-4 text-primary flow-arrow" />
                          </div>
                          
                          {/* Data Flow Particles */}
                          <div className="data-particle" style={{top: '50%', left: '20%'}}></div>
                          <div className="data-particle" style={{top: '50%', left: '50%'}}></div>
                          <div className="data-particle" style={{top: '50%', left: '80%'}}></div>
                        </div>
                      </div>
                    )}
                    
                    <Card className={`clinical-card border-2 ${step.borderColor} transition-all duration-300 step-highlight`}>
                      <CardContent className="p-6 text-center">
                        {/* Icon with gradient background and glow animation */}
                        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white mb-4 shadow-lg icon-container`}>
                          <Icon className="h-10 w-10" />
                        </div>
                        
                        {/* Step number with enhanced styling */}
                        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${step.bgColor} text-foreground text-sm font-bold mb-3`}>
                          {index + 1}
                        </div>
                        
                        <h4 className="font-bold text-foreground mb-3 text-lg">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>



          {/* Effects of Collaboration Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Effects of Collaboration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {flowSteps.slice(3, 6).map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index + 3} className="relative step-card">
                    {/* Animated Arrow Connections */}
                    {index < 2 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                        <div className="relative">
                          {/* Arrow Line */}
                          <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-primary/50 transform -translate-y-1/2" />
                          
                          {/* Animated Arrow Head */}
                          <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            <ArrowRight className="h-4 w-4 text-primary flow-arrow" />
                          </div>
                          
                          {/* Data Flow Particles */}
                          <div className="data-particle" style={{top: '50%', left: '20%'}}></div>
                          <div className="data-particle" style={{top: '50%', left: '50%'}}></div>
                          <div className="data-particle" style={{top: '50%', left: '80%'}}></div>
                        </div>
                      </div>
                    )}
                    
                    <Card className={`clinical-card border-2 ${step.borderColor} transition-all duration-300 step-highlight`}>
                      <CardContent className="p-6 text-center">
                        {/* Icon with gradient background and glow animation */}
                        <div className={`inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white mb-4 shadow-lg icon-container`}>
                          <Icon className="h-10 w-10" />
                        </div>
                        
                        {/* Step number with enhanced styling */}
                        <div className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${step.bgColor} text-foreground text-sm font-bold mb-3`}>
                          {index + 4}
                        </div>
                        
                        <h4 className="font-bold text-foreground mb-3 text-lg">{step.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>



          {/* Impact Metrics with count-up animation */}
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">Measurable Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {impactMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div key={index} className="text-center">
                    <Card className="clinical-card">
                      <CardContent className="pt-6">
                        <div className="flex justify-center mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                        <div className="text-3xl font-bold text-primary mb-2 metric-value">
                          {metric.value}
                        </div>
                        <div className="text-sm text-muted-foreground font-medium">{metric.label}</div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call to Action with animation */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-3 rounded-full">
              <ArrowRightCircle className="h-5 w-5 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">Your expertise drives this entire chain</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default function AboutPage() {
  const router = useRouter();
  const benefits = [
    {
      icon: Award,
      title: "Professional Recognition",
              description: "Get acknowledged in research publications and healthcare advancements. Build your professional reputation in the emerging field of medical innovation.",
      features: ["Dataset collaboration recognition", "Professional profile enhancement", "Industry recognition"]
    },
    {
      icon: TrendingUp,
      title: "Career Advancement",
              description: "Access to cutting-edge clinical insights and data that can enhance your clinical practice and research capabilities.",
        features: ["Early access to clinical insights", "Research collaboration opportunities", "Professional development"]
    },
    {
      icon: Globe,
      title: "Global Impact",
              description: "Contribute to healthcare solutions that will improve patient outcomes for millions of patients worldwide.",
      features: ["Global healthcare impact", "Cross-border collaboration", "International recognition"]
    },
    {
      icon: Shield,
      title: "Data Ethics & Privacy",
      description: "Your contributions are protected by strict privacy protocols. No personal patient data is collected - only structured clinical knowledge.",
      features: ["Zero patient data collection", "HIPAA compliant", "Complete anonymity option"]
    }
  ];

  const impactStats = [
    { number: "1,247+", label: "Clinical Cases Contributed", icon: Database },
    { number: "89", label: "Active Medical Professionals and Students", icon: Users },
    { number: "45+", label: "Countries Represented", icon: Globe }
  ];

  const collaborationProcess = [
    {
      step: "01",
      title: "Share Your Expertise",
      description: "Contribute your clinical knowledge through our structured form - no patient data, only your medical expertise."
    },
    {
      step: "02",
              title: "Research & Validation",
        description: "Your contributions help develop clinically accurate patient care protocols."
    },
    {
      step: "03",
      title: "Global Impact",
              description: "Your expertise enables solutions that improve healthcare outcomes worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-6">
              <Stethoscope className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Advance Healthcare Through Clinical Expertise
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
            Transform healthcare through clinical expertise. Your medical knowledge drives innovation in healthcare research 
            through secure, privacy-preserving data collection that accelerates breakthroughs and improves patient outcomes worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 transition-colors">
              <CheckCircle className="h-4 w-4 mr-2" />
              No Patient Data Required
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors">
              <Shield className="h-4 w-4 mr-2" />
              HIPAA Compliant
            </Badge>
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 transition-colors">
              <Award className="h-4 w-4 mr-2" />
              Professional Recognition
            </Badge>
          </div>
        </div>

        {/* Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 slide-in">
          {impactStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="clinical-card text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <CardContent className="pt-8 pb-8">
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What You Gain from Collaboration
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Your clinical expertise is invaluable. Here's how collaboration benefits you and the global healthcare community.
            </p>
            <div className="mt-6 flex items-center justify-center space-x-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white">
                <span className="text-xs font-bold">!</span>
              </div>
              <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Note: Recognition is only provided when information is properly filled and validated.
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="clinical-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
                        <Icon className="h-7 w-7 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{benefit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                      {benefit.description}
                    </p>
                    <ul className="space-y-3">
                      {benefit.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm font-medium">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 mr-3 flex-shrink-0">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <CauseEffectDiagram />

        <Separator className="my-12" />

        {/* Alignment Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Global Healthcare Alignment
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Organizations and institutions worldwide that align with our mission for synthetic dataset collaboration in healthcare research.
            </p>
          </div>

          <Card className="clinical-card p-8 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg">
            {/* Alignment Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Global Health Organizations</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aligned with WHO, UNICEF, and international health initiatives
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-lg mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                  <Microscope className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">Research Institutions</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Connected with NIH, academic medical centers, and research networks
                </p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-purple-600 shadow-lg mx-auto mb-6 group-hover:shadow-xl transition-shadow">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Regulatory Bodies</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Aligned with FDA, CDC, and international regulatory standards
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Separator className="my-12" />

        {/* Collaboration Process */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How Your Collaboration Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A simple, secure, and impactful process that leverages your clinical expertise for global healthcare improvement.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collaborationProcess.map((step, index) => (
              <Card key={index} className="clinical-card text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
                <CardHeader className="pb-4">
                  <div className="flex justify-center mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-2xl font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
          <CardContent className="pt-12 pb-12">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h3>
              <p className="text-blue-100 mb-10 max-w-3xl mx-auto text-xl leading-relaxed">
                Join hundreds of medical professionals who are already contributing to the future of healthcare. 
                Your expertise can help save lives and improve healthcare outcomes globally.
              </p>
              <div className="flex justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 font-bold text-lg px-8 py-4 hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/')}
                >
                  Start Contributing Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Badge className="bg-white/20 text-white">
                  <Star className="h-4 w-4 mr-2" />
                  Research Recognition
                </Badge>
                <Badge className="bg-white/20 text-white">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Innovation Leadership
                </Badge>
                <Badge className="bg-white/20 text-white">
                  <Target className="h-4 w-4 mr-2" />
                  Global Impact
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 