'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  BookOpen,
  User,
  ChevronDown,
  Info,
  Settings,
  Shield,
  Crown
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { user, userProfile, signIn, signOut, loading, isAdmin, isContributor, isPublic } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      closeProfileDropdown();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.profile-dropdown')) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const NavLink = ({ href, icon: Icon, children, className = "" }: {
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    className?: string;
  }) => (
    <Link 
      href={href} 
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-accent hover:text-accent-foreground ${
        isActive(href) 
          ? 'bg-primary/10 text-primary font-medium' 
          : 'text-muted-foreground hover:text-foreground'
      } ${className}`}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { href: '/', icon: Info, label: 'What is ClinicalForge' }
    ];

    if (isPublic) {
      return [
        ...baseItems,
        { href: '/collaborate', icon: Users, label: 'Collaborations' },
        { href: '/findings', icon: BookOpen, label: 'Findings' }
      ];
    }

    if (isContributor) {
      return [
        ...baseItems,
        { href: '/forms', icon: FileText, label: 'Forms' },
        { href: '/collaborate', icon: Users, label: 'Collaborations' },
        { href: '/findings', icon: BookOpen, label: 'Findings' }
      ];
    }

    if (isAdmin) {
      return [
        { href: '/dashboard', icon: Activity, label: 'Dashboard' },
        { href: '/findings', icon: BookOpen, label: 'Findings' }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Database className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ClinicalForge
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <NavLink key={index} href={item.href} icon={item.icon}>
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            {!loading && (
              user ? (
                <div className="relative profile-dropdown">
                  {/* Profile Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-3 hover:bg-accent transition-all duration-200 group"
                  >
                    <div className="relative">
                      <img 
                        src={user.photoURL || userProfile?.avatarUrl || '/default-avatar.svg'} 
                        alt={user.displayName || userProfile?.displayName || 'User'} 
                        className="w-8 h-8 rounded-full border-2 border-border transition-all duration-200 group-hover:border-primary/50"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      {isAdmin && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-background flex items-center justify-center">
                          <Crown className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium">{user.displayName || userProfile?.displayName || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      {isAdmin && (
                        <Badge variant="destructive" className="text-xs">
                          <Shield className="h-2 w-2 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img 
                              src={user.photoURL || userProfile?.avatarUrl || '/default-avatar.svg'} 
                              alt={user.displayName || userProfile?.displayName || 'User'} 
                              className="w-12 h-12 rounded-full border-2 border-border"
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                            {isAdmin && (
                              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-background flex items-center justify-center">
                                <Crown className="h-2 w-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.displayName || userProfile?.displayName || 'User'}</p>
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-muted-foreground">
                                {isAdmin ? 'Admin' : isContributor ? 'Contributor' : 'Online'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link href="/profile" onClick={closeProfileDropdown}>
                          <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-accent">
                            <User className="h-4 w-4 mr-3" />
                            Profile
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link href="/dashboard" onClick={closeProfileDropdown}>
                            <Button variant="ghost" size="sm" className="w-full justify-start hover:bg-accent">
                              <Settings className="h-4 w-4 mr-3" />
                              Admin Panel
                            </Button>
                          </Link>
                        )}
                        <div className="h-px bg-border my-1"></div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={handleSignOut}
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login">
                  <Button 
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2 relative"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 transition-transform duration-200" />
              ) : (
                <Menu className="h-5 w-5 transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-in slide-in-from-top-2 duration-200">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border bg-background/95 backdrop-blur">
              {/* User Profile Section for Mobile */}
              {!loading && user && (
                <div className="px-3 py-4 border-b border-border bg-accent/50 rounded-lg mx-2 mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img 
                        src={user.photoURL || userProfile?.avatarUrl || '/default-avatar.svg'} 
                        alt={user.displayName || userProfile?.displayName || 'User'} 
                        className="w-12 h-12 rounded-full border-2 border-border"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                      {isAdmin && (
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full border-2 border-background flex items-center justify-center">
                          <Crown className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.displayName || userProfile?.displayName || 'User'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">
                          {isAdmin ? 'Admin' : isContributor ? 'Contributor' : 'Online'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-1 px-2">
                {navigationItems.map((item, index) => (
                  <NavLink key={index} href={item.href} icon={item.icon} className="w-full justify-start">
                    {item.label}
                  </NavLink>
                ))}
                
                {/* Profile Link for Mobile */}
                {!loading && user && (
                  <>
                    <div className="h-px bg-border my-2"></div>
                    <NavLink href="/profile" icon={User} className="w-full justify-start">
                      Profile
                    </NavLink>
                    {isAdmin && (
                      <NavLink href="/dashboard" icon={Settings} className="w-full justify-start">
                        Admin Panel
                      </NavLink>
                    )}
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-between px-3 py-2 border-t border-border mt-4">
                <ThemeToggle />
              </div>
              
              {!loading && (
                user ? (
                  <div className="px-3 py-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 py-2">
                    <Link href="/login">
                      <Button 
                        size="sm" 
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
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