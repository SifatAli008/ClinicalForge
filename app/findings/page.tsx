'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search,
  FileText,
  Database,
  TrendingUp,
  Users,
  Calendar,
  Tag,
  ExternalLink,
  Download,
  Eye,
  BarChart3,
  Globe,
  Lightbulb,
  Shield,
  Award,
  BookOpen,
  MapPin,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  User
} from 'lucide-react';
import Link from 'next/link';

interface ResearchFinding {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: string;
  author: string;
  institution: string;
  impact: string;
  methodology: string;
  keyFindings: string[];
  datasetSize: string;
  contributors: number;
  citations: number;
  status: 'published' | 'in-progress' | 'preview';
}

const researchFindings: ResearchFinding[] = [
  {
    id: 'bangladesh-clinical-dataset-analysis',
    title: 'Clinical Dataset Analysis: Physician Participation in Synthetic Data Creation for Bangladesh Healthcare',
    description: 'Comprehensive analysis of disease prevalence, clinical diversity, and the necessity of physician participation in creating contextually appropriate health datasets for Bangladesh.',
    category: 'Public Health Research',
    tags: ['Clinical Data', 'Physician Participation', 'Bangladesh Healthcare', 'Disease Prevalence', 'Synthetic Data'],
    publishDate: '2024-01-20',
    readTime: '25 min read',
    author: 'ClinicalForge Research Team',
    institution: 'ClinicalForge Platform',
    impact: 'Established framework for physician-driven clinical data collection in Bangladesh',
    methodology: 'Comprehensive literature review and analysis of national health statistics from 2021-2024',
    keyFindings: [
      'Diabetes prevalence: 14.2% with 61.5% unawareness rate',
      'CKD prevalence: 22-22.5% (twice global average)',
      'Only 32% follow-up rate due to economic barriers',
      'Regional variations in disease patterns require local expertise'
    ],
    datasetSize: 'Literature Review',
    contributors: 1,
    citations: 8,
    status: 'published'
  }
];

const categories = [
  { name: 'All', count: researchFindings.length },
  { name: 'Public Health Research', count: researchFindings.filter(f => f.category === 'Public Health Research').length }
];

export default function FindingsPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredFindings = researchFindings;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div 
        className={`text-center mb-12 transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <Badge variant="secondary" className="mb-4">
          <BookOpen className="h-4 w-4 mr-2" />
          Research Findings
        </Badge>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Our Research Findings
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Discover insights from our collaborative research platform. Explore datasets, methodologies, and findings 
          that are advancing healthcare knowledge and improving patient outcomes worldwide.
        </p>
      </div>

      {/* Research Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFindings.map((finding) => (
          <Card key={finding.id} className="border-2 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {finding.category}
                    </Badge>
                    {finding.status === 'published' && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                        Published
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
                    {finding.title}
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(finding.publishDate).toLocaleDateString()}</span>
                </div>
              </div>
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {finding.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {finding.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{finding.datasetSize}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Dataset Size</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{finding.contributors}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Contributors</div>
                </div>
              </div>

              {/* Key Findings Preview */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Findings:</h4>
                <ul className="space-y-1">
                  {finding.keyFindings.slice(0, 2).map((finding, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Author and Impact */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {finding.author}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {finding.institution}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{finding.citations}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{finding.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <Link href={`/findings/${finding.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Read Full Paper</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>References</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Cite</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 