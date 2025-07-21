'use client';

import React from 'react';
import Link from 'next/link';
import { Database, Mail, Shield, FileText, Heart, Github, Twitter, Linkedin } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="relative">
                <Database className="h-6 w-6 text-primary" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm"></div>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                ClinicalForge
              </span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Advancing clinical research through collaborative data collection and AI-powered analytics. 
              Empowering healthcare professionals with comprehensive clinical logic validation tools.
            </p>
            <div className="flex items-center space-x-4">
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <Mail className="h-4 w-4" />
                  <span>Contact Us</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <Shield className="h-4 w-4" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-conditions" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms-conditions" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <span>© {currentYear} ClinicalForge. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Made with</span>
              <Heart className="h-4 w-4 text-red-500 hidden md:inline" />
              <span className="hidden md:inline">for healthcare</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <Link 
                href="/privacy-policy" 
                className="hover:text-primary transition-colors"
              >
                Privacy
              </Link>
              <span>•</span>
              <Link 
                href="/terms-conditions" 
                className="hover:text-primary transition-colors"
              >
                Terms
              </Link>
              <span>•</span>
              <Link 
                href="/contact" 
                className="hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 