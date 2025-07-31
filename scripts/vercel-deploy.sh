#!/bin/bash

# Vercel Deployment Script for ClinicalForge
# This script ensures proper environment variable handling and deployment

echo "🚀 Starting Vercel deployment for ClinicalForge..."

# Set environment variables for Vercel
export NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw"
export NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="hdms-a8e42.firebaseapp.com"
export NEXT_PUBLIC_FIREBASE_PROJECT_ID="hdms-a8e42"
export NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="hdms-a8e42.firebasestorage.app"
export NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1041849143687"
export NEXT_PUBLIC_FIREBASE_APP_ID="1:1041849143687:web:34d48f1209e10443a30322"
export NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf .next
rm -rf .vercel

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --yes

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at: https://clinical-forge.vercel.app" 