// Command Palette Data
const commands = [
    // Navigation Sections
    { icon: '<i class="fa-solid fa-id-badge" style="color:#38BDF8;"></i>', title: 'About', subtitle: 'Section', type: 'section', target: 'about' },
    { icon: '<i class="fa-solid fa-bolt" style="color:#F59E0B;"></i>', title: 'Skills', subtitle: 'Section', type: 'section', target: 'skills', quickAction: 'openSkillMap', quickLabel: 'Heatmap' },
    {
        icon: '<i class="fa-solid fa-diagram-project" style="color:#A855F7;"></i>',
        title: 'Projects',
        subtitle: 'Section',
        type: 'section',
        target: 'projects',
        quickAction: 'openGitHub',
        quickLabel: 'GitHub',
        chips: [
            { label: 'Cleanify', url: 'https://github.com/mini-page/Cleanify' },
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
    { icon: '<i class="fa-solid fa-file-lines" style="color:#FB923C;"></i>', title: 'Resume', subtitle: 'Section', type: 'section', target: 'resume', quickAction: 'downloadResume', quickLabel: 'Download' },
    { icon: '<i class="fa-solid fa-certificate" style="color:#22C55E;"></i>', title: 'Certifications', subtitle: 'Section', type: 'section', target: 'certifications' },
    { icon: '<i class="fa-solid fa-briefcase" style="color:#60A5FA;"></i>', title: 'Experience', subtitle: 'Section', type: 'section', target: 'experience' },
    { icon: '<i class="fa-solid fa-envelope" style="color:#F97316;"></i>', title: 'Contact', subtitle: 'Section', type: 'section', target: 'contact', quickAction: 'email', quickLabel: 'Email' },
    { icon: '<i class="fa-solid fa-arrow-up" style="color:#E2E8F0;"></i>', title: 'Go to Top', subtitle: 'Navigation', type: 'section', target: 'hero' },

    // Settings & Theme
    { icon: '<i class="fa-solid fa-circle-half-stroke" style="color:#94A3B8;"></i>', title: 'Toggle Theme', subtitle: 'Settings', type: 'action', action: 'toggleTheme', toggle: true },
    { icon: '<i class="fa-solid fa-water" style="color:#38BDF8;"></i>', title: 'Toggle Matrix Rain', subtitle: 'Effects', type: 'action', action: 'toggleMatrix', toggle: true },
    { icon: '<i class="fa-solid fa-rotate-right" style="color:#38BDF8;"></i>', title: 'Reload Page', subtitle: 'Settings', type: 'action', action: 'reload' },

    // Social & Resources
    {
        icon: '<i class="fa-solid fa-link" style="color:#60A5FA;"></i>',
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
            { label: 'X.com', url: 'https://x.com/ug_5711' },
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
        icon: '<i class="fa-solid fa-book-open" style="color:#F59E0B;"></i>',
        title: 'Resources & Subpages',
        subtitle: 'Console Pages',
        type: 'group',
        chips: [
            { label: 'Blog', url: 'pages/blog.html' },
            { label: 'Case Studies', url: 'pages/case-studies.html' },
            { label: 'Tool Index', url: 'pages/tool-index.html' },
            { label: 'Change Log', url: 'pages/log.html' },
            { label: 'Archive', url: 'pages/arc.html' },
            { label: 'Vault', url: 'pages/vault.html' },
            { label: 'Terminal', url: '#terminal' },
        ]
    },
    { icon: '<i class="fa-solid fa-newspaper" style="color:#38BDF8;"></i>', title: 'Blog & Field Notes', subtitle: 'Technical Articles', type: 'link', target: 'pages/blog.html', sameTab: true },
    { icon: '<i class="fa-solid fa-microchip" style="color:#A855F7;"></i>', title: 'Case Studies', subtitle: 'Engineering Architecture', type: 'link', target: 'pages/case-studies.html', sameTab: true },
    { icon: '<i class="fa-solid fa-wrench" style="color:#10B981;"></i>', title: 'Tool Index', subtitle: 'Command Reference', type: 'link', target: 'pages/tool-index.html', sameTab: true },
    { icon: '<i class="fa-solid fa-clipboard-list" style="color:#F59E0B;"></i>', title: 'System Change Log', subtitle: 'Version History', type: 'link', target: 'pages/log.html', sameTab: true },
    { icon: '<i class="fa-solid fa-box-archive" style="color:#F97316;"></i>', title: 'Legacy Archive', subtitle: 'Historic Drops & Prototypes', type: 'link', target: 'pages/arc.html', sameTab: true },
    { icon: '<i class="fa-solid fa-vault" style="color:#EC4899;"></i>', title: 'Private Vault', subtitle: 'Visual Media & Assets', type: 'link', target: 'pages/vault.html', sameTab: true },
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
        icon: '<i class="fa-brands fa-whatsapp" style="color:#22C55E;"></i>',
        title: 'WhatsApp',
        subtitle: 'Direct Message',
        type: 'link',
        target: 'https://wa.me/919621272014',
        quickAction: 'openWhatsApp',
        quickLabel: 'Message'
    },
    {
        trigger: 'pic',
        icon: '<i class="fa-solid fa-vault" style="color:#A855F7;"></i>',
        title: 'Vault',
        subtitle: 'Open private gallery',
        type: 'link',
        target: 'pages/vault.html',
        quickAction: 'openVault',
        quickLabel: 'Open'
    },
    {
        trigger: 'arc',
        icon: '<i class="fa-solid fa-box-archive" style="color:#F97316;"></i>',
        title: 'Archive',
        subtitle: 'Legacy drops',
        type: 'link',
        target: 'pages/arc.html',
        quickAction: 'openArc',
        quickLabel: 'Open'
    },
    {
        trigger: 'log',
        icon: '<i class="fa-solid fa-clipboard-list" style="color:#38BDF8;"></i>',
        title: 'Latest Log',
        subtitle: 'Recent updates',
        type: 'link',
        target: 'pages/log.html',
        quickAction: 'openLog',
        quickLabel: 'Open'
    },
    {
        trigger: 'playground',
        icon: '<i class="fa-solid fa-gamepad" style="color:#F97316;"></i>',
        title: 'Productivity Playground',
        subtitle: 'Hidden productivity lab',
        type: 'link',
        target: 'https://mini-page.github.io/Playground/',
        quickAction: 'openPlayground',
        quickLabel: 'Enter'
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
        let actionMarkup = '';
        if (cmd.toggle) {
            const isOn = getToggleState(cmd.action);
            actionMarkup = `<button class="command-switch" role="switch" aria-checked="${isOn ? 'true' : 'false'}" data-toggle="${cmd.action}">
                <span class="command-switch-track"></span>
                <span class="command-switch-knob"></span>
            </button>`;
        } else if (cmd.quickAction) {
            actionMarkup = `<button class="command-action" data-action="${cmd.quickAction}">${cmd.quickLabel || 'Action'}</button>`;
        } else {
            actionMarkup = `<div class="command-hint">${cmd.type === 'info' ? '' : 'Enter'}</div>`;
        }

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
                renderCommands();
            });
        }
        if (cmd.quickAction) {
            const btn = item.querySelector('.command-action');
            btn?.addEventListener('click', (e) => {
                e.stopPropagation();
                executeQuickAction(cmd);
            });
        }
        if (cmd.toggle) {
            const toggle = item.querySelector('.command-switch');
            toggle?.addEventListener('click', (e) => {
                e.stopPropagation();
                executeCommand(cmd);
                renderCommands();
            });
        }
        if (cmd.chips) {
            item.querySelectorAll('.command-chip').forEach((chip) => {
                chip.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const rawUrl = chip.getAttribute('data-url');
                    if (!rawUrl) return;
                    if (rawUrl.startsWith('#')) {
                        const isSubpage = window.location.pathname.includes('/pages/');
                        if (isSubpage) {
                            window.location.href = '../index.html' + rawUrl;
                        } else {
                            document.querySelector(rawUrl)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    } else {
                        const resolved = resolveSubpageUrl(rawUrl);
                        if (rawUrl.startsWith('pages/') || rawUrl.endsWith('.html')) {
                            window.location.href = resolved;
                        } else {
                            window.open(resolved, '_blank');
                        }
                    }
                });
            });
        }
        list.appendChild(item);
    });
}

function getToggleState(action) {
    if (action === 'toggleTheme') {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        return theme === 'dark';
    }
    if (action === 'toggleMatrix') {
        if (window.matrixRain && typeof window.matrixRain.isRunning === 'boolean') {
            return window.matrixRain.isRunning;
        }
        return localStorage.getItem('matrixRain') !== 'off';
    }
    return false;
}

function resolveSubpageUrl(url) {
    if (!url) return '';
    if (url.startsWith('#') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
        return url;
    }
    const isSubpage = window.location.pathname.includes('/pages/');
    if (isSubpage) {
        if (url.startsWith('pages/')) {
            return url.replace(/^pages\//, '');
        }
        if (url.startsWith('./') || url.startsWith('assets/')) {
            return '../' + url.replace(/^\.\//, '');
        }
    }
    return url;
}

function executeQuickAction(cmd) {
    if (!cmd || !cmd.quickAction) return;
    switch (cmd.quickAction) {
        case 'downloadResume':
            window.open(resolveSubpageUrl('./assets/UmangGupta_Resume.pdf'), '_blank');
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
            window.location.href = resolveSubpageUrl('pages/vault.html');
            break;
        case 'openArc':
            window.location.href = resolveSubpageUrl('pages/arc.html');
            break;
        case 'openLog':
            window.location.href = resolveSubpageUrl('pages/log.html');
            break;
        case 'openPlayground':
            window.open('https://mini-page.github.io/Playground/', '_blank');
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
                    icon: '<i class="fa-solid fa-key" style="color:#F59E0B;"></i>',
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
        } else {
            const isSubpage = window.location.pathname.includes('/pages/');
            if (isSubpage) {
                window.location.href = '../index.html#' + cmd.target;
            }
        }
    } else if (cmd.type === 'link') {
        const target = resolveSubpageUrl(cmd.target);
        if (cmd.sameTab) {
            window.location.href = target;
        } else {
            window.open(target, '_blank');
        }
    } else if (cmd.type === 'action') {
        switch (cmd.action) {
            case 'toggleTheme':
                toggleTheme();
                break;
            case 'toggleMatrix':
                if (typeof window.toggleMatrixRain === 'function') {
                    window.toggleMatrixRain();
                }
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
    if (!cmd.toggle) {
        toggleCommandPalette();
    }
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
                renderCommands();
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
