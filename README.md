# ClinicalForge

A comprehensive platform for collecting clinical logic data from medical professionals and visualizing AI-driven insights for healthcare AI development.

## 🎯 Overview

ClinicalForge is designed to bridge the gap between real-world clinical expertise and AI training datasets. It enables medical professionals to contribute structured clinical logic that can be used to generate synthetic patient data for AI model training.

### Key Features

- **Clinical Logic Collection**: Multi-step form for collecting structured disease progression data
- **Strategic Collaboration**: Platform for medical professionals to contribute to AI development
- **Data Visualization**: Interactive dashboard with charts and analytics
- **Contributor Recognition**: Public acknowledgment system similar to Kaggle authorship
- **Privacy-First**: No personal health records collected, only structured clinical logic

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS
- **Form Validation**: React Hook Form + Zod
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Firebase Hosting / Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd clinical-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project
   - Enable Firestore Database
   - Get your Firebase configuration

4. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
clinical-forge/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (Clinical Logic Collection)
│   ├── about/             # About page
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   └── Navigation.tsx     # Navigation component
├── lib/                   # Utility functions and configurations
│   ├── firebase.ts        # Firebase configuration
│   ├── firebase-service.ts # Firebase service functions
│   └── types.ts           # TypeScript type definitions
├── public/                # Static assets
└── package.json           # Dependencies and scripts
```

## 🎨 Features

### 1. Clinical Logic Collection Form (`/`)

- **Multi-step wizard**: 4-step form for comprehensive data collection
- **Validation**: Type-safe validation with Zod schema
- **Fields included**:
  - Disease overview (name, type, age, gender bias, urban/rural)
  - Subtypes & diagnostic criteria
  - Family history & genetic risk
  - Clinical staging with symptoms and medications
  - Comorbidities and emergency triggers
  - Disease timeline and lifestyle management
  - Pediatric vs adult presentation
  - Lab values by stage
  - Contraindications and monitoring protocols
  - Regional practices (urban vs rural)
  - Physician consent and attribution

### 2. About & Collaboration Page (`/about`)

- **Strategic mission**: Explains the importance of medical collaboration
- **Benefits for contributors**: Professional recognition, AI model development
- **Data ethics**: Privacy and security information
- **How it works**: Step-by-step process explanation

### 3. Dashboard (`/dashboard`)

- **Analytics cards**: Key metrics and statistics
- **Interactive charts**: Disease distribution, comorbidities, location data
- **Contributor table**: Recognition system with public/private options
- **AI insights**: Risk assessment and synthetic patient profiles
- **Data export**: Download functionality for public datasets

## 🔐 Privacy & Security

- **No PHR collection**: Only structured clinical logic templates
- **Anonymous by default**: Personal health records are never collected
- **Consent-based attribution**: Opt-in recognition system
- **GDPR compliant**: Follows international privacy standards
- **Firebase security**: Enterprise-grade encryption and security

## 📊 Data Schema

### Clinical Logic Structure

```typescript
interface ClinicalLogic {
  // Disease Overview
  diseaseName: string;
  diseaseType: DiseaseType;
  typicalOnsetAge: number;
  genderBias: 'Male' | 'Female' | 'None';
  urbanRuralBias: 'Urban' | 'Rural' | 'None';
  
  // Clinical Details
  subtypes: string[];
  diagnosticCriteria: string;
  familyHistoryRelevance: boolean;
  geneticRiskFactors: string[];
  stages: ClinicalStage[];
  commonComorbidities: string[];
  emergencyTriggers: string[];
  typicalProgression: string;
  
  // Management
  lifestyleRecommendations: string[];
  contraindications: string[];
  monitoringProtocol: string;
  followUpSchedule: string;
  commonMisdiagnoses: string[];
  
  // Regional & Physician Info
  regionalVariations: { urban?: string; rural?: string };
  physicianName: string;
  institution: string;
  specialty: string;
  location?: string;
  
  // Consent
  consentGiven: boolean;
  attributionConsent: boolean;
  submissionDate: Date;
}
```

## 🚀 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Vercel

1. **Connect your repository to Vercel**
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


**Note**: This platform is designed for medical professionals to contribute clinical expertise for AI development. All data collection follows strict privacy guidelines and ethical standards. 
