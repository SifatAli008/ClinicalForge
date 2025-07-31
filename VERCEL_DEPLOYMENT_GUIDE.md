# 🚀 Vercel Deployment Guide for ClinicalForge

## 🎯 **Quick Fix for Vercel Issues**

### **Step 1: Environment Variables Setup**

1. **Go to Vercel Dashboard:**
   - Visit https://vercel.com/dashboard
   - Select your ClinicalForge project

2. **Add Environment Variables:**
   - Go to Settings → Environment Variables
   - Add these variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hdms-a8e42.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hdms-a8e42
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hdms-a8e42.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1041849143687
NEXT_PUBLIC_FIREBASE_APP_ID=1:1041849143687:web:34d48f1209e10443a30322
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app
```

3. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" on the latest deployment

### **Step 2: Using Deployment Scripts**

#### **For Windows:**
```bash
# Run the Windows deployment script
scripts\vercel-deploy.bat
```

#### **For Mac/Linux:**
```bash
# Make script executable
chmod +x scripts/vercel-deploy.sh

# Run the deployment script
./scripts/vercel-deploy.sh
```

### **Step 3: Manual Deployment**

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy with environment variables
vercel --prod --env NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw --env NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hdms-a8e42.firebaseapp.com --env NEXT_PUBLIC_FIREBASE_PROJECT_ID=hdms-a8e42 --env NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hdms-a8e42.firebasestorage.app --env NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1041849143687 --env NEXT_PUBLIC_FIREBASE_APP_ID=1:1041849143687:web:34d48f1209e10443a30322 --env NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app
```

## 🔧 **Configuration Files**

### **vercel.json** ✅ **Updated**
```json
{
  "env": {
    "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "hdms-a8e42.firebaseapp.com",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hdms-a8e42",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "hdms-a8e42.firebasestorage.app",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "1041849143687",
    "NEXT_PUBLIC_FIREBASE_APP_ID": "1:1041849143687:web:34d48f1209e10443a30322",
    "NEXT_PUBLIC_FIREBASE_DATABASE_URL": "https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app"
  },
  "build": {
    "env": {
      "NEXT_PUBLIC_FIREBASE_API_KEY": "AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw",
      "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "hdms-a8e42.firebaseapp.com",
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID": "hdms-a8e42",
      "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET": "hdms-a8e42.firebasestorage.app",
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID": "1041849143687",
      "NEXT_PUBLIC_FIREBASE_APP_ID": "1:1041849143687:web:34d48f1209e10443a30322",
      "NEXT_PUBLIC_FIREBASE_DATABASE_URL": "https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "redirects": [
    {
      "source": "/firebase",
      "destination": "/",
      "permanent": false
    }
  ]
}
```

### **next.config.js** ✅ **Updated**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'firebasestorage.googleapis.com',
      'clinical-forge.vercel.app',
      'hdms-a8e42.firebaseapp.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'clinical-forge.vercel.app',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hdms-a8e42.firebaseapp.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw",
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hdms-a8e42.firebaseapp.com",
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hdms-a8e42",
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hdms-a8e42.firebasestorage.app",
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1041849143687",
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1041849143687:web:34d48f1209e10443a30322",
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://hdms-a8e42-default-rtdb.asia-southeast1.firebasedatabase.app"
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/firebase/:path*',
        destination: '/api/firebase/:path*',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    // Handle Firebase issues in production
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: false,
  // Add Vercel-specific optimizations
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure proper static generation
  trailingSlash: false,
  // Add experimental features for better performance
  experimental: {
    webpackBuildWorker: true,
    optimizeCss: true,
    scrollRestoration: true,
  },
};

module.exports = nextConfig;
```

## 🚀 **Deployment Steps**

### **Option 1: Automatic Deployment (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Vercel deployment issues"
   git push origin main
   ```

2. **Vercel will automatically deploy** with the updated configuration

### **Option 2: Manual Deployment**

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### **Option 3: Using Deployment Scripts**

#### **Windows:**
```bash
scripts\vercel-deploy.bat
```

#### **Mac/Linux:**
```bash
chmod +x scripts/vercel-deploy.sh
./scripts/vercel-deploy.sh
```

## 🔍 **Troubleshooting**

### **If Deployment Fails:**

1. **Check Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure all Firebase variables are set correctly

2. **Check Build Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on the failed deployment
   - Check the build logs for errors

3. **Redeploy:**
   ```bash
   vercel --prod --force
   ```

### **Common Issues:**

1. **Environment Variables Not Set:**
   - Solution: Add them in Vercel Dashboard

2. **Build Errors:**
   - Solution: Check `npm run build` locally first

3. **Firebase Configuration Issues:**
   - Solution: Verify Firebase project settings

## ✅ **Success Indicators**

- ✅ **Build completes successfully**
- ✅ **Environment variables are accessible**
- ✅ **Firebase authentication works**
- ✅ **No console errors in production**
- ✅ **Application loads without issues**

## 🌐 **Final URL**

After successful deployment, your application will be available at:
**https://clinical-forge.vercel.app**

## 📞 **Support**

If you encounter any issues:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Test locally with `npm run build` first
4. Contact support if issues persist

The updated configuration should resolve all Vercel deployment issues! 