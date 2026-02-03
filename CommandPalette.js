// Command Palette Data
const commands = [
    // Navigation Sections
    { icon: '📁', title: 'About', subtitle: 'Section', type: 'section', target: 'about' },
    { icon: '⚡', title: 'Skills', subtitle: 'Section', type: 'section', target: 'skills' },
    { icon: '💼', title: 'Projects', subtitle: 'Section', type: 'section', target: 'projects' },
    { icon: '📄', title: 'Resume', subtitle: 'Section', type: 'section', target: 'resume' },
    { icon: '🎓', title: 'Certifications', subtitle: 'Section', type: 'section', target: 'certifications' },
    { icon: '💡', title: 'Experience', subtitle: 'Section', type: 'section', target: 'experience' },
    { icon: '📧', title: 'Contact', subtitle: 'Section', type: 'section', target: 'contact' },
    { icon: '🏠', title: 'Go to Top', subtitle: 'Navigation', type: 'section', target: 'hero' },

    // Settings & Theme
    { icon: '🌙', title: 'Toggle Theme', subtitle: 'Settings', type: 'action', action: 'toggleTheme' },
    { icon: '↻', title: 'Reload Page', subtitle: 'Settings', type: 'action', action: 'reload' },
    { icon: '🔍', title: 'Scroll to Skills Heatmap', subtitle: 'Navigation', type: 'action', action: 'scrollToSkillMap' },

    // Professional & Development
    { icon: '<i class="fa-brands fa-github"></i>', title: 'GitHub', subtitle: 'Code & Projects', type: 'link', target: 'https://github.com/mini-page' },
    { icon: '<i class="fa-brands fa-linkedin"></i>', title: 'LinkedIn', subtitle: 'Professional Network', type: 'link', target: 'https://linkedin.com/in/ug5711' },
    { icon: '<i class="fa-brands fa-codepen"></i>', title: 'CodePen', subtitle: 'Frontend Demos', type: 'link', target: 'https://codepen.io/ug5711' },
    { icon: '<i class="fa-brands fa-discord"></i>', title: 'Discord', subtitle: 'Community', type: 'link', target: 'https://discord.com/users/ug5711' },

    // Security & Learning
    { icon: '🔐', title: 'HackTheBox', subtitle: 'CTF Platform', type: 'link', target: 'https://app.hackthebox.com/profile/ug5711' },
    { icon: '🛡️', title: 'LetsDefend', subtitle: 'SOC Training', type: 'link', target: 'https://letsdefend.io/user/ug5711' },
    { icon: '💻', title: 'TryHackMe', subtitle: 'Cyber Range', type: 'link', target: 'https://tryhackme.com/p/ug5711' },
    { icon: '<i class="fa-brands fa-medium"></i>', title: 'Medium', subtitle: 'Tech Articles', type: 'link', target: 'https://medium.com/@ug5711' },

    // Social Media
    { icon: '<i class="fa-brands fa-x-twitter"></i>', title: 'X / Twitter', subtitle: 'Tech Updates', type: 'link', target: 'https://x.com/ug_5711' },
    { icon: '<i class="fa-brands fa-threads"></i>', title: 'Threads', subtitle: 'Quick Thoughts', type: 'link', target: 'https://threads.net/@ug5711' },
    { icon: '<i class="fa-brands fa-instagram"></i>', title: 'Instagram', subtitle: 'Visual Stories', type: 'link', target: 'https://instagram.com/ug5711' },
    { icon: '<i class="fa-brands fa-youtube"></i>', title: 'YouTube', subtitle: 'Video Content', type: 'link', target: 'https://youtube.com/@ug5711' },
    { icon: '<i class="fa-brands fa-reddit"></i>', title: 'Reddit', subtitle: 'Discussions', type: 'link', target: 'https://reddit.com/u/ug5711' },
    { icon: '<i class="fa-brands fa-pinterest"></i>', title: 'Pinterest', subtitle: 'Inspiration', type: 'link', target: 'https://pinterest.com/ug5711' },
    { icon: '<i class="fa-brands fa-snapchat"></i>', title: 'Snapchat', subtitle: 'Quick Snaps', type: 'link', target: 'https://snapchat.com/add/ug5711' },
    { icon: '<i class="fa-brands fa-telegram"></i>', title: 'Telegram', subtitle: 'Fast Chat', type: 'link', target: 'https://t.me/ug5711' },

    // Projects
    { icon: '🔐', title: 'asllock', subtitle: 'Project - Access Control', type: 'link', target: 'https://github.com/mini-page/asllock' },
    { icon: '⚡', title: 'TheSecretJuice', subtitle: 'Project - CLI Enhancer', type: 'link', target: 'https://github.com/mini-page/TheSecretJuice' },
    { icon: '📄', title: 'SejdaCrack', subtitle: 'Project - PDF Tool', type: 'link', target: 'https://github.com/mini-page/SejdaCrack' },
    { icon: '💚', title: 'trackify', subtitle: 'Project - Wellness App', type: 'link', target: 'https://github.com/mini-page/trackify' },
    { icon: '💻', title: 'sniprun', subtitle: 'Project - CLI Aliaser', type: 'link', target: 'https://github.com/mini-page/sniprun' },
    { icon: '🔄', title: 'SyncMaster', subtitle: 'Project - File Sync', type: 'link', target: 'https://github.com/mini-page/SyncMaster' },
    { icon: '🛣️', title: 'Cyber-path', subtitle: 'Project - Learning Guide', type: 'link', target: 'https://github.com/mini-page/Cyber-path' },
    { icon: '💪', title: 'skfitness', subtitle: 'Project - Fitness Website', type: 'link', target: 'https://github.com/mini-page/skfitness' },
    { icon: '🌐', title: 'rahulsoni.in', subtitle: 'Project - Portfolio', type: 'link', target: 'https://github.com/mini-page/rahulsoni.in' },

    // Pages
    { icon: '🧰', title: 'Tool Index', subtitle: 'Page', type: 'link', target: 'tool-index.html' },
    { icon: '📘', title: 'Case Studies', subtitle: 'Page', type: 'link', target: 'case-studies.html' },
    { icon: '📝', title: 'Blog', subtitle: 'Page', type: 'link', target: 'blog.html' },
    { icon: '⌨️', title: 'Interactive Terminal', subtitle: 'Section', type: 'section', target: 'terminal' },
];

let selectedIndex = 0;
let filteredCommands = [...commands];
let secretUnlocked = false;
let secretTimer = null;

// Toggle Command Palette
function toggleCommandPalette() {
    const overlay = document.getElementById('commandPaletteOverlay');
    const search = document.getElementById('commandSearch');

    if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
    } else {
        overlay.classList.add('active');
        search.value = '';
        selectedIndex = 0;
        renderCommands();
        setTimeout(() => search.focus(), 100);
    }
}

// Render Commands
function renderCommands() {
    const list = document.getElementById('commandList');
    list.innerHTML = '';

    filteredCommands.forEach((cmd, index) => {
        const item = document.createElement('div');
        item.className = `command-item ${index === selectedIndex ? 'selected' : ''}`;
        item.innerHTML = `
    <div class="command-icon">${cmd.icon}</div>
    <div class="command-details">
        <div class="command-title">${cmd.title}</div>
        <div class="command-subtitle">${cmd.subtitle}</div>
    </div>
    <div class="command-hint">${cmd.type === 'info' ? '' : 'Enter'}</div>
    `;
        if (cmd.type !== 'info') {
            item.addEventListener('click', () => executeCommand(cmd));
        }
        list.appendChild(item);
    });
}

// Search Commands
function searchCommands(query) {
    query = query.toLowerCase().trim();

    if (!query) {
        filteredCommands = [...commands];
        secretUnlocked = false;
        if (secretTimer) {
            clearTimeout(secretTimer);
            secretTimer = null;
        }
    } else {
        filteredCommands = commands.filter(cmd =>
            cmd.title.toLowerCase().includes(query) ||
            cmd.subtitle.toLowerCase().includes(query)
        );
    }

    if (query === 'rg') {
        if (!secretUnlocked) {
            filteredCommands = [
                ...filteredCommands,
                {
                    icon: '>',
                    title: 'Unlocking secure channel...',
                    subtitle: 'Typing sequence detected',
                    type: 'info'
                }
            ];
            if (!secretTimer) {
                secretTimer = setTimeout(() => {
                    secretUnlocked = true;
                    secretTimer = null;
                    renderCommands();
                }, 700);
            }
        } else {
            filteredCommands = [
                ...filteredCommands,
                {
                    icon: '<i class="fa-brands fa-whatsapp"></i>',
                    title: 'WhatsApp (Secret)',
                    subtitle: 'Direct Message',
                    type: 'link',
                    target: 'https://wa.me/919621272014'
                }
            ];
        }
    } else {
        secretUnlocked = false;
        if (secretTimer) {
            clearTimeout(secretTimer);
            secretTimer = null;
        }
    }

    selectedIndex = 0;
    renderCommands();
}

// Execute Command
function executeCommand(cmd) {
    if (cmd.type === 'section') {
        const element = document.getElementById(cmd.target);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    } else if (cmd.type === 'link') {
        window.open(cmd.target, '_blank');
    } else if (cmd.type === 'action') {
        switch (cmd.action) {
            case 'toggleTheme':
                toggleTheme();
                break;
            case 'setLightTheme':
                setTheme('light');
                break;
            case 'setDarkTheme':
                setTheme('dark');
                break;
            case 'reload':
                location.reload();
                break;
            case 'scrollToSkillMap':
                if (typeof toggleSkillMapPanel === 'function') {
                    toggleSkillMapPanel(true);
                }
                document.getElementById('skillMap')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                break;
        }
    }
    toggleCommandPalette();
}

// Theme Functions
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.className = theme === 'dark' ? 'fa-solid fa-circle' : 'fa-solid fa-moon';
    }
}

// Load saved theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    const overlay = document.getElementById('commandPaletteOverlay');

    // Ctrl+K or Cmd+K to toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
        return;
    }

    if (!overlay.classList.contains('active')) return;

    // Escape to close
    if (e.key === 'Escape') {
        toggleCommandPalette();
        return;
    }

    // Arrow navigation
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % filteredCommands.length;
        renderCommands();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = selectedIndex === 0 ? filteredCommands.length - 1 : selectedIndex - 1;
        renderCommands();
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
        }
    }
});

// Search Input
document.getElementById('commandSearch').addEventListener('input', (e) => {
    searchCommands(e.target.value);
});

// Close on overlay click
document.getElementById('commandPaletteOverlay').addEventListener('click', (e) => {
    if (e.target.id === 'commandPaletteOverlay') {
        toggleCommandPalette();
    }
});

// Skill Map Tooltips
const tooltip = document.getElementById('tooltip');
const mapPoints = document.querySelectorAll('.map-point');
const skillMap = document.getElementById('skillMap');

mapPoints.forEach(point => {
    point.addEventListener('mouseenter', (e) => {
        const title = e.target.getAttribute('data-title');
        const level = e.target.getAttribute('data-level');
        tooltip.innerHTML = `<strong>${title}</strong><br><span style="opacity: 0.7;">${level}</span>`;
        tooltip.classList.add('show');
    });

    point.addEventListener('mousemove', (e) => {
        const mapRect = skillMap.getBoundingClientRect();
        const x = e.clientX - mapRect.left;
        const y = e.clientY - mapRect.top;

        let tooltipX = x + 15;
        let tooltipY = y + 15;

        if (tooltipX + tooltip.offsetWidth > mapRect.width) {
            tooltipX = x - tooltip.offsetWidth - 15;
        }
        if (tooltipY + tooltip.offsetHeight > mapRect.height) {
            tooltipY = y - tooltip.offsetHeight - 15;
        }

        tooltip.style.left = tooltipX + 'px';
        tooltip.style.top = tooltipY + 'px';
    });

    point.addEventListener('mouseleave', () => {
        tooltip.classList.remove('show');
    });
});

// Initialize
renderCommands();
loadTheme();
