# 🚧 Barrier Duty — Volunteer Management System

A responsive web application for managing school crossing volunteers, coordinating rotas, and keeping everyone informed about their duties.

> 🌐 **Live Site:** [barrier-duty-v1.fly.dev](https://barrier-duty-v1.fly.dev/)  
> 🐙 **GitHub:** [github.com/rifaterdemsahin/barrier-duty](https://github.com/rifaterdemsahin/barrier-duty)  
> 💼 **LinkedIn:** [linkedin.com/in/rifaterdemsahin](https://www.linkedin.com/in/rifaterdemsahin/)  
> ▶️ **YouTube:** [youtube.com/@RifatErdemSahin](https://www.youtube.com/@RifatErdemSahin)

---

## 📂 Project Structure (SLS — Self Learning System)

| Folder | Purpose | Link |
|--------|---------|------|
| `1_Real_Unknown/` | Define the problem, OKRs, goals | [📖 View](1_Real_Unknown/README.md) |
| `2_Environment/` | Context, constraints, client setup | [📖 View](2_Environment/README.md) |
| `3_Simulation/` | Media carousel, UI mockups | [📖 View](3_Simulation/README.md) · [🎭 Carousel](https://barrier-duty-v1.fly.dev/3_Simulation/carousel.html) |
| `4_Formula/` | Guides, Qdrant/Ollama setup | [📖 View](4_Formula/README.md) |
| `5_Symbols/` | Source code reference | [📖 View](5_Symbols/README.md) |
| `6_Semblance/` | Errors, fixes, lessons learned | [📖 View](6_Semblance/README.md) |
| `7_Testing_Known/` | Tests and acceptance criteria | [📖 View](7_Testing_Known/README.md) |

---

## 🚀 Quick Links

- 🏠 [Home Page](https://barrier-duty-v1.fly.dev/)
- 📅 [Volunteer Rota](https://barrier-duty-v1.fly.dev/#rota)
- 🔔 [Updates](https://barrier-duty-v1.fly.dev/#updates)
- 📝 [Update My Availability](https://barrier-duty-v1.fly.dev/5_Symbols/update-availability.html)
- 🎭 [Media Gallery / Carousel](https://barrier-duty-v1.fly.dev/3_Simulation/carousel.html)
- 📄 [Markdown Viewer](https://barrier-duty-v1.fly.dev/5_Symbols/markdown_renderer.html)
- 🖨️ [Printable Flier](https://barrier-duty-v1.fly.dev/5_Symbols/flier.html)

---

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

Visit the live site at: `https://barrier-duty-v1.fly.dev/`

## Admin Access

**Default Password:** `3579`

### 🔒 Security Features

This implementation is now secured with a backend API:

1. **Authentication**: The frontend compares hashes and stores session state, but the real security is that all edits happen via the `/api/data/*` endpoints.
2. **Key Vault Integration**: The `ADMIN-PASSWORD` and `AZURE-STORAGE-CONNECTION-STRING` are stored securely in **Azure Key Vault** (`dp-kv-deliverypilot`). The Flask backend uses these credentials to communicate with Azure Blob Storage.
3. **No Plaintext Secrets**: The codebase has no committed secrets.

**For Production Use:**
- Consider integrating a fully-fledged identity provider (e.g. Entra ID / Auth0) for the Admin interface instead of a shared password.
- Enforce HTTPS strictly (Fly.io handles this automatically).

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

This project uses **Fly.io** for hosting a full-stack Python Flask application with an API backend.

### Setup Fly.io Deployment

1. The project includes a root `Dockerfile` and a `fly.toml` for Fly.io configuration.
2. The site is live at: [https://barrier-duty-v1.fly.dev/](https://barrier-duty-v1.fly.dev/)
3. All deployment credentials and data storage rely on **Azure Key Vault** (`dp-kv-deliverypilot`) and **Azure Blob Storage** (`dpstoragebarrierduty`).
4. GitHub Actions workflow (`.github/workflows/fly.yml`) is set up to automatically deploy changes pushed to the `main` branch.

### Manual Deployment

To deploy manually via the Fly.io CLI:
```bash
fly deploy
```

## File Structure

```
barrier-duty/
├── index.html          # Main HTML file with all sections
├── 5_Symbols/styles.css# Responsive CSS styling
├── 5_Symbols/script.js # JavaScript for interactivity and auth
├── app.py              # Python Flask backend serving API
├── Dockerfile          # Docker configuration
├── fly.toml            # Fly.io configuration
├── .github/
│   └── workflows/
│       └── fly.yml     # GitHub Actions deployment workflow
└── README.md           # This file
```

## Technologies Used

- **HTML5 & CSS3** - Semantic markup and modern styling
- **JavaScript (ES6+)** - Client-side interactivity
- **Python Flask** - Backend API and static file serving
- **Azure Blob Storage** - Cloud JSON data storage
- **Azure Key Vault** - Secure credential management
- **Fly.io** - Docker-based application hosting
- **GitHub Actions** - CI/CD pipeline

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
- **Update availability** through a simple web form ([5_Symbols/update-availability.html](5_Symbols/update-availability.html))
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
