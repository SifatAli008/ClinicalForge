# ClinicalForge - Healthcare Data Platform

Transform healthcare through clinical expertise and secure data collection.

## 🚀 New Features

### Role-Based Access Control System

* **Three User Roles**: 
  - **Public Users**: View-only access to homepage, collaborations, and findings
  - **Contributors**: Google login with access to forms, profile, and collaboration features
  - **Administrators**: Static password access with full system control and dashboard
* **Authentication Guards**: Protected routes with automatic redirects to login
* **Dynamic Navigation**: Role-specific navigation items and access controls
* **Secure Login System**: Google OAuth for contributors, password-based for admins

### Clinical Forms Management

* **Data Field Validation Form**: Review and validate Clinical Logic Collection Template fields
* **Parameter Validation Form**: Validate actual data entry with enforced type checks
* **Card-based Interface**: Clean, intuitive form selection with progress tracking
* **Form Protection**: Only authenticated contributors can access forms

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

### Collaboration Platform

* **"Why Collaborate?" Page**: Compelling content about the importance of clinical collaboration
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
* **Data Export**: Secure data export for research and analysis
* **Navigation System**: Dynamic navigation based on user roles

### Security & Compliance

* **Role-based Access Control**: Granular permissions for different user types
* **Password Protection**: Secure admin access with authentication
* **Data Anonymization**: Privacy protection for clinical contributions
* **Audit Trail**: Track all edits and suggestions for data provenance
* **Export Controls**: Secure data export with proper access controls
* **Authentication Guards**: Protected routes with automatic redirects

### Research Utility

* **Data Visualization**: Charts and analytics for research insights
* **Metrics Dashboard**: Comprehensive platform statistics
* **System Feedback**: AI-generated recommendations for improvement
* **Collaboration Tools**: Professional networking and knowledge sharing
* **Role-specific Features**: Different capabilities based on user type

## 🛠️ Tech Stack

* **Frontend**: Next.js 14, TypeScript, React 18
* **Styling**: Tailwind CSS, Radix UI Components
* **Forms**: React Hook Form, Zod validation
* **State Management**: SWR for data fetching
* **Authentication**: Firebase Authentication, Google OAuth
* **Database**: Firebase (Firestore, Authentication)
* **Deployment**: Vercel

## 📊 Key Features

### For Public Users

* ✅ View "What is ClinicalForge" information
* ✅ Access collaboration and findings pages (view-only)
* ✅ Learn about the platform and its benefits
* ✅ Understand the role-based access system

### For Healthcare Professionals (Contributors)

* ✅ Google OAuth login for secure access
* ✅ Validate clinical data collection forms
* ✅ Contribute parameter validation data
* ✅ Track your contributions and impact
* ✅ Download your data for personal use
* ✅ Connect with fellow professionals
* ✅ Access profile management features

### For Researchers & Administrators

* ✅ Static password authentication for admin access
* ✅ Monitor platform activity and metrics
* ✅ Export comprehensive datasets
* ✅ View user engagement analytics
* ✅ Receive system recommendations
* ✅ Manage user accounts and submissions
* ✅ Full system control and data management

### For the Healthcare Ecosystem

* ✅ Improve diagnostic accuracy
* ✅ Advance medical research
* ✅ Bridge healthcare gaps
* ✅ Innovate healthcare technology
* ✅ Ensure data quality
* ✅ Enable role-based collaboration

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

5. **Access the application**  
   * Open [http://localhost:3000](http://localhost:3000)  
   * Navigate to `/login` to access the authentication system
   * Visit `/forms` to explore clinical forms (contributor access required)
   * Access `/collaborate` to learn about collaboration  
   * Visit `/dashboard` for admin analytics (admin access required)

## 📁 Project Structure

```
ClinicalForge/
├── app/                    # Next.js app directory
│   ├── forms/             # Clinical forms management
│   │   ├── data-field-validation/  # Data field validation form
│   │   └── parameter-validation/    # Parameter validation form
│   ├── collaborate/       # Collaboration information
│   ├── dashboard/         # Admin dashboard
│   ├── profile/          # User profile management
│   └── login/            # Authentication page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── auth/             # Authentication components
│   └── Navigation.tsx    # Role-based navigation
├── lib/                  # Utility functions and services
│   ├── auth-context.tsx  # Authentication context
│   └── scroll-animations.ts # Animation hooks
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

#### **Contributors (Google Login)**
- Google OAuth authentication
- Access to forms, profile, and collaboration features
- Can contribute clinical data and validate forms
- Profile management and activity tracking

#### **Administrators (Static Password)**
- Password-based authentication ("Data Debo Na")
- Full system control and dashboard access
- User management and analytics
- Complete data management capabilities

### Navigation by Role

- **Public**: 3 pages (What is ClinicalForge, Collaborations, Findings)
- **Contributor**: 4 pages (What is ClinicalForge, Forms, Collaborations, Findings)
- **Admin**: 2 pages (Dashboard, Findings)

## 📈 Performance Features

* **Lazy Loading**: Heavy components loaded on demand
* **Optimized Images**: Next.js Image optimization
* **Caching**: SWR for efficient data fetching
* **Bundle Optimization**: Code splitting and tree shaking
* **Real-time Updates**: Live data synchronization
* **Scroll Animations**: Smooth scroll effects and loading animations
* **Role-based Loading**: Efficient loading based on user permissions

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

**ClinicalForge** - Empowering healthcare through collaborative data collection and validation with secure role-based access control. 
