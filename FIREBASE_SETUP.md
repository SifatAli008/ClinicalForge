# Firebase Database Setup Guide

## 🚀 Quick Setup

### 1. Firebase Console Configuration

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**: `hdms-a8e42`
3. **Enable Firestore Database**:
   - Go to Firestore Database
   - Click "Create Database"
   - Choose "Start in test mode" for development
   - Select a location (preferably close to your users)

### 2. Security Rules Setup

Create the following Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to submit clinical data
    match /clinicalLogic/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Allow authenticated users to read contributor data
    match /contributors/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Analytics data
    match /analytics/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Indexes Setup

Create the following composite indexes in Firestore:

1. **Collection**: `clinicalLogic`
   - Fields: `submissionDate` (Descending)
   - Query: `orderBy('submissionDate', 'desc')`

2. **Collection**: `contributors`
   - Fields: `lastSubmission` (Descending)
   - Query: `orderBy('lastSubmission', 'desc')`

3. **Collection**: `clinicalLogic`
   - Fields: `physicianName` (Ascending), `submissionDate` (Descending)
   - Query: `where('physicianName', '==', value) && orderBy('submissionDate', 'desc')`

### 4. Environment Variables

Create `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBK1pvOaDPNJcwtEZfZSXsimnMmcHSlNGw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=hdms-a8e42.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=hdms-a8e42
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=hdms-a8e42.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1041849143687
NEXT_PUBLIC_FIREBASE_APP_ID=1:1041849143687:web:34d48f1209e10443a30322
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-K26DF8CGV4
```

## 🔧 Performance Optimizations

### 1. Connection Management

The updated Firebase configuration includes:
- **Automatic reconnection** with retry logic
- **Connection health monitoring**
- **Performance caching** (5-minute cache duration)
- **Real-time listeners** for live data updates

### 2. Caching Strategy

- **Client-side caching** for frequently accessed data
- **Automatic cache invalidation** on data updates
- **Cache size monitoring** to prevent memory issues

### 3. Real-time Features

- **Live data updates** using Firestore listeners
- **Automatic cache updates** when data changes
- **Error handling** for connection issues

## 📊 Database Structure

### Collections

1. **`clinicalLogic`** - Clinical data submissions
   ```javascript
   {
     diseaseName: string,
     diseaseType: string,
     typicalOnsetAge: number,
     genderBias: string,
     urbanRuralBias: string,
     physicianName: string,
     institution: string,
     specialty: string,
     submissionDate: Timestamp,
     createdAt: Timestamp,
     // ... other clinical fields
   }
   ```

2. **`contributors`** - Doctor/contributor information
   ```javascript
   {
     name: string,
     institution: string,
     specialty: string,
     submissionCount: number,
     lastSubmission: Timestamp,
     attributionConsent: boolean,
     createdAt: Timestamp
   }
   ```

3. **`users`** - User profiles
   ```javascript
   {
     uid: string,
     email: string,
     displayName: string,
     photoURL: string,
     username: string,
     phoneNumber: string,
     designation: string,
     institution: string,
     specialty: string,
     role: string,
     experience: number,
     bio: string,
     location: string,
     education: string,
     certifications: string[],
     researchInterests: string[],
     createdAt: Timestamp,
     updatedAt: Timestamp
   }
   ```

## 🚀 Usage Examples

### 1. Submit Clinical Data
```javascript
import { submitClinicalLogic } from '@/lib/firebase-service';

const data = {
  diseaseName: "Type 2 Diabetes",
  diseaseType: "Chronic",
  // ... other fields
};

try {
  const docId = await submitClinicalLogic(data);
  console.log('Submitted with ID:', docId);
} catch (error) {
  console.error('Submission failed:', error);
}
```

### 2. Real-time Data Listening
```javascript
import { subscribeToClinicalLogic } from '@/lib/firebase-service';

const unsubscribe = subscribeToClinicalLogic(
  (submissions) => {
    console.log('Real-time updates:', submissions);
  },
  (error) => {
    console.error('Listener error:', error);
  }
);

// Clean up when component unmounts
// unsubscribe();
```

### 3. Get Cached Data
```javascript
import { getClinicalLogicSubmissions } from '@/lib/firebase-service';

const submissions = await getClinicalLogicSubmissions();
// Data is automatically cached for 5 minutes
```

## 🔍 Troubleshooting

### Common Issues

1. **Connection Timeouts**
   - Check internet connection
   - Verify Firebase project settings
   - Check security rules

2. **Permission Denied**
   - Ensure user is authenticated
   - Check Firestore security rules
   - Verify collection names

3. **Slow Performance**
   - Data is now cached for 5 minutes
   - Real-time listeners provide live updates
   - Connection optimization reduces latency

### Performance Monitoring

```javascript
import { getConnectionStatus } from '@/lib/firebase-service';

const status = getConnectionStatus();
console.log('Cache size:', status.cacheSize);
console.log('Cached keys:', status.cacheKeys);
```

## 📈 Next Steps

1. **Monitor Performance**: Use Firebase Console to monitor usage
2. **Scale Up**: Upgrade Firebase plan if needed
3. **Backup Data**: Set up regular data exports
4. **Security**: Review and update security rules regularly

## 🆘 Support

If you encounter issues:
1. Check Firebase Console for errors
2. Verify environment variables
3. Test with Firebase Emulator for development
4. Review browser console for detailed error messages 