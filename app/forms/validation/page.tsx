'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Plus
} from 'lucide-react';

interface ValidationSection {
  id: string;
  title: string;
  description: string;
  parameters: ValidationParameter[];
}

interface ValidationParameter {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  isChecked: boolean;
}

export default function ValidationFormPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [otherParameters, setOtherParameters] = React.useState('');

  // Clinical Logic Collection Template sections
  const [sections, setSections] = React.useState<ValidationSection[]>([
    {
      id: '1',
      title: 'Disease Overview',
      description: 'Basic information about the disease including name, type, and onset characteristics',
      parameters: [
        { id: '1.1', name: 'Disease Name', description: 'Primary disease identifier', isRequired: true, isChecked: true },
        { id: '1.2', name: 'Common Name', description: 'Alternative names for the disease', isRequired: false, isChecked: true },
        { id: '1.3', name: 'Disease Type', description: 'Acute, Chronic, Recurrent, or Congenital', isRequired: true, isChecked: true },
        { id: '1.4', name: 'Typical Onset Age', description: 'Age range when disease typically manifests', isRequired: true, isChecked: true },
        { id: '1.5', name: 'Gender Bias', description: 'Gender-specific prevalence patterns', isRequired: false, isChecked: true },
        { id: '1.6', name: 'Urban/Rural Bias', description: 'Geographic distribution patterns', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '2',
      title: 'Disease Subtypes & Family History',
      description: 'Detailed classification and genetic factors',
      parameters: [
        { id: '2.1', name: 'Subtypes', description: 'Different forms of the disease', isRequired: false, isChecked: true },
        { id: '2.2', name: 'Subtype Criteria', description: 'Criteria for subtype classification', isRequired: false, isChecked: true },
        { id: '2.3', name: 'Genetic Risk Factors', description: 'Inherited risk factors', isRequired: false, isChecked: true },
        { id: '2.4', name: 'Inheritance Patterns', description: 'How the disease is inherited', isRequired: false, isChecked: false },
        { id: '2.5', name: 'Family History Relevance', description: 'Importance of family history', isRequired: true, isChecked: true }
      ]
    },
    {
      id: '3',
      title: 'Clinical Staging & Symptoms',
      description: 'Disease progression stages and associated symptoms',
      parameters: [
        { id: '3.1', name: 'Disease Stages', description: 'Progressive stages of the disease', isRequired: true, isChecked: true },
        { id: '3.2', name: 'Stage Symptoms', description: 'Symptoms for each stage', isRequired: true, isChecked: true },
        { id: '3.3', name: 'Stage Duration', description: 'How long each stage lasts', isRequired: false, isChecked: false },
        { id: '3.4', name: 'Stage Triggers', description: 'What triggers stage progression', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '4',
      title: 'Comorbidities',
      description: 'Other conditions that commonly occur with this disease',
      parameters: [
        { id: '4.1', name: 'Common Comorbidities', description: 'Frequently associated conditions', isRequired: false, isChecked: true },
        { id: '4.2', name: 'Comorbidity Frequency', description: 'How often comorbidities occur', isRequired: false, isChecked: false },
        { id: '4.3', name: 'Comorbidity Onset', description: 'When comorbidities typically develop', isRequired: false, isChecked: false },
        { id: '4.4', name: 'Comorbidity Complications', description: 'How comorbidities affect treatment', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '5',
      title: 'Medication Protocol',
      description: 'Treatment protocols and medication guidelines',
      parameters: [
        { id: '5.1', name: 'First Line Treatment', description: 'Primary treatment options', isRequired: true, isChecked: true },
        { id: '5.2', name: 'Second Line Treatment', description: 'Alternative treatment options', isRequired: false, isChecked: true },
        { id: '5.3', name: 'Dosage Guidelines', description: 'Recommended dosages', isRequired: true, isChecked: true },
        { id: '5.4', name: 'Treatment Triggers', description: 'When to start specific treatments', isRequired: false, isChecked: false },
        { id: '5.5', name: 'Treatment Notes', description: 'Important treatment considerations', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '6',
      title: 'Lifestyle Management',
      description: 'Non-pharmacological management strategies',
      parameters: [
        { id: '6.1', name: 'Lifestyle Recommendations', description: 'Recommended lifestyle changes', isRequired: false, isChecked: true },
        { id: '6.2', name: 'Lifestyle by Stage', description: 'Stage-specific lifestyle advice', isRequired: false, isChecked: false },
        { id: '6.3', name: 'Lifestyle Notes', description: 'Additional lifestyle considerations', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '7',
      title: 'Pediatric vs Adult',
      description: 'Age-specific disease presentations',
      parameters: [
        { id: '7.1', name: 'Pediatric Presentation', description: 'How disease presents in children', isRequired: false, isChecked: true },
        { id: '7.2', name: 'Adult Presentation', description: 'How disease presents in adults', isRequired: false, isChecked: true }
      ]
    },
    {
      id: '8',
      title: 'Emergency Conditions',
      description: 'Emergency situations and urgent care protocols',
      parameters: [
        { id: '8.1', name: 'Emergency Triggers', description: 'Symptoms requiring immediate care', isRequired: true, isChecked: true },
        { id: '8.2', name: 'Emergency Stages', description: 'Stages of emergency progression', isRequired: false, isChecked: false },
        { id: '8.3', name: 'Hospitalization Criteria', description: 'When hospitalization is needed', isRequired: true, isChecked: true },
        { id: '8.4', name: 'Emergency Actions', description: 'Immediate actions to take', isRequired: true, isChecked: true }
      ]
    },
    {
      id: '9',
      title: 'Disease Progression',
      description: 'How the disease progresses over time',
      parameters: [
        { id: '9.1', name: 'Progression Timeline', description: 'Expected disease progression', isRequired: false, isChecked: true },
        { id: '9.2', name: 'Progression Triggers', description: 'Factors that accelerate progression', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '10',
      title: 'Lab Values',
      description: 'Laboratory tests and diagnostic values',
      parameters: [
        { id: '10.1', name: 'Lab Test Names', description: 'Relevant laboratory tests', isRequired: false, isChecked: true },
        { id: '10.2', name: 'Normal Ranges', description: 'Expected normal values', isRequired: false, isChecked: true },
        { id: '10.3', name: 'Critical Values', description: 'Values requiring immediate attention', isRequired: true, isChecked: true },
        { id: '10.4', name: 'Lab Notes', description: 'Additional lab considerations', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '11',
      title: 'Monitoring',
      description: 'Ongoing monitoring protocols',
      parameters: [
        { id: '11.1', name: 'Monitoring Frequency', description: 'How often to monitor', isRequired: true, isChecked: true },
        { id: '11.2', name: 'Monitoring Metrics', description: 'What to monitor', isRequired: true, isChecked: true }
      ]
    },
    {
      id: '12',
      title: 'Regional Variations',
      description: 'Geographic and cultural variations',
      parameters: [
        { id: '12.1', name: 'Urban Variations', description: 'City-specific patterns', isRequired: false, isChecked: false },
        { id: '12.2', name: 'Rural Variations', description: 'Rural-specific patterns', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '13',
      title: 'Contraindications',
      description: 'When treatments should not be used',
      parameters: [
        { id: '13.1', name: 'Contraindications', description: 'When to avoid treatments', isRequired: true, isChecked: true },
        { id: '13.2', name: 'Contraindication Conditions', description: 'Specific conditions to avoid', isRequired: false, isChecked: false },
        { id: '13.3', name: 'Contraindication Notes', description: 'Additional contraindication info', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '14',
      title: 'Misdiagnoses',
      description: 'Common diagnostic errors',
      parameters: [
        { id: '14.1', name: 'Common Misdiagnoses', description: 'Frequently confused conditions', isRequired: false, isChecked: true },
        { id: '14.2', name: 'Misdiagnosis Differentiators', description: 'How to distinguish from similar conditions', isRequired: false, isChecked: false },
        { id: '14.3', name: 'Misdiagnosis Notes', description: 'Additional diagnostic considerations', isRequired: false, isChecked: false }
      ]
    },
    {
      id: '15',
      title: 'Cultural & Additional Notes',
      description: 'Cultural considerations and additional observations',
      parameters: [
        { id: '15.1', name: 'Cultural Aspects', description: 'Cultural considerations in treatment', isRequired: false, isChecked: false },
        { id: '15.2', name: 'Socioeconomic Barriers', description: 'Economic factors affecting care', isRequired: false, isChecked: false },
        { id: '15.3', name: 'Additional Observations', description: 'Other important observations', isRequired: false, isChecked: false }
      ]
    }
  ]);

  const handleParameterToggle = (sectionId: string, parameterId: string) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          parameters: section.parameters.map(param => {
            if (param.id === parameterId) {
              return { ...param, isChecked: !param.isChecked };
            }
            return param;
          })
        };
      }
      return section;
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, this would save to the database
      console.log('Validation form submitted:', {
        sections,
        otherParameters,
        submittedBy: user?.email,
        submittedAt: new Date().toISOString()
      });
      
      // Navigate to the parameter input form
      router.push('/forms/input');
    } catch (error) {
      console.error('Failed to submit validation form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getValidationStats = () => {
    const totalParameters = sections.reduce((acc, section) => acc + section.parameters.length, 0);
    const checkedParameters = sections.reduce((acc, section) => 
      acc + section.parameters.filter(param => param.isChecked).length, 0
    );
    const requiredParameters = sections.reduce((acc, section) => 
      acc + section.parameters.filter(param => param.isRequired).length, 0
    );
    const checkedRequired = sections.reduce((acc, section) => 
      acc + section.parameters.filter(param => param.isRequired && param.isChecked).length, 0
    );

    return {
      total: totalParameters,
      checked: checkedParameters,
      required: requiredParameters,
      checkedRequired: checkedRequired,
      progress: Math.round((checkedRequired / requiredParameters) * 100)
    };
  };

  const stats = getValidationStats();

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
            <p className="text-muted-foreground">Please sign in to access the validation form.</p>
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                onClick={() => router.push('/forms')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Forms
              </Button>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Data Field Validation Form</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Validate if the Clinical Logic Collection Template is sufficient for your disease
              </p>
            </div>
          </div>

          {/* Progress Stats */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.checkedRequired}/{stats.required}</div>
                  <div className="text-sm text-muted-foreground">Required Checked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.checked}/{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Checked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.progress}%</div>
                  <div className="text-sm text-muted-foreground">Required Progress</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{sections.length}</div>
                  <div className="text-sm text-muted-foreground">Sections</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Sections */}
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {section.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.parameters.map((parameter) => (
                      <div key={parameter.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={parameter.id}
                          checked={parameter.isChecked}
                          onCheckedChange={() => handleParameterToggle(section.id, parameter.id)}
                        />
                        <div className="flex-1">
                          <Label htmlFor={parameter.id} className="flex items-center gap-2">
                            {parameter.name}
                            {parameter.isRequired && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </Label>
                          <p className="text-sm text-muted-foreground mt-1">{parameter.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Other Parameters */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Other Required Parameters
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Suggest any additional parameters that should be included in the template
              </p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter any additional parameters that should be included..."
                value={otherParameters}
                onChange={(e) => setOtherParameters(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || stats.checkedRequired < stats.required}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 