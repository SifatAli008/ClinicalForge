'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Activity,
  Users,
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  LogOut,
  FileText,
  BookOpen
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, signIn, signOut, loading } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <Database className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">ClinicalForge</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Activity className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link href="/forms" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <FileText className="h-4 w-4" />
              <span>Forms</span>
            </Link>
            <Link href="/collaborate" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <Users className="h-4 w-4" />
              <span>Collaborations</span>
            </Link>
            <Link href="/findings" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="h-4 w-4" />
              <span>Findings</span>
            </Link>
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {!loading && (
              user ? (
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Button onClick={handleSignIn} size="sm">
                  Sign In
                </Button>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMobileMenu}
              >
                <Activity className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/forms"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMobileMenu}
              >
                <FileText className="h-4 w-4" />
                <span>Forms</span>
              </Link>
              <Link
                href="/collaborate"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMobileMenu}
              >
                <Users className="h-4 w-4" />
                <span>Collaborations</span>
              </Link>
              <Link
                href="/findings"
                className="flex items-center space-x-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={closeMobileMenu}
              >
                <BookOpen className="h-4 w-4" />
                <span>Findings</span>
              </Link>
              <div className="flex items-center justify-between px-3 py-2">
                <ThemeToggle />
              </div>
              
              {!loading && (
                user ? (
                  <div className="space-y-2 px-3 py-2 border-t border-border">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSignOut}
                      className="w-full justify-start flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 py-2 border-t border-border">
                    <Button onClick={handleSignIn} size="sm" className="w-full">
                      Sign In
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 