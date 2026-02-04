// Command Palette Data
const commands = [
    // Navigation Sections
    { icon: '📁', title: 'About', subtitle: 'Section', type: 'section', target: 'about' },
    { icon: '⚡', title: 'Skills', subtitle: 'Section', type: 'section', target: 'skills', quickAction: 'openSkillMap', quickLabel: 'Heatmap' },
    {
        icon: '💼',
        title: 'Projects',
        subtitle: 'Section',
        type: 'section',
        target: 'projects',
        quickAction: 'openGitHub',
        quickLabel: 'GitHub',
        chips: [
            { label: 'asllock', url: 'https://github.com/mini-page/asllock' },
            { label: 'TheSecretJuice', url: 'https://github.com/mini-page/TheSecretJuice' },
            { label: 'SejdaCrack', url: 'https://github.com/mini-page/SejdaCrack' },
            { label: 'trackify', url: 'https://github.com/mini-page/trackify' },
            { label: 'sniprun', url: 'https://github.com/mini-page/sniprun' },
            { label: 'SyncMaster', url: 'https://github.com/mini-page/SyncMaster' },
            { label: 'Cyber-path', url: 'https://github.com/mini-page/Cyber-path' },
            { label: 'skfitness', url: 'https://github.com/mini-page/skfitness' },
            { label: 'rahulsoni.in', url: 'https://github.com/mini-page/rahulsoni.in' },
        ]
    },
    { icon: '📄', title: 'Resume', subtitle: 'Section', type: 'section', target: 'resume', quickAction: 'downloadResume', quickLabel: 'Download' },
    { icon: '🎓', title: 'Certifications', subtitle: 'Section', type: 'section', target: 'certifications' },
    { icon: '💡', title: 'Experience', subtitle: 'Section', type: 'section', target: 'experience' },
    { icon: '📧', title: 'Contact', subtitle: 'Section', type: 'section', target: 'contact', quickAction: 'email', quickLabel: 'Email' },
    { icon: '🏠', title: 'Go to Top', subtitle: 'Navigation', type: 'section', target: 'hero' },

    // Settings & Theme
    { icon: '🌙', title: 'Toggle Theme', subtitle: 'Settings', type: 'action', action: 'toggleTheme' },
    { icon: '↻', title: 'Reload Page', subtitle: 'Settings', type: 'action', action: 'reload' },
    { icon: '🔍', title: 'Scroll to Skills Heatmap', subtitle: 'Navigation', type: 'action', action: 'scrollToSkillMap' },

    // Social & Resources
    {
        icon: '<i class="fa-solid fa-link"></i>',
        title: 'Social Links',
        subtitle: 'Quick links',
        type: 'group',
        chips: [
            { label: 'GitHub', url: 'https://github.com/mini-page/' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/ug5711' },
            { label: 'HackTheBox', url: 'https://account.hackthebox.com/ug5711' },
            { label: 'LetsDefend', url: 'https://app.letsdefend.io/user/ug5711' },
            { label: 'TryHackMe', url: 'https://tryhackme.com/p/ug5711' },
            { label: 'Medium', url: 'https://medium.com/@ug5711' },
            { label: 'X', url: 'https://x.com/ug_5711' },
            { label: 'Threads', url: 'https://www.threads.com/@ug_5711' },
            { label: 'Instagram', url: 'https://www.instagram.com/ug_5711' },
            { label: 'YouTube', url: 'https://www.youtube.com/@ug5711' },
            { label: 'Reddit', url: 'https://www.reddit.com/user/Raghavs5711/' },
            { label: 'Pinterest', url: 'https://in.pinterest.com/ug_5711/' },
            { label: 'Snapchat', url: 'https://www.snapchat.com/add/rg_5711' },
            { label: 'Telegram', url: 'http://t.me/@ug_5711' },
        ]
    },
    {
        icon: '📚',
        title: 'Resources',
        subtitle: 'Pages',
        type: 'group',
        chips: [
            { label: 'Tool Index', url: 'tool-index.html' },
            { label: 'Case Studies', url: 'case-studies.html' },
            { label: 'Blog', url: 'blog.html' },
            { label: 'Terminal', url: '#terminal' },
        ]
    },
];

let selectedIndex = 0;
let filteredCommands = [...commands];
let secretUnlocked = false;
let secretActiveTrigger = null;
let secretTimer = null;

// Secret registry (future-proof)
const secrets = [
    {
        trigger: 'rg',
        icon: '<i class="fa-brands fa-whatsapp"></i>',
        title: 'WhatsApp',
        subtitle: 'Direct Message',
        type: 'link',
        target: 'https://wa.me/919621272014',
        quickAction: 'openWhatsApp',
        quickLabel: 'Message'
    },
    {
        trigger: 'pic',
        icon: '🗂️',
        title: 'Vault',
        subtitle: 'Open private gallery',
        type: 'link',
        target: 'vault.html',
        quickAction: 'openVault',
        quickLabel: 'Open'
    },
    {
        trigger: 'arc',
        icon: '🗃️',
        title: 'Archive',
        subtitle: 'Legacy drops',
        type: 'link',
        target: 'arc.html',
        quickAction: 'openArc',
        quickLabel: 'Open'
    },
    {
        trigger: 'log',
        icon: '🧾',
        title: 'Latest Log',
        subtitle: 'Recent updates',
        type: 'link',
        target: 'log.html',
        quickAction: 'openLog',
        quickLabel: 'Open'
    }
];

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
        const actionMarkup = cmd.quickAction
            ? `<button class="command-action" data-action="${cmd.quickAction}">${cmd.quickLabel || 'Action'}</button>`
            : `<div class="command-hint">${cmd.type === 'info' ? '' : 'Enter'}</div>`;

        const chipsMarkup = Array.isArray(cmd.chips)
            ? `<div class="command-chips">${cmd.chips.map(chip => {
                const brand = chip.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                return `<button class="command-chip" data-brand="${brand}" data-url="${chip.url}">${chip.label}</button>`;
            }).join('')}</div>`
            : '';

        item.innerHTML = `
    <div class="command-icon">${cmd.icon}</div>
    <div class="command-details">
        <div class="command-title">${cmd.title}</div>
        <div class="command-subtitle">${cmd.subtitle}</div>
        ${chipsMarkup}
    </div>
    ${actionMarkup}
    `;
        if (cmd.type !== 'info' && cmd.type !== 'group') {
            item.addEventListener('click', (e) => {
                if (e.shiftKey && cmd.quickAction) {
                    executeQuickAction(cmd);
                    return;
                }
                executeCommand(cmd);
            });
        }
        if (cmd.quickAction) {
            const btn = item.querySelector('.command-action');
            btn?.addEventListener('click', (e) => {
                e.stopPropagation();
                executeQuickAction(cmd);
            });
        }
        if (cmd.chips) {
            item.querySelectorAll('.command-chip').forEach((chip) => {
                chip.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const url = chip.getAttribute('data-url');
                    if (!url) return;
                    if (url.startsWith('#')) {
                        document.querySelector(url)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        window.open(url, '_blank');
                    }
                });
            });
        }
        list.appendChild(item);
    });
}

function executeQuickAction(cmd) {
    if (!cmd || !cmd.quickAction) return;
    switch (cmd.quickAction) {
        case 'downloadResume':
            window.open('/assets/UmangGupta_Resume.pdf', '_blank');
            break;
        case 'email':
            window.location.href = 'mailto:raghavans5711+portfolio@gmail.com';
            break;
        case 'openSkillMap':
            if (typeof toggleSkillMapPanel === 'function') {
                toggleSkillMapPanel(true);
            }
            break;
        case 'openGitHub':
            window.open('https://github.com/mini-page/', '_blank');
            break;
        case 'openVault':
            window.open('vault.html', '_blank');
            break;
        case 'openArc':
            window.open('arc.html', '_blank');
            break;
        case 'openLog':
            window.open('log.html', '_blank');
            break;
        case 'openWhatsApp':
            window.open('https://wa.me/919621272014', '_blank');
            break;
        default:
            break;
    }
}

// Search Commands
function searchCommands(query) {
    const rawQuery = query.toLowerCase();
    const queryTrimmed = rawQuery.trim();

    if (!queryTrimmed) {
        filteredCommands = [...commands];
        secretUnlocked = false;
        if (secretTimer) {
            clearTimeout(secretTimer);
            secretTimer = null;
        }
    } else {
        filteredCommands = commands.filter(cmd => {
            const hit = cmd.title.toLowerCase().includes(queryTrimmed) ||
                cmd.subtitle.toLowerCase().includes(queryTrimmed);
            const chipHit = Array.isArray(cmd.chips) && cmd.chips.some(chip =>
                chip.label.toLowerCase().includes(queryTrimmed)
            );
            return hit || chipHit;
        });
    }

    const secret = secrets.find(s => rawQuery.startsWith(s.trigger));
    if (secret) {
        const shouldReveal = secretUnlocked && secretActiveTrigger === secret.trigger && rawQuery.length > secret.trigger.length;
        if (shouldReveal) {
            filteredCommands = [{
                icon: secret.icon || '🗂️',
                ...secret
            }];
            renderCommands();
            return;
        }
        if (!secretUnlocked || secretActiveTrigger !== secret.trigger) {
            filteredCommands = [
                {
                    icon: '>',
                    title: 'Unlocking secure channel...',
                    subtitle: 'Typing sequence detected',
                    type: 'info'
                }
            ];
            secretUnlocked = true;
            secretActiveTrigger = secret.trigger;
            if (secretTimer) {
                clearTimeout(secretTimer);
            }
            secretTimer = setTimeout(() => {
                secretTimer = null;
                renderCommands();
            }, 700);
        }
        return;
    }

    secretUnlocked = false;
    secretActiveTrigger = null;
    if (secretTimer) {
        clearTimeout(secretTimer);
        secretTimer = null;
    }

    selectedIndex = 0;
    renderCommands();
}

// Execute Command
function executeCommand(cmd) {
    if (cmd.type === 'group') {
        return;
    }
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
            const cmd = filteredCommands[selectedIndex];
            if (e.shiftKey && cmd.quickAction) {
                executeQuickAction(cmd);
            } else {
                executeCommand(cmd);
            }
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

// Footer hint for quick actions
const paletteFooter = document.querySelector('.command-footer');
if (paletteFooter && !paletteFooter.querySelector('[data-shift-hint]')) {
    const hint = document.createElement('div');
    hint.className = 'command-footer-item';
    hint.setAttribute('data-shift-hint', 'true');
    hint.innerHTML = '<span class="command-key">Shift+Enter</span><span>Action</span>';
    paletteFooter.appendChild(hint);
}

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
