'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, Clock, Users, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface FormCard {
  id: string;
  title: string;
  description: string;
  type: 'validation' | 'parameter';
  status: 'active' | 'draft' | 'completed';
  submissions: number;
  lastUpdated: string;
  icon: React.ReactNode;
}

const forms: FormCard[] = [
  {
    id: 'data-field-validation',
    title: 'Data Field Validation Form',
    description: 'Validate and suggest improvements for Clinical Logic Collection Template fields. Check each field for sufficiency and suggest additional sections.',
    type: 'validation',
    status: 'active',
    submissions: 24,
    lastUpdated: '2 hours ago',
    icon: <FileText className="h-6 w-6" />
  },
  {
    id: 'parameter-validation',
    title: 'Parameter Validation Form',
    description: 'Validate actual data entry for each defined parameter. Fill in required values with enforced data type checks.',
    type: 'parameter',
    status: 'active',
    submissions: 18,
    lastUpdated: '1 day ago',
    icon: <BarChart3 className="h-6 w-6" />
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'validation':
      return 'bg-purple-100 text-purple-800';
    case 'parameter':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function FormsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Clinical Data Collection Forms
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Select a form to contribute to our clinical knowledge database
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form) => (
          <Link key={form.id} href={`/forms/${form.id}`}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      {form.icon}
                    </div>
                    <Badge variant="secondary" className={getTypeColor(form.type)}>
                      {form.type}
                    </Badge>
                  </div>
                  <Badge className={getStatusColor(form.status)}>
                    {form.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{form.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {form.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{form.submissions} submissions</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{form.lastUpdated}</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Start Form
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Why Collaborate?
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
              Your clinical expertise helps build a comprehensive database that improves patient care, 
              enables better research, and creates more accurate diagnostic tools. Every contribution 
              makes a difference in advancing healthcare knowledge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 