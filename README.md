# 🚧 Barrier Duty - Volunteer Management System

A responsive web application for managing school crossing volunteers, coordinating rotas, and keeping everyone informed about their duties.

> https://rifaterdemsahin.github.io/barrier-duty/#updates

## Features

### 📅 Volunteer Rota
- Weekly schedule with morning (8:00-8:30 AM) and afternoon (3:00-3:30 PM) shifts
- Filter view by shift type (all, morning, afternoon)
- Color-coded status indicators (confirmed, pending)
- Easy-to-read table format with date, volunteer name, and status

### 👥 Volunteer Information
- Complete volunteer directory with statistics
- Track volunteer participation (total shifts completed)
- Record children's leaving year for planning purposes
- Display volunteer availability preferences
- Overall statistics dashboard

### 🔔 Updates Section
- Timeline of announcements and updates
- Urgent notifications highlighted
- Weather alerts and policy reminders
- Welcome messages for new volunteers
- Important schedule changes

### 🔒 Password-Protected Admin Area
- Secure access with password authentication
- Dashboard with quick statistics
- Action items and pending tasks
- Contact management tools
- Rota editing capabilities
- Announcement posting
- Data export functionality (CSV, PDF)
- Session-based authentication

### 📱 Responsive Design
- Mobile-first approach
- Tablet and desktop optimized layouts
- Touch-friendly interface
- Print-friendly styles
- Accessible navigation

## Live Demo

Visit the live site at: `https://[your-username].github.io/barrier-duty/`

## Admin Access

**Default Password:** `admin123`

### ⚠️ CRITICAL SECURITY WARNING

This implementation uses **CLIENT-SIDE password protection for demonstration purposes only**. This is **NOT SECURE** for production use because:

1. The password is visible in the JavaScript source code
2. Anyone can view the source and see the password
3. There is no real authentication - users can bypass it by manipulating browser storage

**For Production Use:**
- Implement proper **server-side authentication** with encrypted passwords
- Use a backend framework (Node.js, Python Flask/Django, PHP, etc.)
- Store passwords securely using bcrypt or similar hashing
- Implement proper session management on the server
- Use HTTPS for all communications
- Consider using OAuth or other modern authentication methods

This demo is suitable for:
- Local development and testing
- Understanding the UI/UX flow
- Demonstrating features to stakeholders
- Educational purposes

**Do not deploy this to production without implementing proper security measures.**

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/[your-username]/barrier-duty.git
cd barrier-duty
```

2. Open `index.html` in your web browser:
```bash
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

Or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages.

### Setup GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment":
   - Source: "GitHub Actions"
4. Push to the main/master branch to trigger deployment

### Manual Deployment

The workflow can also be triggered manually:
1. Go to Actions tab
2. Select "Deploy to GitHub Pages"
3. Click "Run workflow"

## File Structure

```
barrier-duty/
├── index.html          # Main HTML file with all sections
├── styles.css          # Responsive CSS styling
├── script.js           # JavaScript for interactivity and auth
├── .github/
│   └── workflows/
│       └── deploy.yml  # GitHub Actions deployment workflow
└── README.md           # This file
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **JavaScript (ES6+)** - Client-side interactivity
- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static site hosting

## Features Overview

### Navigation
- Sticky navigation bar
- Smooth section transitions
- Active state indicators
- Keyboard shortcuts (Alt+1 through Alt+5)
- Browser back/forward support

### Security
- Session-based authentication
- Password protection for admin area
- Logout functionality (ESC key or button)
- No sensitive data in client code

### Interactivity
- Dynamic rota filtering
- Animated card reveals on scroll
- Hover effects and transitions
- Form validation
- Modal-style admin login

## Customization

### Change Admin Password
Edit `script.js` and modify the `ADMIN_PASSWORD` constant:
```javascript
const ADMIN_PASSWORD = 'your-secure-password';
```

### Update Volunteer Data
Edit the HTML in `index.html`:
- Rota table: `<tbody id="rotaTableBody">` section
- Volunteer cards: `.volunteer-grid` section
- Statistics: `.volunteer-stats` section

### Modify Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --accent-color: #f59e0b;
    /* ... */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## New Features: Google Sheets Integration & Email Notifications

### 📊 Google Sheets Integration
The system now supports integration with Google Sheets for real-time data management:
- **Live volunteer data** sync from spreadsheets
- **Automated schedule updates** and tracking
- **Availability update logging** for audit trail
- **Dashboard metrics** with formulas and statistics

See [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md) for detailed setup instructions.

### 📧 Automated Email Notifications (n8n)
Volunteers receive automated emails via n8n workflows:
- **Availability requests** when assigned to pending shifts
- **Daily reminders** for upcoming unconfirmed duties
- **Confirmation emails** when updates are submitted
- **One-click update links** to quickly modify availability

See [N8N_EMAIL_WORKFLOW.md](N8N_EMAIL_WORKFLOW.md) for workflow setup guide.

### 🔗 Volunteer Update Portal
New self-service page for volunteers:
- **Update availability** through a simple web form ([update-availability.html](update-availability.html))
- **Pre-filled forms** from email notification links
- **Instant submission** to Google Sheets
- **Email confirmations** to both volunteer and admin

### 🔌 API Integration
Complete API integration documentation:
- **Google Sheets API** setup and authentication
- **OAuth 2.0 configuration** for secure access
- **JavaScript API client** for frontend integration
- **Error handling** and rate limiting best practices

See [API_INTEGRATION.md](API_INTEGRATION.md) for complete API documentation.

## Future Enhancements

- SMS alerts for urgent changes
- Calendar export (iCal format)
- Weather API integration
- Multi-language support
- Mobile app development
- Advanced analytics dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For questions or support, please open an issue in the GitHub repository.

---

Made with ❤️ for keeping our children safe 🚸
