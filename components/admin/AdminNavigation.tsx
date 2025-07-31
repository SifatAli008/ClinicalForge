'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Database, 
  FileText, 
  Users, 
  Settings, 
  BarChart3,
  Shield,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function AdminNavigation() {
  const { isAdmin } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isAdmin) {
    return null;
  }

  const adminLinks = [
    {
      title: 'Submission Management',
      description: 'View and manage all form submissions',
      href: '/admin/submissions',
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Research Findings',
      description: 'Manage research articles and publications',
      href: '/findings',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      href: '/admin/users',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'System Analytics',
      description: 'View system performance and analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      title: 'System Settings',
      description: 'Configure system parameters',
      href: '/admin/settings',
      icon: Settings,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-900/20'
    }
  ];

  return (
    <Card className="border-l-4 border-l-red-500">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span>Admin Panel</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            <span>{isExpanded ? 'Hide' : 'Show'}</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Administrative tools and system management
        </p>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-3">
          {adminLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button variant="outline" className="w-full justify-start group hover:bg-accent transition-all duration-200">
                <div className={`p-2 rounded-lg mr-3 ${link.bgColor}`}>
                  <link.icon className={`h-4 w-4 ${link.color}`} />
                </div>
                <div className="text-left">
                  <div className="font-medium">{link.title}</div>
                  <div className="text-xs text-muted-foreground">{link.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </CardContent>
      )}
    </Card>
  );
} 