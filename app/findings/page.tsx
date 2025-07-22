'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  BookOpen,
  CheckCircle,
  User,
  Sparkles,
  Database,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { submitArticle, getArticles, ResearchFinding } from '@/lib/article-service';
import { populateArticles } from '@/lib/populate-articles';
import { useAuth } from '@/lib/auth-context';
import AdminOnly from '@/components/admin/AdminOnly';
import ArticleSubmissionForm from '@/components/ui/article-submission-form';

export default function FindingsPage() {
  const { isAdmin } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [findings, setFindings] = useState<ResearchFinding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddArticleModal, setShowAddArticleModal] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      const articles = await getArticles();
      setFindings(articles);
    } catch (error) {
      console.error('Error loading articles:', error);
      setFindings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulateArticles = async () => {
    try {
      setIsLoading(true);
      await populateArticles();
      await loadArticles(); // Reload articles after populating
    } catch (error) {
      console.error('Error populating articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddArticleSuccess = () => {
    setShowAddArticleModal(false);
    loadArticles(); // Reload articles after adding new one
  };

  const handleAddArticleCancel = () => {
    setShowAddArticleModal(false);
  };

  const filteredFindings = findings;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div 
          className={`text-center mb-12 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <Badge variant="secondary" className="text-sm">
                Research Findings
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
              Discover Research
              <span className="text-primary block">Insights</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore cutting-edge research findings, methodologies, and insights that are advancing 
              healthcare knowledge and improving patient outcomes worldwide.
            </p>
          </div>
        </div>

        {/* Admin Add Article Button */}
        <AdminOnly>
          <div className="mb-8 flex justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white shadow-lg"
              onClick={() => setShowAddArticleModal(true)}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Article
            </Button>
          </div>
        </AdminOnly>

        {/* Research Findings Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg animate-pulse bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="h-6 bg-muted rounded w-16"></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-muted rounded"></div>
                    <div className="h-16 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFindings.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-muted rounded-full">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  No articles found
                </h3>
                                        <p className="text-gray-600 dark:text-gray-400 max-w-md mb-4">
                          No research articles are currently available.
                        </p>
                        <Button 
                          onClick={handlePopulateArticles} 
                          disabled={isLoading}
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Populating...
                            </>
                          ) : (
                            <>
                              <Database className="h-4 w-4 mr-2" />
                              Add Sample Article
                            </>
                          )}
                        </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFindings.map((finding) => (
              <Card key={finding.id} className="group border-0 shadow-lg hover:shadow-xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden">
                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-10">
                  {finding.status === 'published' && (
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Published
                    </Badge>
                  )}
                  {finding.status === 'in-progress' && (
                    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-0">
                      In Progress
                    </Badge>
                  )}
                  {finding.status === 'preview' && (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                      Preview
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {finding.category}
                      </Badge>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(finding.publishDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {finding.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                      {finding.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {finding.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {finding.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{finding.tags.length - 3} more
                      </Badge>
                    )}
                  </div>



                  {/* Key Findings Preview */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-primary" />
                      Key Findings
                    </h4>
                    <ul className="space-y-1">
                      {finding.keyFindings.slice(0, 2).map((finding, index) => (
                        <li key={index} className="flex items-start space-x-2 text-xs text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Author */}
                  <div className="border-t pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center pt-4 border-t">
                                                  <Link href={`/findings/bangladesh-clinical-dataset-analysis`}>
                      <Button variant="outline" size="sm" className="flex items-center space-x-2 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                        <BookOpen className="h-4 w-4" />
                        <span>Read Full Paper</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Article Modal */}
      {showAddArticleModal && (
        <ArticleSubmissionForm
          onSuccess={handleAddArticleSuccess}
          onCancel={handleAddArticleCancel}
        />
      )}
    </div>
  );
} 