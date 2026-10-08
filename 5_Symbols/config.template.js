// Google Sheets API Configuration Template
// Copy this file to config.js and fill in your actual values
// DO NOT commit config.js with real credentials to Git!

const GOOGLE_CONFIG = {
  // Get this from Google Cloud Console > Credentials
  CLIENT_ID: 'YOUR_CLIENT_ID_HERE.apps.googleusercontent.com',
  
  // Optional: Only needed for public read-only access
  API_KEY: 'YOUR_API_KEY_HERE',
  
  // These are standard and don't need to change
  DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  
  // Scopes needed for reading/writing sheets
  // For read-only access, use: 'https://www.googleapis.com/auth/spreadsheets.readonly'
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets'
};

// Your Google Sheet ID
// Find this in the URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

// n8n Webhook Configuration
// Get these URLs from your n8n workflows
const N8N_CONFIG = {
  // Webhook for availability update form submissions
  UPDATE_WEBHOOK: 'https://your-n8n-instance.com/webhook/availability-update',
  
  // Optional: Webhook for other triggers
  REMINDER_WEBHOOK: 'https://your-n8n-instance.com/webhook/reminder'
};

// Optional: Admin configuration
const ADMIN_CONFIG = {
  // Admin email for notifications
  EMAIL: 'admin@example.com',
  
  // Admin notification preferences
  NOTIFICATIONS: {
    NEW_UPDATES: true,
    DAILY_SUMMARY: true,
    URGENT_ONLY: false
  }
};

// Export configuration (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GOOGLE_CONFIG,
    SHEET_ID,
    N8N_CONFIG,
    ADMIN_CONFIG
  };
}
