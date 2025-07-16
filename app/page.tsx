'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClinicalLogicSchema, type ClinicalLogic } from '@/lib/types';
import { Heart, ArrowRight, CheckCircle, AlertTriangle, ChevronRight, ChevronLeft, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/lib/language-context';
import { trackClinicalLogicStarted, trackClinicalLogicCompleted, trackFormStepCompleted } from '@/lib/analytics-service';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { LoginButton } from '@/components/auth/LoginButton';

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  // Track form start when component mounts
  React.useEffect(() => {
    trackClinicalLogicStarted();
  }, []);

  // Custom login fallback for Clinical Data form
  const ClinicalDataLoginFallback = (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center clinical-card">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
            <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Clinical Data Access Required</CardTitle>
          <p className="text-muted-foreground">
            Please sign in with your Google account to contribute clinical data and help advance healthcare research.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ClinicalLogic>({
    resolver: zodResolver(ClinicalLogicSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ClinicalLogic) => {
    setIsSubmitting(true);
    try {
      // TODO: Submit to Firebase
      console.log('Submitting data:', data);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      
      // Track completion
      trackClinicalLogicCompleted(data.diseaseType);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { id: 1, ...t.steps.step1 },
    { id: 2, ...t.steps.step2 },
    { id: 3, ...t.steps.step3 },
    { id: 4, ...t.steps.step4 },
    { id: 5, ...t.steps.step5 },
    { id: 6, ...t.steps.step6 },
    { id: 7, ...t.steps.step7 },
  ];

  const progress = (currentStep / steps.length) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center clinical-card">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              {t.ui.thankYou}
            </h1>
            <p className="text-muted-foreground mb-8 text-base leading-relaxed">
              {t.ui.thankYouMessage}
            </p>
            <Button 
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              className="w-full h-11 text-base font-semibold"
            >
              {t.ui.submitAnother}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <AuthGuard fallback={ClinicalDataLoginFallback}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Strategic Collaboration on Clinical Data Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Clinically Validated Data for Advanced Medical Research and Patient Care
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Stethoscope className="h-3 w-3" />
                Doctor Access Required
              </Badge>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-12 slide-in">
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold text-foreground">
                {t.ui.step} {currentStep} {t.ui.of} {steps.length}
              </span>
              <span className="text-base font-medium text-muted-foreground">
                {Math.round(progress)}% {t.ui.complete}
              </span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 rounded-full" />
            </div>
            <div className="flex justify-between mt-6">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center step-card">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                    currentStep >= step.id
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
                  }`}>
                    {step.id}
                  </div>
                  <div className="mt-3 text-center">
                    <div className={`text-xs font-semibold max-w-32 leading-tight ${
                      currentStep >= step.id
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}>{step.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Disease Overview */}
          {currentStep === 1 && (
            <Card className="clinical-card form-step">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Badge className="text-sm font-bold px-3 py-1 bg-black text-white border-0">{t.ui.step} 1</Badge>
                  <span className="text-foreground">
                    {t.form.diseaseName.split('*')[0]}
                  </span>
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {t.steps.step1.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="diseaseName" className="text-base font-semibold">{t.form.diseaseName}</Label>
                    <Input
                      id="diseaseName"
                      {...register('diseaseName')}
                      placeholder={t.placeholders.diseaseName}
                      className={`h-12 text-base bg-background border-input text-foreground focus:ring-primary ${errors.diseaseName ? 'border-destructive ring-destructive' : ''}`}
                    />
                    {errors.diseaseName && (
                      <p className="text-sm text-destructive font-medium">{errors.diseaseName.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="commonName" className="text-base font-semibold">{t.form.commonName}</Label>
                    <Input
                      id="commonName"
                      {...register('commonName')}
                      placeholder={t.placeholders.commonName}
                      className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="diseaseType" className="text-base font-semibold">{t.form.diseaseType}</Label>
                    <Select onValueChange={(value) => setValue('diseaseType', value as any)}>
                      <SelectTrigger className={`h-12 text-base bg-background border-input text-foreground ${errors.diseaseType ? 'border-destructive ring-destructive' : 'focus:ring-primary'}`}>
                        <SelectValue placeholder={t.ui.select} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acute">{t.ui.acute}</SelectItem>
                        <SelectItem value="Chronic">{t.ui.chronic}</SelectItem>
                        <SelectItem value="Recurrent">{t.ui.recurrent}</SelectItem>
                        <SelectItem value="Congenital">{t.ui.congenital}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.diseaseType && (
                      <p className="text-sm text-destructive font-medium">{errors.diseaseType.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="typicalOnsetAge" className="text-base font-semibold">{t.form.typicalOnsetAge}</Label>
                    <Input
                      id="typicalOnsetAge"
                      type="number"
                      {...register('typicalOnsetAge', { valueAsNumber: true })}
                      placeholder={t.placeholders.typicalAge}
                      className={`h-12 text-base bg-background border-input text-foreground ${errors.typicalOnsetAge ? 'border-destructive ring-destructive' : 'focus:ring-primary'}`}
                    />
                    {errors.typicalOnsetAge && (
                      <p className="text-sm text-destructive font-medium">{errors.typicalOnsetAge.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="genderBias" className="text-base font-semibold">{t.form.genderPrevalence}</Label>
                    <Select onValueChange={(value) => setValue('genderBias', value as any)}>
                      <SelectTrigger className="h-12 text-base bg-background border-input text-foreground focus:ring-primary">
                        <SelectValue placeholder={t.ui.select} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Equal">{t.ui.equal}</SelectItem>
                        <SelectItem value="Male">{t.ui.male}</SelectItem>
                        <SelectItem value="Female">{t.ui.female}</SelectItem>
                        <SelectItem value="Context-dependent">{t.ui.contextDependent}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="urbanRuralBias" className="text-base font-semibold">{t.form.ruralUrbanDifferences}</Label>
                    <Textarea
                      id="urbanRuralBias"
                      {...register('urbanRuralBias')}
                      placeholder={t.placeholders.ruralUrbanDiff}
                      rows={3}
                      className="text-base bg-background border-input text-foreground focus:ring-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Subtypes & Family History */}
          {currentStep === 2 && (
            <Card className="clinical-card form-step">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Badge className="text-sm font-bold px-3 py-1 bg-black text-white border-0">{t.ui.step} 2</Badge>
                  <span className="text-foreground">
                    {t.steps.step2.title}
                  </span>
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {t.steps.step2.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step2.subtypesTitle}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.steps.step2.subtypeName}</Label>
                        <Input
                          {...register('subtypes.0')}
                          placeholder={t.placeholders.subtypeName}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.steps.step2.subtypeCriteria}</Label>
                        <Input
                          {...register('subtypeCriteria.0')}
                          placeholder={t.placeholders.subtypeCriteria}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.steps.step2.distinctTreatment}</Label>
                        <Select onValueChange={(value) => setValue('subtypeTreatment.0', value)}>
                          <SelectTrigger className="h-12 text-base bg-background border-input text-foreground focus:ring-primary">
                            <SelectValue placeholder={t.ui.select} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">{t.ui.yes}</SelectItem>
                            <SelectItem value="No">{t.ui.no}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.steps.step2.notes}</Label>
                        <Input
                          {...register('subtypeNotes.0')}
                          placeholder={t.placeholders.subtypeNotes}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step2.familyHistoryTitle}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.steps.step2.riskFactor}</Label>
                        <Input
                          {...register('geneticRiskFactors.0')}
                          placeholder={t.placeholders.riskFactor}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.steps.step2.inheritancePattern}</Label>
                        <Input
                          {...register('inheritancePatterns.0')}
                          placeholder={t.placeholders.inheritancePattern}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">{t.steps.step2.influenceOnOnset}</Label>
                        <Input
                          {...register('geneticInfluence.0')}
                          placeholder={t.placeholders.influenceOnOnset}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="familyHistoryRelevance"
                    {...register('familyHistoryRelevance')}
                    className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  />
                  <Label htmlFor="familyHistoryRelevance" className="text-base font-semibold">{t.steps.step2.familyHistoryRelevance}</Label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Clinical Staging */}
          {currentStep === 3 && (
            <Card className="clinical-card form-step">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Badge className="text-sm font-bold px-3 py-1 bg-black text-white border-0">{t.ui.step} 3</Badge>
                  <span className="text-foreground">
                    {t.steps.step3.title}
                  </span>
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {t.steps.step3.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step3.clinicalStagingTitle}</h3>
                  <div className="space-y-6">
                    {['Early', 'Moderate', 'Advanced'].map((stage, index) => (
                      <Card key={stage} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{t.steps.step3.stage} {index + 1} ({stage})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-3">
                              <Label className="text-base font-semibold">{t.steps.step3.diagnosticCriteria}</Label>
                              <Textarea
                                {...register(`stages.${index}.description`)}
                                placeholder={t.placeholders.diagnosticCriteria}
                                rows={3}
                                className="text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-base font-semibold">{t.steps.step3.approxDuration}</Label>
                              <Input
                                {...register(`stages.${index}.duration`)}
                                placeholder={t.placeholders.approxDuration}
                                className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-base font-semibold">{t.steps.step3.transitionTriggers}</Label>
                              <Textarea
                                {...register(`stages.${index}.triggers`)}
                                placeholder={t.placeholders.transitionTriggers}
                                rows={3}
                                className="text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step3.symptomsByStageTitle}</h3>
                  <div className="space-y-4">
                    {['Early', 'Moderate', 'Advanced'].map((stage, index) => (
                      <Card key={stage} className="border-l-4 border-l-green-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{stage}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label>{t.steps.step3.majorSymptoms}</Label>
                              <Textarea
                                {...register(`stageSymptoms.${index}.major`)}
                                placeholder={t.placeholders.majorSymptoms}
                                rows={3}
                                className="text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step3.earlyHiddenSymptoms}</Label>
                              <Textarea
                                {...register(`stageSymptoms.${index}.hidden`)}
                                placeholder={t.placeholders.earlyHiddenSymptoms}
                                rows={3}
                                className="text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step3.symptomPrevalence}</Label>
                              <Input
                                {...register(`stageSymptoms.${index}.prevalence`)}
                                placeholder={t.placeholders.symptomPrevalence}
                                className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step3.commonComorbiditiesTitle}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>{t.steps.step3.comorbidity}</Label>
                        <Input
                          {...register('commonComorbidities.0')}
                          placeholder={t.placeholders.comorbidity}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step3.frequency}</Label>
                        <Input
                          {...register('comorbidityFrequency.0')}
                          placeholder={t.placeholders.frequency}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step3.commonOnsetStage}</Label>
                        <Select onValueChange={(value) => setValue('comorbidityOnset.0', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t.ui.select} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Early">{t.ui.early}</SelectItem>
                            <SelectItem value="Moderate">{t.ui.moderate}</SelectItem>
                            <SelectItem value="Advanced">{t.ui.advanced}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step3.complicatesTreatment}</Label>
                        <Select onValueChange={(value) => setValue('comorbidityComplicates.0', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder={t.ui.select} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">{t.ui.yes}</SelectItem>
                            <SelectItem value="No">{t.ui.no}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Treatment & Management */}
          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-black text-white border-0">{t.ui.step} 4</Badge>
                  {t.steps.step4.title}
                </CardTitle>
                <CardDescription>
                  {t.steps.step4.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step4.medicationProtocolTitle}</h3>
                  <div className="space-y-6">
                    {['Early', 'Moderate', 'Advanced'].map((stage, index) => (
                      <Card key={stage} className="border-l-4 border-l-purple-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{stage}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="space-y-2">
                              <Label>{t.steps.step4.lineOfTreatment}</Label>
                              <Input
                                {...register(`medicationProtocol.${index}.line`)}
                                placeholder={t.placeholders.lineOfTreatment}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step4.drugClass}</Label>
                              <Input
                                {...register(`medicationProtocol.${index}.drug`)}
                                placeholder={t.placeholders.drugClass}
                                className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step4.standardDosage}</Label>
                              <Input
                                {...register(`medicationProtocol.${index}.dosage`)}
                                placeholder={t.placeholders.standardDosage}
                                className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step4.triggerToStartStop}</Label>
                              <Input
                                {...register(`medicationProtocol.${index}.trigger`)}
                                placeholder={t.placeholders.triggerToStartStop}
                                className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step4.notes}</Label>
                              <Input
                                {...register(`medicationProtocol.${index}.notes`)}
                                placeholder={t.placeholders.notes}
                                className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step4.lifestyleGuidanceTitle}</h3>
                  <div className="space-y-4">
                    {['Diet', 'Exercise', 'Other'].map((type, index) => (
                      <div key={type} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>{t.steps.step4.interventionType}</Label>
                          <Input
                            value={type}
                            className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.steps.step4.description}</Label>
                          <Textarea
                            {...register(`lifestyleRecommendations.${index}`)}
                            placeholder={t.placeholders.lifestyleDescription}
                            rows={2}
                            className="text-base bg-background border-input text-foreground focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.steps.step4.recommendedStages}</Label>
                          <Select onValueChange={(value) => setValue(`lifestyleStages.${index}`, value)}>
                            <SelectTrigger className="h-12 text-base bg-background border-input text-foreground focus:ring-primary">
                              <SelectValue placeholder={t.ui.select} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Early">{t.ui.early}</SelectItem>
                              <SelectItem value="Moderate">{t.ui.moderate}</SelectItem>
                              <SelectItem value="Advanced">{t.ui.advanced}</SelectItem>
                              <SelectItem value="All">{t.ui.allStages}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>{t.steps.step4.notes}</Label>
                          <Input
                            {...register(`lifestyleNotes.${index}`)}
                            placeholder={t.placeholders.lifestyleNotes}
                            className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step4.pediatricVsAdultTitle}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>{t.steps.step4.pediatricUniqueFeatures}</Label>
                      <Textarea
                        {...register('pediatricPresentation')}
                        placeholder={t.placeholders.pediatricPresentation}
                        rows={4}
                        className="text-base bg-background border-input text-foreground focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.steps.step4.adultUniqueFeatures}</Label>
                      <Textarea
                        {...register('adultPresentation')}
                        placeholder={t.placeholders.adultPresentation}
                        rows={4}
                        className="text-base bg-background border-input text-foreground focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Emergency & Monitoring */}
          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-black text-white border-0">{t.ui.step} 5</Badge>
                  {t.steps.step5.title}
                </CardTitle>
                <CardDescription>
                  {t.steps.step5.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {t.steps.step5.emergencyWarning}
                  </AlertDescription>
                </Alert>

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step5.redFlagsTitle}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>{t.steps.step5.symptomEvent}</Label>
                        <Input
                          {...register('emergencyTriggers.0')}
                          placeholder={t.placeholders.symptomEvent}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step5.stageWhenAppears}</Label>
                        <Select onValueChange={(value) => setValue('emergencyStages.0', value)}>
                          <SelectTrigger className="h-12 text-base bg-background border-input text-foreground focus:ring-primary">
                            <SelectValue placeholder={t.ui.select} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Early">{t.ui.early}</SelectItem>
                            <SelectItem value="Moderate">{t.ui.moderate}</SelectItem>
                            <SelectItem value="Advanced">{t.ui.advanced}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step5.hospitalizationRequired}</Label>
                        <Select onValueChange={(value) => setValue('emergencyHospitalization.0', value)}>
                          <SelectTrigger className="h-12 text-base bg-background border-input text-foreground focus:ring-primary">
                            <SelectValue placeholder={t.ui.select} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Yes">{t.ui.yes}</SelectItem>
                            <SelectItem value="No">{t.ui.no}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step5.criticalActionRequired}</Label>
                        <Input
                          {...register('emergencyActions.0')}
                          placeholder={t.placeholders.criticalActionRequired}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step5.diseaseProgressionTitle}</h3>
                  <div className="space-y-4">
                    {['Early', 'Moderate', 'Advanced'].map((stage, index) => (
                      <div key={stage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t.steps.step5.averageDuration}</Label>
                          <Input
                            {...register(`progressionTimeline.${index}.duration`)}
                            placeholder={t.placeholders.averageDuration}
                            className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.steps.step5.triggersForProgression}</Label>
                          <Input
                            {...register(`progressionTimeline.${index}.triggers`)}
                            placeholder={t.placeholders.triggersForProgression}
                            className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step5.labValueRangesTitle}</h3>
                  <div className="space-y-4">
                    {['Early', 'Moderate', 'Advanced'].map((stage, index) => (
                      <Card key={stage} className="border-l-4 border-l-orange-500">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">{stage}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label>{t.steps.step5.labName}</Label>
                              <Input
                                {...register(`labValues.${index}.name`)}
                                placeholder={t.placeholders.labName}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step5.expectedRange}</Label>
                              <Input
                                {...register(`labValues.${index}.range`)}
                                placeholder={t.placeholders.expectedRange}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step5.criticalValues}</Label>
                              <Input
                                {...register(`labValues.${index}.critical`)}
                                placeholder={t.placeholders.criticalValues}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>{t.steps.step5.notes}</Label>
                              <Input
                                {...register(`labValues.${index}.notes`)}
                                placeholder={t.placeholders.notes}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step5.monitoringRequirementsTitle}</h3>
                  <div className="space-y-4">
                    {['Early', 'Moderate', 'Advanced'].map((stage, index) => (
                      <div key={stage} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>{t.steps.step5.followUpFrequency}</Label>
                          <Input
                            {...register(`monitoringProtocol.${index}.frequency`)}
                            placeholder={t.placeholders.followUpFrequency}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.steps.step5.keyMetricsToMonitor}</Label>
                          <Input
                            {...register(`monitoringProtocol.${index}.metrics`)}
                            placeholder={t.placeholders.keyMetricsToMonitor}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Regional & Cultural */}
          {currentStep === 6 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-black text-white border-0">{t.ui.step} 6</Badge>
                  {t.steps.step6.title}
                </CardTitle>
                <CardDescription>
                  {t.steps.step6.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step6.regionalVariationsTitle}</h3>
                  <div className="space-y-4">
                    {['Diagnosis Methods', 'Medication Use', 'Patient Behavior'].map((factor, index) => (
                      <div key={factor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>{t.steps.step6.factor}</Label>
                          <Input
                            value={factor}
                            className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                            readOnly
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.steps.step6.urbanPractice}</Label>
                          <Textarea
                            {...register(`regionalVariations.urban.${index}`)}
                            placeholder={t.placeholders.urbanPractice}
                            rows={2}
                            className="text-base bg-background border-input text-foreground focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>{t.steps.step6.ruralPractice}</Label>
                          <Textarea
                            {...register(`regionalVariations.rural.${index}`)}
                            placeholder={t.placeholders.ruralPractice}
                            rows={2}
                            className="text-base bg-background border-input text-foreground focus:ring-primary"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step6.contraindicationsTitle}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>{t.steps.step6.drugProcedure}</Label>
                        <Input
                          {...register('contraindications.0')}
                          placeholder={t.placeholders.drugProcedure}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step6.contraindicatedIn}</Label>
                        <Input
                          {...register('contraindicationConditions.0')}
                          placeholder={t.placeholders.contraindicatedIn}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step6.notes}</Label>
                        <Input
                          {...register('contraindicationNotes.0')}
                          placeholder={t.placeholders.contraindicationNotes}
                          className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step6.commonMisdiagnosesTitle}</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>{t.steps.step6.oftenMisdiagnosedAs}</Label>
                        <Input
                          {...register('commonMisdiagnoses.0')}
                          placeholder={t.placeholders.oftenMisdiagnosedAs}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step6.keyDifferentiators}</Label>
                        <Input
                          {...register('misdiagnosisDifferentiators.0')}
                          placeholder={t.placeholders.keyDifferentiators}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>{t.steps.step6.notes}</Label>
                        <Input
                          {...register('misdiagnosisNotes.0')}
                          placeholder={t.placeholders.misdiagnosisNotes}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4">{t.steps.step6.additionalNotesTitle}</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>{t.steps.step6.culturalAspects}</Label>
                      <Textarea
                        {...register('culturalAspects')}
                        placeholder={t.placeholders.culturalAspects}
                        rows={3}
                        className="text-base bg-background border-input text-foreground focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.steps.step6.socioeconomicBarriers}</Label>
                      <Textarea
                        {...register('socioeconomicBarriers')}
                        placeholder={t.placeholders.socioeconomicBarriers}
                        rows={3}
                        className="text-base bg-background border-input text-foreground focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t.steps.step6.otherRelevantObservations}</Label>
                      <Textarea
                        {...register('additionalObservations')}
                        placeholder={t.placeholders.otherRelevantObservations}
                        rows={3}
                        className="text-base bg-background border-input text-foreground focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Physician Information */}
          {currentStep === 7 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-black text-white border-0">{t.ui.step} 7</Badge>
                  {t.steps.step7.title}
                </CardTitle>
                <CardDescription>
                  {t.steps.step7.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="physicianName">{t.steps.step7.nameRole}</Label>
                    <Input
                      id="physicianName"
                      {...register('physicianName')}
                      placeholder={t.placeholders.physicianName}
                      className={`h-12 text-base bg-background border-input text-foreground focus:ring-primary ${errors.physicianName ? 'border-destructive ring-destructive' : ''}`}
                    />
                    {errors.physicianName && (
                      <p className="text-sm text-destructive">{errors.physicianName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">{t.steps.step7.institution}</Label>
                    <Input
                      id="institution"
                      {...register('institution')}
                      placeholder={t.placeholders.institution}
                      className={`h-12 text-base bg-background border-input text-foreground focus:ring-primary ${errors.institution ? 'border-destructive ring-destructive' : ''}`}
                    />
                    {errors.institution && (
                      <p className="text-sm text-destructive">{errors.institution.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialty">{t.steps.step7.specialty}</Label>
                    <Input
                      id="specialty"
                      {...register('specialty')}
                      placeholder={t.placeholders.specialty}
                      className={`h-12 text-base bg-background border-input text-foreground focus:ring-primary ${errors.specialty ? 'border-destructive ring-destructive' : ''}`}
                    />
                    {errors.specialty && (
                      <p className="text-sm text-destructive">{errors.specialty.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">{t.steps.step7.location}</Label>
                    <Input
                      id="location"
                      {...register('location')}
                      placeholder={t.placeholders.location}
                      className="h-12 text-base bg-background border-input text-foreground focus:ring-primary"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>{t.steps.step7.consent}</Label>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consentGiven"
                        {...register('consentGiven')}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded"
                      />
                      <div>
                        <Label htmlFor="consentGiven" className="text-sm">
                          {t.steps.step7.consentConsent}
                          {t.steps.step7.consentEthically}
                        </Label>
                        {errors.consentGiven && (
                          <p className="text-sm text-destructive mt-1">{errors.consentGiven.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="attributionConsent"
                        {...register('attributionConsent')}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary border-input rounded"
                      />
                      <div>
                        <Label htmlFor="attributionConsent" className="text-sm">
                          {t.steps.step7.attributionConsent}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{t.steps.step7.submissionChecklistTitle}:</strong>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>☐ {t.steps.step7.checklistAllStages}</li>
                      <li>☐ {t.steps.step7.checklistMedicationProtocols}</li>
                      <li>☐ {t.steps.step7.checklistRedFlags}</li>
                      <li>☐ {t.steps.step7.checklistComorbidities}</li>
                      <li>☐ {t.steps.step7.checklistMonitoringProgression}</li>
                      <li>☐ {t.steps.step7.checklistRegionalCultural}</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentStep(currentStep - 1);
                  trackFormStepCompleted(currentStep - 1, steps[currentStep - 2]?.title || 'Previous Step');
                }}
                className="flex items-center gap-3 h-11 px-6 text-base font-semibold border hover:bg-accent/50 transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
                {t.ui.previous}
              </Button>
            )}
            
            {currentStep < 7 ? (
              <Button
                type="button"
                onClick={() => {
                  setCurrentStep(currentStep + 1);
                  trackFormStepCompleted(currentStep + 1, steps[currentStep]?.title || 'Next Step');
                }}
                className="ml-auto flex items-center gap-3 h-11 px-8 text-base font-semibold transition-colors duration-200"
              >
                {t.ui.next}
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="ml-auto flex items-center gap-3 h-11 px-8 text-base font-semibold bg-green-600 hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t.ui.submitting}
                  </>
                ) : (
                  <>
                    {t.ui.submit}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
    </AuthGuard>
  );
} 