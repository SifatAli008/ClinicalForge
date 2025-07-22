'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Eye, 
  Lock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function ReadOnlyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Eye className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Read-Only Data Field Validation
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              View the comprehensive data field validation form in read-only mode. 
              This demonstrates the structure and validation rules without allowing edits.
            </p>
          </div>

          {/* Read-Only Notice */}
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800 dark:text-orange-200">
                    Read-Only Mode
                  </h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    This is a demonstration view. To edit or submit data, please use the main form.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Sections */}
          <div className="space-y-6">
            {/* Decision Models Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <CardTitle>Clinical Decision Models</CardTitle>
                    <CardDescription>
                      Evaluation of clinical decision models and their impact assessment
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Model 1: Diagnostic Accuracy</h4>
                      <p className="text-sm text-muted-foreground">
                        Sensitivity: 85%, Specificity: 92%
                      </p>
                      <Badge variant="secondary" className="mt-2">High Impact</Badge>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Model 2: Treatment Response</h4>
                      <p className="text-sm text-muted-foreground">
                        Response Rate: 78%, Duration: 12 weeks
                      </p>
                      <Badge variant="secondary" className="mt-2">Medium Impact</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Critical Points Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <CardTitle>Critical Clinical Decision Points</CardTitle>
                    <CardDescription>
                      Identification and evaluation of critical decision points
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                      Point 1: Initial Assessment
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Critical for determining treatment pathway and resource allocation
                    </p>
                  </div>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                      Point 2: Treatment Modification
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      Requires careful monitoring and adjustment based on patient response
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section Validation */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle>Clinical Section Validation</CardTitle>
                    <CardDescription>
                      Quality assessment of clinical data sections
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Patient Demographics', status: 'Complete', color: 'green' },
                    { name: 'Medical History', status: 'Complete', color: 'green' },
                    { name: 'Physical Examination', status: 'Complete', color: 'green' },
                    { name: 'Laboratory Results', status: 'Complete', color: 'green' },
                    { name: 'Imaging Studies', status: 'Complete', color: 'green' },
                    { name: 'Treatment Plan', status: 'Complete', color: 'green' }
                  ].map((section, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <h4 className="font-medium text-sm mb-1">{section.name}</h4>
                      <Badge 
                        variant={section.color === 'green' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {section.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/forms/data-field-validation">
              <Button className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                Go to Editable Form
              </Button>
            </Link>
            <Link href="/forms">
              <Button variant="outline" className="w-full sm:w-auto">
                <Info className="h-4 w-4 mr-2" />
                Back to Forms
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 