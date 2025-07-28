'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertCircle, Loader2, TestTube } from 'lucide-react';
import { populateArticles, checkArticlesExist } from '@/lib/populate-articles';
import { getArticles } from '@/lib/article-service';

export default function TestFirebasePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasArticles, setHasArticles] = useState<boolean | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
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

  const handleLoadArticles = async () => {
    try {
      setIsLoading(true);
      setMessage('Loading articles from Firebase...');
      const loadedArticles = await getArticles();
      setArticles(loadedArticles);
      setMessage(`Loaded ${loadedArticles.length} articles from Firebase!`);
    } catch (error) {
      setMessage('Error loading articles: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Firebase Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Test Firebase connection and article management
        </p>
      </div>

      <div className="grid gap-6">
        {/* Firebase Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TestTube className="h-5 w-5" />
              <span>Firebase Connection Test</span>
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
                      Testing...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>
                
                {hasArticles !== null && (
                  <div className="flex items-center space-x-2">
                    {hasArticles ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Connected & Articles Found
                        </Badge>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                          Connected (No Articles)
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

        {/* Load Articles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Load Articles from Firebase</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Load and display articles from Firebase Firestore database.
              </p>
              
              <Button 
                onClick={handleLoadArticles} 
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Database className="h-4 w-4 mr-2" />
                    Load Articles
                  </>
                )}
              </Button>

              {articles.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Loaded Articles:</h3>
                  <div className="space-y-2">
                    {articles.map((article, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <h4 className="font-medium">{article.title}</h4>
                        <p className="text-sm text-gray-600">{article.description}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline">{article.category}</Badge>
                          <Badge variant="secondary">{article.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              <p>1. First, click &quot;Test Connection&quot; to verify Firebase connection.</p>
              <p>2. If connection is successful, click &quot;Populate Articles&quot; to add sample data.</p>
              <p>3. Click &quot;Load Articles&quot; to fetch and display articles from Firebase.</p>
              <p>4. Visit the <a href="/findings" className="text-primary hover:underline">Findings page</a> to see the articles loaded from Firebase.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 