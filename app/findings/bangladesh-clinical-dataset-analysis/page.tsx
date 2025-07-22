'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  Quote, 
  BookOpen, 
  Calendar,
  User,
  Building,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Award,
  MapPin,
  Share2
} from 'lucide-react';
import Link from 'next/link';

interface Reference {
  id: string;
  title: string;
  authors: string;
  journal?: string;
  year: string;
  doi?: string;
  url?: string;
  type: 'journal' | 'report' | 'website' | 'book';
}

const references: Reference[] = [
  {
    id: 'ref1',
    title: 'International Diabetes Federation, Bangladesh Factsheet 2021',
    authors: 'IDF Diabetes Atlas',
    journal: 'IDF Diabetes Atlas 10th/11th Edition Factsheets',
    year: '2021',
    type: 'report',
    url: 'https://diabetesatlas.org/resources/factsheets/'
  },
  {
    id: 'ref2',
    title: 'TheGlobalEconomy.com, Bangladesh—Diabetes prevalence',
    authors: 'TheGlobalEconomy.com',
    year: '2021',
    type: 'website',
    url: 'https://www.theglobaleconomy.com/Bangladesh/diabetes_prevalence/'
  },
  {
    id: 'ref3',
    title: 'BDHS 2017–18 (PubMed)',
    authors: 'Bangladesh Demographic and Health Survey',
    journal: 'PubMed',
    year: '2017-2018',
    type: 'journal'
  },
  {
    id: 'ref4',
    title: 'Kidney International Reports, 2021',
    authors: 'Kidney International',
    journal: 'Kidney International Reports',
    year: '2021',
    type: 'journal',
    url: 'https://www.kireports.org/'
  },
  {
    id: 'ref5',
    title: 'PMC, Awareness about CKD (Bangladesh)',
    authors: 'Europe PMC',
    journal: 'Global Dialysis Perspective',
    year: '2021',
    type: 'journal',
    url: 'https://pmc.ncbi.nlm.nih.gov/'
  },
  {
    id: 'ref6',
    title: 'National Thalassemia Profile Bangladesh, BSMMU, 2022',
    authors: 'BSMMU Research Team',
    journal: 'National Thalassemia Profile',
    year: '2022',
    type: 'report'
  },
  {
    id: 'ref7',
    title: 'DGHS Bangladesh Annual Report 2022',
    authors: 'Directorate General of Health Services',
    journal: 'DGHS Annual Report',
    year: '2022',
    type: 'report',
    url: 'https://old.dghs.gov.bd/'
  },
  {
    id: 'ref8',
    title: 'Clinical Logic Collection Template, 2024',
    authors: 'ClinicalForge Platform',
    journal: 'Clinical Logic Framework',
    year: '2024',
    type: 'report'
  }
];

export default function BangladeshClinicalDatasetAnalysisPage() {
  const [activeTab, setActiveTab] = useState('content');
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Calculate real date and read time
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate read time based on content length (average reading speed: 200 words per minute)
  const calculateReadTime = () => {
    const contentLength = 2500; // Approximate word count of the article
    const wordsPerMinute = 200;
    const readTimeMinutes = Math.ceil(contentLength / wordsPerMinute);
    return `${readTimeMinutes} min read`;
  };

  const tableOfContents = [
    { id: 'introduction', title: '1. Introduction', level: 1 },
    { id: 'key-diseases', title: '2. Key Diseases & National Data', level: 1 },
    { id: 'diabetes', title: '2.1 Diabetes', level: 2 },
    { id: 'ckd', title: '2.2 Chronic Kidney Disease (CKD)', level: 2 },
    { id: 'regional-diversity', title: '2.3 Regional & Social Diversity', level: 2 },
    { id: 'clinical-template', title: '3. Clinical Logic Collection Template', level: 1 },
    { id: 'physician-participation', title: '4. Why Physician Participation is Essential', level: 1 },
    { id: 'faqs', title: '5. FAQs & Answers', level: 1 },
    { id: 'case-study', title: '6. Powerful Case Study: Diabetes in Bangladesh', level: 1 },
    { id: 'references', title: '7. References', level: 1 },
    { id: 'conclusion', title: '8. Conclusion', level: 1 }
  ];

  // Handle PDF download
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Create a simple PDF content
      const content = `
        As a physician, why is your participation in the creation and use of clinical synthetic data in Bangladesh necessary?
        
        Authors: ClinicalForge
        Institution: ClinicalForge Platform
        Date: ${currentDate}
        
        ABSTRACT:
        In Bangladesh, disease prevalence and clinical diversity are often underrepresented in global databases. 
        Direct participation by physicians ensures accuracy rooted in local realities, strengthens scientific integrity, 
        and provides a quality foundation for decision-making.
        
        KEY FINDINGS:
        - Diabetes prevalence: 14.2% with 61.5% unawareness rate
        - CKD prevalence: 22-22.5% (twice global average)
        - Only 32% follow-up rate due to economic barriers
        - Regional variations in disease patterns require local expertise
        
        CONCLUSION:
        Without physician participation, creating an effective, scientifically credible, and contextually appropriate 
        health dataset for Bangladesh is nearly impossible. This initiative lays the foundation for research, policy, 
        AI-driven healthcare, and national disease registries.
      `;
      
      // Create blob and download
      const blob = new Blob([content], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'bangladesh-clinical-dataset-analysis.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle share functionality
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareData = {
        title: 'As a physician, why is your participation in the creation and use of clinical synthetic data in Bangladesh necessary?',
        text: 'Comprehensive analysis by ClinicalForge of disease prevalence, clinical diversity, and the necessity of physician participation in creating contextually appropriate health datasets for Bangladesh.',
        url: window.location.href
      };

      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        console.error('Error copying to clipboard:', clipboardError);
        alert('Unable to share. Please copy the URL manually.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link href="/findings">
            <Button variant="ghost" className="flex items-center space-x-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Findings</span>
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Badge variant="secondary" className="text-sm">
                  Public Health Research
                </Badge>
                <Badge variant="outline" className="text-sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Published
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                As a physician, why is your participation in the creation and use of clinical synthetic data in Bangladesh necessary?
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>ClinicalForge</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4" />
                  <span>ClinicalForge Platform</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{currentDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{calculateReadTime()}</span>
                </div>
              </div>


            </div>

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 ml-6">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Downloading...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-2"
                onClick={handleShare}
                disabled={isSharing}
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents Sidebar */}
          {showTableOfContents && (
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Table of Contents
                    </h3>
                    <nav className="space-y-1">
                      {tableOfContents.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block text-sm py-1 px-2 rounded hover:bg-muted transition-colors ${
                            item.level === 1 ? 'font-medium' : 'ml-4 text-gray-600'
                          }`}
                        >
                          {item.title}
                        </a>
                      ))}
                    </nav>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          )}

          {/* Main Article Content */}
          <div className={`${showTableOfContents ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Content</span>
                </TabsTrigger>
                <TabsTrigger value="references" className="flex items-center space-x-2">
                  <Quote className="h-4 w-4" />
                  <span>References</span>
                </TabsTrigger>
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="mt-6">
                <Card>
                  <CardContent className="prose prose-gray dark:prose-invert max-w-none p-8">
                    <div className="space-y-8">
                      {/* Introduction */}
                      <section id="introduction">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          In Bangladesh, disease prevalence and clinical diversity are often underrepresented in global databases. 
                          Direct participation by physicians ensures accuracy rooted in local realities, strengthens scientific integrity, 
                          and provides a quality foundation for decision-making.
                        </p>
                      </section>

                      {/* Key Diseases & National Data */}
                      <section id="key-diseases">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Key Diseases & National Data (Enhanced Summary)</h2>
                        
                        <section id="diabetes">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">2.1 Diabetes</h3>
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <AlertCircle className="h-4 w-4 text-blue-600" />
                              <span className="font-semibold text-blue-900 dark:text-blue-100">Key Statistics</span>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 text-lg">
                              <li><strong>Prevalence:</strong> About <strong>14.2%</strong> of Bangladeshi adults had diabetes in 2021 <sup><a href="#cite1" className="text-blue-600 hover:underline">[1]</a></sup></li>
                              <li><strong>BDHS 2017–18:</strong> Found diabetes at ~9.2% and prediabetes at ~13.3% <sup><a href="#cite3" className="text-blue-600 hover:underline">[3]</a></sup></li>
                              <li><strong>Awareness:</strong> Approximately <strong>61.5%</strong> of individuals with diabetes are unaware of their condition; only <strong>~30%</strong> have it under control</li>
                              <li><strong>Comorbidities:</strong> Hypertension (~60%) and obesity (~30%) are common—especially urban; rural awareness is lower</li>
                              <li><strong>Follow‑ups:</strong> Only <strong>~32%</strong> of patients follow up regularly, hindered by social and economic barriers <sup><a href="#cite2" className="text-blue-600 hover:underline">[2]</a></sup></li>
                              <li><strong>Gender & Regional Variations:</strong> Women often conceal symptoms and may be unaware—they face additional cultural challenges</li>
                            </ul>
                          </div>
                        </section>

                        <section id="ckd">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">2.2 Chronic Kidney Disease (CKD)</h3>
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <Info className="h-4 w-4 text-green-600" />
                              <span className="font-semibold text-green-900 dark:text-green-100">Critical Findings</span>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 text-lg">
                              <li><strong>Prevalence:</strong> National rate is ~22–22.5% (Kidney International Reports 2021)—twice the global average (~9%) <sup><a href="#cite4" className="text-green-600 hover:underline">[4]</a></sup></li>
                              <li><strong>Gender Differences:</strong> Women: 25.3%, Men: 20.3% (Kidney International Reports 2021)</li>
                              <li><strong>Low Awareness:</strong> Only <strong>6.8%</strong> of affected individuals were aware beforehand <sup><a href="#cite5" className="text-green-600 hover:underline">[5]</a></sup></li>
                              <li><strong>Late Diagnoses:</strong> Lack of organized screening leads to many diagnoses at late stages</li>
                              <li><strong>Comorbidities:</strong> Strong interrelations exist between CKD, diabetes, and hypertension</li>
                            </ul>
                          </div>
                        </section>

                        <section id="regional-diversity">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">2.3 Regional & Social Diversity</h3>
                          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin className="h-4 w-4 text-purple-600" />
                              <span className="font-semibold text-purple-900 dark:text-purple-100">Regional Analysis</span>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 text-lg">
                              <li><strong>Thalassemia:</strong> Highest regional clustering in Sylhet and Chittagong due to genetic/family history <sup><a href="#cite6" className="text-purple-600 hover:underline">[6]</a></sup></li>
                              <li><strong>Follow‑up & Barriers:</strong> Only <strong>~32%</strong> of patients sustain follow‑ups due to economic and cultural factors; rural women hesitate to seek care</li>
                              <li><strong>Cultural/Social Factors:</strong> Women conceal symptoms; traditional diets and reluctance to seek medication are common in rural areas</li>
                              <li><strong>Urban vs Rural:</strong> Urban areas have better awareness and access to care; rural areas face severe late-stage diagnosis</li>
                            </ul>
                          </div>
                        </section>
                      </section>

                      {/* Clinical Logic Collection Template */}
                      <section id="clinical-template">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Clinical Logic Collection Template (Country-Specific Format)</h2>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-300 dark:border-gray-600">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-gray-800">
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Section</th>
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Topic</th>
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Example (Bangladesh)</th>
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Purpose</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>1. Disease Identity</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Disease name, onset age, gender, residence</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Onset ~45–48 years; urban/rural and gender differences</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Aligns data with national epidemiology</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>2. Subtype / Classification</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">e.g. pre- vs type-2 diabetes, CKD staging</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">~90% of diabetes is type-2; CKD stage 3–4 is common</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Supports future guidelines & modeling</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>3. Family/Genetic History</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Thalassemia clusters, family history</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">High incidence in Sylhet/Chittagong</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Essential for local screening guidelines</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>4. Clinical Staging</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">CKD stage, HbA1c divisions</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">CKD ~22.5% prevalence; stage 3–4 common</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Enables timely intervention planning</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>5. Symptoms (Stage-wise)</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Notable and concealed symptoms</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Women often conceal diabetes/CKD symptoms</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Clinician insight boosts awareness</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>6. Comorbidities</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">HTN, obesity, dyslipidemia, anemia</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">HTN ~60%, obesity ~30%, high dyslipidemia</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Facilitates comorbidity-aware treatment/AI</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>7–15. Other Sections</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Medication use, lab results (e.g., HbA1c, eGFR, ACR), socioeconomics</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Local lab values like HbA1c missing from international databases</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Enhances realism in models and guidelines</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3"><strong>16. Regional/Cultural Variations</strong></td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Urban/rural, gender, social/economic barriers</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Follow-up ~32%; awareness gaps in rural women</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Reflects real context in clinical frameworks</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </section>

                      {/* Why Physician Participation is Essential */}
                      <section id="physician-participation">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Why Physician Participation is Essential</h2>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                          <div className="flex items-center space-x-2 mb-4">
                            <Award className="h-5 w-5 text-yellow-600" />
                            <span className="font-semibold text-yellow-900 dark:text-yellow-100">Key Insights</span>
                          </div>
                          <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                            <li><strong>Evidence-Based Data Generation:</strong> Only clinician-validated data can reliably support AI-backed decision support, guideline development, and national registry functioning.</li>
                            <li><strong>Real-Life Diversity:</strong> Social, regional, and gender-based disease profiles are captured accurately only through provider insight.</li>
                            <li><strong>Research & Policy Foundation:</strong> Physician input is vital for building country-specific registries and comparative studies.</li>
                            <li><strong>Privacy & Recognition:</strong> Identity-excluded clinical data, voluntary acknowledgment, and compliance with Bangladeshi data privacy laws are safeguarded.</li>
                          </ul>
                        </div>
                      </section>

                      {/* FAQs */}
                      <section id="faqs">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. FAQs & Answers</h2>
                        <div className="space-y-4">
                          <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Is patient privacy maintained?</h3>
                            <p className="text-gray-700 dark:text-gray-300">Only clinical data is collected; personal identifiers are neither stored nor shared.</p>
                          </div>
                          <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Is it time-consuming?</h3>
                            <p className="text-gray-700 dark:text-gray-300">Physician-friendly UI/UX and quick forms allow participation during convenient hours; acknowledgment is voluntary.</p>
                          </div>
                          <div className="border-l-4 border-purple-500 pl-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Why is your participation needed?</h3>
                            <p className="text-gray-700 dark:text-gray-300">Only clinical input can accurately reflect Bangladesh's real disease patterns, comorbidities, and social realities.</p>
                          </div>
                          <div className="border-l-4 border-orange-500 pl-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">What are the benefits?</h3>
                            <p className="text-gray-700 dark:text-gray-300">Meaningful contribution to national research and policy, personal acknowledgment, and involvement in future AI/decision-support systems.</p>
                          </div>
                        </div>
                      </section>

                      {/* Case Study */}
                      <section id="case-study">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Powerful Case Study: Diabetes in Bangladesh</h2>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-300 dark:border-gray-600">
                            <thead>
                              <tr className="bg-gray-50 dark:bg-gray-800">
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Indicator</th>
                                <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Bangladesh Context (with Sources)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Average onset age</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">≈ 45 years (BDHS & PubMed-based analysis)</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Prevalence (20–79 years)</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">~14.2% (IDF 2021)</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Unawareness/control</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">~43% unaware; only ~30% under control</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Comorbidities</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">HTN ~60%, obesity ~30% (PubMed/DGHS/WHO)</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Follow‑up rate</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">≈ 32% (DGHS Annual Report 2022)</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">CKD prevalence</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">≈ 22.48% (meta-analysis)</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Gender disparity</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">CKD: women 25.3%, men 20.3%</td>
                              </tr>
                              <tr>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Lab-value gap</td>
                                <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Regional biomarkers (HbA1c etc.) missing from international databases</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </section>

                      {/* Conclusion */}
                      <section id="conclusion">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Conclusion</h2>
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                            Without physician participation, creating an effective, scientifically credible, and contextually appropriate 
                            health dataset for Bangladesh is nearly impossible. This initiative lays the foundation for research, policy, 
                            AI-driven healthcare, and national disease registries. 
                            <strong className="text-blue-600 dark:text-blue-400">Your clinical judgment and insight will help build Bangladesh's health future—let's start this transformative journey today.</strong>
                          </p>
                        </div>
                      </section>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* References Tab */}
              <TabsContent value="references" className="mt-6">
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">References (2021–2024)</h2>
                    <div className="space-y-4">
                      {references.map((ref, index) => (
                        <div key={ref.id} id={ref.id} className="border-l-4 border-blue-500 pl-4 py-2">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-bold text-blue-600">[{index + 1}]</span>
                                <Badge variant="outline" className="text-xs">
                                  {ref.type}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{ref.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {ref.authors} • {ref.year}
                                {ref.journal && ` • ${ref.journal}`}
                              </p>
                              {ref.doi && (
                                <p className="text-sm text-blue-600">
                                  DOI: <a href={`https://doi.org/${ref.doi}`} className="hover:underline">{ref.doi}</a>
                                </p>
                              )}
                              {ref.url && (
                                <p className="text-sm text-blue-600">
                                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center space-x-1">
                                    <span>View Source</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
} 