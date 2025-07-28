# Firebase Setup Guide

## 🚀 Automatic Firebase Setup

This guide will help you automatically set up Firebase with the enhanced database configuration for ClinicalForge.

## 📋 Prerequisites

Before running the setup, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Firebase CLI** installed globally
4. **Git** (for version control)

## 🔧 Installation Steps

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Install Project Dependencies

```bash
npm install
```

## 🎯 Setup Options

### Option 1: Quick Development Setup (Recommended for Development)

This sets up Firebase emulators for local development:

```bash
npm run setup:firebase:quick
```

**What this does:**
- Creates development environment configuration
- Sets up Firebase emulators
- Creates sample data for testing
- Updates package.json with development scripts
- Creates development documentation

### Option 2: Full Production Setup

This sets up Firebase for production deployment:

```bash
npm run setup:firebase
```

**What this does:**
- Checks Firebase CLI installation
- Verifies Firebase authentication
- Updates Firebase configuration files
- Deploys security rules and indexes
- Creates initial collections
- Sets up environment variables
- Validates the setup

## 🏃‍♂️ Quick Start

### For Development:

1. **Run the quick setup:**
   ```bash
   npm run setup:firebase:quick
   ```

2. **Start development server with Firebase emulators:**
   ```bash
   npm run dev:firebase:ui
   ```

3. **Access the application:**
   - **Next.js App**: http://localhost:3000
   - **Firebase Emulator UI**: http://localhost:4000
   - **Forms**: http://localhost:3000/forms

### For Production:

1. **Run the full setup:**
   ```bash
   npm run setup:firebase
   ```

2. **Update environment variables:**
   Edit `.env.local` with your actual Firebase project credentials

3. **Deploy to production:**
   ```bash
   npm run build
   npm run firebase:deploy
   ```

## 📁 Generated Files

### Configuration Files

- `firebase.json` - Firebase project configuration
- `firestore.rules` - Firestore security rules
- `firestore.indexes.json` - Firestore indexes
- `.env.local` - Environment variables

### Scripts

- `scripts/setup-enhanced-firebase.js` - Full production setup
- `scripts/setup-firebase-dev.js` - Development setup
- `scripts/dev-data.json` - Sample development data

### Documentation

- `DEVELOPMENT_SETUP.md` - Development guide
- `ENHANCED_CLINICAL_DATABASE_DESIGN.md` - Database design
- `DATABASE_IMPROVEMENTS_SUMMARY.md` - Implementation summary

## 🔧 Available Scripts

### Setup Scripts

```bash
npm run setup:firebase          # Full production setup
npm run setup:firebase:quick    # Quick development setup
```

### Development Scripts

```bash
npm run dev                     # Start Next.js development server
npm run dev:firebase            # Start Next.js + Firebase emulators
npm run dev:firebase:ui         # Start Next.js + Firebase emulators with UI
npm run firebase:emulators      # Start Firebase emulators only
npm run firebase:emulators:ui   # Start Firebase emulators with UI
```

### Deployment Scripts

```bash
npm run firebase:deploy         # Deploy everything to Firebase
npm run firebase:deploy:rules   # Deploy only Firestore rules
npm run firebase:deploy:indexes # Deploy only Firestore indexes
```

## 🗄️ Database Collections

The enhanced setup creates the following collections:

### Primary Collections

- `enhancedClinicalDatabase` - Main collection for all form data
- `comprehensiveParameterValidation` - Legacy collection (backward compatibility)
- `advancedClinicalAnalytics` - Legacy collection (backward compatibility)
- `formSubmissions` - Legacy collection (backward compatibility)

### Supporting Collections

- `users` - User profiles and preferences
- `collaborators` - Collaborator information
- `articles` - Published articles and content
- `admin` - Admin configuration and settings
- `analytics` - Analytics and metrics data
- `dashboard` - Dashboard data and settings
- `notifications` - User notifications
- `settings` - User settings
- `auditLog` - Audit trail and logging
- `backups` - Database backups

## 🔐 Security Rules

The enhanced setup includes comprehensive security rules:

### Access Control Levels

1. **Creator/Collaborator**: Full access to own documents
2. **Explicit Read Access**: Users with read permissions
3. **Explicit Write Access**: Users with write permissions
4. **Admin Access**: Full administrative control
5. **Public Read**: Approved documents accessible to authenticated users

### Security Features

- User-based access control
- Role-based permissions
- Document-level security
- Admin-only operations
- Audit logging and monitoring

## 📊 Enhanced Features

### Cross-Form Validation

- Parameter validation score (0-100)
- Analytics validation score (0-100)
- Overall consistency score (0-100)
- Data completeness score (0-100)
- Clinical relevance score (0-100)
- Implementation readiness score (0-100)

### Advanced Analytics

- Clinical decision support models
- Risk assessment and treatment complexity
- Quality metrics and scoring
- Missing data identification
- Recommendations for improvement

### Search & Indexing

- Comprehensive search capabilities
- Optimized query performance
- Real-time updates and notifications
- Efficient pagination support

## 🧪 Testing

### Test the Forms

1. Navigate to http://localhost:3000/forms
2. Test Comprehensive Parameter Validation form
3. Test Advanced Clinical Analytics form
4. Check Firebase emulator UI for data

### Verify Data Collection

1. Open Firebase Emulator UI: http://localhost:4000
2. Navigate to Firestore tab
3. Check `enhancedClinicalDatabase` collection
4. Verify data structure and validation

## 🔧 Troubleshooting

### Common Issues

#### Firebase CLI Not Found
```bash
npm install -g firebase-tools
firebase login
```

#### Port Conflicts
Edit `firebase.json` to change emulator ports:
```json
{
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8080 },
    "hosting": { "port": 5000 },
    "ui": { "port": 4000 }
  }
}
```

#### Authentication Issues
1. Check Firebase emulator UI: http://localhost:4000
2. Verify authentication configuration
3. Check `.env.local` for correct credentials

#### Database Connection Issues
1. Ensure Firebase emulators are running
2. Check `lib/firebase-config.ts` configuration
3. Verify environment variables

### Development Tips

#### Using Emulators
```bash
# Start only specific emulators
firebase emulators:start --only firestore,auth

# Export emulator data
firebase emulators:export ./emulator-data

# Import emulator data
firebase emulators:start --import=./emulator-data
```

#### Debug Mode
Set `NEXT_PUBLIC_DEBUG_MODE=true` in `.env.local` for detailed logging.

## 📚 Documentation

### Key Documents

- `ENHANCED_CLINICAL_DATABASE_DESIGN.md` - Complete database design
- `DATABASE_IMPROVEMENTS_SUMMARY.md` - Implementation summary
- `DEVELOPMENT_SETUP.md` - Development guide
- `FIREBASE_SETUP_GUIDE.md` - This setup guide

### API Documentation

- Enhanced Clinical Database Service: `lib/enhanced-clinical-database-service.ts`
- Firebase Configuration: `lib/firebase-config.ts`
- Form Components: `app/forms/`

## 🚀 Deployment

### Development to Production

1. **Test locally:**
   ```bash
   npm run dev:firebase:ui
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Deploy to Firebase:**
   ```bash
   npm run firebase:deploy
   ```

### Environment Variables

Update `.env.local` with production Firebase credentials:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🎯 Success Metrics

### Setup Validation

- ✅ Firebase CLI installed and authenticated
- ✅ Enhanced database service configured
- ✅ Security rules deployed
- ✅ Indexes deployed
- ✅ Environment variables configured
- ✅ Forms integrated with enhanced database

### Performance Metrics

- **Query Response Time**: <500ms
- **Index Efficiency**: >95%
- **Data Retrieval Speed**: <200ms
- **Real-time Updates**: <100ms

### Quality Metrics

- **Form Submission Success**: >99%
- **Data Validation Accuracy**: >98%
- **Cross-form Consistency**: >90%
- **Analytics Quality**: >85%

## 🆘 Support

### Getting Help

1. **Check the documentation** in the `/docs` folder
2. **Review the setup logs** for error messages
3. **Test with emulators** before production deployment
4. **Verify environment variables** are correctly set

### Common Commands

```bash
# Check Firebase status
firebase projects:list

# View emulator logs
firebase emulators:start --only firestore,auth

# Deploy specific components
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Export/Import data
firebase emulators:export ./data
firebase emulators:start --import=./data
```

This automated setup ensures that Firebase is properly configured with the enhanced database design, providing robust data collection and storage for both Comprehensive Parameter Validation and Advanced Clinical Analytics forms. 