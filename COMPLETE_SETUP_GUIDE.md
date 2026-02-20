# Complete Setup Guide for Google Sheets Integration and Email System

This guide provides step-by-step instructions to set up the complete Barrier Duty system with Google Sheets integration and automated email notifications.

## Prerequisites

- Google Account (for Google Sheets and API)
- Access to n8n (cloud or self-hosted)
- GitHub account (for hosting the web pages)
- Basic understanding of web development and APIs

## Setup Overview

The complete setup involves 4 main components:

1. **Google Sheets** - Data storage and management
2. **Google Sheets API** - Programmatic access to data
3. **n8n Workflows** - Automated email notifications
4. **Web Pages** - Volunteer interface

---

## Part 1: Google Sheets Setup (30 minutes)

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Barrier Duty Management"
3. Create 5 sheets with these exact names:
   - `Volunteers`
   - `Schedule`
   - `Availability Updates`
   - `Email Log`
   - `Dashboard`

### Step 2: Set Up Sheet Structures

Follow the detailed structure in [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md):

**Key sheets to configure:**
- **Volunteers**: Columns A-K with volunteer information
- **Schedule**: Columns A-K with rota assignments
- **Availability Updates**: Columns A-L for tracking updates
- **Email Log**: Columns A-L for email tracking
- **Dashboard**: Summary metrics and statistics

### Step 3: Apply Formulas

Copy the formulas from [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) into:
- Column A in each sheet (for auto-incrementing IDs)
- Column H in Volunteers sheet (for counting shifts)
- Dashboard sheet (for all metrics)

### Step 4: Set Up Data Validation

Apply dropdown validations:
- Volunteers sheet: Active Status, Preferred Shifts
- Schedule sheet: Volunteer Name, Time Slot, Status
- Availability Updates sheet: Update Type, Status
- Email Log sheet: Email Type, Delivery Status

### Step 5: Create Named Ranges

1. Click Data → Named ranges
2. Create: `VolunteersList` = `Volunteers!B2:B100`
3. Use this range in Schedule and other sheets

### Step 6: Add Sample Data

Add at least 5-10 volunteers and some schedule entries for testing.

**Checklist:**
- [ ] 5 sheets created with correct names
- [ ] All column headers added
- [ ] Formulas applied and working
- [ ] Data validation rules set
- [ ] Named ranges created
- [ ] Sample data added

---

## Part 2: Google Apps Script Setup (20 minutes)

### Step 1: Open Script Editor

1. In your Google Sheet, click Extensions → Apps Script
2. Delete the default code

### Step 2: Add Custom Functions

Copy all the script functions from [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md):
- `sendAvailabilityRequestEmail()`
- `triggerN8nWebhook()`
- `onFormSubmit()`
- `sendAdminNotification()`
- `autoUpdateScheduleStatus()`
- `getVolunteerEmail()`

### Step 3: Save and Authorize

1. Click "Save" (disk icon)
2. Name the project: "Barrier Duty Automation"
3. Click "Run" → Select `sendAvailabilityRequestEmail`
4. Authorize the script (allow access to sheets and email)

### Step 4: Set Script Properties

1. Click Project Settings (gear icon)
2. Click "Script Properties"
3. Add properties:
   - Key: `N8N_WEBHOOK_URL` | Value: (will add in Part 3)
   - Key: `ADMIN_EMAIL` | Value: your-admin-email@example.com

### Step 5: Create Time-based Triggers

1. Click "Triggers" (clock icon)
2. Add trigger 1:
   - Function: `sendAvailabilityRequestEmail`
   - Event: Time-driven
   - Type: Day timer
   - Time: 7 AM to 8 AM
3. Add trigger 2:
   - Function: `autoUpdateScheduleStatus`
   - Event: Time-driven
   - Type: Day timer
   - Time: 11 PM to 12 AM

**Checklist:**
- [ ] Script functions added
- [ ] Script saved and authorized
- [ ] Script properties configured
- [ ] Time-based triggers created
- [ ] Test run successful

---

## Part 3: n8n Workflow Setup (45 minutes)

### Step 1: Set Up n8n

**Option A: Cloud (Easiest)**
1. Sign up at https://n8n.cloud
2. Create a new workflow

**Option B: Self-hosted**
```bash
docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```

### Step 2: Create Workflow 1 - Availability Request

Follow [N8N_EMAIL_WORKFLOW.md](N8N_EMAIL_WORKFLOW.md) to create:

1. **Webhook Trigger** node
   - Copy the webhook URL (you'll need it later)
2. **Google Sheets** node (lookup volunteer email)
3. **Function** node (generate update link)
4. **Send Email** node (send request email)
5. **Google Sheets** node (log email)

Save and activate the workflow.

### Step 3: Create Workflow 2 - Daily Reminders

Create the second workflow:

1. **Cron** node (daily at 7 AM)
2. **Google Sheets** node (read pending shifts)
3. **Function** node (filter next 7 days)
4. **Split In Batches** node
5. Same nodes as Workflow 1

Save and activate the workflow.

### Step 4: Create Workflow 3 - Update Confirmation

Create the third workflow:

1. **Webhook Trigger** node
   - Copy this webhook URL too
2. **Google Sheets** node (append to Availability Updates)
3. **Send Email** node (confirmation to volunteer)
4. **Send Email** node (notify admin)
5. **Google Sheets** nodes (log both emails)

Save and activate the workflow.

### Step 5: Update Webhook URLs

Go back to Google Apps Script:
1. Update Script Properties
2. Set `N8N_WEBHOOK_URL` to your Workflow 1 webhook URL

**Checklist:**
- [ ] n8n instance running
- [ ] 3 workflows created and activated
- [ ] Gmail/SMTP configured for email sending
- [ ] Webhook URLs copied
- [ ] Google Sheets access authorized
- [ ] Test execution successful

---

## Part 4: Google Sheets API Setup (30 minutes)

### Step 1: Enable API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Barrier Duty Management"
3. Enable APIs:
   - Google Sheets API
   - Google Drive API

### Step 2: Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Configure OAuth consent screen:
   - User Type: External
   - App name: "Barrier Duty Volunteer System"
   - Add scopes: `https://www.googleapis.com/auth/spreadsheets`
3. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Name: "Barrier Duty Web Client"
   - Authorized origins: `https://yourusername.github.io`
   - Redirect URIs: `https://yourusername.github.io/barrier-duty/oauth2callback`

### Step 3: Get Sheet ID

1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
3. Copy the `{SHEET_ID}` part

### Step 4: Share Sheet

1. Click "Share" in your Google Sheet
2. Add your service account email (if using service account)
3. Or set to "Anyone with the link can view" for testing

**Checklist:**
- [ ] Google Cloud project created
- [ ] APIs enabled
- [ ] OAuth credentials created
- [ ] Client ID and Client Secret saved
- [ ] Sheet ID copied
- [ ] Sharing permissions set

---

## Part 5: Web Pages Configuration (20 minutes)

### Step 1: Create Config File

Create `config.js` in your repository:

```javascript
// Google Sheets API Configuration
const GOOGLE_CONFIG = {
  CLIENT_ID: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  API_KEY: 'YOUR_API_KEY', // Optional
  DISCOVERY_DOCS: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  SCOPES: 'https://www.googleapis.com/auth/spreadsheets'
};

// Your Google Sheet ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';

// n8n Webhook URLs
const N8N_CONFIG = {
  UPDATE_WEBHOOK: 'https://your-n8n-instance.com/webhook/availability-update'
};
```

### Step 2: Update HTML Files

1. Add this line to `index.html` and `update-availability.html` (before `script.js`):
```html
<script src="config.js"></script>
```

2. Update `update-availability.html`:
   - Find `const webhookUrl = 'YOUR_N8N_WEBHOOK_URL';`
   - Replace with: `const webhookUrl = N8N_CONFIG.UPDATE_WEBHOOK;`

### Step 3: Add API Integration Script (Optional)

If you want live data from Google Sheets:

1. Create the `google-sheets-api.js` file from [API_INTEGRATION.md](API_INTEGRATION.md)
2. Add to `index.html`:
```html
<script src="https://apis.google.com/js/api.js"></script>
<script src="config.js"></script>
<script src="google-sheets-api.js"></script>
<script src="script.js"></script>
```

3. Update `script.js` to use the API for loading real-time data

### Step 4: Test Locally

```bash
# Navigate to your repository
cd /path/to/barrier-duty

# Start local server
python -m http.server 8000

# Open in browser
# http://localhost:8000
```

**Checklist:**
- [ ] config.js created with credentials
- [ ] HTML files updated with script tags
- [ ] Webhook URLs configured
- [ ] Local testing successful
- [ ] All links working

---

## Part 6: GitHub Pages Deployment (10 minutes)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Add Google Sheets integration and email system"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to repository Settings
2. Navigate to Pages
3. Source: GitHub Actions (or main branch)
4. Wait for deployment

### Step 3: Update OAuth Redirect URIs

Go back to Google Cloud Console:
1. Update authorized origins: `https://yourusername.github.io`
2. Update redirect URIs: `https://yourusername.github.io/barrier-duty/oauth2callback`

### Step 4: Test Production

Visit your live site:
```
https://yourusername.github.io/barrier-duty/
```

**Checklist:**
- [ ] Code pushed to GitHub
- [ ] GitHub Pages enabled
- [ ] Site is live
- [ ] OAuth URIs updated for production
- [ ] All features working online

---

## Part 7: Testing Everything (30 minutes)

### Test 1: Manual Form Submission

1. Visit `update-availability.html`
2. Fill in the form
3. Submit
4. Check:
   - [ ] Entry appears in Google Sheets (Availability Updates)
   - [ ] Confirmation email received by volunteer
   - [ ] Admin notification email received
   - [ ] Emails logged in Email Log sheet

### Test 2: Webhook Trigger

```bash
# Test availability request webhook
curl -X POST https://your-n8n/webhook/availability-request \
  -H "Content-Type: application/json" \
  -d '{
    "scheduleId": "S0001",
    "date": "2026-02-20",
    "volunteerName": "Test Volunteer",
    "volunteerEmail": "test@example.com",
    "timeSlot": "Morning (8:00-8:30 AM)"
  }'
```

Check:
- [ ] Email received with update link
- [ ] Link opens update form with prefilled data
- [ ] Email logged in sheet

### Test 3: Daily Reminder

1. Add some pending shifts in Schedule sheet
2. Set dates within next 7 days
3. Manually execute the workflow in n8n
4. Check:
   - [ ] Emails sent to volunteers with pending shifts
   - [ ] Emails contain correct dates and times
   - [ ] Update links work

### Test 4: Google Apps Script

1. Manually run `sendAvailabilityRequestEmail()` in Apps Script
2. Check execution logs
3. Verify webhook was triggered

### Test 5: Auto Status Update

1. Create a schedule entry with past date
2. Set status to "Confirmed"
3. Wait for daily trigger (11 PM) or run manually
4. Check status changed to "Completed"

**Checklist:**
- [ ] Form submission works end-to-end
- [ ] Webhooks trigger correctly
- [ ] Emails send successfully
- [ ] Data logs to Google Sheets
- [ ] Auto-update scripts work
- [ ] All links functional

---

## Part 8: Production Readiness (15 minutes)

### Security

1. **Remove test data** from Google Sheets
2. **Change admin password** in `script.js`
3. **Limit OAuth access** to specific users (in OAuth consent screen)
4. **Use HTTPS only** - Verify all links use HTTPS
5. **Don't commit secrets** - Add `config.js` to `.gitignore`

### Documentation

1. Document the admin workflow
2. Create volunteer user guide
3. Document troubleshooting steps
4. Set up error monitoring

### Backup

1. **Export Google Sheet** as backup
2. **Export n8n workflows** as JSON
3. **Save credentials** securely (password manager)
4. **Document recovery procedures**

### Monitoring

1. Check n8n execution logs daily
2. Review Email Log sheet weekly
3. Monitor Google Apps Script quotas
4. Set up alerts for failed workflows

**Checklist:**
- [ ] Test data removed
- [ ] Security measures implemented
- [ ] config.js added to .gitignore
- [ ] Documentation completed
- [ ] Backups created
- [ ] Monitoring configured
- [ ] Admin trained on system

---

## Common Issues and Solutions

### Issue 1: Emails Not Sending

**Symptoms:** n8n workflow executes but no emails arrive

**Solutions:**
- Check Gmail OAuth authorization in n8n
- Verify email addresses are valid
- Check spam folders
- Review n8n execution logs for errors
- Verify SMTP settings if using custom email

### Issue 2: Google Sheets Not Updating

**Symptoms:** Form submitted but no new row in sheet

**Solutions:**
- Check OAuth authorization in n8n
- Verify sheet name exactly matches
- Check column count matches
- Review API quotas in Google Cloud Console
- Test with Google Sheets API Explorer

### Issue 3: Webhook Not Triggered

**Symptoms:** Script runs but n8n workflow doesn't execute

**Solutions:**
- Verify webhook URL is correct in Script Properties
- Check n8n workflow is activated
- Test webhook with curl command
- Review n8n webhook logs
- Check firewall/network restrictions

### Issue 4: Update Link Doesn't Work

**Symptoms:** Clicking email link shows error

**Solutions:**
- Verify `update-availability.html` is published
- Check URL parameters are encoded correctly
- Ensure page is accessible (not 404)
- Test link in incognito mode
- Check console for JavaScript errors

### Issue 5: Formulas Not Working

**Symptoms:** Calculated columns show errors

**Solutions:**
- Check sheet references match exact sheet names
- Verify named ranges are created
- Review formula syntax
- Check for circular references
- Ensure date formats are consistent

---

## Maintenance Schedule

### Daily
- [ ] Check n8n execution logs
- [ ] Review new availability updates
- [ ] Process pending updates in Google Sheets

### Weekly
- [ ] Review Email Log for delivery issues
- [ ] Check coverage for next week
- [ ] Follow up on unconfirmed shifts
- [ ] Backup Google Sheet

### Monthly
- [ ] Review dashboard metrics
- [ ] Update volunteer list
- [ ] Archive old schedule data
- [ ] Review and optimize workflows
- [ ] Check API usage and quotas

---

## Support and Resources

**Documentation:**
- [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) - Sheet structure and formulas
- [API_INTEGRATION.md](API_INTEGRATION.md) - API setup and usage
- [N8N_EMAIL_WORKFLOW.md](N8N_EMAIL_WORKFLOW.md) - Email automation

**External Resources:**
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [n8n Documentation](https://docs.n8n.io/)
- [Google Apps Script Guide](https://developers.google.com/apps-script)

**Getting Help:**
- Open an issue in the GitHub repository
- Check n8n Community Forum
- Review Google Apps Script documentation
- Consult API documentation

---

## Next Steps

After completing the setup:

1. **Train administrators** on using the system
2. **Create volunteer onboarding** materials
3. **Send welcome email** to all volunteers with update link
4. **Monitor closely** for first 2 weeks
5. **Gather feedback** and iterate
6. **Expand features** based on needs

Congratulations! Your Barrier Duty system is now fully integrated with Google Sheets and automated email notifications. 🎉
