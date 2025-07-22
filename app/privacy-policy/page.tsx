'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Database, Users, FileText, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const lastUpdated = 'December 2024';

  const policySections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      description: 'Types of data we collect and how we use it',
      content: [
        'Personal information (name, email, professional credentials)',
        'Clinical data and research information',
        'Usage analytics and platform interactions',
        'Communication records and support requests',
        'Technical data (IP address, browser type, device information)'
      ],
      color: 'blue'
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      description: 'Purposes for which we process your data',
      content: [
        'Provide and improve our clinical research platform',
        'Process and validate clinical data submissions',
        'Send important updates and notifications',
        'Provide technical support and customer service',
        'Ensure platform security and prevent fraud',
        'Comply with legal and regulatory requirements'
      ],
      color: 'green'
    },
    {
      icon: Database,
      title: 'Data Storage and Security',
      description: 'How we protect your information',
      content: [
        'Encrypted data transmission using SSL/TLS protocols',
        'Secure cloud storage with industry-standard security',
        'Regular security audits and vulnerability assessments',
        'Access controls and authentication measures',
        'Data backup and disaster recovery procedures',
        'Compliance with healthcare data regulations (HIPAA)'
      ],
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Data Sharing and Disclosure',
      description: 'When and how we share your information',
      content: [
        'We do not sell your personal information',
        'Limited sharing with trusted service providers',
        'Anonymized data for research and analytics',
        'Legal disclosure when required by law',
        'Consent-based sharing for specific purposes',
        'Aggregate statistics for platform improvement'
      ],
      color: 'orange'
    },
    {
      icon: FileText,
      title: 'Your Rights and Choices',
      description: 'Your control over your data',
      content: [
        'Access and review your personal information',
        'Request correction of inaccurate data',
        'Delete your account and associated data',
        'Opt-out of non-essential communications',
        'Export your data in standard formats',
        'Lodge complaints with supervisory authorities'
      ],
      color: 'indigo'
    },
    {
      icon: Calendar,
      title: 'Data Retention',
      description: 'How long we keep your information',
      content: [
        'Active account data: Duration of account',
        'Clinical research data: 10 years minimum',
        'Analytics data: 2 years maximum',
        'Support communications: 3 years',
        'Legal compliance: As required by law',
        'Anonymized data: Indefinitely for research'
      ],
      color: 'teal'
    }
  ];

  const complianceStandards = [
    {
      name: 'HIPAA Compliance',
      description: 'Healthcare data protection standards',
      status: 'Compliant',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'GDPR Compliance',
      description: 'European data protection regulation',
      status: 'Compliant',
      icon: CheckCircle,
      color: 'green'
    },
    {
      name: 'SOC 2 Type II',
      description: 'Security and availability controls',
      status: 'In Progress',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      name: 'ISO 27001',
      description: 'Information security management',
      status: 'Planned',
      icon: AlertTriangle,
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            At ClinicalForge, we are committed to protecting your privacy and ensuring the security of your personal and clinical data. 
            This policy explains how we collect, use, and safeguard your information.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Last Updated: {lastUpdated}</span>
            <span>•</span>
            <span>Version: 1.0</span>
          </div>
        </div>

        {/* Quick Overview */}
        <Card className="mb-8 border-2 border-blue-200 dark:border-blue-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="text-xl text-blue-900 dark:text-blue-100">
              Privacy Overview
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Key points about how we handle your data
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Secure</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">End-to-end encryption</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900 dark:text-green-100">Protected</h3>
                <p className="text-sm text-green-700 dark:text-green-300">HIPAA compliant</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900 dark:text-purple-100">Controlled</h3>
                <p className="text-sm text-purple-700 dark:text-purple-300">You own your data</p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <FileText className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">Transparent</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300">Clear policies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Standards */}
        <Card className="mb-8 border-2 border-green-200 dark:border-green-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20">
            <CardTitle className="text-xl text-green-900 dark:text-green-100">
              Compliance Standards
            </CardTitle>
            <CardDescription className="text-green-700 dark:text-green-300">
              We adhere to the highest standards of data protection and privacy
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceStandards.map((standard, index) => {
                const Icon = standard.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Icon className={`h-6 w-6 text-${standard.color}-600`} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {standard.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {standard.description}
                      </p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`bg-${standard.color}-100 text-${standard.color}-800 dark:bg-${standard.color}-900/20 dark:text-${standard.color}-400`}
                    >
                      {standard.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        <div className="space-y-6">
          {policySections.map((section, index) => {
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

        {/* Contact Information */}
        <Card className="mt-8 border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <CardTitle className="text-xl text-indigo-900 dark:text-indigo-100">
              Contact Us
            </CardTitle>
            <CardDescription className="text-indigo-700 dark:text-indigo-300">
                              Questions about our privacy policy? We&apos;re here to help.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Privacy Officer
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  Email: privacy@clinicalforge.com
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Phone: +1 (555) 123-4567
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Data Protection
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-1">
                  For data access requests: data@clinicalforge.com
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  For complaints: compliance@clinicalforge.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 