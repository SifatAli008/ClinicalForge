'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, ExternalLink, Download } from 'lucide-react';
import Link from 'next/link';

export default function BangladeshClinicalDatasetPage() {


  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header with Back Button */}
      <div className="mb-8">
        <Link href="/findings">
          <Button variant="ghost" className="flex items-center space-x-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Findings</span>
          </Button>
        </Link>
        
        <div className="flex items-center justify-between">
          <div>
            <Badge variant="secondary" className="mb-2">
              Public Health Research
            </Badge>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Clinical Dataset Analysis: Physician Participation in Synthetic Data Creation for Bangladesh Healthcare
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Published: January 20, 2024</span>
              <span>•</span>
              <span>Authors: ClinicalForge Research Team</span>
              <span>•</span>
              <span>25 min read</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>References</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span>Cite</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Research Article Content */}
      <Card className="border-2">
        <CardContent className="prose prose-gray dark:prose-invert max-w-none p-8">
          <div className="space-y-8">
            {/* Abstract */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Abstract</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                In Bangladesh, disease prevalence and clinical diversity are often underrepresented in global databases. 
                This comprehensive analysis examines the necessity of direct physician participation in creating contextually 
                appropriate health datasets. Through analysis of national health statistics from 2021-2024, we demonstrate 
                that only clinician-validated data can reliably support AI-backed decision support, guideline development, 
                and national registry functioning. The study reveals critical gaps in disease awareness, regional variations, 
                and the need for Bangladesh-specific clinical frameworks.
              </p>
            </div>

            {/* Introduction */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mb-4">
                In Bangladesh, disease prevalence and clinical diversity are often underrepresented in global databases. 
                Direct participation by physicians ensures accuracy rooted in local realities, strengthens scientific integrity, 
                and provides a quality foundation for decision-making.
              </p>
            </div>

            {/* Key Diseases & National Data */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Key Diseases & National Data</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Diabetes</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 text-lg">
                <li><strong>Prevalence:</strong> About 14.2% of Bangladeshi adults had diabetes in 2021 (International Diabetes Federation)</li>
                <li><strong>BDHS 2017–18:</strong> Found diabetes at ~9.2% and prediabetes at ~13.3%</li>
                <li><strong>Awareness:</strong> Approximately 61.5% of individuals with diabetes are unaware of their condition</li>
                <li><strong>Control:</strong> Only ~30% have it under control</li>
                <li><strong>Follow-ups:</strong> Only ~32% of patients follow up regularly</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Chronic Kidney Disease (CKD)</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 text-lg">
                <li><strong>Prevalence:</strong> National rate is ~22–22.5% (Kidney International Reports 2021)—twice the global average</li>
                <li><strong>Gender Differences:</strong> Women: 25.3%, Men: 20.3%</li>
                <li><strong>Low Awareness:</strong> Only 6.8% of affected individuals were aware beforehand</li>
                <li><strong>Late Diagnoses:</strong> Lack of organized screening leads to many diagnoses at late stages</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Regional & Social Diversity</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-6 text-lg">
                <li><strong>Thalassemia:</strong> Highest regional clustering in Sylhet and Chittagong due to genetic/family history</li>
                <li><strong>Cultural Factors:</strong> Women conceal symptoms; traditional diets and reluctance to seek medication are common</li>
                <li><strong>Urban vs Rural:</strong> Urban areas have better awareness and access to care; rural areas face severe late-stage diagnosis</li>
              </ul>
            </div>

            {/* Clinical Logic Collection Template */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Clinical Logic Collection Template</h2>
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
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">1. Disease Identity</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Disease name, onset age, gender, residence</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Onset ~45–48 years; urban/rural and gender differences</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Aligns data with national epidemiology</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">2. Subtype / Classification</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">e.g. pre- vs type-2 diabetes, CKD staging</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">~90% of diabetes is type-2; CKD stage 3–4 is common</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Supports future guidelines & modeling</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">3. Family/Genetic History</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Thalassemia clusters, family history</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">High incidence in Sylhet/Chittagong</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Essential for local screening guidelines</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Why Physician Participation is Essential */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Why Physician Participation is Essential</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                <li><strong>Evidence-Based Data Generation:</strong> Only clinician-validated data can reliably support AI-backed decision support, guideline development, and national registry functioning.</li>
                <li><strong>Real-Life Diversity:</strong> Social, regional, and gender-based disease profiles are captured accurately only through provider insight.</li>
                <li><strong>Research & Policy Foundation:</strong> Physician input is vital for building country-specific registries and comparative studies.</li>
                <li><strong>Privacy & Recognition:</strong> Identity-excluded clinical data, voluntary acknowledgment, and compliance with Bangladeshi data privacy laws are safeguarded.</li>
              </ul>
            </div>

            {/* Case Study */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Case Study: Diabetes in Bangladesh</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 dark:border-gray-600">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800">
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Indicator</th>
                      <th className="border border-gray-300 dark:border-gray-600 px-4 py-3 text-left font-semibold">Bangladesh Context</th>
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
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">Follow‑up rate</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">≈ 32% (DGHS Annual Report 2022)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">CKD prevalence</td>
                      <td className="border border-gray-300 dark:border-gray-600 px-4 py-3">≈ 22.48% (meta-analysis)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* References */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. References (2021–2024)</h2>
              <ul className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300 text-lg">
                <li><strong>International Diabetes Federation, Bangladesh Factsheet 2021</strong> – IDF Diabetes Atlas 10th/11th Edition Factsheets, World & Regional Data (incl. Bangladesh)</li>
                <li><strong>TheGlobalEconomy.com, Bangladesh—Diabetes prevalence</strong> – &quot;Bangladesh: Diabetes prevalence … Latest value from 2021 is 14.2 percent&quot;</li>
                <li><strong>BDHS 2017–18 (PubMed)</strong> – Awareness, Treatment, and Control of Diabetes in Bangladesh, PubMed (BDHS 2017–18)</li>
                <li><strong>Kidney International Reports, 2021</strong> – Prevalence of CKD in Bangladesh (~22–22.5%), stage III–V distribution</li>
                <li><strong>PMC, Awareness about CKD (Bangladesh)</strong> – Global Dialysis Perspective & CKD awareness studies</li>
                <li><strong>National Thalassemia Profile Bangladesh, BSMMU, 2022</strong> – Thalassemia prevalence & regional variation report</li>
                <li><strong>DGHS Bangladesh Annual Report 2022</strong> – DGHS website listing annual reports & health bulletin</li>
                <li><strong>Clinical Logic Collection Template, 2024</strong> – Template via CMS/clinical logic frameworks</li>
              </ul>
            </div>

            {/* Conclusion */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Conclusion</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                Without physician participation, creating an effective, scientifically credible, and contextually appropriate 
                health dataset for Bangladesh is nearly impossible. This initiative lays the foundation for research, policy, 
                AI-driven healthcare, and national disease registries. Your clinical judgment and insight will help build 
                Bangladesh&apos;s health future—let&apos;s start this transformative journey today.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 