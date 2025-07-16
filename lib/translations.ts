export type Language = 'en' | 'bn';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    home: string;
    about: string;
    dashboard: string;
  };
  steps: {
    step1: {
      title: string;
      description: string;
    };
    step2: {
      title: string;
      description: string;
      subtypesTitle: string;
      subtypeName: string;
      subtypeCriteria: string;
      distinctTreatment: string;
      notes: string;
      familyHistoryTitle: string;
      riskFactor: string;
      inheritancePattern: string;
      influenceOnOnset: string;
      familyHistoryRelevance: string;
    };
    step3: {
      title: string;
      description: string;
      clinicalStagingTitle: string;
      stage: string;
      diagnosticCriteria: string;
      approxDuration: string;
      transitionTriggers: string;
      symptomsByStageTitle: string;
      majorSymptoms: string;
      earlyHiddenSymptoms: string;
      symptomPrevalence: string;
      commonComorbiditiesTitle: string;
      comorbidity: string;
      frequency: string;
      commonOnsetStage: string;
      complicatesTreatment: string;
    };
    step4: {
      title: string;
      description: string;
      medicationProtocolTitle: string;
      lineOfTreatment: string;
      drugClass: string;
      standardDosage: string;
      triggerToStartStop: string;
      notes: string;
      lifestyleGuidanceTitle: string;
      interventionType: string;
      description2: string;
      recommendedStages: string;
      lifestyleNotes: string;
      pediatricVsAdultTitle: string;
      pediatricUniqueFeatures: string;
      adultUniqueFeatures: string;
    };
    step5: {
      title: string;
      description: string;
      emergencyWarning: string;
      redFlagsTitle: string;
      symptomEvent: string;
      stageWhenAppears: string;
      hospitalizationRequired: string;
      criticalActionRequired: string;
      diseaseProgressionTitle: string;
      averageDuration: string;
      triggersForProgression: string;
      labValueRangesTitle: string;
      labName: string;
      expectedRange: string;
      criticalValues: string;
      monitoringRequirementsTitle: string;
      followUpFrequency: string;
      keyMetricsToMonitor: string;
      notes: string;
    };
    step6: {
      title: string;
      description: string;
      regionalVariationsTitle: string;
      factor: string;
      urbanPractice: string;
      ruralPractice: string;
      contraindicationsTitle: string;
      drugProcedure: string;
      contraindicatedIn: string;
      notes: string;
      commonMisdiagnosesTitle: string;
      oftenMisdiagnosedAs: string;
      keyDifferentiators: string;
      misdiagnosisNotes: string;
      additionalNotesTitle: string;
      culturalAspects: string;
      socioeconomicBarriers: string;
      otherRelevantObservations: string;
    };
    step7: {
      title: string;
      description: string;
      nameRole: string;
      institution: string;
      specialty: string;
      location: string;
      consent: string;
      consentConsent: string;
      consentEthically: string;
      attributionConsent: string;
      submissionChecklistTitle: string;
      checklistAllStages: string;
      checklistMedicationProtocols: string;
      checklistRedFlags: string;
      checklistComorbidities: string;
      checklistMonitoringProgression: string;
      checklistRegionalCultural: string;
    };
  };
  form: {
    diseaseName: string;
    commonName: string;
    diseaseType: string;
    typicalOnsetAge: string;
    genderPrevalence: string;
    ruralUrbanDifferences: string;
  };
  ui: {
    next: string;
    previous: string;
    submit: string;
    submitting: string;
    thankYou: string;
    thankYouMessage: string;
    submitAnother: string;
    step: string;
    of: string;
    complete: string;
    select: string;
    yes: string;
    no: string;
    early: string;
    moderate: string;
    advanced: string;
    allStages: string;
    equal: string;
    male: string;
    female: string;
    contextDependent: string;
    acute: string;
    chronic: string;
    recurrent: string;
    congenital: string;
    diet: string;
    exercise: string;
    other: string;
  };
  placeholders: {
    diseaseName: string;
    commonName: string;
    typicalAge: string;
    ruralUrbanDiff: string;
    subtypeName: string;
    subtypeCriteria: string;
    subtypesTitle: string;
    keyFeatures: string;
    additionalNotes: string;
    familyHistory: string;
    polygenicAutosomal: string;
    howItAffects: string;
    labsVitalsSigns: string;
    duration: string;
    progressionTriggers: string;
    commonSymptoms: string;
    subtleSigns: string;
    prevalence: string;
    comorbidity: string;
    frequency: string;
    firstLineSecondLine: string;
    metformin: string;
    dosageExample: string;
    whenToStartStop: string;
    recommendations: string;
    pediatricDiff: string;
    adultDiff: string;
    chestPain: string;
    immediateAction: string;
    labExample: string;
    rangeExample: string;
    criticalExample: string;
    followUpExample: string;
    bloodGlucoseWeight: string;
    urbanSpecific: string;
    ruralSpecific: string;
    renalFailure: string;
    type1Diabetes: string;
    autoantibodyTesting: string;
    culturalInfluence: string;
    socioeconomicFactors: string;
    otherRelevant: string;
    doctorName: string;
    yourInstitution: string;
    yourSpecialty: string;
    cityCountry: string;
    subtypeNotes: string;
    riskFactor: string;
    inheritancePattern: string;
    influenceOnOnset: string;
    diagnosticCriteria: string;
    approxDuration: string;
    transitionTriggers: string;
    majorSymptoms: string;
    earlyHiddenSymptoms: string;
    symptomPrevalence: string;
    lineOfTreatment: string;
    drugClass: string;
    standardDosage: string;
    triggerToStartStop: string;
    notes: string;
    lifestyleDescription: string;
    lifestyleNotes: string;
    pediatricPresentation: string;
    adultPresentation: string;
    symptomEvent: string;
    criticalActionRequired: string;
    averageDuration: string;
    triggersForProgression: string;
    labName: string;
    expectedRange: string;
    criticalValues: string;
    followUpFrequency: string;
    keyMetricsToMonitor: string;
    urbanPractice: string;
    ruralPractice: string;
    drugProcedure: string;
    contraindicatedIn: string;
    contraindicationNotes: string;
    oftenMisdiagnosedAs: string;
    keyDifferentiators: string;
    misdiagnosisNotes: string;
    culturalAspects: string;
    socioeconomicBarriers: string;
    otherRelevantObservations: string;
    physicianName: string;
    institution: string;
    specialty: string;
    location: string;
  };
  about: {
    title: string;
    subtitle: string;
    mission: string;
    missionText: string;
    collaboration: string;
    collaborationText: string;
    dataEthics: string;
    dataEthicsText: string;
    benefits: string;
    benefitsList: string[];
    contact: string;
    contactText: string;
    impactStats: string[];
    process: {
      title: string;
      description: string;
      0: string;
      1: string;
      2: string;
      3: string;
      4: string;
      5: string;
    };
    benefitsSection: {
      title: string;
      description: string;
    };
    badges: {
      noPatientData: string;
      hipaaCompliant: string;
      professionalRecognition: string;
    };
    cta: {
      title: string;
      description: string;
      startButton: string;
      learnMoreButton: string;
      badges: {
        research: string;
        innovation: string;
        impact: string;
      };
    };
  };
  dashboard: {
    title: string;
    subtitle: string;
    overview: string;
    contributors: string;
    insights: string;
    totalSubmissions: string;
    avgOnsetAge: string;
    activeContributors: string;
    urbanRuralRatio: string;
    diseaseTypeDistribution: string;
    mostCommonComorbidities: string;
    urbanVsRural: string;
    name: string;
    institution: string;
    specialty: string;
    submissions: string;
    lastSubmission: string;
    actions: string;
    view: string;
    public: string;
    anonymous: string;
    riskAssessment: string;
    highRisk: string;
    mediumRisk: string;
    lowRisk: string;
    keyFactors: string;
    syntheticPatientProfile: string;
    demographics: string;
    age: string;
    gender: string;
    clinicalProfile: string;
    symptoms: string;
    comorbidities: string;
    medications: string;
    exportData: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: "HDMS Web Portal",
      subtitle: "Healthcare Data Management System",
      home: "Home",
      about: "Why You Need to Collaborate?",
      dashboard: "Dashboard",
    },
    steps: {
      step1: {
        title: "Disease Overview",
        description: "Basic disease information",
      },
      step2: {
        title: "Subtypes & Family History",
        description: "Classifications and genetic risk",
        subtypesTitle: "Disease Subtypes / Classifications",
        subtypeName: "Subtype Name",
        subtypeCriteria: "Diagnostic Criteria",
        distinctTreatment: "Distinct Treatment?",
        notes: "Notes",
        familyHistoryTitle: "Family History & Genetic Risk",
        riskFactor: "Risk Factor / Trait",
        inheritancePattern: "Inheritance Pattern",
        influenceOnOnset: "Influence on Onset/Severity",
        familyHistoryRelevance: "Family history is relevant for this disease",
      },
      step3: {
        title: "Clinical Staging",
        description: "Stages, symptoms, and progression",
        clinicalStagingTitle: "Clinical Staging",
        stage: "Stage",
        diagnosticCriteria: "Diagnostic Criteria",
        approxDuration: "Approx. Duration",
        transitionTriggers: "Transition Triggers",
        symptomsByStageTitle: "Symptoms by Stage",
        majorSymptoms: "Major (Typical) Symptoms",
        earlyHiddenSymptoms: "Early/Hidden Symptoms",
        symptomPrevalence: "Symptom Prevalence (%)",
        commonComorbiditiesTitle: "Common Comorbidities",
        comorbidity: "Comorbidity",
        frequency: "Frequency (%)",
        commonOnsetStage: "Common Onset Stage",
        complicatesTreatment: "Complicates Treatment?",
      },
      step4: {
        title: "Treatment & Management",
        description: "Medications and protocols",
        medicationProtocolTitle: "Medication Protocol",
        lineOfTreatment: "Line of Treatment",
        drugClass: "Drug Class / Generic Name",
        standardDosage: "Standard Dosage",
        triggerToStartStop: "Trigger to Start/Stop",
        notes: "Notes (Side effects, cost)",
        lifestyleGuidanceTitle: "Lifestyle Management Guidance",
        interventionType: "Intervention Type",
        description2: "Description",
        recommendedStages: "Recommended Stage(s)",
        lifestyleNotes: "Notes",
        pediatricVsAdultTitle: "Pediatric vs. Adult Presentation",
        pediatricUniqueFeatures: "Pediatric Unique Features",
        adultUniqueFeatures: "Adult Unique Features",
      },
      step5: {
        title: "Emergency & Monitoring",
        description: "Red flags and follow-up",
        emergencyWarning: "This section is critical for patient safety. Please be thorough in documenting emergency conditions.",
        redFlagsTitle: "Red Flags & Emergency Conditions",
        symptomEvent: "Symptom / Event",
        stageWhenAppears: "Stage When Appears",
        hospitalizationRequired: "Hospitalization Required?",
        criticalActionRequired: "Critical Action Required",
        diseaseProgressionTitle: "Disease Progression Timeline",
        averageDuration: "Average Duration",
        triggersForProgression: "Triggers for Progression",
        labValueRangesTitle: "Lab Value Ranges by Stage",
        labName: "Lab Name",
        expectedRange: "Expected Range",
        criticalValues: "Critical Values / Units",
        monitoringRequirementsTitle: "Monitoring & Follow-up Requirements",
        followUpFrequency: "Follow-up Frequency",
        keyMetricsToMonitor: "Key Metrics to Monitor",
        notes: "Notes",
      },
      step6: {
        title: "Regional & Cultural",
        description: "Practice variations and notes",
        regionalVariationsTitle: "Regional Practices & Variations",
        factor: "Factor",
        urbanPractice: "Urban Practice",
        ruralPractice: "Rural Practice",
        contraindicationsTitle: "Contraindications & Treatment Conflicts",
        drugProcedure: "Drug / Procedure",
        contraindicatedIn: "Contraindicated In",
        notes: "Notes",
        commonMisdiagnosesTitle: "Common Misdiagnoses / Differential Diagnoses",
        oftenMisdiagnosedAs: "Often Misdiagnosed As",
        keyDifferentiators: "Key Differentiators / Tests",
        misdiagnosisNotes: "Notes",
        additionalNotesTitle: "Additional Notes",
        culturalAspects: "Cultural Aspects",
        socioeconomicBarriers: "Socioeconomic Barriers",
        otherRelevantObservations: "Other Relevant Observations",
      },
      step7: {
        title: "Physician Information",
        description: "Your details and consent",
        nameRole: "Name / Role *",
        institution: "Institution *",
        specialty: "Specialty *",
        location: "Location (Optional)",
        consent: "Consent",
        consentConsent: "I consent to share this clinical logic for AI training and synthetic data generation.",
        consentEthically: "I understand this data will be used ethically and anonymously.",
        attributionConsent: "I consent to be acknowledged as a contributor in the dashboard and public dataset (like Kaggle authorship). I can opt-out later if needed.",
        submissionChecklistTitle: "Submission Checklist",
        checklistAllStages: "All stages have diagnostic and symptom data",
        checklistMedicationProtocols: "Medication protocols are detailed per stage",
        checklistRedFlags: "Red flags and emergency triggers are clear",
        checklistComorbidities: "Comorbidities and genetic risk factors included",
        checklistMonitoringProgression: "Monitoring and progression timelines are documented",
        checklistRegionalCultural: "Regional/cultural variations noted",
      },
    },
    form: {
      diseaseName: "Disease Name (Clinical) *",
      commonName: "Common / Layman Term",
      diseaseType: "Disease Type *",
      typicalOnsetAge: "Typical Age of Onset *",
      genderPrevalence: "Gender Prevalence",
      ruralUrbanDifferences: "Rural/Urban Differences",
    },
    ui: {
      next: "Next",
      previous: "Previous",
      submit: "Submit Clinical Logic",
      submitting: "Submitting...",
      thankYou: "Thank You for Your Contribution!",
      thankYouMessage: "Your clinical logic has been successfully submitted and will be used to improve AI-driven healthcare solutions.",
      submitAnother: "Submit Another Disease Logic",
      step: "Step",
      of: "of",
      complete: "Complete",
      select: "Select",
      yes: "Yes",
      no: "No",
      early: "Early",
      moderate: "Moderate",
      advanced: "Advanced",
      allStages: "All stages",
      equal: "Equal",
      male: "Male",
      female: "Female",
      contextDependent: "Context-dependent",
      acute: "Acute",
      chronic: "Chronic",
      recurrent: "Recurrent",
      congenital: "Congenital",
      diet: "Diet",
      exercise: "Exercise",
      other: "Other",
    },
    placeholders: {
      diseaseName: "e.g., Type 2 Diabetes Mellitus",
      commonName: "e.g., Sugar diabetes",
      typicalAge: "e.g., 45",
      ruralUrbanDiff: "Describe any differences in prevalence or presentation between rural and urban areas...",
      subtypeName: "e.g., Type 1",
      subtypeCriteria: "Key features",
      subtypesTitle: "Disease Subtypes / Classifications",
      keyFeatures: "Key features",
      additionalNotes: "Additional notes",
      familyHistory: "e.g., Family history",
      polygenicAutosomal: "e.g., polygenic, autosomal",
      howItAffects: "How it affects disease",
      labsVitalsSigns: "Labs, vitals, clinical signs...",
      duration: "e.g., 2-3 months",
      progressionTriggers: "What triggers progression...",
      commonSymptoms: "Most common symptoms...",
      subtleSigns: "Subtle or early signs...",
      prevalence: "e.g., 80%",
      comorbidity: "e.g., Hypertension",
      frequency: "e.g., 60%",
      firstLineSecondLine: "1st line, 2nd line...",
      metformin: "e.g., Metformin",
      dosageExample: "e.g., 500mg BID",
      whenToStartStop: "When to start/stop",
      recommendations: "Specific recommendations...",
      pediatricDiff: "How the disease presents differently in children...",
      adultDiff: "How the disease presents in adults...",
      chestPain: "e.g., Chest pain",
      immediateAction: "Immediate action needed",
      labExample: "e.g., HbA1c",
      rangeExample: "e.g., 6.5-7.5%",
      criticalExample: "e.g., >8.0%",
      followUpExample: "e.g., Every 3 months",
      bloodGlucoseWeight: "e.g., Blood glucose, weight",
      urbanSpecific: "Urban-specific practices...",
      ruralSpecific: "Rural-specific practices...",
      renalFailure: "e.g., Renal failure",
      type1Diabetes: "e.g., Type 1 diabetes",
      autoantibodyTesting: "e.g., Autoantibody testing",
      culturalInfluence: "Cultural aspects influencing symptom reporting...",
      socioeconomicFactors: "Socioeconomic barriers affecting treatment adherence...",
      otherRelevant: "Any other relevant observations...",
      doctorName: "Dr. Your Name",
      yourInstitution: "Your Institution",
      yourSpecialty: "Your Specialty",
      cityCountry: "City, Country",
      subtypeNotes: "Notes specific to this subtype",
      riskFactor: "e.g., Genetic mutation",
      inheritancePattern: "e.g., Autosomal dominant",
      influenceOnOnset: "e.g., Age of onset",
      diagnosticCriteria: "e.g., Blood glucose > 126 mg/dL",
      approxDuration: "e.g., 1-2 years",
      transitionTriggers: "e.g., Stress, infection",
      majorSymptoms: "e.g., Fatigue, frequent urination",
      earlyHiddenSymptoms: "e.g., Insulin resistance",
      symptomPrevalence: "e.g., 90%",
      lineOfTreatment: "e.g., Metformin, insulin",
      drugClass: "e.g., Sulfonylurea, GLP-1 agonist",
      standardDosage: "e.g., 1000mg daily",
      triggerToStartStop: "e.g., Blood glucose > 200 mg/dL",
      notes: "e.g., May cause hypoglycemia",
      lifestyleDescription: "Guidelines for managing this disease",
      lifestyleNotes: "e.g., Regular exercise, balanced diet",
      pediatricPresentation: "e.g., Type 1 diabetes in children",
      adultPresentation: "e.g., Type 2 diabetes in adults",
      symptomEvent: "e.g., Severe hypoglycemia",
      criticalActionRequired: "e.g., Call 911, give glucose",
      averageDuration: "e.g., 5-10 years",
      triggersForProgression: "e.g., Poor diet, lack of exercise",
      labName: "e.g., HbA1c",
      expectedRange: "e.g., 4-6%",
      criticalValues: "e.g., >7%",
      followUpFrequency: "e.g., Every 3 months",
      keyMetricsToMonitor: "e.g., Blood glucose, A1C, weight",
      urbanPractice: "e.g., Regular monitoring, tight glucose control",
      ruralPractice: "e.g., Frequent glucose checks, flexible diet",
      drugProcedure: "e.g., Injection, infusion",
      contraindicatedIn: "e.g., Pregnancy, kidney failure",
      contraindicationNotes: "e.g., May worsen kidney function",
      oftenMisdiagnosedAs: "e.g., Type 2 diabetes",
      keyDifferentiators: "e.g., Insulin resistance, genetic mutation",
      misdiagnosisNotes: "e.g., May be misdiagnosed as Type 2",
      culturalAspects: "e.g., Cultural beliefs about diabetes",
      socioeconomicBarriers: "e.g., Cost of medication, access to care",
      otherRelevantObservations: "e.g., Complications, complications",
      physicianName: "e.g., Dr. Smith",
      institution: "e.g., Hospital A",
      specialty: "e.g., Endocrinology",
      location: "e.g., New York, USA",
    },
    about: {
      title: "Why You Need to Collaborate?",
      subtitle: "Join the forefront of AI-driven healthcare innovation. Your clinical expertise is the key to developing more accurate, ethical, and effective AI solutions for preventive medicine.",
      mission: "Our Mission",
      missionText: "HDMS bridges the gap between real-world medical expertise and AI training datasets, enabling the development of more accurate and clinically relevant synthetic patient data.",
      collaboration: "Strategic Collaboration",
      collaborationText: "We partner with healthcare professionals worldwide to collect validated clinical knowledge that improves AI-driven healthcare solutions.",
      dataEthics: "Data Ethics & Privacy",
      dataEthicsText: "All data is collected with explicit consent, anonymized, and used ethically for research and AI training purposes only.",
      benefits: "Benefits for Contributors",
      benefitsList: [
        "Dataset collaboration recognition",
        "Access to aggregated insights",
        "Contribution to AI healthcare advancement",
        "Professional development opportunities",
      ],
      contact: "Get Involved",
      contactText: "Join our community of healthcare professionals contributing to the future of AI-driven medicine.",
      impactStats: [
        "Clinical Cases Contributed",
        "Active Medical Professionals",
        "Countries Represented",
        "Research Publications"
      ],
      process: {
        title: "How Your Collaboration Works",
        description: "A simple, secure, and impactful process that leverages your clinical expertise for global healthcare improvement.",
        0: "Share Your Expertise",
        1: "Contribute your clinical knowledge through our structured form - no patient data, only your medical expertise.",
        2: "AI Training & Validation",
        3: "Your contributions help train AI models to generate clinically accurate synthetic patient data.",
        4: "Global Impact",
        5: "Your expertise enables AI solutions that improve healthcare outcomes worldwide."
      },
      benefitsSection: {
        title: "What You Gain from Collaboration",
        description: "Your clinical expertise is invaluable. Here's how collaboration benefits you and the global healthcare community."
      },
      badges: {
        noPatientData: "No Patient Data Required",
        hipaaCompliant: "HIPAA Compliant",
        professionalRecognition: "Professional Recognition"
      },
      cta: {
        title: "Ready to Make a Difference?",
        description: "Join hundreds of medical professionals who are already contributing to the future of AI-driven healthcare. Your expertise can help save lives and improve healthcare outcomes globally.",
        startButton: "Start Contributing Now",
        learnMoreButton: "Learn More",
        badges: {
          research: "Research Recognition",
          innovation: "Innovation Leadership",
          impact: "Global Impact"
        }
      }
    },
    dashboard: {
      title: "HDMS Dashboard",
      subtitle: "Data visualization and contributor recognition",
      overview: "Overview",
      contributors: "Contributors",
      insights: "AI Insights",
      totalSubmissions: "Total Submissions",
      avgOnsetAge: "Avg. Onset Age",
      activeContributors: "Active Contributors",
      urbanRuralRatio: "Urban/Rural Ratio",
      diseaseTypeDistribution: "Disease Type Distribution",
      mostCommonComorbidities: "Most Common Comorbidities",
      urbanVsRural: "Urban vs Rural Distribution",
      name: "Name",
      institution: "Institution",
      specialty: "Specialty",
      submissions: "Submissions",
      lastSubmission: "Last Submission",
      actions: "Actions",
      view: "View",
      public: "Public",
      anonymous: "Anonymous",
      riskAssessment: "AI Risk Assessment",
      highRisk: "High Risk",
      mediumRisk: "Medium Risk",
      lowRisk: "Low Risk",
      keyFactors: "Key Factors:",
      syntheticPatientProfile: "Synthetic Patient Profile",
      demographics: "Demographics",
      age: "Age",
      gender: "Gender",
      clinicalProfile: "Clinical Profile",
      symptoms: "Symptoms",
      comorbidities: "Comorbidities",
      medications: "Medications",
      exportData: "Export Data",
    },
  },
  bn: {
    // TODO: Fill in Bengali translations for all fields above
    // You can copy the structure from 'en' and translate each value
    // For now, you can use the English values as placeholders
    header: {
      title: "এইচডিএমএস ওয়েব পোর্টাল",
      subtitle: "স্বাস্থ্যসেবা ডেটা ব্যবস্থাপনা সিস্টেম",
      home: "হোম",
      about: "কেন আপনি সহযোগিতা করতে চান?",
      dashboard: "ড্যাশবোর্ড",
    },
    steps: {
      step1: {
        title: "রোগের সংক্ষিপ্ত বিবরণ",
        description: "মৌলিক রোগের তথ্য",
      },
      step2: {
        title: "উপপ্রকার ও পারিবারিক ইতিহাস",
        description: "শ্রেণীবিভাগ এবং জিনগত ঝুঁকি",
        subtypesTitle: "রোগের উপপ্রকার / শ্রেণীবিভাগ",
        subtypeName: "উপপ্রকারের নাম",
        subtypeCriteria: "নির্ণয়ের মানদণ্ড",
        distinctTreatment: "পৃথক চিকিৎসা?",
        notes: "নোট",
        familyHistoryTitle: "পারিবারিক ইতিহাস ও জিনগত ঝুঁকি",
        riskFactor: "ঝুঁকির কারণ / বৈশিষ্ট্য",
        inheritancePattern: "উত্তরাধিকার প্যাটার্ন",
        influenceOnOnset: "সূচনা/তীব্রতার উপর প্রভাব",
        familyHistoryRelevance: "এই রোগের জন্য পারিবারিক ইতিহাস প্রাসঙ্গিক",
      },
      step3: {
        title: "ক্লিনিকাল স্টেজিং",
        description: "পর্যায়, লক্ষণ এবং অগ্রগতি",
        clinicalStagingTitle: "ক্লিনিকাল স্টেজিং",
        stage: "পর্যায়",
        diagnosticCriteria: "নির্ণয়ের মানদণ্ড",
        approxDuration: "আনুমানিক সময়কাল",
        transitionTriggers: "পরিবর্তনের ট্রিগার",
        symptomsByStageTitle: "পর্যায় অনুযায়ী লক্ষণ",
        majorSymptoms: "প্রধান (সাধারণ) লক্ষণ",
        earlyHiddenSymptoms: "প্রাথমিক/গোপন লক্ষণ",
        symptomPrevalence: "লক্ষণের প্রাদুর্ভাব (%)",
        commonComorbiditiesTitle: "সাধারণ সহরোগ",
        comorbidity: "সহরোগ",
        frequency: "ফ্রিকোয়েন্সি (%)",
        commonOnsetStage: "সাধারণ সূচনা পর্যায়",
        complicatesTreatment: "চিকিৎসা জটিল করে?",
      },
      step4: {
        title: "চিকিৎসা ও জীবনযাত্রা",
        description: "ওষুধের প্রোটোকল এবং জীবনযাত্রার নির্দেশনা",
        medicationProtocolTitle: "ওষুধের প্রোটোকল",
        lineOfTreatment: "চিকিৎসার লাইন",
        drugClass: "ওষুধের শ্রেণী",
        standardDosage: "মানক ডোজ",
        triggerToStartStop: "শুরু/বন্ধের ট্রিগার",
        notes: "নোট",
        lifestyleGuidanceTitle: "জীবনযাত্রার নির্দেশনা",
        interventionType: "হস্তক্ষেপের ধরন",
        description2: "বিবরণ",
        recommendedStages: "সুপারিশকৃত পর্যায়",
        lifestyleNotes: "জীবনযাত্রার নোট",
        pediatricVsAdultTitle: "শিশু বনাম প্রাপ্তবয়স্ক",
        pediatricUniqueFeatures: "শিশুদের অনন্য বৈশিষ্ট্য",
        adultUniqueFeatures: "প্রাপ্তবয়স্কদের অনন্য বৈশিষ্ট্য",
      },
      step5: {
        title: "জরুরি ও পর্যবেক্ষণ",
        description: "লাল পতাকা এবং জরুরি অবস্থা",
        emergencyWarning: "এই তথ্যগুলি জরুরি অবস্থার জন্য গুরুত্বপূর্ণ। সঠিকভাবে ব্যবহার করুন।",
        redFlagsTitle: "লাল পতাকা / জরুরি ট্রিগার",
        symptomEvent: "লক্ষণ/ঘটনা",
        stageWhenAppears: "কখন দেখা যায়",
        hospitalizationRequired: "হাসপাতালে ভর্তি প্রয়োজন",
        criticalActionRequired: "সমালোচনামূলক পদক্ষেপ",
        diseaseProgressionTitle: "রোগের অগ্রগতি",
        averageDuration: "গড় সময়কাল",
        triggersForProgression: "অগ্রগতির ট্রিগার",
        labValueRangesTitle: "ল্যাব মানের পরিসর",
        labName: "ল্যাব পরীক্ষার নাম",
        expectedRange: "প্রত্যাশিত পরিসর",
        criticalValues: "সমালোচনামূলক মান",
        monitoringRequirementsTitle: "পর্যবেক্ষণ এবং ফলো-আপ প্রয়োজনীয়তা",
        followUpFrequency: "ফলো-আপের ফ্রিকোয়েন্সি",
        keyMetricsToMonitor: "পর্যবেক্ষণের মূল মেট্রিক্স",
        notes: "নোট",
      },
      step6: {
        title: "আঞ্চলিক ও সাংস্কৃতিক",
        description: "আঞ্চলিক বৈচিত্র্য এবং সাংস্কৃতিক প্রভাব",
        regionalVariationsTitle: "আঞ্চলিক বৈচিত্র্য",
        factor: "ফ্যাক্টর",
        urbanPractice: "শহুরে অনুশীলন",
        ruralPractice: "গ্রামীণ অনুশীলন",
        contraindicationsTitle: "বিরোধী সংকেত",
        drugProcedure: "ওষুধ/পদ্ধতি",
        contraindicatedIn: "কোন অবস্থায় বিরোধী",
        notes: "নোট",
        commonMisdiagnosesTitle: "ভুল নির্ণয়",
        oftenMisdiagnosedAs: "প্রায়ই ভুল নির্ণয়",
        keyDifferentiators: "মূল পার্থক্যকারী",
        misdiagnosisNotes: "ভুল নির্ণয়ের নোট",
        culturalAspects: "সাংস্কৃতিক দিক",
        socioeconomicBarriers: "সামাজিক-অর্থনৈতিক বাধা",
        additionalNotesTitle: "অতিরিক্ত নোট",
        otherRelevantObservations: "অন্যান্য প্রাসঙ্গিক পর্যবেক্ষণ",
      },
      step7: {
        title: "চিকিৎসকের তথ্য",
        description: "আপনার বিবরণ এবং সম্মতি",
        nameRole: "নাম / ভূমিকা *",
        institution: "প্রতিষ্ঠান *",
        specialty: "বিশেষজ্ঞতা *",
        location: "অবস্থান (ঐচ্ছিক)",
        consent: "সম্মতি",
        consentConsent: "আমি AI প্রশিক্ষণ এবং সিনথেটিক ডেটা জেনারেশনের জন্য এই ক্লিনিকাল লজিক শেয়ার করতে সম্মত। আমি বুঝি যে এই ডেটা নৈতিকভাবে এবং বেনামে ব্যবহার করা হবে।",
        consentEthically: "",
        attributionConsent: "আমি ড্যাশবোর্ড এবং পাবলিক ডেটাসেটে অবদানকারী হিসেবে স্বীকৃত হতে সম্মত (Kaggle লেখকত্বের মতো)। প্রয়োজনে পরে অপ্ট-আউট করতে পারি।",
        submissionChecklistTitle: "জমা দেওয়ার চেকলিস্ট:",
        checklistAllStages: "সব পর্যায়ে নির্ণয় এবং লক্ষণের ডেটা আছে",
        checklistMedicationProtocols: "প্রতি পর্যায়ে ওষুধের প্রোটোকল বিস্তারিত",
        checklistRedFlags: "লাল পতাকা এবং জরুরি ট্রিগার স্পষ্ট",
        checklistComorbidities: "সহরোগ এবং জিনগত ঝুঁকির কারণ অন্তর্ভুক্ত",
        checklistMonitoringProgression: "পর্যবেক্ষণ এবং অগ্রগতির সময়সীমা নথিভুক্ত",
        checklistRegionalCultural: "আঞ্চলিক/সাংস্কৃতিক বৈচিত্র্য নোট করা হয়েছে",
      },
    },
    form: {
      diseaseName: "রোগের নাম (ক্লিনিকাল) *",
      commonName: "সাধারণ / সাধারণ নাম",
      diseaseType: "রোগের ধরন *",
      typicalOnsetAge: "সূচনার সাধারণ বয়স *",
      genderPrevalence: "লিঙ্গের প্রাদুর্ভাব",
      ruralUrbanDifferences: "গ্রামীণ/শহুরে পার্থক্য",
    },
    ui: {
      step: "ধাপ",
      of: "এর",
      complete: "সম্পূর্ণ",
      next: "পরবর্তী",
      previous: "পূর্ববর্তী",
      submit: "জমা দিন",
      submitting: "জমা দেওয়া হচ্ছে...",
      select: "নির্বাচন করুন",
      yes: "হ্যাঁ",
      no: "না",
      early: "প্রাথমিক",
      moderate: "মাঝারি",
      advanced: "উন্নত",
      allStages: "সব পর্যায়",
      acute: "তীব্র",
      chronic: "দীর্ঘস্থায়ী",
      recurrent: "পুনরাবৃত্তিমূলক",
      congenital: "জন্মগত",
              equal: "সমান",
        male: "পুরুষ",
        female: "মহিলা",
        contextDependent: "প্রসঙ্গ-নির্ভর",
        thankYou: "ধন্যবাদ",
        thankYouMessage: "আপনার অবদানের জন্য ধন্যবাদ!",
        submitAnother: "আরেকটি জমা দিন",
        diet: "খাদ্য",
        exercise: "ব্যায়াম",
        other: "অন্যান্য",
    },
    placeholders: {
      diseaseName: "যেমন, টাইপ 2 ডায়াবেটিস মেলিটাস",
      commonName: "যেমন, চিনির ডায়াবেটিস",
      typicalAge: "যেমন, 45",
      ruralUrbanDiff: "গ্রামীণ এবং শহুরে এলাকার মধ্যে প্রাদুর্ভাব বা উপস্থাপনার পার্থক্য বর্ণনা করুন...",
      subtypeName: "যেমন, টাইপ 1",
      subtypeCriteria: "মূল বৈশিষ্ট্য",
      subtypeNotes: "এই উপপ্রকারের জন্য নির্দিষ্ট নোট",
      riskFactor: "যেমন, জিনগত মিউটেশন",
      inheritancePattern: "যেমন, অটোসোমাল প্রভাবশালী",
      influenceOnOnset: "যেমন, সূচনার বয়স",
      diagnosticCriteria: "যেমন, রক্তের গ্লুকোজ > 126 mg/dL",
      approxDuration: "যেমন, 1-2 বছর",
      transitionTriggers: "যেমন, চাপ, সংক্রমণ",
      majorSymptoms: "যেমন, পলিউরিয়া, পলিডিপসিয়া",
      earlyHiddenSymptoms: "যেমন, ক্লান্তি, ওজন হ্রাস",
      symptomPrevalence: "যেমন, 85%",
              comorbidity: "যেমন, হাইপারটেনশন",
        frequency: "যেমন, 60%",
      drugClass: "যেমন, মেটফরমিন",
      standardDosage: "যেমন, 500mg BID",
      triggerToStartStop: "যেমন, HbA1c > 7%",
      notes: "যেমন, বিশেষ নির্দেশনা",
      lifestyleDescription: "যেমন, নিয়মিত ব্যায়াম, কম কার্বোহাইড্রেট ডায়েট",
      lifestyleNotes: "যেমন, রোগীর সম্মতি প্রয়োজন",
      pediatricPresentation: "যেমন, শিশুদের মধ্যে অনন্য লক্ষণ এবং চিকিৎসা",
      adultPresentation: "যেমন, প্রাপ্তবয়স্কদের মধ্যে জটিলতা এবং চিকিৎসা",
      symptomEvent: "যেমন, তীব্র বুকে ব্যথা",
      criticalActionRequired: "যেমন, অবিলম্বে হাসপাতালে ভর্তি",
      averageDuration: "যেমন, 2-3 বছর",
      triggersForProgression: "যেমন, চাপ, অস্বাস্থ্যকর জীবনযাত্রা",
      urbanPractice: "যেমন, শহুরে এলাকায় সাধারণ অনুশীলন",
      ruralPractice: "যেমন, গ্রামীণ এলাকায় সীমিত সুবিধা",
      drugProcedure: "যেমন, মেটফরমিন",
      contraindicatedIn: "যেমন, গর্ভাবস্থা, কিডনি ব্যর্থতা",
      contraindicationNotes: "যেমন, কিডনি ফাংশন খারাপ করতে পারে",
      oftenMisdiagnosedAs: "যেমন, টাইপ 2 ডায়াবেটিস",
      keyDifferentiators: "যেমন, ইনসুলিন প্রতিরোধ, জিনগত মিউটেশন",
      misdiagnosisNotes: "যেমন, টাইপ 2 হিসেবে ভুল নির্ণয় হতে পারে",
      culturalAspects: "যেমন, ডায়াবেটিস সম্পর্কে সাংস্কৃতিক বিশ্বাস",
      socioeconomicBarriers: "যেমন, ওষুধের খরচ, যত্নের প্রবেশাধিকার",
      otherRelevantObservations: "যেমন, জটিলতা, জটিলতা",
      physicianName: "যেমন, ডাঃ স্মিথ",
      institution: "যেমন, হাসপাতাল A",
      specialty: "যেমন, এন্ডোক্রিনোলজি",
      location: "যেমন, নিউ ইয়র্ক, মার্কিন যুক্তরাষ্ট্র",
    },
    about: {
      title: "কেন আপনি সহযোগিতা করতে চান?",
      subtitle: "AI-চালিত স্বাস্থ্যসেবা উদ্ভাবনের অগ্রভাগে যোগ দিন। আপনার ক্লিনিকাল দক্ষতা প্রতিরোধমূলক ওষুধের জন্য আরও সঠিক, নৈতিক এবং কার্যকর AI সমাধান বিকাশের চাবিকাঠি।",
      mission: "আমাদের মিশন",
      missionText: "এইচডিএমএস বাস্তব-বিশ্বের চিকিৎসা দক্ষতা এবং AI প্রশিক্ষণ ডেটাসেটের মধ্যে ব্যবধান সেতু করে, আরও সঠিক এবং ক্লিনিকালভাবে প্রাসঙ্গিক সিনথেটিক রোগীর ডেটা বিকাশের অনুমতি দেয়।",
      collaboration: "কৌশলগত সহযোগিতা",
      collaborationText: "আমরা বিশ্বব্যাপী স্বাস্থ্যসেবা পেশাদারদের সাথে অংশীদারিত্ব করি যাতে AI-চালিত স্বাস্থ্যসেবা সমাধান উন্নত করার জন্য বৈধ ক্লিনিকাল জ্ঞান সংগ্রহ করা যায়।",
      dataEthics: "ডেটা নৈতিকতা এবং গোপনীয়তা",
      dataEthicsText: "সব ডেটা স্পষ্ট সম্মতির সাথে সংগ্রহ করা হয়, বেনামে করা হয় এবং শুধুমাত্র গবেষণা এবং AI প্রশিক্ষণের উদ্দেশ্যে নৈতিকভাবে ব্যবহার করা হয়।",
      benefits: "অবদানকারীদের জন্য সুবিধা",
      benefitsList: [
        "ডেটাসেট সহযোগিতার স্বীকৃতি",
        "সামগ্রিক অন্তর্দৃষ্টি অ্যাক্সেস",
        "AI স্বাস্থ্যসেবা অগ্রগতিতে অবদান",
        "পেশাদার বিকাশের সুযোগ",
      ],
      contact: "জড়িত হন",
      contactText: "AI-চালিত ওষুধের ভবিষ্যতে অবদানকারী স্বাস্থ্যসেবা পেশাদারদের সম্প্রদায়ে যোগ দিন।",
      impactStats: [
        "ক্লিনিকাল কেস অবদান",
        "সক্রিয় চিকিৎসা পেশাদার",
        "প্রতিনিধিত্বকারী দেশ",
        "গবেষণা প্রকাশনা"
      ],
      process: {
        title: "আপনার সহযোগিতা কিভাবে কাজ করে",
        description: "একটি সহজ, নিরাপদ এবং প্রভাবশালী প্রক্রিয়া যা আপনার ক্লিনিকাল দক্ষতাকে বিশ্বব্যাপী স্বাস্থ্যসেবা উন্নতির জন্য ব্যবহার করে।",
        0: "আপনার দক্ষতা শেয়ার করুন",
        1: "আমাদের কাঠামোগত ফর্মের মাধ্যমে আপনার ক্লিনিকাল জ্ঞান অবদান করুন - কোন রোগীর ডেটা নয়, শুধুমাত্র আপনার চিকিৎসা দক্ষতা।",
        2: "AI প্রশিক্ষণ এবং বৈধতা",
        3: "আপনার অবদান AI মডেলগুলিকে ক্লিনিকালভাবে সঠিক সিনথেটিক রোগীর ডেটা তৈরি করতে প্রশিক্ষণ দিতে সাহায্য করে।",
        4: "বিশ্বব্যাপী প্রভাব",
        5: "আপনার দক্ষতা AI সমাধানগুলিকে সক্ষম করে যা বিশ্বব্যাপী স্বাস্থ্যসেবা ফলাফল উন্নত করে।"
      },
      benefitsSection: {
        title: "সহযোগিতা থেকে আপনি কী লাভ করেন",
        description: "আপনার ক্লিনিকাল দক্ষতা অমূল্য। এখানে সহযোগিতা কীভাবে আপনাকে এবং বিশ্বব্যাপী স্বাস্থ্যসেবা সম্প্রদায়কে উপকৃত করে।"
      },
      badges: {
        noPatientData: "কোন রোগীর ডেটা প্রয়োজন নেই",
        hipaaCompliant: "HIPAA সম্মত",
        professionalRecognition: "পেশাদার স্বীকৃতি"
      },
      cta: {
        title: "পার্থক্য তৈরি করতে প্রস্তুত?",
        description: "শত শত চিকিৎসা পেশাদারদের সাথে যোগ দিন যারা ইতিমধ্যে AI-চালিত স্বাস্থ্যসেবার ভবিষ্যতে অবদান রাখছেন। আপনার দক্ষতা জীবন বাঁচাতে এবং বিশ্বব্যাপী স্বাস্থ্যসেবা ফলাফল উন্নত করতে সাহায্য করতে পারে।",
        startButton: "এখন অবদান শুরু করুন",
        learnMoreButton: "আরও জানুন",
        badges: {
          research: "গবেষণা স্বীকৃতি",
          innovation: "উদ্ভাবন নেতৃত্ব",
          impact: "বিশ্বব্যাপী প্রভাব"
        }
      }
    },
    dashboard: {
      title: "এইচডিএমএস ড্যাশবোর্ড",
      subtitle: "ডেটা ভিজ্যুয়ালাইজেশন এবং অবদানকারী স্বীকৃতি",
      overview: "সংক্ষিপ্ত বিবরণ",
      contributors: "অবদানকারী",
      insights: "AI অন্তর্দৃষ্টি",
      totalSubmissions: "মোট জমা",
      avgOnsetAge: "গড় সূচনার বয়স",
      activeContributors: "সক্রিয় অবদানকারী",
      urbanRuralRatio: "শহুরে/গ্রামীণ অনুপাত",
      diseaseTypeDistribution: "রোগের ধরন বিতরণ",
      mostCommonComorbidities: "সবচেয়ে সাধারণ সহরোগ",
      urbanVsRural: "শহুরে বনাম গ্রামীণ বিতরণ",
      name: "নাম",
      institution: "প্রতিষ্ঠান",
      specialty: "বিশেষজ্ঞতা",
      submissions: "জমা",
      lastSubmission: "শেষ জমা",
      actions: "কর্ম",
      view: "দেখুন",
      public: "পাবলিক",
      anonymous: "বেনামে",
      riskAssessment: "AI ঝুঁকি মূল্যায়ন",
      highRisk: "উচ্চ ঝুঁকি",
      mediumRisk: "মাঝারি ঝুঁকি",
      lowRisk: "নিম্ন ঝুঁকি",
      keyFactors: "মূল কারণ:",
      syntheticPatientProfile: "সিনথেটিক রোগীর প্রোফাইল",
      demographics: "জনসংখ্যাতাত্ত্বিক",
      age: "বয়স",
      gender: "লিঙ্গ",
      clinicalProfile: "ক্লিনিকাল প্রোফাইল",
      symptoms: "লক্ষণ",
      comorbidities: "সহরোগ",
      medications: "ওষুধ",
      exportData: "ডেটা রপ্তানি",
    },
  },
}; 