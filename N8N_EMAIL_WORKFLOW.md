# n8n Email Notification Workflow Setup Guide

## Overview
This guide explains how to set up an n8n workflow for automated email notifications in the Barrier Duty Volunteer Management System. The workflow sends emails to volunteers when they need to update their availability or when there are schedule changes.

## Table of Contents
1. [n8n Installation](#n8n-installation)
2. [Workflow Architecture](#workflow-architecture)
3. [Workflow Setup](#workflow-setup)
4. [Email Templates](#email-templates)
5. [Testing](#testing)
6. [Deployment](#deployment)

---

## n8n Installation

### Option 1: Cloud Hosting (Easiest)
1. Sign up at [n8n.cloud](https://n8n.cloud/)
2. Create a new workflow instance
3. No local installation required

### Option 2: Self-Hosted with Docker
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

Access at: `http://localhost:5678`

### Option 3: npm Installation
```bash
npm install n8n -g
n8n start
```

---

## Workflow Architecture

The system consists of three main workflows:

### 1. **Availability Request Workflow**
Sends emails to volunteers when they're assigned to a shift that needs confirmation.

**Trigger:** Webhook from Google Sheets (via Apps Script) or manual trigger

**Flow:**
```
Webhook Trigger
    ↓
Check Schedule Status
    ↓
Get Volunteer Email
    ↓
Generate Update Link
    ↓
Send Email with Link
    ↓
Log to Email Log Sheet
```

### 2. **Reminder Workflow**
Sends daily reminders for upcoming unconfirmed shifts.

**Trigger:** Cron Schedule (Daily at 7 AM)

**Flow:**
```
Cron Trigger
    ↓
Query Google Sheets (Pending Shifts)
    ↓
Filter: Next 7 Days
    ↓
For Each Volunteer
    ↓
Send Reminder Email
    ↓
Log to Email Log Sheet
```

### 3. **Update Confirmation Workflow**
Sends confirmation when volunteer submits an availability update.

**Trigger:** Webhook from update form submission

**Flow:**
```
Webhook Trigger
    ↓
Parse Form Data
    ↓
Append to Google Sheets
    ↓
Send Confirmation Email
    ↓
Notify Admin
    ↓
Log to Email Log Sheet
```

---

## Workflow Setup

### Workflow 1: Availability Request Email

#### Step 1: Create Webhook Trigger

1. Add "Webhook" node
2. Configure:
   - **Webhook Name:** `availability-request`
   - **Method:** POST
   - **Path:** `availability-request`
   - **Response:** Immediately
3. Save and copy the webhook URL

**Example Webhook URL:**
```
https://your-n8n-instance.com/webhook/availability-request
```

#### Step 2: Add Google Sheets Node (Get Volunteer Email)

1. Add "Google Sheets" node
2. Configure:
   - **Authentication:** OAuth2
   - **Operation:** Lookup
   - **Document:** Select your "Barrier Duty Management" sheet
   - **Sheet:** Volunteers
   - **Lookup Column:** Full Name
   - **Lookup Value:** `{{ $json.volunteerName }}`
   - **Return Column:** Email

#### Step 3: Add Function Node (Generate Update Link)

1. Add "Function" node
2. Code:
```javascript
// Get data from webhook
const volunteerName = $input.first().json.volunteerName;
const volunteerEmail = $input.first().json.volunteerEmail;
const scheduleId = $input.first().json.scheduleId;
const date = $input.first().json.date;
const timeSlot = $input.first().json.timeSlot;

// Generate update link with parameters
const baseUrl = 'https://rifaterdemsahin.github.io/barrier-duty/update-availability.html';
const updateLink = `${baseUrl}?name=${encodeURIComponent(volunteerName)}&email=${encodeURIComponent(volunteerEmail)}&date=${date}&scheduleId=${scheduleId}`;

// Format date for display
const dateObj = new Date(date);
const formattedDate = dateObj.toLocaleDateString('en-US', { 
  weekday: 'long', 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
});

return {
  json: {
    volunteerName,
    volunteerEmail,
    scheduleId,
    date,
    formattedDate,
    timeSlot,
    updateLink
  }
};
```

#### Step 4: Add Email Node (Send Email)

1. Add "Send Email" node (or Gmail/SMTP)
2. Configure for **Gmail:**
   - **Authentication:** OAuth2
   - **To:** `{{ $json.volunteerEmail }}`
   - **Subject:** `Action Required: Confirm Your Barrier Duty for {{ $json.formattedDate }}`
   - **Email Type:** HTML
   - **Message:**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚧 Barrier Duty Reminder</h1>
        </div>
        <div class="content">
            <p>Hello {{ $json.volunteerName }},</p>
            
            <p>You have been assigned to a barrier duty shift that needs confirmation:</p>
            
            <div class="details">
                <p><strong>📅 Date:</strong> {{ $json.formattedDate }}</p>
                <p><strong>🕐 Time:</strong> {{ $json.timeSlot }}</p>
                <p><strong>📍 Location:</strong> School Crossing</p>
            </div>
            
            <p><strong>If you cannot make this shift,</strong> please click the button below to update your availability:</p>
            
            <p style="text-align: center;">
                <a href="{{ $json.updateLink }}" class="button">
                    📝 Update My Availability
                </a>
            </p>
            
            <p>The link above will take you to a quick form where you can:</p>
            <ul>
                <li>Mark yourself as unavailable</li>
                <li>Request a substitute</li>
                <li>Provide a reason for your absence</li>
            </ul>
            
            <p><strong>Important:</strong> If we don't hear from you within 48 hours, we'll assume you're confirmed for this shift.</p>
            
            <p>Thank you for helping keep our children safe! 🚸</p>
            
            <p>Best regards,<br>
            Barrier Duty Admin Team</p>
        </div>
        <div class="footer">
            <p>This is an automated message from the Barrier Duty Volunteer Management System.</p>
            <p>Please do not reply to this email. If you have questions, contact your administrator.</p>
        </div>
    </div>
</body>
</html>
```

#### Step 5: Add Google Sheets Node (Log Email)

1. Add "Google Sheets" node
2. Configure:
   - **Operation:** Append
   - **Document:** Select your sheet
   - **Sheet:** Email Log
   - **Columns:**
     - Email ID: `=TEXT(ROW()-1,"E0000")` (auto in sheet)
     - Sent Timestamp: `{{ $now.toISO() }}`
     - Recipient Name: `{{ $json.volunteerName }}`
     - Recipient Email: `{{ $json.volunteerEmail }}`
     - Email Type: `Availability Request`
     - Subject: Email subject from previous node
     - Schedule ID: `{{ $json.scheduleId }}`
     - Delivery Status: `Sent`

---

### Workflow 2: Daily Reminder Workflow

#### Step 1: Create Cron Trigger

1. Add "Cron" node
2. Configure:
   - **Mode:** Every Day
   - **Hour:** 7
   - **Minute:** 0
   - **Timezone:** Your timezone

#### Step 2: Add Google Sheets Node (Get Pending Shifts)

1. Add "Google Sheets" node
2. Configure:
   - **Operation:** Read
   - **Document:** Your sheet
   - **Sheet:** Schedule
   - **Range:** A2:K100

#### Step 3: Add Function Node (Filter Pending Shifts)

1. Add "Function" node
2. Code:
```javascript
const items = $input.all();
const today = new Date();
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

const pendingShifts = [];

for (const item of items) {
  const shiftDate = new Date(item.json.Date);
  const status = item.json.Status;
  const volunteerName = item.json['Volunteer Name'];
  
  // Check if shift is in next 7 days and status is Pending
  if (shiftDate >= today && shiftDate <= nextWeek && status === 'Pending' && volunteerName) {
    pendingShifts.push({
      json: {
        scheduleId: item.json['Schedule ID'],
        date: item.json.Date,
        dayOfWeek: item.json['Day of Week'],
        volunteerName: volunteerName,
        timeSlot: item.json['Time Slot'],
        status: status
      }
    });
  }
}

return pendingShifts;
```

#### Step 4: Add Split In Batches Node

1. Add "Split In Batches" node
2. Configure:
   - **Batch Size:** 1

#### Step 5-7: Add Same Nodes as Workflow 1
- Get Volunteer Email (Google Sheets Lookup)
- Generate Update Link (Function)
- Send Email
- Log to Email Log Sheet

---

### Workflow 3: Update Confirmation Workflow

#### Step 1: Create Webhook Trigger

1. Add "Webhook" node
2. Configure:
   - **Webhook Name:** `availability-update`
   - **Method:** POST
   - **Path:** `availability-update`

#### Step 2: Add Google Sheets Node (Append Update)

1. Add "Google Sheets" node
2. Configure:
   - **Operation:** Append
   - **Sheet:** Availability Updates
   - **Data:**
     - Timestamp: `{{ $json.submittedAt }}`
     - Volunteer Name: `{{ $json.volunteerName }}`
     - Email: `{{ $json.email }}`
     - Date From: `{{ $json.dateFrom }}`
     - Date To: `{{ $json.dateTo }}`
     - Update Type: `{{ $json.updateType }}`
     - Reason: `{{ $json.reason }}`
     - Status: `New`

#### Step 3: Add Email Node (Confirmation to Volunteer)

1. Add "Send Email" node
2. Configure:
   - **To:** `{{ $json.email }}`
   - **Subject:** `Confirmation: Availability Update Received`
   - **Message:**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-box { background: #d1fae5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ Update Received</h1>
        </div>
        <div class="content">
            <p>Hello {{ $json.volunteerName }},</p>
            
            <div class="success-box">
                <p><strong>Thank you for updating your availability!</strong></p>
            </div>
            
            <p>We have received your availability update with the following details:</p>
            
            <div class="details">
                <p><strong>Update Type:</strong> {{ $json.updateType }}</p>
                <p><strong>Date Range:</strong> {{ $json.dateFrom }} to {{ $json.dateTo }}</p>
                <p><strong>Reason:</strong> {{ $json.reason }}</p>
                <p><strong>Submitted:</strong> {{ $now.toFormat('MMMM d, yyyy at h:mm a') }}</p>
            </div>
            
            <p>What happens next:</p>
            <ol>
                <li>An administrator will review your update within 24 hours</li>
                <li>The schedule will be adjusted as needed</li>
                <li>You'll receive a confirmation email once processed</li>
            </ol>
            
            <p>If you have any questions or need to make changes, please contact the administrator.</p>
            
            <p>Thank you for your continued support! 🚸</p>
            
            <p>Best regards,<br>
            Barrier Duty Admin Team</p>
        </div>
        <div class="footer">
            <p>This is an automated confirmation from the Barrier Duty Volunteer Management System.</p>
        </div>
    </div>
</body>
</html>
```

#### Step 4: Add Email Node (Notify Admin)

1. Add another "Send Email" node
2. Configure:
   - **To:** `admin@example.com` (your admin email)
   - **Subject:** `New Availability Update - {{ $json.volunteerName }}`
   - **Message:**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .alert-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔔 New Availability Update</h1>
        </div>
        <div class="content">
            <div class="alert-box">
                <p><strong>Action Required:</strong> A volunteer has submitted an availability update that requires your review.</p>
            </div>
            
            <div class="details">
                <h3>Volunteer Information</h3>
                <p><strong>Name:</strong> {{ $json.volunteerName }}</p>
                <p><strong>Email:</strong> {{ $json.email }}</p>
                
                <h3>Update Details</h3>
                <p><strong>Type:</strong> {{ $json.updateType }}</p>
                <p><strong>Date Range:</strong> {{ $json.dateFrom }} to {{ $json.dateTo }}</p>
                <p><strong>Reason:</strong> {{ $json.reason }}</p>
                <p><strong>Schedule ID:</strong> {{ $json.scheduleId }}</p>
                <p><strong>Submitted:</strong> {{ $now.toFormat('MMMM d, yyyy at h:mm a') }}</p>
            </div>
            
            <p style="text-align: center;">
                <a href="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID" class="button">
                    📊 Review in Google Sheets
                </a>
            </p>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
                <li>Review the update in the "Availability Updates" sheet</li>
                <li>Update the schedule as needed</li>
                <li>Mark the update as "Reviewed" or "Applied"</li>
                <li>Contact the volunteer if additional information is needed</li>
            </ol>
        </div>
    </div>
</body>
</html>
```

#### Step 5: Log to Email Log Sheet (Both Emails)

Add two Google Sheets nodes to log both the volunteer confirmation and admin notification.

---

## Email Templates

### Template Variables

All templates can use these variables:

**Volunteer Info:**
- `{{ $json.volunteerName }}`
- `{{ $json.volunteerEmail }}`

**Schedule Info:**
- `{{ $json.scheduleId }}`
- `{{ $json.date }}`
- `{{ $json.formattedDate }}`
- `{{ $json.dayOfWeek }}`
- `{{ $json.timeSlot }}`

**Update Info:**
- `{{ $json.updateType }}`
- `{{ $json.dateFrom }}`
- `{{ $json.dateTo }}`
- `{{ $json.reason }}`

**System:**
- `{{ $now.toISO() }}` - Current timestamp
- `{{ $now.toFormat('MMMM d, yyyy') }}` - Formatted date
- `{{ $json.updateLink }}` - Generated update link

---

## Testing

### Test Workflow 1: Availability Request

1. Use the "Execute Workflow" button in n8n
2. Or send test webhook:

```bash
curl -X POST https://your-n8n-instance.com/webhook/availability-request \
  -H "Content-Type: application/json" \
  -d '{
    "scheduleId": "S0001",
    "date": "2026-02-20",
    "dayOfWeek": "Thursday",
    "volunteerName": "Test Volunteer",
    "volunteerEmail": "test@example.com",
    "timeSlot": "Morning (8:00-8:30 AM)",
    "status": "Pending"
  }'
```

### Test Workflow 2: Daily Reminder

1. Click "Execute Workflow" manually
2. Check execution logs for errors
3. Verify emails sent to pending volunteers

### Test Workflow 3: Update Confirmation

1. Submit test form on update-availability.html
2. Check Google Sheets for new entry
3. Verify confirmation email received
4. Verify admin notification email

---

## Deployment

### Production Checklist

- [ ] All workflows activated
- [ ] Webhook URLs configured in Google Sheets
- [ ] Webhook URL configured in update-availability.html
- [ ] Email credentials configured (Gmail OAuth or SMTP)
- [ ] Admin email address updated
- [ ] Test all workflows with real data
- [ ] Monitor executions for first week
- [ ] Set up error notifications
- [ ] Document troubleshooting procedures

### Webhook URLs to Configure

1. **In Google Apps Script:**
```javascript
PropertiesService.getScriptProperties()
  .setProperty('N8N_WEBHOOK_URL', 'https://your-n8n/webhook/availability-request');
```

2. **In update-availability.html:**
```javascript
const webhookUrl = 'https://your-n8n/webhook/availability-update';
```

### Monitoring

**n8n Executions:**
- Check "Executions" tab daily
- Set up email alerts for failed workflows
- Review error logs weekly

**Google Sheets Email Log:**
- Monitor delivery status
- Check for bounced emails
- Track open and click rates

---

## Troubleshooting

### Common Issues

**1. Emails Not Sending**
- Check email credentials in n8n
- Verify SMTP settings
- Check spam folder
- Review execution logs

**2. Webhook Not Triggering**
- Verify webhook URL is correct
- Check firewall/security settings
- Test with curl command
- Review n8n logs

**3. Google Sheets Not Updating**
- Check OAuth authorization
- Verify sheet name and range
- Check data format matches columns
- Review API quotas

**4. Missing Volunteer Emails**
- Verify volunteer exists in Volunteers sheet
- Check email column spelling
- Review lookup configuration
- Test with known volunteer

---

## Advanced Features

### Feature 1: Smart Scheduling

Add logic to suggest alternative volunteers:

```javascript
// In availability request workflow
// After determining volunteer is unavailable
// Query other volunteers with same preferred time slot
// Filter by available days
// Send substitute request to top matches
```

### Feature 2: Escalation

Add conditional logic:

```javascript
// If no response after 48 hours
// Send reminder email
// If still no response after 72 hours
// Notify admin
// Auto-search for substitute
```

### Feature 3: Weather Integration

Add HTTP Request node:

```javascript
// Fetch weather forecast
// If severe weather predicted
// Send early morning notification
// Update schedule with weather alert flag
```

---

## Support Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community Forum](https://community.n8n.io/)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Email Template Best Practices](https://www.campaignmonitor.com/resources/guides/email-templates/)

## Security Notes

1. **Never expose webhook URLs publicly** - They should only be called from trusted sources
2. **Use OAuth for email** - More secure than storing passwords
3. **Validate webhook data** - Check for required fields and valid formats
4. **Rate limit webhooks** - Prevent abuse
5. **Use HTTPS only** - Never HTTP for webhooks
6. **Rotate credentials** - Change passwords and tokens regularly
