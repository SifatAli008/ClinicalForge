@echo off
REM Vercel Deployment Script for ClinicalForge (Windows)
REM This script ensures proper environment variable handling and deployment

echo 🚀 Starting Vercel deployment for ClinicalForge...

REM Set environment variables for Vercel
set NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw
set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hdms-a8e42.firebaseapp.com
set NEXT_PUBLIC_FIREBASE_PROJECT_ID=hdms-a8e42
set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hdms-a8e42.firebasestorage.app
set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1041849143687
set NEXT_PUBLIC_FIREBASE_APP_ID=1:1041849143687:web:34d48f1209e10443a30322
set NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist .next rmdir /s /q .next
if exist .vercel rmdir /s /q .vercel

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Build the application
echo 🔨 Building application...
call npm run build

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call vercel --prod --yes

echo ✅ Deployment completed!
echo 🌐 Your application should be available at: https://clinical-forge.vercel.app

pause 