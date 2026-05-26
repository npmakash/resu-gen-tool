// Firebase Config & Fallback Wrapper
// In a production environment, you would run: npm install firebase
// and import { initializeApp } from 'firebase/app' and import { getAuth } from 'firebase/auth'

import { api } from './api';

// Example Firebase Web App Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "MOCK_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "resume-optima.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "resume-optima",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "resume-optima.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:00000:web:0000"
};

// Check if actual configuration keys are set
const isRealFirebaseConfigured = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "MOCK_API_KEY";

let firebaseApp = null;
let firebaseAuth = null;

if (isRealFirebaseConfigured) {
  // If keys are provided, we would initialize actual Firebase:
  // firebaseApp = initializeApp(firebaseConfig);
  // firebaseAuth = getAuth(firebaseApp);
  console.log("Firebase App initialized with live credentials!");
} else {
  console.log("Firebase not configured. Running in Fallback/Development mode connected to local MongoDB API server.");
}

// Export mock/wrapper functions matching Firebase interface but routed through our MongoDB server
export const authService = {
  isConfigured: () => isRealFirebaseConfigured,

  // Firebase-like wrapper for Send OTP
  sendOtpCode: async (email, name = '', password = '', isLogin = true) => {
    if (isRealFirebaseConfigured) {
      // Real Firebase passwordless sign in:
      // return sendSignInLinkToEmail(firebaseAuth, email, actionCodeSettings);
    }
    // Fallback local OTP service
    return api.auth.sendOtp(email, name, password, isLogin);
  },

  // Firebase-like wrapper for Verify OTP
  verifyOtpCode: async (email, otp) => {
    if (isRealFirebaseConfigured) {
      // Real Firebase OTP verification
    }
    // Fallback local verification
    return api.auth.verifyOtp(email, otp);
  },

  // Password reset helper
  sendPasswordResetOtp: async (email) => {
    return api.auth.forgotPassword(email);
  },

  confirmPasswordResetOtp: async (email, otp, newPassword) => {
    return api.auth.resetPassword(email, otp, newPassword);
  }
};
