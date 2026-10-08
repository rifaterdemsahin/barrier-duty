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
// Password is verified via hash to prevent plaintext secrets in source code

async function checkPassword(event) {
    event.preventDefault();
    const password = document.getElementById('adminPassword').value;
    
    // Securely hash the input password to avoid plaintext secrets in the repo
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Check against the SHA-256 hash of the vault-stored password
    if (hashHex === 'cc49091e6a3fa59a5d4f8f9d4a420ff47d7bfaabae08f666fe5d698712b1d326') {
        // Store authentication in local storage to keep logged in
        localStorage.setItem('adminAuthenticated', 'true');
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
    localStorage.removeItem('adminAuthenticated');
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminContent').style.display = 'none';
    document.getElementById('adminPassword').value = '';
    alert('✅ You have been logged out successfully.');
}

function checkAccess(sectionId) {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    
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
    if (localStorage.getItem('adminAuthenticated') === 'true') {
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

// Load Rota Data from Azure Blob Storage (or fallback to local for dev)
async function loadRotaFromAzure() {
    const tableBody = document.getElementById('rotaTableBody');
    if (!tableBody) return;

    // Production Azure Blob URL for the rota data
    const azureBlobUrl = 'https://dpstoragebarrierduty.blob.core.windows.net/rota/rota.json';
    const fallbackLocalUrl = '5_Symbols/rota.json';

    try {
        let response = await fetch(azureBlobUrl);
        if (!response.ok) {
            console.log('Azure blob not available, falling back to local file.');
            response = await fetch(fallbackLocalUrl);
        }
        
        const data = await response.json();
        
        tableBody.innerHTML = ''; // Clear loading state
        
        data.forEach(entry => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-shift', entry.shift);
            
            const timeClass = entry.shift === 'morning' ? 'morning-slot' : 'afternoon-slot';
            
            const formatVolunteer = (name) => {
                if (name.toLowerCase() === 'needed') {
                    return '<span class="status pending">Needed</span>';
                }
                return name;
            };

            tr.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.day}</td>
                <td class="${timeClass}">${entry.time}</td>
                <td>${formatVolunteer(entry.volunteer1)}</td>
                <td>${formatVolunteer(entry.volunteer2)}</td>
            `;
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading rota data:', error);
        tableBody.innerHTML = '<tr><td colspan="5">Error loading rota. Please try again later.</td></tr>';
    }
}

// Ensure the rota is loaded when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    loadRotaFromAzure();
});

// --- Rota Editor Functions ---

async function openRotaEditor() {
    const editorSection = document.getElementById('adminRotaEditor');
    const textArea = document.getElementById('rotaJsonEditor');
    
    editorSection.style.display = 'block';
    textArea.value = "Loading current rota...";
    
    // Fetch current data
    const azureBlobUrl = 'https://dpstoragebarrierduty.blob.core.windows.net/rota/rota.json';
    const fallbackLocalUrl = '5_Symbols/rota.json';
    
    try {
        let response = await fetch(azureBlobUrl);
        if (!response.ok) {
            response = await fetch(fallbackLocalUrl);
        }
        const data = await response.json();
        textArea.value = JSON.stringify(data, null, 4);
        
        // Scroll to editor
        editorSection.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
        textArea.value = '[\n    // Error loading rota. You can paste your own JSON here.\n]';
    }
}

function closeRotaEditor() {
    document.getElementById('adminRotaEditor').style.display = 'none';
}

function downloadRotaJson() {
    const textArea = document.getElementById('rotaJsonEditor');
    const content = textArea.value;
    
    // Validate JSON before downloading
    try {
        JSON.parse(content);
    } catch (e) {
        alert("Invalid JSON format. Please fix the errors before downloading.\n\n" + e.message);
        return;
    }
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rota.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert("Downloaded rota.json. You can now provide this file to the system or upload it to Azure.");
}
