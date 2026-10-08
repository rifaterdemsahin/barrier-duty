# Visual System Overview

## 📊 Barrier Duty System - Complete Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        BARRIER DUTY VOLUNTEER SYSTEM                        │
│                                                                             │
│  🎯 Mission: Safe school crossings through volunteer coordination          │
└────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACES                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📱 Main Website (index.html)                                               │
│  ┌────────────────────────────────────────────────────────────┐            │
│  │  🏠 Home    📅 Rota    👥 Volunteers    🔔 Updates    🔐 Admin │            │
│  │                                                             │            │
│  │  ┌────────────────────────────────────────────┐           │            │
│  │  │  📝 UPDATE AVAILABILITY BUTTON (CTA)        │           │            │
│  │  └──────────────────┬──────────────────────────┘           │            │
│  └────────────────────│──────────────────────────────────────┘            │
│                       │                                                     │
│                       ▼                                                     │
│  📝 Update Form (update-availability.html)                                 │
│  ┌─────────────────────────────────────────────────────────────┐          │
│  │  • Name & Email                                              │          │
│  │  • Update Type (Unavailable/Available/Substitute)            │          │
│  │  • Date Range                                                │          │
│  │  • Reason/Details                                            │          │
│  │  • Submit Button → Webhook                                   │          │
│  └─────────────────────────────────────────────────────────────┘          │
│                                                                              │
└──────────────────────────────────┬───────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INTEGRATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  🔌 Google Sheets API                    🔔 n8n Webhooks                    │
│  ┌──────────────────────┐               ┌──────────────────────┐          │
│  │  OAuth 2.0           │               │  /availability-req   │          │
│  │  Client ID           │               │  /availability-update│          │
│  │  Scopes              │               │  /reminder           │          │
│  └──────────┬───────────┘               └──────────┬───────────┘          │
│             │                                       │                       │
│             ▼                                       ▼                       │
└─────────────┼───────────────────────────────────────┼───────────────────────┘
              │                                       │
              ▼                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA STORAGE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📊 Google Sheets: "Barrier Duty Management"                                │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │                                                                 │        │
│  │  📋 Sheet 1: VOLUNTEERS (11 columns)                           │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ ID | Name | Email | Phone | Year | Status | Shifts | ... │ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • 24 active volunteers                                        │        │
│  │  • Contact information                                         │        │
│  │  • Availability preferences                                    │        │
│  │  • Auto-calculated total shifts                                │        │
│  │                                                                 │        │
│  │  📅 Sheet 2: SCHEDULE (11 columns)                             │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ ID | Date | Day | Volunteer | Time | Status | Notes | ...│ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • Weekly rota assignments                                     │        │
│  │  • Morning (8:00-8:30) & Afternoon (3:00-3:30) slots          │        │
│  │  • Status: Confirmed/Pending/Cancelled/Completed               │        │
│  │  • Conditional formatting by status                            │        │
│  │                                                                 │        │
│  │  ✏️ Sheet 3: AVAILABILITY UPDATES (12 columns)                 │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ ID | Time | Name | Email | Dates | Type | Status | ...   │ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • Tracks all volunteer update requests                        │        │
│  │  • New/Reviewed/Applied status workflow                        │        │
│  │  • Admin processing tracking                                   │        │
│  │                                                                 │        │
│  │  📧 Sheet 4: EMAIL LOG (12 columns)                            │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ ID | Sent | Name | Email | Type | Status | Opened | ...  │ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • All sent emails logged                                      │        │
│  │  • Delivery status tracking                                    │        │
│  │  • Open and click tracking                                     │        │
│  │                                                                 │        │
│  │  📈 Sheet 5: DASHBOARD (Metrics)                               │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ • Active Volunteers: 24                                   │ │        │
│  │  │ • Shifts This Week: 10                                    │ │        │
│  │  │ • Pending Confirmations: 2                                │ │        │
│  │  │ • Coverage Rate: 98%                                      │ │        │
│  │  │ • Unprocessed Updates: 1                                  │ │        │
│  │  │ • Emails Sent This Week: 15                               │ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • Real-time calculated metrics                                │        │
│  │  • Weekly summary queries                                      │        │
│  │                                                                 │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                              │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AUTOMATION LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚙️ Google Apps Script (Runs in Google Sheets)                             │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │                                                                 │        │
│  │  📜 Function: sendAvailabilityRequestEmail()                   │        │
│  │     ├─ Trigger: Time-based (7 AM daily)                        │        │
│  │     ├─ Finds pending shifts in next 7 days                     │        │
│  │     └─ Calls n8n webhook for each                              │        │
│  │                                                                 │        │
│  │  📜 Function: autoUpdateScheduleStatus()                        │        │
│  │     ├─ Trigger: Time-based (11 PM daily)                       │        │
│  │     └─ Marks past confirmed shifts as completed                │        │
│  │                                                                 │        │
│  │  📜 Function: onFormSubmit()                                    │        │
│  │     ├─ Trigger: On new update submission                       │        │
│  │     └─ Notifies admin of new updates                           │        │
│  │                                                                 │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                              │
│                                   │                                          │
│                                   ▼                                          │
│                                                                              │
│  🔄 n8n Workflows (3 Workflows)                                             │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │                                                                 │        │
│  │  🔔 Workflow 1: AVAILABILITY REQUEST                            │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ Webhook → Get Email → Generate Link → Send Email → Log  │ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • Triggered by Apps Script or manual                          │        │
│  │  • Looks up volunteer email                                    │        │
│  │  • Creates update link with pre-filled data                    │        │
│  │  • Sends email with clickable button                           │        │
│  │  • Logs to Email Log sheet                                     │        │
│  │                                                                 │        │
│  │  ⏰ Workflow 2: DAILY REMINDERS                                 │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ Cron → Query Sheet → Filter → Loop → Email → Log        │ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • Runs at 7 AM every day                                      │        │
│  │  • Queries pending shifts                                      │        │
│  │  • Filters next 7 days                                         │        │
│  │  • Sends reminder to each volunteer                            │        │
│  │  • Logs all sent emails                                        │        │
│  │                                                                 │        │
│  │  ✅ Workflow 3: UPDATE CONFIRMATION                             │        │
│  │  ┌──────────────────────────────────────────────────────────┐ │        │
│  │  │ Webhook → Save → Email Volunteer → Email Admin → Log    │ │        │
│  │  └──────────────────────────────────────────────────────────┘ │        │
│  │  • Triggered by form submission                                │        │
│  │  • Saves to Availability Updates sheet                         │        │
│  │  • Confirms receipt to volunteer                               │        │
│  │  • Notifies admin of new update                                │        │
│  │  • Logs both emails                                            │        │
│  │                                                                 │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                              │
└──────────────────────────────┬───────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EMAIL DELIVERY                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📧 Gmail / SMTP Service                                                    │
│  ┌────────────────────────────────────────────────────────────────┐        │
│  │                                                                 │        │
│  │  📨 Email Types:                                                │        │
│  │                                                                 │        │
│  │  1️⃣ Availability Request                                        │        │
│  │     Subject: "Action Required: Confirm Your Barrier Duty"      │        │
│  │     Content: Shift details + Update button                     │        │
│  │                                                                 │        │
│  │  2️⃣ Daily Reminder                                              │        │
│  │     Subject: "Reminder: Barrier Duty Confirmation Needed"      │        │
│  │     Content: Upcoming shifts + Update button                   │        │
│  │                                                                 │        │
│  │  3️⃣ Update Confirmation (to Volunteer)                          │        │
│  │     Subject: "Confirmation: Availability Update Received"      │        │
│  │     Content: Update summary + next steps                       │        │
│  │                                                                 │        │
│  │  4️⃣ Admin Notification                                          │        │
│  │     Subject: "New Availability Update - [Name]"                │        │
│  │     Content: Update details + link to sheet                    │        │
│  │                                                                 │        │
│  └─────────────────────────────────────────────────────────────────┘        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Examples

### Example 1: Volunteer Updates Availability

```
1. Volunteer clicks "Update Availability" on website
   ↓
2. Opens update-availability.html form
   ↓
3. Fills in: Name, Email, Dates, Type, Reason
   ↓
4. Clicks Submit → Triggers n8n webhook
   ↓
5. n8n Workflow 3 executes:
   a. Appends row to "Availability Updates" sheet
   b. Sends confirmation email to volunteer
   c. Sends notification email to admin
   d. Logs both emails to "Email Log" sheet
   ↓
6. Volunteer receives: "✅ Update Received"
7. Admin receives: "🔔 New Update - [Name]"
   ↓
8. Admin reviews in Google Sheets
   ↓
9. Admin updates schedule as needed
```

### Example 2: Daily Automated Reminders

```
1. Clock hits 7:00 AM
   ↓
2. n8n Workflow 2 (Cron trigger) activates
   ↓
3. Queries "Schedule" sheet for:
   • Status = "Pending"
   • Date between today and +7 days
   ↓
4. Finds 3 pending shifts for different volunteers
   ↓
5. For each volunteer:
   a. Looks up email from "Volunteers" sheet
   b. Generates update link with pre-filled data
   c. Sends reminder email with shift details
   d. Logs email to "Email Log" sheet
   ↓
6. 3 volunteers receive reminders with:
   • Their specific shift date/time
   • One-click update button
   • Link to update form
```

### Example 3: Weekly Schedule Update

```
1. Admin opens "Schedule" sheet
   ↓
2. Adds new shifts for next week
   ↓
3. Sets Status = "Pending" for new shifts
   ↓
4. At 7 AM next day, Apps Script runs:
   sendAvailabilityRequestEmail()
   ↓
5. Script finds new pending shifts
   ↓
6. For each pending shift:
   a. Calls n8n Workflow 1 via webhook
   b. Passes: volunteer name, date, time slot
   ↓
7. n8n Workflow 1:
   a. Looks up volunteer email
   b. Creates personalized update link
   c. Sends availability request email
   d. Logs to Email Log
   ↓
8. Volunteers receive emails with:
   • "You're assigned to [Date] [Time]"
   • "Can't make it? Click here to update"
```

## 📊 Data Relationships

```
Volunteers Sheet
    │
    │ (Name lookup)
    ↓
Schedule Sheet ←──────────┐
    │                     │
    │ (Counts shifts)     │ (References)
    ↓                     │
Volunteers.Total Shifts   │
                          │
Availability Updates ─────┘
    │ (Creates)
    │
    ↓ (References volunteer + schedule)
    │
Email Log Sheet
    │ (Tracks)
    ↓
Dashboard Metrics
```

## 🎯 Key Features Summary

### ✅ For Volunteers
- One-click update from email
- Pre-filled forms (no typing)
- Instant confirmation
- Clear instructions
- Mobile-friendly

### ✅ For Administrators  
- Real-time dashboard
- Auto-calculated metrics
- Update request tracking
- Email audit trail
- No manual email sending

### ✅ System Features
- Fully automated workflows
- Secure authentication
- Error handling
- Comprehensive logging
- Scalable architecture

## 📈 Metrics & Monitoring

```
Dashboard View:
┌─────────────────────────────────────┐
│  📊 BARRIER DUTY DASHBOARD          │
├─────────────────────────────────────┤
│  👥 Active Volunteers        24     │
│  📅 Shifts This Week         10     │
│  ⚠️  Pending Confirmations    2     │
│  ✅ Coverage Rate            98%    │
│  📝 Unprocessed Updates      1     │
│  📧 Emails Sent This Week    15     │
└─────────────────────────────────────┘

Weekly Schedule:
┌───────────────────────────────────────────┐
│ Day       | Shift     | Total | Confirmed │
├───────────────────────────────────────────┤
│ Monday    | Morning   |   1   |     1     │
│ Monday    | Afternoon |   1   |     1     │
│ Tuesday   | Morning   |   1   |     1     │
│ Tuesday   | Afternoon |   1   |     0     │ ← Pending
│ Wednesday | Morning   |   1   |     1     │
│ Wednesday | Afternoon |   1   |     1     │
│ Thursday  | Morning   |   1   |     0     │ ← Pending
│ Thursday  | Afternoon |   1   |     1     │
│ Friday    | Morning   |   1   |     1     │
│ Friday    | Afternoon |   1   |     1     │
└───────────────────────────────────────────┘
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│        Security Layers                   │
├─────────────────────────────────────────┤
│                                          │
│  🔒 Level 1: Client-Side                │
│     • HTTPS only                         │
│     • Input validation                   │
│     • XSS prevention                     │
│     • CSRF tokens                        │
│                                          │
│  🔒 Level 2: API Layer                   │
│     • OAuth 2.0 authentication           │
│     • Scoped permissions                 │
│     • Rate limiting                      │
│     • Request validation                 │
│                                          │
│  🔒 Level 3: Data Layer                  │
│     • Encrypted in transit               │
│     • Access control lists               │
│     • Audit logging                      │
│     • Regular backups                    │
│                                          │
│  🔒 Level 4: Email Layer                 │
│     • SPF/DKIM/DMARC                     │
│     • TLS encryption                     │
│     • Bounce handling                    │
│     • Spam prevention                    │
│                                          │
└─────────────────────────────────────────┘
```

## 📦 Deployment Architecture

```
┌────────────────────────────────────────────────────┐
│                   DEPLOYMENT                        │
├────────────────────────────────────────────────────┤
│                                                     │
│  🌐 Frontend: GitHub Pages                         │
│     • Static HTML/CSS/JS                           │
│     • CDN delivery                                 │
│     • HTTPS enabled                                │
│     • Auto-deploy on push                          │
│                                                     │
│  📊 Data: Google Sheets                            │
│     • Cloud-hosted                                 │
│     • Real-time sync                               │
│     • 99.9% uptime                                 │
│     • Auto-backup                                  │
│                                                     │
│  🔄 Automation: n8n                                │
│     • Self-hosted or cloud                         │
│     • 24/7 monitoring                              │
│     • Workflow versioning                          │
│     • Error alerts                                 │
│                                                     │
│  📧 Email: Gmail API                               │
│     • OAuth authentication                         │
│     • Send quota: 100/day (user)                   │
│     • 2000/day (workspace)                         │
│     • Delivery tracking                            │
│                                                     │
└────────────────────────────────────────────────────┘
```

## 📖 Documentation Map

```
📚 Documentation Structure:

├── 📘 QUICK_START.md (This file)
│   └── Overview and quick reference
│
├── 📗 COMPLETE_SETUP_GUIDE.md
│   └── Step-by-step full setup (8 parts)
│
├── 📙 GOOGLE_SHEETS_SETUP.md
│   ├── Sheet structures
│   ├── Formulas
│   ├── Apps Script functions
│   └── Validation rules
│
├── 📕 API_INTEGRATION.md
│   ├── Google Cloud setup
│   ├── OAuth configuration
│   ├── JavaScript client
│   └── Security best practices
│
├── 📔 N8N_EMAIL_WORKFLOW.md
│   ├── 3 workflow setups
│   ├── Email templates
│   ├── Webhook configuration
│   └── Testing procedures
│
├── 📓 VOLUNTEER_GUIDE.md
│   ├── How to use system
│   ├── Update availability
│   ├── FAQ
│   └── Troubleshooting
│
└── 📄 README.md
    └── Project overview
```

## 🎓 Learning Path

```
For Developers:
1. Read QUICK_START.md (overview)
2. Review COMPLETE_SETUP_GUIDE.md (setup)
3. Study API_INTEGRATION.md (integration)
4. Implement N8N_EMAIL_WORKFLOW.md (automation)
5. Test with real data

For Administrators:
1. Read QUICK_START.md (overview)
2. Follow COMPLETE_SETUP_GUIDE.md (setup)
3. Learn GOOGLE_SHEETS_SETUP.md (data mgmt)
4. Understand N8N_EMAIL_WORKFLOW.md (emails)
5. Train volunteers using VOLUNTEER_GUIDE.md

For Volunteers:
1. Read VOLUNTEER_GUIDE.md only
2. Bookmark update form URL
3. Check emails regularly
4. Contact admin for questions
```

---

**Total System Size:**
- 📄 Documentation: 4,146 lines
- 💾 Files: 11 files
- 📊 Sheets: 5 Google Sheets
- 🔄 Workflows: 3 n8n workflows
- ⏱️ Setup Time: ~3 hours
- 💰 Cost: $0-20/month

**Ready to implement?** Start with [COMPLETE_SETUP_GUIDE.md](COMPLETE_SETUP_GUIDE.md)
