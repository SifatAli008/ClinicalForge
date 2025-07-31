# ClinicalForge - Healthcare Data Platform

Transform healthcare through clinical expertise and secure data collection.

## 🚀 Latest Updates

### 📋 Admin Submission Management System
* **Comprehensive Submission Tracking**: Full CRUD operations for managing user submissions
* **Individual Submission Views**: Detailed view of each submission with edit capabilities
* **Bulk Management**: Efficient handling of multiple submissions
* **Status Tracking**: Monitor submission status and processing workflow
* **Data Export**: Export submission data for analysis and reporting

### 🧪 Testing Infrastructure
* **Jest Configuration**: Complete testing setup with proper configuration
* **Unit Testing**: `__tests__/utils.test.ts` for utility function testing
* **E2E Testing**: Cypress tests for dashboard and forms functionality
* **Test Coverage**: Comprehensive testing for critical user flows
* **CI/CD Ready**: Testing infrastructure ready for continuous integration

### 🎨 Enhanced Admin Navigation
* **AdminNavigation Component**: Dedicated navigation for admin users
* **Role-based UI**: Clean separation between admin and regular user interfaces
* **Improved UX**: Better navigation flow for administrative tasks
* **Professional Design**: Consistent styling with the rest of the platform

### 📝 Enhanced Article Submission System
* **Admin-Only Article Creation**: Secure article submission for administrators only
* **Markdown Template**: Comprehensive template with href links, tables, and bullet points
* **Firebase Integration**: Articles stored and loaded from Firebase Firestore
* **Dynamic Content**: Auto-calculated read time and professional formatting
* **Wikipedia-Style Layout**: Professional academic article display with tabs and navigation

### 🎨 Improved Article Display
* **Professional Article Pages**: Wikipedia-style layout with table of contents
* **Tabbed Interface**: Content, References, and Citations tabs
* **Responsive Design**: Works perfectly on all screen sizes
* **Academic Formatting**: Proper citations, references, and professional styling
* **Action Buttons**: Download PDF and Share functionality

### 🔒 Enhanced Admin Access Control
* **Clean Admin Interface**: No error messages for non-admin users
* **Role-Based Visibility**: Admin features completely hidden from regular users
* **Secure Article Management**: Full CRUD operations for research articles
* **Professional Workflow**: Streamlined article creation and management

### 🧠 Advanced Clinical Analytics Validation
* **Enhanced Data Field Validation Form**: Based on Advanced Clinical Analytics Matrix
* **Decision Models Tab**: 6 clinical decision models with impact assessment
* **Critical Points Tab**: 3 critical clinical decision points evaluation
* **Conflict Zones Tab**: 3 critical conflict zones identification and resolution
* **Feedback Loops Tab**: 3 feedback loops for continuous learning
* **Section Validation Tab**: 18 clinical sections with quality assessment
* **Overall Assessment Tab**: Clinical relevance and implementation readiness

### 🎯 Navigation Improvements
* **Fixed Button Order**: Corrected navigation sequence for contributor users
* **Updated Collaboration Name**: Changed to "Why Need to Collaborate?" for better clarity
* **Role-based Navigation**: Optimized navigation items for each user type
* **Hydration Warning Fixes**: Resolved browser extension-related warnings

### 🎨 Enhanced UI/UX
* **Modern Design System**: Gradient backgrounds, improved typography, and professional styling
* **Responsive Layout**: Mobile-first design with adaptive components
* **Accessibility Improvements**: Better keyboard navigation and screen reader support
* **Performance Optimizations**: Reduced bundle size and improved loading times

## 🚀 New Features

### Admin Submission Management
* **Submission Dashboard**: Comprehensive view of all user submissions
* **Individual Submission Details**: Detailed view with edit and update capabilities
* **Status Management**: Track submission processing and approval workflow
* **Data Export**: Export submission data for research and analysis
* **Bulk Operations**: Efficient management of multiple submissions
* **Audit Trail**: Complete history of submission changes and updates

### Testing Infrastructure
* **Jest Setup**: Complete unit testing framework with proper configuration
* **Cypress E2E Tests**: End-to-end testing for critical user flows
* **Test Utilities**: Helper functions for consistent testing
* **Coverage Reporting**: Track test coverage and quality metrics
* **CI/CD Integration**: Ready for automated testing in deployment pipeline

### Role-Based Access Control System

* **Three User Roles**: 
  - **Public Users**: View-only access to homepage, collaborations, and findings
  - **Contributors**: Google login with access to forms, profile, and collaboration features
  - **Administrators**: Static password access with full system control and dashboard
* **Authentication Guards**: Protected routes with automatic redirects to login
* **Dynamic Navigation**: Role-specific navigation items and access controls
* **Secure Login System**: Google OAuth for contributors, password-based for admins

### Clinical Forms Management

* **Advanced Data Field Validation Form**: Comprehensive validation based on Advanced Clinical Analytics Matrix
  - **Decision Models**: 6 clinical decision models evaluation
  - **Critical Points**: 3 critical clinical decision points
  - **Conflict Zones**: 3 critical conflict zones identification
  - **Feedback Loops**: 3 feedback loops for continuous learning
  - **Section Validation**: 18 clinical sections with quality assessment
  - **Overall Assessment**: Clinical relevance and implementation readiness
* **Enhanced Parameter Validation Form**: Improved UI with modern design and better UX
* **Card-based Interface**: Clean, intuitive form selection with progress tracking
* **Form Protection**: Only authenticated contributors can access forms

### Professional Footer System

* **Contact Page** (`/contact`):
  - Interactive contact form with validation
  - Inquiry types (General, Technical, Clinical, Partnership)
  - Contact information (email, phone, office, hours)
  - Response time indicators for different inquiry types
  - Professional design with gradient backgrounds

* **Privacy Policy Page** (`/privacy-policy`):
  - Comprehensive privacy policy coverage
  - 6 policy sections (Information Collection, Usage, Security, Sharing, Rights, Retention)
  - Compliance standards (HIPAA, GDPR, SOC 2, ISO 27001)
  - Contact information for privacy concerns

* **Terms & Conditions Page** (`/terms-conditions`):
  - Complete legal framework
  - 6 terms sections (Acceptance, Service Description, Responsibilities, Prohibited Activities, IP, Liability)
  - Key provisions and termination conditions
  - Dispute resolution process

### Enhanced User Profile Management

* **Real-time Profile Editing**: Update profile information instantly
* **Activity Tracking**: Monitor form submissions and completion status
* **Data Export**: Download your form responses in JSON format
* **Statistics Dashboard**: Track contributions and completion rates
* **Role-based Profiles**: Different profile features based on user role

### Admin Dashboard & Analytics

* **Overview Widgets**: Real-time submission metrics and user statistics
* **Visual Analytics**: Charts and graphs for data visualization
* **User Management**: Monitor user activity and contribution statistics
* **System Recommendations**: AI-generated insights for improving data collection
* **Data Export**: Comprehensive export functionality for research analysis
* **Admin-only Access**: Full system control and data management

### Research Articles Management

* **Admin-Only Article Creation**: Secure article submission system for administrators
* **Markdown Template System**: Comprehensive template with professional formatting
* **Firebase Integration**: Articles stored and loaded from Firebase Firestore
* **Wikipedia-Style Display**: Professional academic article pages with navigation
* **Tabbed Interface**: Content, References, and Citations organized in tabs
* **Dynamic Features**: Auto-calculated read time and responsive design
* **Action Buttons**: Download PDF and Share functionality for articles

### Collaboration Platform

* **"Why Need to Collaborate?" Page**: Compelling content about the importance of clinical collaboration
* **Impact Statistics**: Showcase platform achievements and user contributions
* **Testimonials**: Real feedback from healthcare professionals
* **Professional Network**: Connect with fellow healthcare professionals
* **Public Access**: Collaboration information available to all users

### Authentication & Security

* **Google OAuth Integration**: Secure contributor login with Google accounts
* **Admin Password Protection**: Static password authentication for administrators
* **Role-based Authorization**: Granular access control based on user roles
* **Session Management**: Secure session handling for all user types
* **Protected Routes**: Automatic redirects for unauthorized access attempts

## 🏗️ System Architecture

### Core Components

* **Authentication System**: Role-based access control with multiple login methods
* **Forms Management**: Modular form system with validation and suggestions
* **User Profiles**: Dynamic profile management with activity tracking
* **Admin Dashboard**: Comprehensive analytics and user management
* **Admin Submission Management**: Full CRUD operations for submission handling
* **Testing Infrastructure**: Comprehensive testing framework for quality assurance
* **Data Export**: Secure data export for research and analysis
* **Navigation System**: Dynamic navigation based on user roles
* **Footer System**: Professional footer with contact, privacy, and terms pages

### Security & Compliance

* **Role-based Access Control**: Granular permissions for different user types
* **Password Protection**: Secure admin access with authentication
* **Data Anonymization**: Privacy protection for clinical contributions
* **Audit Trail**: Track all edits and suggestions for data provenance
* **Export Controls**: Secure data export with proper access controls
* **Authentication Guards**: Protected routes with automatic redirects
* **Privacy Compliance**: HIPAA and GDPR compliant data handling

### Research Utility

* **Data Visualization**: Charts and analytics for research insights
* **Metrics Dashboard**: Comprehensive platform statistics
* **System Feedback**: AI-generated recommendations for improvement
* **Collaboration Tools**: Professional networking and knowledge sharing
* **Role-specific Features**: Different capabilities based on user type
* **Advanced Analytics**: Clinical decision model validation and assessment

## 🛠️ Tech Stack

* **Frontend**: Next.js 14, TypeScript, React 18
* **Styling**: Tailwind CSS, Radix UI Components
* **Forms**: React Hook Form, Zod validation
* **State Management**: SWR for data fetching
* **Authentication**: Firebase Authentication, Google OAuth
* **Database**: Firebase (Firestore, Authentication)
* **Testing**: Jest, Cypress for unit and E2E testing
* **Deployment**: Vercel

## 📊 Key Features

### For Public Users

* ✅ View "What is ClinicalForge" information
* ✅ Access collaboration and findings pages (view-only)
* ✅ Learn about the platform and its benefits
* ✅ Understand the role-based access system
* ✅ Access contact, privacy policy, and terms pages via footer

### For Healthcare Professionals (Contributors)

* ✅ Google OAuth login for secure access
* ✅ Advanced clinical data validation forms
* ✅ Comprehensive parameter validation with improved UI
* ✅ Track your contributions and impact
* ✅ Download your data for personal use
* ✅ Connect with fellow professionals
* ✅ Access profile management features
* ✅ Contact support and access legal information

### For Researchers & Administrators

* ✅ Static password authentication for admin access
* ✅ Monitor platform activity and metrics
* ✅ Export comprehensive datasets
* ✅ View user engagement analytics
* ✅ Receive system recommendations
* ✅ Manage user accounts and submissions
* ✅ Full system control and data management
* ✅ Access to all footer pages and legal information
* ✅ Create and manage research articles
* ✅ Use markdown template for professional formatting
* ✅ Store articles in Firebase with real-time updates
* ✅ Professional article display with Wikipedia-style layout
* ✅ Comprehensive submission management system
* ✅ Individual submission tracking and editing
* ✅ Bulk submission operations
* ✅ Complete audit trail for all changes

### For the Healthcare Ecosystem

* ✅ Improve diagnostic accuracy
* ✅ Advance medical research
* ✅ Bridge healthcare gaps
* ✅ Innovate healthcare technology
* ✅ Ensure data quality
* ✅ Enable role-based collaboration
* ✅ Professional contact and support system

## 🚀 Getting Started

1. **Clone the repository**  
```bash
git clone https://github.com/SifatAli008/ClinicalForge.git  
cd ClinicalForge
```

2. **Install dependencies**  
```bash
npm install
```

3. **Set up environment variables**  
```bash
cp .env.example .env.local  
# Configure Firebase and other services
```

4. **Run the development server**  
```bash
npm run dev
```

5. **Run tests**  
```bash
# Unit tests
npm test

# E2E tests
npm run cypress:open
```

6. **Access the application**  
   * Open [http://localhost:3000](http://localhost:3000)  
   * Navigate to `/login` to access the authentication system
   * Visit `/forms` to explore clinical forms (contributor access required)
   * Access `/collaborate` to learn about collaboration  
   * Visit `/dashboard` for admin analytics (admin access required)
   * Access footer links for contact, privacy policy, and terms

## 📁 Project Structure

```
ClinicalForge/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin management pages
│   │   ├── submissions/   # Submission management
│   │   └── populate-articles/ # Article creation
│   ├── forms/             # Clinical forms management
│   │   ├── data-field-validation/  # Advanced data field validation form
│   │   └── parameter-validation/    # Enhanced parameter validation form
│   ├── contact/           # Contact page with form
│   ├── privacy-policy/    # Privacy policy page
│   ├── terms-conditions/  # Terms & conditions page
│   ├── collaborate/       # Collaboration information
│   ├── dashboard/         # Admin dashboard
│   ├── profile/          # User profile management
│   └── login/            # Authentication page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   ├── admin/            # Admin-specific components
│   ├── Navigation.tsx    # Role-based navigation
│   └── Footer.tsx        # Professional footer component
├── lib/                  # Utility functions and services
│   ├── auth-context.tsx  # Authentication context
│   └── scroll-animations.ts # Animation hooks
├── __tests__/            # Unit tests
├── cypress/              # E2E tests
└── public/               # Static assets
```

## 🔧 Configuration

### Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Access
ADMIN_PASSWORD=Data Debo Na
```

## 🔐 Authentication System

### User Roles

#### **Public Users (No Login Required)**
- Access to homepage, collaborations, and findings (view-only)
- Can learn about the platform and its benefits
- No data contribution capabilities
- Access to contact, privacy policy, and terms pages

#### **Contributors (Google Login)**
- Google OAuth authentication
- Access to forms, profile, and collaboration features
- Can contribute clinical data and validate forms
- Profile management and activity tracking
- Full access to all footer pages

#### **Administrators (Static Password)**
- Password-based authentication ("Data Debo Na")
- Full system control and dashboard access
- User management and analytics
- Complete data management capabilities
- Access to all system features
- Submission management and editing
- Article creation and management

### Navigation by Role

- **Public**: 3 pages (What is ClinicalForge, Why Need to Collaborate?, Findings)
- **Contributor**: 4 pages (What is ClinicalForge, Why Need to Collaborate?, Forms, Findings)
- **Admin**: 2 pages (Dashboard, Findings)

## 📈 Performance Features

* **Lazy Loading**: Heavy components loaded on demand
* **Optimized Images**: Next.js Image optimization
* **Caching**: SWR for efficient data fetching
* **Bundle Optimization**: Code splitting and tree shaking
* **Real-time Updates**: Live data synchronization
* **Scroll Animations**: Smooth scroll effects and loading animations
* **Role-based Loading**: Efficient loading based on user permissions
* **Hydration Optimization**: Fixed browser extension warnings

## 🧹 Code Quality & Error Checking

This project uses ESLint and TypeScript for code quality and error prevention.

### Linting (ESLint)

A standard ESLint configuration is provided in `.eslintrc.js` for Next.js, React, and TypeScript. To check for code style and common errors, run:

```bash
npx eslint "app/**/*.{js,jsx,ts,tsx}" "components/**/*.{js,jsx,ts,tsx}" "lib/**/*.{js,jsx,ts,tsx}"
```

- Fix issues as reported by ESLint for best code quality.

### Type Checking (TypeScript)

To check for type errors across the project, run:

```bash
npx tsc --noEmit
```

### Build Check (Next.js)

To ensure the project builds without errors, run:

```bash
npx next build
```

### Testing

Run the complete test suite:

```bash
# Unit tests
npm test

# E2E tests
npm run cypress:run

# All tests
npm run test:all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

* Healthcare professionals worldwide for their valuable contributions
* The Next.js and React communities for excellent tooling
* Firebase team for robust backend services
* All contributors who help improve healthcare through data

---

**ClinicalForge** - Empowering healthcare through collaborative data collection and validation with secure role-based access control and comprehensive professional support system. 
