'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  FileText, 
  CheckCircle, 
  Clock, 
  BarChart3
} from 'lucide-react';

interface FormItem {
  id: string;
  title: string;
  type: string;
  category: string;
  status: 'draft' | 'incomplete' | 'complete' | 'submitted';
  progress: number;
  lastUpdated: string;
  createdDate: string;
  missingFields: string[];
  collaborators?: string[];
}

export default function FormsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();


  // Sample forms data
  const [forms, setForms] = React.useState<FormItem[]>([
    {
      id: 'validation',
      title: 'Template Validation Form',
      type: 'Validation',
      category: 'System',
      status: 'draft',
      progress: 0,
      lastUpdated: 'Just now',
      createdDate: 'Just now',
      missingFields: ['All sections need validation']
    },
    {
      id: 'input',
      title: 'Parameter Input Form',
      type: 'Input',
      category: 'System',
      status: 'draft',
      progress: 0,
      lastUpdated: 'Just now',
      createdDate: 'Just now',
      missingFields: ['All parameters need input']
    },
    {
      id: '1',
      title: 'Diabetes Clinical Data Collection',
      type: 'Clinical Logic Collection',
      category: 'Endocrinology',
      status: 'incomplete',
      progress: 75,
      lastUpdated: '2 days ago',
      createdDate: '2024-01-15',
      missingFields: ['Lab values', 'Medication protocol']
    },
    {
      id: '2',
      title: 'Hypertension Research Study',
      type: 'Clinical Logic Collection',
      category: 'Cardiology',
      status: 'incomplete',
      progress: 60,
      lastUpdated: '1 week ago',
      createdDate: '2024-01-10',
      missingFields: ['Emergency conditions', 'Cultural aspects']
    },
    {
      id: '3',
      title: 'Cardiovascular Disease Analysis',
      type: 'Clinical Logic Collection',
      category: 'Cardiology',
      status: 'complete',
      progress: 100,
      lastUpdated: '3 days ago',
      createdDate: '2024-01-08',
      missingFields: []
    }
  ]);



  // Handle form actions
  const handleEditForm = (formId: string) => {
    // Route to appropriate form type based on form ID
    if (formId === 'validation') {
      router.push('/forms/validation');
    } else if (formId === 'input') {
      router.push('/forms/input');
    } else {
      router.push(`/dashboard?formId=${formId}&mode=edit`);
    }
  };

  const getStatusColor = (status: FormItem['status']) => {
    switch (status) {
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'incomplete':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: FormItem['status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4" />;
      case 'incomplete':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'submitted':
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <p className="text-muted-foreground">Please sign in to access your forms.</p>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => router.push('/')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold">My Forms</h1>
                <p className="text-lg text-muted-foreground mt-1">
                  Strategic Collaboration on Clinical Data Collection
                </p>
              </div>
            </div>
          </div>



          {/* Forms Cards */}
          <div className="mt-6">
            {forms.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {forms.map((form) => (
                  <Card key={form.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleEditForm(form.id)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold mb-2">
                            {form.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {form.category}
                            </Badge>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getStatusColor(form.status)}`}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(form.status)}
                                {form.status}
                              </div>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{form.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                form.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${form.progress}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Missing Fields */}
                        {form.missingFields.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Missing:</p>
                            <p className="text-xs text-orange-600">
                              {form.missingFields.slice(0, 2).join(', ')}
                              {form.missingFields.length > 2 && ` +${form.missingFields.length - 2} more`}
                            </p>
                          </div>
                        )}

                        {/* Dates */}
                        <div className="text-xs text-muted-foreground">
                          <p>Created: {form.createdDate}</p>
                          <p>Updated: {form.lastUpdated}</p>
                        </div>

                        {/* Click to Continue Message */}
                        <div className="text-center pt-2">
                          <p className="text-xs text-blue-600 font-medium">
                            Click to {form.status === 'complete' || form.status === 'submitted' ? 'view' : 'continue'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No forms available</h3>
                <p className="text-muted-foreground">
                  Forms will appear here when they are created
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 