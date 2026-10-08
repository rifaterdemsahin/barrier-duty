# API Integration Guide for Barrier Duty System

## Overview
This guide explains how to integrate the Barrier Duty web application with Google Sheets API and set up the necessary infrastructure for real-time data synchronization.

## Table of Contents
1. [Google Sheets API Setup](#google-sheets-api-setup)
2. [Authentication Methods](#authentication-methods)
3. [API Endpoints](#api-endpoints)
4. [JavaScript Integration](#javascript-integration)
5. [Security Considerations](#security-considerations)
6. [Error Handling](#error-handling)

---

## Google Sheets API Setup

### Step 1: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one:
   - Click "Select a project" → "New Project"
   - Name: "Barrier Duty Management"
   - Click "Create"

3. Enable Google Sheets API:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

4. Also enable Google Drive API (required for file operations):
   - Search for "Google Drive API"
   - Click and press "Enable"

### Step 2: Create Credentials

**For Web Application (Recommended):**

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Configure OAuth consent screen (if not done):
   - User Type: External
   - App name: "Barrier Duty Volunteer System"
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `https://www.googleapis.com/auth/spreadsheets`
   - Test users: Add volunteer emails

4. Create OAuth Client ID:
   - Application type: Web application
   - Name: "Barrier Duty Web Client"
   - Authorized JavaScript origins:
     - `https://rifaterdemsahin.github.io`
     - `http://localhost:8000` (for testing)
   - Authorized redirect URIs:
     - `https://rifaterdemsahin.github.io/barrier-duty/oauth2callback`
     - `http://localhost:8000/oauth2callback`

5. Save the **Client ID** and **Client Secret**

**For Service Account (Server-side):**

1. Click "Create Credentials" → "Service Account"
2. Name: "barrier-duty-service"
3. Grant role: "Editor"
4. Create and download JSON key file
5. Share your Google Sheet with the service account email

### Step 3: Required Scopes

Add these OAuth 2.0 scopes:

```
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/drive.readonly
```

For read-only access (safer):
```
https://www.googleapis.com/auth/spreadsheets.readonly
```

---

## Authentication Methods

### Method 1: OAuth 2.0 for Web (Client-side)

**Configuration file: `config.js`**

```javascript
const GOOGLE_CONFIG = {
  CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  API_KEY: 'YOUR_API_KEY', // Optional for public sheets
  DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets.readonly'
};
```

**Initialize Google API:**

```javascript
function initGoogleAPI() {
  gapi.load('client:auth2', () => {
    gapi.client.init({
      apiKey: GOOGLE_CONFIG.API_KEY,
      clientId: GOOGLE_CONFIG.CLIENT_ID,
      discoveryDocs: GOOGLE_CONFIG.DISCOVERY_DOCS,
      scope: GOOGLE_CONFIG.SCOPES
    }).then(() => {
      console.log('Google API initialized');
      // Check if user is already signed in
      const authInstance = gapi.auth2.getAuthInstance();
      if (authInstance.isSignedIn.get()) {
        loadSheetData();
      }
    }).catch(error => {
      console.error('Error initializing Google API:', error);
    });
  });
}
```

**Sign In Function:**

```javascript
function signInToGoogle() {
  const authInstance = gapi.auth2.getAuthInstance();
  authInstance.signIn().then(() => {
    console.log('User signed in');
    loadSheetData();
  }).catch(error => {
    console.error('Error signing in:', error);
  });
}

function signOutFromGoogle() {
  const authInstance = gapi.auth2.getAuthInstance();
  authInstance.signOut();
}
```

### Method 2: Service Account (Server-side)

**Node.js Example:**

```javascript
const { google } = require('googleapis');
const credentials = require('./service-account-key.json');

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
  return await auth.getClient();
}

async function getSheetsClient() {
  const auth = await getAuthClient();
  return google.sheets({ version: 'v4', auth });
}
```

### Method 3: API Key (Public Read-only)

For public sheets only:

```javascript
const API_KEY = 'YOUR_API_KEY';
const SHEET_ID = 'YOUR_SHEET_ID';

async function readPublicSheet(range) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.values;
  } catch (error) {
    console.error('Error reading sheet:', error);
    return null;
  }
}
```

---

## API Endpoints

### Base URL
```
https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}
```

### Common Operations

#### 1. Read Data (GET)
```
GET /values/{range}
```

**Example:**
```javascript
// Read volunteers data
const range = 'Volunteers!A2:K100';
gapi.client.sheets.spreadsheets.values.get({
  spreadsheetId: SHEET_ID,
  range: range
}).then(response => {
  const values = response.result.values;
  console.log('Volunteer data:', values);
});
```

#### 2. Write Data (POST/PUT)
```
POST /values/{range}:append
PUT /values/{range}
```

**Example - Append:**
```javascript
// Add new availability update
const values = [
  [new Date().toISOString(), 'John Doe', 'john@example.com', 
   '2026-02-20', '2026-02-20', 'Unavailable', 'Sick', 'New']
];

gapi.client.sheets.spreadsheets.values.append({
  spreadsheetId: SHEET_ID,
  range: 'AvailabilityUpdates!A:L',
  valueInputOption: 'USER_ENTERED',
  resource: {
    values: values
  }
}).then(response => {
  console.log('Update submitted:', response.result);
});
```

**Example - Update:**
```javascript
// Update specific cell
gapi.client.sheets.spreadsheets.values.update({
  spreadsheetId: SHEET_ID,
  range: 'Schedule!F5',
  valueInputOption: 'USER_ENTERED',
  resource: {
    values: [['Confirmed']]
  }
});
```

#### 3. Batch Operations
```
POST /values:batchGet
POST /values:batchUpdate
```

**Example:**
```javascript
// Read multiple ranges at once
gapi.client.sheets.spreadsheets.values.batchGet({
  spreadsheetId: SHEET_ID,
  ranges: ['Volunteers!B2:C100', 'Schedule!A2:K100']
}).then(response => {
  const volunteers = response.result.valueRanges[0].values;
  const schedule = response.result.valueRanges[1].values;
});
```

#### 4. Formatting (for conditional formatting)
```
POST /batchUpdate
```

#### 5. Search/Filter
Use in JavaScript after fetching:
```javascript
const volunteers = await fetchVolunteers();
const activeVolunteers = volunteers.filter(v => v[6] === 'Active');
```

---

## JavaScript Integration

### Complete Integration Example

**1. Create `google-sheets-api.js`:**

```javascript
/**
 * Google Sheets API Integration for Barrier Duty
 * Handles all interactions with Google Sheets
 */

class BarrierDutyAPI {
  constructor(sheetId, config) {
    this.sheetId = sheetId;
    this.config = config;
    this.isInitialized = false;
  }

  // Initialize the Google API
  async init() {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: this.config.API_KEY,
            clientId: this.config.CLIENT_ID,
            discoveryDocs: this.config.DISCOVERY_DOCS,
            scope: this.config.SCOPES
          });
          this.isInitialized = true;
          console.log('Google Sheets API initialized');
          resolve();
        } catch (error) {
          console.error('Failed to initialize API:', error);
          reject(error);
        }
      });
    });
  }

  // Check if user is signed in
  isSignedIn() {
    if (!this.isInitialized) return false;
    const authInstance = gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  }

  // Sign in user
  async signIn() {
    const authInstance = gapi.auth2.getAuthInstance();
    return await authInstance.signIn();
  }

  // Sign out user
  signOut() {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut();
  }

  // Fetch volunteers
  async getVolunteers() {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Volunteers!A2:K100'
      });
      
      return this._parseVolunteers(response.result.values || []);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
      throw error;
    }
  }

  // Fetch schedule
  async getSchedule(startDate = null, endDate = null) {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Schedule!A2:K100'
      });
      
      let schedule = this._parseSchedule(response.result.values || []);
      
      // Filter by date if provided
      if (startDate) {
        schedule = schedule.filter(s => new Date(s.date) >= new Date(startDate));
      }
      if (endDate) {
        schedule = schedule.filter(s => new Date(s.date) <= new Date(endDate));
      }
      
      return schedule;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  }

  // Submit availability update
  async submitAvailabilityUpdate(data) {
    try {
      const values = [[
        '', // Update ID (auto-generated)
        new Date().toISOString(),
        data.volunteerName,
        data.email,
        data.dateFrom,
        data.dateTo,
        data.updateType,
        data.reason || '',
        'New', // Status
        '', // Processed By
        '', // Processed Date
        '' // Notes
      ]];

      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: this.sheetId,
        range: 'AvailabilityUpdates!A:L',
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        resource: { values: values }
      });

      console.log('Availability update submitted:', response.result);
      return response.result;
    } catch (error) {
      console.error('Error submitting update:', error);
      throw error;
    }
  }

  // Update schedule status
  async updateScheduleStatus(scheduleId, status) {
    try {
      // First, find the row with this schedule ID
      const schedule = await this.getSchedule();
      const rowIndex = schedule.findIndex(s => s.scheduleId === scheduleId);
      
      if (rowIndex === -1) {
        throw new Error('Schedule entry not found');
      }

      const cellRange = `Schedule!F${rowIndex + 2}`; // +2 for header and 0-index
      
      const response = await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.sheetId,
        range: cellRange,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [[status]]
        }
      });

      return response.result;
    } catch (error) {
      console.error('Error updating schedule status:', error);
      throw error;
    }
  }

  // Helper: Parse volunteers data
  _parseVolunteers(rows) {
    return rows.map(row => ({
      id: row[0] || '',
      fullName: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      childLeavingYear: row[4] || '',
      joinDate: row[5] || '',
      activeStatus: row[6] || '',
      totalShifts: parseInt(row[7]) || 0,
      preferredShifts: row[8] || '',
      availableDays: row[9] || '',
      notes: row[10] || ''
    }));
  }

  // Helper: Parse schedule data
  _parseSchedule(rows) {
    return rows.map(row => ({
      scheduleId: row[0] || '',
      date: row[1] || '',
      dayOfWeek: row[2] || '',
      volunteerName: row[3] || '',
      timeSlot: row[4] || '',
      status: row[5] || '',
      confirmedDate: row[6] || '',
      lastUpdated: row[7] || '',
      substitute: row[8] || '',
      weatherAlert: row[9] === 'TRUE',
      notes: row[10] || ''
    }));
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.sheetId,
        range: 'Dashboard!B1:B6'
      });
      
      const values = response.result.values || [];
      return {
        totalActiveVolunteers: parseInt(values[0]?.[0]) || 0,
        totalShiftsThisWeek: parseInt(values[1]?.[0]) || 0,
        pendingConfirmations: parseInt(values[2]?.[0]) || 0,
        coverageRate: parseFloat(values[3]?.[0]) || 0,
        unprocessedUpdates: parseInt(values[4]?.[0]) || 0,
        emailsSentThisWeek: parseInt(values[5]?.[0]) || 0
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarrierDutyAPI;
}
```

**2. Update `script.js` to use the API:**

```javascript
// At the top of script.js
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // Get from Sheet URL
const api = new BarrierDutyAPI(SHEET_ID, GOOGLE_CONFIG);

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  try {
    await api.init();
    
    // Load real data if signed in
    if (api.isSignedIn()) {
      await loadRealTimeData();
    }
  } catch (error) {
    console.error('Failed to initialize Google API:', error);
  }
});

async function loadRealTimeData() {
  try {
    // Load volunteers
    const volunteers = await api.getVolunteers();
    updateVolunteersDisplay(volunteers);
    
    // Load schedule
    const schedule = await api.getSchedule();
    updateRotaDisplay(schedule);
    
    // Load dashboard stats
    const stats = await api.getDashboardStats();
    updateDashboardDisplay(stats);
  } catch (error) {
    console.error('Error loading data:', error);
  }
}
```

---

## Security Considerations

### 1. API Key Protection

**❌ NEVER expose API keys in client-side code for write operations**

**✅ Use OAuth 2.0 for user authentication**

**✅ Use Service Accounts for server-side operations**

### 2. Limit Scopes

Use the most restrictive scope possible:
- Read-only when possible: `spreadsheets.readonly`
- Specific sheet access only

### 3. CORS Configuration

Ensure your domain is authorized in Google Cloud Console:
- Add to "Authorized JavaScript origins"
- Whitelist specific domains only

### 4. Rate Limiting

Google Sheets API has quotas:
- 100 requests per 100 seconds per user
- 500 requests per 100 seconds per project

**Implement caching:**
```javascript
class CachedAPI extends BarrierDutyAPI {
  constructor(sheetId, config, cacheDuration = 60000) {
    super(sheetId, config);
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
  }

  async getSchedule(startDate, endDate) {
    const cacheKey = `schedule-${startDate}-${endDate}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const data = await super.getSchedule(startDate, endDate);
    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }
}
```

### 5. Input Validation

Always validate user input before sending to API:
```javascript
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validateDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}
```

---

## Error Handling

### Comprehensive Error Handler

```javascript
class APIError extends Error {
  constructor(message, code, details) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.details = details;
  }
}

async function handleAPICall(apiFunction, errorMessage) {
  try {
    return await apiFunction();
  } catch (error) {
    console.error(errorMessage, error);
    
    if (error.status === 401) {
      throw new APIError('Authentication required', 401, error);
    } else if (error.status === 403) {
      throw new APIError('Permission denied', 403, error);
    } else if (error.status === 429) {
      throw new APIError('Rate limit exceeded', 429, error);
    } else if (error.status === 404) {
      throw new APIError('Sheet or range not found', 404, error);
    } else {
      throw new APIError('API call failed', error.status || 500, error);
    }
  }
}

// Usage
try {
  const volunteers = await handleAPICall(
    () => api.getVolunteers(),
    'Failed to fetch volunteers'
  );
} catch (error) {
  if (error instanceof APIError) {
    // Show user-friendly message
    alert(`Error: ${error.message}`);
    
    if (error.code === 401) {
      // Redirect to sign in
      api.signIn();
    }
  }
}
```

---

## Testing

### Test the Integration

1. **Test Authentication:**
```javascript
console.log('Signed in:', api.isSignedIn());
```

2. **Test Read Operations:**
```javascript
api.getVolunteers().then(volunteers => {
  console.log('Volunteers:', volunteers);
});
```

3. **Test Write Operations:**
```javascript
api.submitAvailabilityUpdate({
  volunteerName: 'Test User',
  email: 'test@example.com',
  dateFrom: '2026-02-20',
  dateTo: '2026-02-20',
  updateType: 'Unavailable',
  reason: 'Testing'
}).then(result => {
  console.log('Update submitted:', result);
});
```

---

## Deployment Checklist

- [ ] Google Cloud Project created
- [ ] Google Sheets API enabled
- [ ] OAuth 2.0 credentials configured
- [ ] Authorized origins and redirect URIs set
- [ ] Config file created with credentials
- [ ] API integration code added to project
- [ ] Error handling implemented
- [ ] Rate limiting and caching in place
- [ ] Security review completed
- [ ] Testing completed on staging
- [ ] Production deployment

## Support

For issues with:
- **Google Sheets API:** [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- **OAuth 2.0:** [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- **JavaScript Client:** [Google API JavaScript Client](https://github.com/google/google-api-javascript-client)
