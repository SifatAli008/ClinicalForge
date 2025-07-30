'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  loading: boolean;
  adminUser: AdminUser | null;
}

interface AdminUser {
  id: string;
  name: string;
  role: 'super-admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLogin: Date;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Enhanced admin configuration
const ADMIN_CONFIG = {
  password: 'Data Debo Na',
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
};

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);

  useEffect(() => {
    // Check if admin is already authenticated (stored in sessionStorage)
    const adminAuth = sessionStorage.getItem('adminAuthenticated');
    const adminData = sessionStorage.getItem('adminUser');
    const lastLogin = sessionStorage.getItem('adminLastLogin');
    
    if (adminAuth === 'true' && adminData && lastLogin) {
      const lastLoginTime = new Date(lastLogin);
      const now = new Date();
      
      // Check if session is still valid
      if (now.getTime() - lastLoginTime.getTime() < ADMIN_CONFIG.sessionTimeout) {
        setIsAuthenticated(true);
        setIsAdmin(true);
        setAdminUser(JSON.parse(adminData));
      } else {
        // Session expired, clear storage
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminLastLogin');
      }
    }
    setLoading(false);
  }, []);

  const login = (password: string): boolean => {
    // Check for lockout
    if (lockoutUntil && new Date() < lockoutUntil) {
      return false;
    }

    if (password === ADMIN_CONFIG.password) {
      // Reset login attempts on successful login
      setLoginAttempts(0);
      setLockoutUntil(null);
      
      // Create admin user object
      const adminUserData: AdminUser = {
        id: 'admin-001',
        name: 'System Administrator',
        role: 'super-admin',
        permissions: ['read', 'write', 'delete', 'manage_users', 'system_config'],
        lastLogin: new Date(),
      };
      
      setIsAuthenticated(true);
      setIsAdmin(true);
      setAdminUser(adminUserData);
      
      // Store in session storage
      sessionStorage.setItem('adminAuthenticated', 'true');
      sessionStorage.setItem('adminUser', JSON.stringify(adminUserData));
      sessionStorage.setItem('adminLastLogin', new Date().toISOString());
      
      return true;
    } else {
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Apply lockout if max attempts reached
      if (newAttempts >= ADMIN_CONFIG.maxLoginAttempts) {
        const lockoutTime = new Date();
        lockoutTime.setTime(lockoutTime.getTime() + ADMIN_CONFIG.lockoutDuration);
        setLockoutUntil(lockoutTime);
      }
      
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setAdminUser(null);
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminUser');
    sessionStorage.removeItem('adminLastLogin');
  };

  const value: AdminContextType = {
    isAdmin,
    isAuthenticated,
    login,
    logout,
    loading,
    adminUser,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
} 