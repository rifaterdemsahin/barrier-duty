# Google Sheets Integration Setup Guide

## Overview
This guide explains how to set up Google Sheets integration for the Barrier Duty Volunteer Management System. The integration enables:
- Real-time volunteer data management
- Automated availability tracking
- Email notification triggers
- Historical data analysis

## Google Sheets Structure

### Sheet 1: Volunteers
This sheet stores volunteer contact and profile information.

**Columns:**
| Column | Name | Type | Description | Formula/Validation |
|--------|------|------|-------------|-------------------|
| A | Volunteer ID | Text | Unique identifier | `=ROW()-1` (auto-increment) |
| B | Full Name | Text | Volunteer's full name | Required field |
| C | Email | Email | Contact email | Email validation |
| D | Phone | Text | Phone number | Format: (XXX) XXX-XXXX |
| E | Child's Leaving Year | Number | Year child leaves school | Range: 2026-2035 |
| F | Join Date | Date | When volunteer joined | Date format |
| G | Active Status | Dropdown | Active/Inactive | `=IF(F2<>"",IF(TODAY()-F2>730,"Review","Active"),"")` |
| H | Total Shifts | Number | Total completed shifts | `=COUNTIFS(Schedule!D:D,B2,Schedule!F:F,"Completed")` |
| I | Preferred Shifts | Text | Morning/Afternoon/Both | Dropdown validation |
| J | Available Days | Text | Days of week | Multi-select |
| K | Notes | Text | Additional information | Optional |

**Named Range:** `VolunteersList = Volunteers!B2:B100`

### Sheet 2: Schedule (Rota)
This sheet manages the weekly schedule assignments.

**Columns:**
| Column | Name | Type | Description | Formula/Validation |
|--------|------|------|-------------|-------------------|
| A | Schedule ID | Text | Unique schedule entry | `=TEXT(ROW()-1,"S0000")` |
| B | Date | Date | Shift date | Date format |
| C | Day of Week | Text | Day name | `=TEXT(B2,"dddd")` |
| D | Volunteer Name | Dropdown | Assigned volunteer | `=VolunteersList` |
| E | Time Slot | Dropdown | Morning/Afternoon | Morning: 8:00-8:30 AM, Afternoon: 3:00-3:30 PM |
| F | Status | Dropdown | Shift status | Confirmed/Pending/Cancelled/Completed |
| G | Confirmed Date | Date | When confirmed | Auto-filled |
| H | Last Updated | Timestamp | Last modification | `=NOW()` when changed |
| I | Substitute | Dropdown | Backup volunteer | `=VolunteersList` |
| J | Weather Alert | Checkbox | Bad weather flag | Manual |
| K | Notes | Text | Special instructions | Optional |

**Conditional Formatting:**
- Status = "Pending" → Yellow background
- Status = "Confirmed" → Green background
- Status = "Cancelled" → Red background
- Status = "Completed" → Gray background

**Named Range:** `CurrentWeekSchedule = Schedule!A2:K100`

### Sheet 3: Availability Updates
This sheet tracks volunteer availability changes and requests.

**Columns:**
| Column | Name | Type | Description | Formula/Validation |
|--------|------|------|-------------|-------------------|
| A | Update ID | Text | Unique update ID | `=TEXT(ROW()-1,"U0000")` |
| B | Timestamp | Timestamp | When submitted | `=NOW()` |
| C | Volunteer Name | Text | Who submitted | Auto-filled from form |
| D | Email | Email | Volunteer email | Auto-filled from form |
| E | Date From | Date | Start date of change | Date format |
| F | Date To | Date | End date of change | Date format |
| G | Update Type | Dropdown | Type of update | Available/Unavailable/Substitute Request |
| H | Reason | Text | Explanation | Optional |
| I | Status | Dropdown | Processing status | New/Reviewed/Applied/Rejected |
| J | Processed By | Text | Admin name | Auto-filled |
| K | Processed Date | Timestamp | When processed | Auto-filled |
| L | Notes | Text | Admin notes | Optional |

**Trigger Formula in Column I:**
```
=IF(AND(I2="New", B2<>""), 
  IF(COUNTIFS(Schedule!B:B,">="&E2,Schedule!B:B,"<="&F2,Schedule!D:D,C2)>0,
    "Requires Action",
    "No Conflicts"
  ),
  I2
)
```

### Sheet 4: Email Log
This sheet logs all email notifications sent.

**Columns:**
| Column | Name | Type | Description | Formula/Validation |
|--------|------|------|-------------|-------------------|
| A | Email ID | Text | Unique email ID | `=TEXT(ROW()-1,"E0000")` |
| B | Sent Timestamp | Timestamp | When email sent | Auto-filled by n8n |
| C | Recipient Name | Text | Volunteer name | From webhook |
| D | Recipient Email | Email | Email address | From webhook |
| E | Email Type | Dropdown | Notification type | Reminder/Cancellation/Availability Request/Confirmation |
| F | Subject | Text | Email subject line | From n8n |
| G | Schedule ID | Text | Related schedule entry | References Schedule!A |
| H | Delivery Status | Dropdown | Email status | Sent/Delivered/Bounced/Failed |
| I | Opened | Checkbox | Email opened | From email tracking |
| J | Link Clicked | Checkbox | Update link clicked | From webhook |
| K | Response Date | Timestamp | When responded | From update form |
| L | Notes | Text | Additional info | Optional |

### Sheet 5: Dashboard (Summary)
This sheet provides quick statistics and metrics.

**Key Metrics:**

**A1:** `Total Active Volunteers`  
**B1:** `=COUNTIF(Volunteers!G:G,"Active")`

**A2:** `Total Shifts This Week`  
**B2:** `=COUNTIFS(Schedule!B:B,">="&TODAY()-WEEKDAY(TODAY())+1,Schedule!B:B,"<="&TODAY()-WEEKDAY(TODAY())+7)`

**A3:** `Pending Confirmations`  
**B3:** `=COUNTIF(Schedule!F:F,"Pending")`

**A4:** `Coverage Rate %`  
**B4:** `=ROUND((B2-B3)/B2*100,1)`

**A5:** `Unprocessed Updates`  
**B5:** `=COUNTIF(AvailabilityUpdates!I:I,"New")`

**A6:** `Emails Sent This Week`  
**B6:** `=COUNTIFS(EmailLog!B:B,">="&TODAY()-WEEKDAY(TODAY())+1)`

**Weekly Schedule Summary (A8:E20):**
```
=QUERY(Schedule!A:K,
  "SELECT C, E, COUNT(D), COUNTIF(F,'Confirmed'), COUNTIF(F,'Pending')
   WHERE B >= date '"&TEXT(TODAY()-WEEKDAY(TODAY())+1,"yyyy-MM-dd")&"'
     AND B <= date '"&TEXT(TODAY()-WEEKDAY(TODAY())+7,"yyyy-MM-dd")&"'
   GROUP BY C, E
   ORDER BY B",
  1
)
```

## Google Apps Script Functions

Create these custom functions in Tools > Script Editor:

### Function 1: Send Availability Request Email
```javascript
function sendAvailabilityRequestEmail() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Schedule');
  var data = sheet.getDataRange().getValues();
  var today = new Date();
  var nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  for (var i = 1; i < data.length; i++) {
    var scheduleDate = new Date(data[i][1]); // Column B (Date)
    var status = data[i][5]; // Column F (Status)
    var volunteerName = data[i][3]; // Column D (Volunteer Name)
    
    // Check if shift is in next week and status is Pending
    if (scheduleDate >= today && scheduleDate <= nextWeek && status === 'Pending') {
      triggerN8nWebhook(data[i]);
    }
  }
}

function triggerN8nWebhook(rowData) {
  var webhookUrl = PropertiesService.getScriptProperties().getProperty('N8N_WEBHOOK_URL');
  
  var payload = {
    scheduleId: rowData[0],
    date: rowData[1],
    dayOfWeek: rowData[2],
    volunteerName: rowData[3],
    timeSlot: rowData[4],
    status: rowData[5]
  };
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  
  try {
    UrlFetchApp.fetch(webhookUrl, options);
  } catch (error) {
    Logger.log('Error triggering webhook: ' + error.toString());
  }
}
```

### Function 2: Update Schedule from Form
```javascript
function onFormSubmit(e) {
  var updateSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Availability Updates');
  var scheduleSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Schedule');
  
  // Process the form submission
  var lastRow = updateSheet.getLastRow();
  var status = updateSheet.getRange(lastRow, 9).getValue(); // Column I (Status)
  
  if (status === 'New') {
    // Trigger notification to admin
    sendAdminNotification(lastRow);
  }
}

function sendAdminNotification(row) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Availability Updates');
  var data = sheet.getRange(row, 1, 1, 12).getValues()[0];
  
  var adminEmail = PropertiesService.getScriptProperties().getProperty('ADMIN_EMAIL');
  var subject = 'New Availability Update - ' + data[2];
  var body = 'A volunteer has submitted an availability update:\n\n' +
             'Volunteer: ' + data[2] + '\n' +
             'Email: ' + data[3] + '\n' +
             'Date Range: ' + data[4] + ' to ' + data[5] + '\n' +
             'Type: ' + data[6] + '\n' +
             'Reason: ' + data[7] + '\n\n' +
             'Please review in Google Sheets.';
  
  MailApp.sendEmail(adminEmail, subject, body);
}
```

### Function 3: Auto-update Status
```javascript
function autoUpdateScheduleStatus() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Schedule');
  var data = sheet.getDataRange().getValues();
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (var i = 1; i < data.length; i++) {
    var scheduleDate = new Date(data[i][1]);
    scheduleDate.setHours(0, 0, 0, 0);
    var status = data[i][5];
    
    // Auto-mark completed shifts
    if (scheduleDate < today && status === 'Confirmed') {
      sheet.getRange(i + 1, 6).setValue('Completed');
    }
  }
}
```

### Function 4: Get Volunteer Email
```javascript
function getVolunteerEmail(volunteerName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Volunteers');
  var data = sheet.getDataRange().getValues();
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === volunteerName) { // Column B (Full Name)
      return data[i][2]; // Column C (Email)
    }
  }
  return null;
}
```

## Time-based Triggers Setup

1. Open Script Editor (Tools > Script Editor)
2. Click on clock icon (Triggers)
3. Add these triggers:

**Daily Morning Trigger:**
- Function: `sendAvailabilityRequestEmail`
- Event: Time-driven, Day timer, 7 AM to 8 AM

**Daily Evening Trigger:**
- Function: `autoUpdateScheduleStatus`
- Event: Time-driven, Day timer, 11 PM to 12 AM

## Data Validation Rules

### Volunteers Sheet:
- Column C (Email): Custom formula `=ISURL("mailto:"&C2)`
- Column E (Child's Leaving Year): Number between 2026 and 2035
- Column G (Active Status): List: Active, Inactive, Review
- Column I (Preferred Shifts): List: Morning, Afternoon, Both, Flexible

### Schedule Sheet:
- Column D (Volunteer Name): List from range `VolunteersList`
- Column E (Time Slot): List: Morning (8:00-8:30 AM), Afternoon (3:00-3:30 PM)
- Column F (Status): List: Pending, Confirmed, Cancelled, Completed
- Column I (Substitute): List from range `VolunteersList`

### Availability Updates Sheet:
- Column G (Update Type): List: Available, Unavailable, Substitute Request, Change Request
- Column I (Status): List: New, Reviewed, Applied, Rejected

### Email Log Sheet:
- Column E (Email Type): List: Reminder, Cancellation, Availability Request, Confirmation, Welcome
- Column H (Delivery Status): List: Sent, Delivered, Bounced, Failed, Pending

## Setup Instructions

1. **Create the Google Sheet:**
   - Create a new Google Sheet named "Barrier Duty Management"
   - Create 5 sheets with the names and structures above

2. **Set up Named Ranges:**
   - Data > Named ranges
   - Create `VolunteersList` pointing to Volunteers!B2:B100

3. **Apply Formulas:**
   - Copy formulas from the tables above to the appropriate cells
   - Set up conditional formatting rules

4. **Configure Data Validation:**
   - Apply dropdown validations as specified
   - Set up custom validation formulas

5. **Install Google Apps Script:**
   - Tools > Script Editor
   - Copy the script functions above
   - Save and authorize the script

6. **Set Script Properties:**
   - File > Project properties > Script properties
   - Add: `N8N_WEBHOOK_URL` with your n8n webhook URL
   - Add: `ADMIN_EMAIL` with admin email address

7. **Set up Triggers:**
   - Click clock icon in Script Editor
   - Add time-based triggers as specified above

8. **Enable Google Sheets API:**
   - Go to Google Cloud Console
   - Enable Google Sheets API for your project
   - Create API credentials (Service Account or OAuth 2.0)

## Notes

- Backup your sheet data regularly
- Test formulas in a copy before applying to production
- Monitor script execution logs for errors
- Review and adjust trigger timing based on your needs
- Consider adding more sheets for historical data archiving
