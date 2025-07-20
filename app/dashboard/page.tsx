'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Users, 
  FileText, 
  TrendingUp,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  Database,
  Zap,
  Target,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useScrollAnimation, useScrollProgress, useScrollTrigger } from '@/lib/scroll-animations';
import AuthGuard from '@/components/auth/AuthGuard';

export default function DashboardPage() {
  const { user, userProfile, loading } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const scrollProgress = useScrollProgress();
  const hasScrolled = useScrollTrigger(50);
  
  const { elementRef: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { elementRef: statsRef, isVisible: statsVisible } = useScrollAnimation();
  const { elementRef: recentRef, isVisible: recentVisible } = useScrollAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Database className="h-12 w-12 text-primary animate-pulse mx-auto" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse w-32 mx-auto"></div>
            <div className="h-3 bg-muted rounded animate-pulse w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Forms",
      value: "24",
      change: "+12%",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20"
    },
    {
      title: "Active Collaborations",
      value: "8",
      change: "+3%",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20"
    },
    {
      title: "Data Points",
      value: "1,234",
      change: "+18%",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20"
    },
    {
      title: "Completion Rate",
      value: "94%",
      change: "+5%",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20"
    }
  ];

  const recentActivities = [
    {
      title: "New form created",
      description: "Patient demographics form",
      time: "2 hours ago",
      icon: Plus,
      color: "text-green-600"
    },
    {
      title: "Data collection completed",
      description: "Clinical trial phase 1",
      time: "4 hours ago",
      icon: CheckCircle,
      color: "text-blue-600"
    },
    {
      title: "Collaboration invited",
      description: "Dr. Sarah Johnson joined",
      time: "1 day ago",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Report generated",
      description: "Monthly analytics report",
      time: "2 days ago",
      icon: BarChart3,
      color: "text-orange-600"
    }
  ];

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-muted z-50">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div 
              ref={heroRef}
              className={`mb-8 transition-all duration-1000 ${
                heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {userProfile?.displayName || user?.displayName || 'User'}!
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    Here's what's happening with your clinical research today.
                  </p>
                </div>
                <Link href="/forms">
                  <Button className="group">
                    <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                    Create Form
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div 
              ref={statsRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transition-all duration-1000 delay-300 ${
                statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card 
                    key={index} 
                    className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5" />
                      <span>Recent Activity</span>
                    </CardTitle>
                    <CardDescription>
                      Your latest research activities and updates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <div 
                            key={index}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                          >
                            <div className={`p-2 rounded-full bg-muted group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className={`h-4 w-4 ${activity.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.description}</p>
                              <p className="text-xs text-muted-foreground flex items-center mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Progress */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href="/forms">
                      <Button variant="outline" className="w-full justify-start group">
                        <FileText className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        Create New Form
                      </Button>
                    </Link>
                    <Link href="/collaborate">
                      <Button variant="outline" className="w-full justify-start group">
                        <Users className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        Invite Collaborator
                      </Button>
                    </Link>
                    <Link href="/findings">
                      <Button variant="outline" className="w-full justify-start group">
                        <BarChart3 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        View Reports
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Progress Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Progress Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Forms Completion</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Data Collection</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Collaboration</span>
                        <span>90%</span>
                      </div>
                      <Progress value={90} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span>Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="text-sm font-medium">First Form Created</p>
                          <p className="text-xs text-muted-foreground">You created your first form</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <Users className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Team Player</p>
                          <p className="text-xs text-muted-foreground">Joined your first collaboration</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 