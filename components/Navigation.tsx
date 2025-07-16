"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { LoginButton } from '@/components/auth/LoginButton';
import { UserProfile } from '@/components/auth/UserProfile';

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: t.header.home, href: '/', icon: Heart },
    { name: t.header.about, href: '/about', icon: Sparkles },
    { name: t.header.dashboard, href: '/dashboard', icon: Sparkles },
    ...(user ? [{ name: 'Profile', href: '/profile', icon: Sparkles }] : []),
  ];

  // Show language toggle only on home page
  const showLanguageToggle = pathname === '/';

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">
                  {t.header.title}
                </span>
                <span className="text-xs text-muted-foreground -mt-1">
                  Clinical Data Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'text-primary bg-primary/10 border border-primary/20'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                  }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2">
            {showLanguageToggle && <LanguageToggle />}
            <ThemeToggle />
            {!loading && (
              user ? (
                <div className="relative group">
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <img 
                      src={user.photoURL || '/default-avatar.png'} 
                      alt={user.displayName || 'User'} 
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="hidden sm:inline">{user.displayName}</span>
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <UserProfile />
                  </div>
                </div>
              ) : (
                <LoginButton />
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-9 h-9 rounded-lg hover:bg-accent/50 transition-colors duration-200"
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
          <div className="md:hidden slide-in">
            <div className="px-2 pt-2 pb-4 space-y-2 border-t border-border bg-background">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                      pathname === item.href
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="flex items-center justify-between px-4 py-3 mt-4 pt-4 border-t border-border">
                {showLanguageToggle && <LanguageToggle />}
                <ThemeToggle />
                {!loading && (
                  user ? (
                    <div className="w-full">
                      <UserProfile />
                    </div>
                  ) : (
                    <LoginButton />
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 