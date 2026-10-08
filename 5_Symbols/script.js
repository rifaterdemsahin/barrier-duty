// Navigation and Section Management
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Update URL hash without jumping
        history.pushState(null, null, `#${sectionId}`);
        
        // Find and activate the corresponding nav link
        const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Password Protection
// ⚠️ SECURITY WARNING: This is a client-side demo implementation only.
// For production use, you MUST implement proper server-side authentication.
// Never store passwords in client-side JavaScript.
const ADMIN_PASSWORD = 'admin123'; // Demo password - NOT FOR PRODUCTION USE

function checkPassword(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    if (password === ADMIN_PASSWORD) {
        // Store authentication in session
        sessionStorage.setItem('adminAuthenticated', 'true');
        showAdminContent();
        return false;
    } else {
        alert('❌ Incorrect password. Please try again.');
        document.getElementById('adminPassword').value = '';
        return false;
    }
}

function showAdminContent() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminContent').style.display = 'block';
}

function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminContent').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    alert('✅ You have been logged out successfully.');
}

function checkAccess(sectionId) {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    
    if (sectionId === 'admin') {
        showSection('admin');
        if (isAuthenticated) {
            showAdminContent();
        }
    }
}

// Rota Filtering
function filterRota(type, event) {
    const rows = document.querySelectorAll('#rotaTableBody tr');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Filter rows
    rows.forEach(row => {
        const shift = row.getAttribute('data-shift');
        
        if (type === 'all') {
            row.style.display = '';
        } else if (shift === type) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Export Functions (Demo - would need backend implementation)
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication on page load
    if (sessionStorage.getItem('adminAuthenticated') === 'true') {
        const adminSection = document.getElementById('admin');
        if (adminSection && adminSection.classList.contains('active')) {
            showAdminContent();
        }
    }
    
    // Handle initial hash in URL
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        if (sectionId && sectionId !== 'home') {
            if (sectionId === 'admin') {
                checkAccess('admin');
            } else {
                showSection(sectionId);
            }
        }
    }
    
    // Add click handlers for admin action buttons
    const adminActionButtons = document.querySelectorAll('.admin-action-btn');
    adminActionButtons.forEach(button => {
        button.addEventListener('click', function() {
            alert('This feature would be connected to a backend system in a production environment.');
        });
    });
    
    // Add click handlers for export buttons
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent;
            alert(`${buttonText}\n\nThis would download the requested file in a production environment.`);
        });
    });
});

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        if (sectionId === 'admin') {
            checkAccess('admin');
        } else {
            showSection(sectionId);
        }
    } else {
        showSection('home');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Alt+1 to Alt+5 for quick navigation
    if (e.altKey) {
        switch(e.key) {
            case '1':
                showSection('home');
                break;
            case '2':
                showSection('rota');
                break;
            case '3':
                showSection('volunteers');
                break;
            case '4':
                showSection('updates');
                break;
            case '5':
                showSection('resources');
                break;
            case '6':
                checkAccess('admin');
                break;
        }
    }
    
    // ESC to logout from admin
    if (e.key === 'Escape') {
        const adminContent = document.getElementById('adminContent');
        if (adminContent && adminContent.style.display !== 'none') {
            if (confirm('Do you want to logout from admin area?')) {
                logout();
            }
        }
    }
});

// Add animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and timeline items
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll(
        '.welcome-card, .volunteer-card, .update-item, .stat-card, .admin-card'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});

// Utility function to format dates
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Add notification badge for pending slots (example)
function updateNotificationBadge() {
    const pendingSlots = document.querySelectorAll('.status.pending').length;
    if (pendingSlots > 0) {
        console.log(`⚠️ ${pendingSlots} slots need volunteers!`);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNotificationBadge();
});
