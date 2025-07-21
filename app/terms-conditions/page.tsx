'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Shield, Users, Database, AlertTriangle, CheckCircle, Scale, Gavel, Clock, Mail } from 'lucide-react';

export default function TermsConditionsPage() {
  const lastUpdated = 'December 2024';

  const termsSections = [
    {
      icon: Users,
      title: 'Acceptance of Terms',
      description: 'By using ClinicalForge, you agree to these terms',
      content: [
        'You must be 18 years or older to use our services',
        'You must provide accurate and complete information',
        'You are responsible for maintaining account security',
        'You agree to comply with all applicable laws and regulations',
        'You must not use the service for illegal or unauthorized purposes'
      ],
      color: 'blue'
    },
    {
      icon: Database,
      title: 'Service Description',
      description: 'What ClinicalForge provides and how it works',
      content: [
        'Clinical data collection and validation platform',
        'AI-powered analytics and insights',
        'Collaborative research tools and features',
        'Data storage and management services',
        'Technical support and customer service',
        'Regular platform updates and improvements'
      ],
      color: 'green'
    },
    {
      icon: Shield,
      title: 'User Responsibilities',
      description: 'Your obligations when using our platform',
      content: [
        'Maintain accurate and up-to-date information',
        'Protect your account credentials and data',
        'Use the platform in compliance with healthcare regulations',
        'Report any security concerns or violations',
        'Respect intellectual property rights',
        'Cooperate with reasonable requests from our team'
      ],
      color: 'purple'
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Activities',
      description: 'Activities that are not allowed on our platform',
      content: [
        'Sharing false or misleading clinical information',
        'Attempting to gain unauthorized access to systems',
        'Interfering with platform functionality or performance',
        'Violating patient privacy or confidentiality',
        'Using the service for commercial purposes without permission',
        'Engaging in any form of harassment or abuse'
      ],
      color: 'red'
    },
    {
      icon: Scale,
      title: 'Intellectual Property',
      description: 'Ownership and usage rights for content and data',
      content: [
        'ClinicalForge retains ownership of platform and software',
        'Users retain ownership of their clinical data',
        'Aggregate data may be used for research and improvement',
        'No unauthorized copying or distribution of content',
        'Proper attribution required for any permitted use',
        'Trademark and copyright protections apply'
      ],
      color: 'orange'
    },
    {
      icon: Gavel,
      title: 'Limitation of Liability',
      description: 'Our liability and your legal protections',
      content: [
        'Service provided "as is" without warranties',
        'We are not liable for indirect or consequential damages',
        'Maximum liability limited to fees paid in last 12 months',
        'No guarantee of uninterrupted or error-free service',
        'Users responsible for their own clinical decisions',
        'Force majeure events may affect service availability'
      ],
      color: 'indigo'
    }
  ];

  const keyProvisions = [
    {
      title: 'Data Ownership',
      description: 'You retain full ownership of your clinical data',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Privacy Protection',
      description: 'HIPAA and GDPR compliant data handling',
      icon: Shield,
      color: 'blue'
    },
    {
      title: 'Service Availability',
      description: '99.9% uptime commitment with maintenance windows',
      icon: Clock,
      color: 'purple'
    },
    {
      title: 'Support Coverage',
      description: '24/7 technical support for critical issues',
      icon: Users,
      color: 'orange'
    }
  ];

  const terminationConditions = [
    {
      condition: 'Breach of Terms',
      action: 'Immediate account suspension',
      severity: 'High',
      color: 'red'
    },
    {
      condition: 'Inactivity',
      action: 'Account deactivation after 12 months',
      severity: 'Medium',
      color: 'yellow'
    },
    {
      condition: 'Request',
      action: 'Account deletion within 30 days',
      severity: 'Low',
      color: 'green'
    },
    {
      condition: 'Legal Requirement',
      action: 'Immediate termination if required by law',
      severity: 'High',
      color: 'red'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            These terms and conditions govern your use of ClinicalForge. By accessing and using our platform, 
            you accept and agree to be bound by these terms and our Privacy Policy.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span>Version: 1.0</span>
          </div>
        </div>

        {/* Key Provisions */}
        <Card className="mb-8 border-2 border-green-200 dark:border-green-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
            <CardTitle className="text-xl text-green-900 dark:text-green-100">
              Key Provisions
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              Important aspects of our service agreement
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyProvisions.map((provision, index) => {
                const Icon = provision.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Icon className={`h-6 w-6 text-${provision.color}-600 mt-1`} />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {provision.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {provision.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Termination Conditions */}
        <Card className="mb-8 border-2 border-orange-200 dark:border-orange-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20">
            <CardTitle className="text-xl text-orange-900 dark:text-orange-100">
              Termination Conditions
            </CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Circumstances under which accounts may be terminated
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {terminationConditions.map((condition, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {condition.condition}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {condition.action}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`bg-${condition.color}-100 text-${condition.color}-800 dark:bg-${condition.color}-900/20 dark:text-${condition.color}-400`}
                  >
                    {condition.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
        <div className="space-y-6">
          {termsSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card key={index} className="border-2 border-gray-200 dark:border-gray-700 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-${section.color}-100 dark:bg-${section.color}-900/30 rounded-lg flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 text-${section.color}-600 dark:text-${section.color}-400`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-gray-900 dark:text-white">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <ul className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-2">
                        <div className={`w-2 h-2 bg-${section.color}-500 rounded-full mt-2 flex-shrink-0`}></div>
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dispute Resolution */}
        <Card className="mt-8 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">
              Dispute Resolution
            </CardTitle>
            <CardDescription className="text-indigo-700 dark:text-indigo-300">
              How we handle disagreements and legal matters
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Resolution Process
                </h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold">1.</span>
                    <span>Direct communication and negotiation</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold">2.</span>
                    <span>Mediation through neutral third party</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold">3.</span>
                    <span>Arbitration in accordance with AAA rules</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-semibold">4.</span>
                    <span>Legal action in courts of competent jurisdiction</span>
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Governing Law
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p>• These terms are governed by the laws of [Jurisdiction]</p>
                  <p>• Any disputes will be resolved in [Jurisdiction] courts</p>
                  <p>• International users agree to jurisdiction and venue</p>
                  <p>• Class action waivers apply where permitted</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mt-8 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
              Questions About Terms?
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Contact our legal team for clarification or concerns
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Legal Department
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Email: legal@clinicalforge.com
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Phone: +1 (555) 123-4567
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  General Inquiries
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Email: support@clinicalforge.com
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  For urgent matters: +1 (555) 123-4568
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 