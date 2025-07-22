
// Test data for ClinicalForge
const testData = {
  clinicalLogic: [
    {
      diseaseName: "Type 2 Diabetes",
      diseaseType: "Chronic",
      typicalOnsetAge: 45,
      genderBias: "Equal",
      urbanRuralBias: "Urban",
      physicianName: "Dr. Sarah Johnson",
      institution: "Johns Hopkins",
      specialty: "Endocrinology",
      submissionDate: new Date(),
      consentGiven: true,
      userId: "user1"
    },
    {
      diseaseName: "Hypertension",
      diseaseType: "Chronic",
      typicalOnsetAge: 50,
      genderBias: "Male",
      urbanRuralBias: "Urban",
      physicianName: "Dr. Michael Chen",
      institution: "Mayo Clinic",
      specialty: "Cardiology",
      submissionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
      consentGiven: true,
      userId: "user2"
    },
    {
      diseaseName: "Cardiovascular Disease",
      diseaseType: "Chronic",
      typicalOnsetAge: 55,
      genderBias: "Male",
      urbanRuralBias: "Both",
      physicianName: "Dr. Emily Davis",
      institution: "Cleveland Clinic",
      specialty: "Cardiology",
      submissionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      consentGiven: true,
      userId: "user3"
    }
  ],
  contributors: [
    {
      name: "Dr. Sarah Johnson",
      institution: "Johns Hopkins",
      specialty: "Endocrinology",
      submissionCount: 12,
      lastSubmission: new Date(),
      attributionConsent: true
    },
    {
      name: "Dr. Michael Chen",
      institution: "Mayo Clinic",
      specialty: "Cardiology",
      submissionCount: 8,
      lastSubmission: new Date(Date.now() - 24 * 60 * 60 * 1000),
      attributionConsent: true
    },
    {
      name: "Dr. Emily Davis",
      institution: "Cleveland Clinic",
      specialty: "Cardiology",
      submissionCount: 6,
      lastSubmission: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      attributionConsent: true
    }
  ]
};

console.log('Test data ready for import');
