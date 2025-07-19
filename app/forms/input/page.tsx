'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ArrowLeft, 
  Save, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Upload,
  Download
} from 'lucide-react';

interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  name: string;
  description: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'multiselect';
  required: boolean;
  value: string | number | string[];
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export default function ParameterInputFormPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formProgress, setFormProgress] = React.useState(0);

  // Form sections based on the Clinical Logic Collection Template
  const [sections, setSections] = React.useState<FormSection[]>([
    {
      id: '1',
      title: 'Disease Overview',
      description: 'Basic information about the disease',
      fields: [
        {
          id: '1.1',
          name: 'Disease Name',
          description: 'Primary disease identifier',
          type: 'text',
          required: true,
          value: ''
        },
        {
          id: '1.2',
          name: 'Common Name',
          description: 'Alternative names for the disease',
          type: 'text',
          required: false,
          value: ''
        },
        {
          id: '1.3',
          name: 'Disease Type',
          description: 'Acute, Chronic, Recurrent, or Congenital',
          type: 'select',
          required: true,
          value: '',
          options: ['Acute', 'Chronic', 'Recurrent', 'Congenital']
        },
        {
          id: '1.4',
          name: 'Typical Onset Age',
          description: 'Age range when disease typically manifests',
          type: 'text',
          required: true,
          value: '',
          validation: { min: 0, max: 120 }
        },
        {
          id: '1.5',
          name: 'Gender Bias',
          description: 'Gender-specific prevalence patterns',
          type: 'select',
          required: false,
          value: '',
          options: ['Male', 'Female', 'No Bias', 'Unknown']
        },
        {
          id: '1.6',
          name: 'Urban/Rural Bias',
          description: 'Geographic distribution patterns',
          type: 'select',
          required: false,
          value: '',
          options: ['Urban', 'Rural', 'No Bias', 'Unknown']
        }
      ]
    },
    {
      id: '2',
      title: 'Disease Subtypes & Family History',
      description: 'Detailed classification and genetic factors',
      fields: [
        {
          id: '2.1',
          name: 'Subtypes',
          description: 'Different forms of the disease',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '2.2',
          name: 'Subtype Criteria',
          description: 'Criteria for subtype classification',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '2.3',
          name: 'Genetic Risk Factors',
          description: 'Inherited risk factors',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '2.4',
          name: 'Inheritance Patterns',
          description: 'How the disease is inherited',
          type: 'select',
          required: false,
          value: '',
          options: ['Autosomal Dominant', 'Autosomal Recessive', 'X-linked', 'Y-linked', 'Mitochondrial', 'Unknown']
        },
        {
          id: '2.5',
          name: 'Family History Relevance',
          description: 'Importance of family history',
          type: 'select',
          required: true,
          value: '',
          options: ['High', 'Medium', 'Low', 'None']
        }
      ]
    },
    {
      id: '3',
      title: 'Clinical Staging & Symptoms',
      description: 'Disease progression stages and associated symptoms',
      fields: [
        {
          id: '3.1',
          name: 'Disease Stages',
          description: 'Progressive stages of the disease',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '3.2',
          name: 'Stage Symptoms',
          description: 'Symptoms for each stage',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '3.3',
          name: 'Stage Duration',
          description: 'How long each stage lasts',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '3.4',
          name: 'Stage Triggers',
          description: 'What triggers stage progression',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '4',
      title: 'Comorbidities',
      description: 'Other conditions that commonly occur with this disease',
      fields: [
        {
          id: '4.1',
          name: 'Common Comorbidities',
          description: 'Frequently associated conditions',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '4.2',
          name: 'Comorbidity Frequency',
          description: 'How often comorbidities occur',
          type: 'select',
          required: false,
          value: '',
          options: ['Very Common (>50%)', 'Common (25-50%)', 'Uncommon (10-25%)', 'Rare (<10%)', 'Unknown']
        },
        {
          id: '4.3',
          name: 'Comorbidity Onset',
          description: 'When comorbidities typically develop',
          type: 'select',
          required: false,
          value: '',
          options: ['Before Disease', 'At Disease Onset', 'Early Disease', 'Late Disease', 'Variable', 'Unknown']
        },
        {
          id: '4.4',
          name: 'Comorbidity Complications',
          description: 'How comorbidities affect treatment',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '5',
      title: 'Medication Protocol',
      description: 'Treatment protocols and medication guidelines',
      fields: [
        {
          id: '5.1',
          name: 'First Line Treatment',
          description: 'Primary treatment options',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '5.2',
          name: 'Second Line Treatment',
          description: 'Alternative treatment options',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '5.3',
          name: 'Dosage Guidelines',
          description: 'Recommended dosages',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '5.4',
          name: 'Treatment Triggers',
          description: 'When to start specific treatments',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '5.5',
          name: 'Treatment Notes',
          description: 'Important treatment considerations',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '6',
      title: 'Lifestyle Management',
      description: 'Non-pharmacological management strategies',
      fields: [
        {
          id: '6.1',
          name: 'Lifestyle Recommendations',
          description: 'Recommended lifestyle changes',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '6.2',
          name: 'Lifestyle by Stage',
          description: 'Stage-specific lifestyle advice',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '6.3',
          name: 'Lifestyle Notes',
          description: 'Additional lifestyle considerations',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '7',
      title: 'Pediatric vs Adult',
      description: 'Age-specific disease presentations',
      fields: [
        {
          id: '7.1',
          name: 'Pediatric Presentation',
          description: 'How disease presents in children',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '7.2',
          name: 'Adult Presentation',
          description: 'How disease presents in adults',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '8',
      title: 'Emergency Conditions',
      description: 'Emergency situations and urgent care protocols',
      fields: [
        {
          id: '8.1',
          name: 'Emergency Triggers',
          description: 'Symptoms requiring immediate care',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '8.2',
          name: 'Emergency Stages',
          description: 'Stages of emergency progression',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '8.3',
          name: 'Hospitalization Criteria',
          description: 'When hospitalization is needed',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '8.4',
          name: 'Emergency Actions',
          description: 'Immediate actions to take',
          type: 'textarea',
          required: true,
          value: ''
        }
      ]
    },
    {
      id: '9',
      title: 'Disease Progression',
      description: 'How the disease progresses over time',
      fields: [
        {
          id: '9.1',
          name: 'Progression Timeline',
          description: 'Expected disease progression',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '9.2',
          name: 'Progression Triggers',
          description: 'Factors that accelerate progression',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '10',
      title: 'Lab Values',
      description: 'Laboratory tests and diagnostic values',
      fields: [
        {
          id: '10.1',
          name: 'Lab Test Names',
          description: 'Relevant laboratory tests',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '10.2',
          name: 'Normal Ranges',
          description: 'Expected normal values',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '10.3',
          name: 'Critical Values',
          description: 'Values requiring immediate attention',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '10.4',
          name: 'Lab Notes',
          description: 'Additional lab considerations',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '11',
      title: 'Monitoring',
      description: 'Ongoing monitoring protocols',
      fields: [
        {
          id: '11.1',
          name: 'Monitoring Frequency',
          description: 'How often to monitor',
          type: 'select',
          required: true,
          value: '',
          options: ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually', 'As Needed', 'Variable']
        },
        {
          id: '11.2',
          name: 'Monitoring Metrics',
          description: 'What to monitor',
          type: 'textarea',
          required: true,
          value: ''
        }
      ]
    },
    {
      id: '12',
      title: 'Regional Variations',
      description: 'Geographic and cultural variations',
      fields: [
        {
          id: '12.1',
          name: 'Urban Variations',
          description: 'City-specific patterns',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '12.2',
          name: 'Rural Variations',
          description: 'Rural-specific patterns',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '13',
      title: 'Contraindications',
      description: 'When treatments should not be used',
      fields: [
        {
          id: '13.1',
          name: 'Contraindications',
          description: 'When to avoid treatments',
          type: 'textarea',
          required: true,
          value: ''
        },
        {
          id: '13.2',
          name: 'Contraindication Conditions',
          description: 'Specific conditions to avoid',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '13.3',
          name: 'Contraindication Notes',
          description: 'Additional contraindication info',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '14',
      title: 'Misdiagnoses',
      description: 'Common diagnostic errors',
      fields: [
        {
          id: '14.1',
          name: 'Common Misdiagnoses',
          description: 'Frequently confused conditions',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '14.2',
          name: 'Misdiagnosis Differentiators',
          description: 'How to distinguish from similar conditions',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '14.3',
          name: 'Misdiagnosis Notes',
          description: 'Additional diagnostic considerations',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    },
    {
      id: '15',
      title: 'Cultural & Additional Notes',
      description: 'Cultural considerations and additional observations',
      fields: [
        {
          id: '15.1',
          name: 'Cultural Aspects',
          description: 'Cultural considerations in treatment',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '15.2',
          name: 'Socioeconomic Barriers',
          description: 'Economic factors affecting care',
          type: 'textarea',
          required: false,
          value: ''
        },
        {
          id: '15.3',
          name: 'Additional Observations',
          description: 'Other important observations',
          type: 'textarea',
          required: false,
          value: ''
        }
      ]
    }
  ]);

  const handleFieldChange = (sectionId: string, fieldId: string, value: string | number | string[]) => {
    setSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          fields: section.fields.map(field => {
            if (field.id === fieldId) {
              return { ...field, value };
            }
            return field;
          })
        };
      }
      return section;
    }));
  };

  const calculateProgress = () => {
    const totalRequiredFields = sections.reduce((acc, section) => 
      acc + section.fields.filter(field => field.required).length, 0
    );
    const completedRequiredFields = sections.reduce((acc, section) => 
      acc + section.fields.filter(field => field.required && field.value !== '').length, 0
    );
    return Math.round((completedRequiredFields / totalRequiredFields) * 100);
  };

  React.useEffect(() => {
    setFormProgress(calculateProgress());
  }, [sections]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In a real app, this would save to the database
      const formData = {
        sections,
        submittedBy: user?.email,
        submittedAt: new Date().toISOString(),
        progress: formProgress
      };
      
      console.log('Form submitted:', formData);
      
      // Navigate to success page or back to forms
      router.push('/forms');
    } catch (error) {
      console.error('Failed to submit form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    try {
      // Save as draft
      console.log('Form saved as draft:', { sections, progress: formProgress });
      router.push('/forms');
    } catch (error) {
      console.error('Failed to save draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField, sectionId: string) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={field.value as string}
            onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={field.value as number}
            onChange={(e) => handleFieldChange(sectionId, field.id, Number(e.target.value))}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            min={field.validation?.min}
            max={field.validation?.max}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={field.value as string}
            onChange={(e) => handleFieldChange(sectionId, field.id, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            rows={3}
          />
        );
      case 'select':
        return (
          <Select
            value={field.value as string}
            onValueChange={(value) => handleFieldChange(sectionId, field.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return null;
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
            <p className="text-muted-foreground">Please sign in to access the parameter input form.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950">
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
              <h1 className="text-3xl font-bold">Parameter Input Form</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Fill out the required values for your disease parameters
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Form Progress</span>
                <span className="text-sm text-muted-foreground">{formProgress}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    formProgress === 100 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${formProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formProgress === 100 ? 'All required fields completed!' : 'Complete all required fields to submit'}
              </p>
            </CardContent>
          </Card>

          {/* Form Sections */}
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
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="flex items-center gap-2">
                          {field.name}
                          {field.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </Label>
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                        {renderField(field, section.id)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-between">
            <Button 
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || formProgress < 100}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 