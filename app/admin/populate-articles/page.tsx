'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { populateArticles, checkArticlesExist } from '@/lib/populate-articles';

export default function PopulateArticlesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasArticles, setHasArticles] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  const handleCheckArticles = async () => {
    try {
      setIsLoading(true);
      const exists = await checkArticlesExist();
      setHasArticles(exists);
      setMessage(exists ? 'Articles found in database!' : 'No articles found in database.');
    } catch (error) {
      setMessage('Error checking articles: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopulateArticles = async () => {
    try {
      setIsLoading(true);
      setMessage('Populating articles...');
      await populateArticles();
      setMessage('Articles populated successfully!');
      setHasArticles(true);
    } catch (error) {
      setMessage('Error populating articles: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Firebase Article Management
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage articles in Firebase Firestore database
        </p>
      </div>

      <div className="grid gap-6">
        {/* Check Articles Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={handleCheckArticles} 
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Check Articles
                    </>
                  )}
                </Button>
                
                {hasArticles !== null && (
                  <div className="flex items-center space-x-2">
                    {hasArticles ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Articles Found
                        </Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                          No Articles
                        </Badge>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {message && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Populate Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Populate Articles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Add sample articles to the Firebase database. This will create the article about physician participation in clinical synthetic data creation.
              </p>
              
              <Button 
                onClick={handlePopulateArticles} 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Populating...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Populate Articles
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>1. First, click &quot;Check Articles&quot; to see if articles already exist in the database.</p>
              <p>2. If no articles are found, click &quot;Populate Articles&quot; to add the sample article.</p>
              <p>3. After populating, visit the <a href="/findings" className="text-primary hover:underline">Findings page</a> to see the articles loaded from Firebase.</p>
              <p>4. The articles will be automatically loaded from Firebase when the findings page loads.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 