import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Analytics event tracking
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (analytics) {
    try {
      logEvent(analytics, eventName, parameters);
    } catch (error) {
      console.error('Analytics error:', error);
    }
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
export const trackUserSignIn = (method: string = 'google') => {
  trackEvent(AnalyticsEvents.USER_SIGN_IN, { method });
};

export const trackUserSignOut = () => {
  trackEvent(AnalyticsEvents.USER_SIGN_OUT);
};

export const trackProfileUpdate = (fields: string[]) => {
  trackEvent(AnalyticsEvents.PROFILE_UPDATED, { fields });
};

export const trackClinicalLogicStarted = () => {
  trackEvent(AnalyticsEvents.CLINICAL_LOGIC_STARTED);
};

export const trackClinicalLogicCompleted = (diseaseType: string) => {
  trackEvent(AnalyticsEvents.CLINICAL_LOGIC_COMPLETED, { diseaseType });
};

export const trackClinicalLogicAbandoned = (step: number) => {
  trackEvent(AnalyticsEvents.CLINICAL_LOGIC_ABANDONED, { step });
};

export const trackPageView = (pageName: string) => {
  trackEvent(AnalyticsEvents.PAGE_VIEW, { page_name: pageName });
};

export const trackDashboardAccess = () => {
  trackEvent(AnalyticsEvents.DASHBOARD_ACCESSED);
};

export const trackProfileAccess = () => {
  trackEvent(AnalyticsEvents.PROFILE_ACCESSED);
};

export const trackFormStepCompleted = (step: number, stepName: string) => {
  trackEvent(AnalyticsEvents.FORM_STEP_COMPLETED, { step, step_name: stepName });
};

export const trackFormValidationError = (field: string, error: string) => {
  trackEvent(AnalyticsEvents.FORM_VALIDATION_ERROR, { field, error });
};

export const trackDataExport = (exportType: string) => {
  trackEvent(AnalyticsEvents.DATA_EXPORTED, { export_type: exportType });
};

export const trackError = (errorType: string, errorMessage: string) => {
  trackEvent(AnalyticsEvents.ERROR_OCCURRED, { error_type: errorType, error_message: errorMessage });
}; 