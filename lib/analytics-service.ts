// Mock analytics service for better performance - replaces Firebase Analytics
export const trackEvent = async (eventName: string, parameters?: Record<string, any>) => {
  try {
    if (typeof window !== 'undefined') {
      // Mock analytics tracking
      console.log('📊 Analytics Event:', eventName, parameters);
      
      // Store in localStorage for demo purposes
      const analytics = JSON.parse(localStorage.getItem('analytics') || '[]');
      analytics.push({
        event: eventName,
        parameters,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('analytics', JSON.stringify(analytics.slice(-100))); // Keep last 100 events
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// Predefined events for consistent tracking
export const AnalyticsEvents = {
  // Authentication events
  USER_SIGN_IN: 'user_sign_in',
  USER_SIGN_OUT: 'user_sign_out',
  PROFILE_UPDATED: 'profile_updated',
  
  // Clinical logic events
  CLINICAL_LOGIC_STARTED: 'clinical_logic_started',
  CLINICAL_LOGIC_COMPLETED: 'clinical_logic_completed',
  CLINICAL_LOGIC_ABANDONED: 'clinical_logic_abandoned',
  
  // Navigation events
  PAGE_VIEW: 'page_view',
  DASHBOARD_ACCESSED: 'dashboard_accessed',
  PROFILE_ACCESSED: 'profile_accessed',
  
  // Form interactions
  FORM_STEP_COMPLETED: 'form_step_completed',
  FORM_VALIDATION_ERROR: 'form_validation_error',
  
  // Data export
  DATA_EXPORTED: 'data_exported',
  
  // Error tracking
  ERROR_OCCURRED: 'error_occurred',
} as const;

// Helper functions for common events
export const trackUserSignIn = async (method: string = 'google') => {
  await trackEvent(AnalyticsEvents.USER_SIGN_IN, { method });
};

export const trackUserSignOut = async () => {
  await trackEvent(AnalyticsEvents.USER_SIGN_OUT);
};

export const trackProfileUpdate = async (fields: string[]) => {
  await trackEvent(AnalyticsEvents.PROFILE_UPDATED, { fields });
};

export const trackClinicalLogicStarted = async () => {
  await trackEvent(AnalyticsEvents.CLINICAL_LOGIC_STARTED);
};

export const trackClinicalLogicCompleted = async (diseaseType: string) => {
  await trackEvent(AnalyticsEvents.CLINICAL_LOGIC_COMPLETED, { diseaseType });
};

export const trackClinicalLogicAbandoned = async (step: number) => {
  await trackEvent(AnalyticsEvents.CLINICAL_LOGIC_ABANDONED, { step });
};

export const trackPageView = async (pageName: string) => {
  await trackEvent(AnalyticsEvents.PAGE_VIEW, { page_name: pageName });
};

export const trackDashboardAccess = async () => {
  await trackEvent(AnalyticsEvents.DASHBOARD_ACCESSED);
};

export const trackProfileAccess = async () => {
  await trackEvent(AnalyticsEvents.PROFILE_ACCESSED);
};

export const trackFormStepCompleted = async (step: number, stepName: string) => {
  await trackEvent(AnalyticsEvents.FORM_STEP_COMPLETED, { step, step_name: stepName });
};

export const trackFormValidationError = async (field: string, error: string) => {
  await trackEvent(AnalyticsEvents.FORM_VALIDATION_ERROR, { field, error });
};

export const trackDataExport = async (exportType: string) => {
  await trackEvent(AnalyticsEvents.DATA_EXPORTED, { export_type: exportType });
};

export const trackError = async (errorType: string, errorMessage: string) => {
  await trackEvent(AnalyticsEvents.ERROR_OCCURRED, { error_type: errorType, error_message: errorMessage });
}; 