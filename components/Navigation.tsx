'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Activity,
  Users,
  Menu,
  X,
  LogOut,
  FileText,
  BookOpen,
  User,
  ChevronDown,
  Info
} from 'lucide-react';

import { useAuth } from '@/lib/auth-context';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const { user, userProfile, signOut, loading, isAdmin, isContributor, isPublic } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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

  // Reset image error when user changes
  React.useEffect(() => {
    setImageError(false);
  }, [user?.uid, userProfile?.avatarUrl]);

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
        { href: '/collaborate', icon: Users, label: 'Why Need to Collaborate?' },
        { href: '/findings', icon: BookOpen, label: 'Findings' }
      ];
    }

    if (isContributor) {
      return [
        ...baseItems,
        { href: '/collaborate', icon: Users, label: 'Why Need to Collaborate?' },
        { href: '/forms', icon: FileText, label: 'Forms' },
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

  // Helper function to get user photo with fallback
  const getUserPhoto = () => {
    let photoUrl = user?.photoURL || userProfile?.avatarUrl;
    
    // If the photo URL is empty or invalid, return null
    if (!photoUrl || photoUrl === 'null' || photoUrl === 'undefined' || photoUrl === '') {
      return null;
    }
    
    return photoUrl;
  };

  // Get user photo URL
  const userPhoto = getUserPhoto();

  // Avatar component with proper fallback
  const UserAvatar = ({ size = 32, className = "" }: { size?: number; className?: string }) => {
    const displayName = user?.displayName || userProfile?.displayName || 'Demo User';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    
    if (userPhoto && !imageError) {
      return (
        <div className={`relative ${className}`}>
          <Image 
            src={userPhoto} 
            alt={displayName}
            width={size}
            height={size}
            className={`rounded-full border-2 border-border transition-all duration-200 group-hover:border-primary/50 ${className}`}
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
            unoptimized={userPhoto.startsWith('data:') || userPhoto.startsWith('blob:')}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
      );
    }
    
    return (
      <div className={`relative ${className}`}>
        <div className={`rounded-full border-2 border-border bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
          <div className="text-center">
            <User className="text-gray-400 mx-auto" style={{ width: size * 0.4, height: size * 0.4 }} />
            <div className="text-xs text-gray-500 font-medium" style={{ fontSize: size * 0.25 }}>
              {initials}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
      </div>
    );
  };

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
                isAdmin ? (
                  // Simple logout button for admin users
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden lg:inline">Logout</span>
                  </Button>
                ) : (
                  // Full profile dropdown for non-admin users
                <div className="relative profile-dropdown">
                  {/* Profile Button */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-3 hover:bg-accent transition-all duration-200 group"
                  >
                    <UserAvatar size={32} />
                                         <div className="hidden lg:block text-left">
                       <p className="text-sm font-medium">{user.displayName || userProfile?.displayName || 'Demo User'}</p>
                       <p className="text-xs text-muted-foreground">{user.email || 'demo@example.com'}</p>
                     </div>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <UserAvatar size={48} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.displayName || userProfile?.displayName || 'Demo User'}</p>
                            <p className="text-sm text-muted-foreground truncate">{user.email || 'demo@example.com'}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-muted-foreground">
                                  {isContributor ? 'Contributor' : 'Online'}
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
                )
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
              {!loading && user && !isAdmin && (
                <div className="px-3 py-4 border-b border-border bg-accent/50 rounded-lg mx-2 mb-2">
                  <div className="flex items-center space-x-3">
                    <UserAvatar size={48} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.displayName || userProfile?.displayName || 'Demo User'}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email || 'demo@example.com'}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-muted-foreground">
                          {isContributor ? 'Contributor' : 'Online'}
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
                {!loading && user && !isAdmin && (
                  <>
                    <div className="h-px bg-border my-2"></div>
                    <NavLink href="/profile" icon={User} className="w-full justify-start">
                      Profile
                    </NavLink>
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