/**
 * Portfolio Enhancements Script
 * Includes: Matrix Rain, Scroll Animations, Parallax, Lazy Loading, Performance Optimizations
 * Author: Umang Gupta
 * Version: 2.0
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========== 1. LOADING SCREEN ==========
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.add('page-transition');
        }, 1000);
    }
});

// ========== 2. MATRIX RAIN EFFECT ==========
class MatrixRain {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.chars = [
            '9621272014',
            'raghavans5711+portfolio@gmail.com',
            'ug_5711',
            'ug5711',
            'rg',
            'mini-page',
            'raghavan',
            'umang gupta',
            'UG-SOC',
            'security',
            'automation'
        ].join(' ');
        this.fontSize = 14;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);
        this.theme = document.documentElement.getAttribute('data-theme') || 'light';
        
        this.intervalId = null;
        this.isRunning = false;
        this.init();
    }
    
    init() {
        this.start();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('themechange', (e) => {
            this.theme = e.detail?.theme || this.theme;
        });
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.canvas.style.display = 'block';
        this.intervalId = setInterval(() => this.draw(), 33);
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.display = 'none';
    }
    
    draw() {
        const fade = this.theme === 'dark' ? 'rgba(2, 6, 23, 0.08)' : 'rgba(248, 250, 252, 0.12)';
        this.ctx.fillStyle = fade;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = scrollMax > 0 ? Math.min(1, window.scrollY / scrollMax) : 0;
        const styles = getComputedStyle(document.documentElement);
        const baseHue = this.theme === 'dark'
            ? parseFloat(styles.getPropertyValue('--matrix-hue-dark')) || 24
            : parseFloat(styles.getPropertyValue('--matrix-hue-light')) || 28;
        const range = parseFloat(styles.getPropertyValue('--matrix-hue-range')) || 22;
        const hue = baseHue + (ratio * range);
        const sat = this.theme === 'dark' ? 82 : 76;
        const light = this.theme === 'dark' ? 58 : 48;
        this.ctx.fillStyle = `hsl(${hue} ${sat}% ${light}%)`;
        this.ctx.font = this.fontSize + 'px monospace';
        
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * this.chars.length)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);
            
            if (this.drops[i] * this.fontSize > this.canvas.height && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);
    }
}

// Initialize Matrix Rain
document.addEventListener('DOMContentLoaded', () => {
    if (!prefersReducedMotion) {
        const saved = localStorage.getItem('matrixRain');
        const shouldStart = saved !== 'off';
        window.matrixRain = new MatrixRain('matrix-canvas');
        if (!shouldStart && window.matrixRain) {
            window.matrixRain.stop();
        }
    }
});

window.toggleMatrixRain = () => {
    if (prefersReducedMotion) return;
    if (!window.matrixRain) {
        window.matrixRain = new MatrixRain('matrix-canvas');
    }
    const shouldEnable = !window.matrixRain.isRunning;
    if (shouldEnable) {
        window.matrixRain.start();
        localStorage.setItem('matrixRain', 'on');
    } else {
        window.matrixRain.stop();
        localStorage.setItem('matrixRain', 'off');
    }
};

// ========== 3. SCROLL PROGRESS BAR ==========
class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress');
        if (!this.progressBar) return;
        
        window.addEventListener('scroll', () => this.update());
    }
    
    update() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        this.progressBar.style.width = scrolled + '%';
    }
}

new ScrollProgress();

// ========== 4. BACK TO TOP BUTTON ==========
class BackToTop {
    constructor() {
        this.button = document.querySelector('.back-to-top');
        if (!this.button) return;
        
        window.addEventListener('scroll', () => this.toggle());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
    
    toggle() {
        if (window.pageYOffset > 300) {
            this.button.classList.add('visible');
        } else {
            this.button.classList.remove('visible');
        }
    }
    
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

new BackToTop();

// ========== 5. SCROLL-TRIGGERED ANIMATIONS ==========
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
        if (prefersReducedMotion) {
            this.elements.forEach(el => el.classList.add('active'));
            return;
        }
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );
        
        this.init();
    }
    
    init() {
        this.elements.forEach(el => this.observer.observe(el));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optionally unobserve after animation
                // this.observer.unobserve(entry.target);
            }
        });
    }
}

new ScrollAnimations();

// ========== 6. PARALLAX EFFECT ==========
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.parallax');
        if (this.elements.length === 0 || prefersReducedMotion) return;
        
        window.addEventListener('scroll', () => this.update());
    }
    
    update() {
        const scrolled = window.pageYOffset;
        
        this.elements.forEach(el => {
            const speed = el.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
}

new ParallaxEffect();

// ========== 7. LAZY LOADING IMAGES ==========
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        if (this.images.length === 0) return;
        
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { rootMargin: '50px' }
        );
        
        this.init();
    }
    
    init() {
        this.images.forEach(img => this.observer.observe(img));
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                });
                this.observer.unobserve(img);
            }
        });
    }
}

new LazyLoader();

// ========== 8. TYPING ANIMATION ==========
function initTypingCycle() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const raw = typingElement.getAttribute('data-phrases') || '';
    const phrases = raw.split(',').map(p => p.trim()).filter(Boolean);
    const fallback = typingElement.textContent.trim();
    const items = phrases.length ? phrases : (fallback ? [fallback] : []);

    if (!items.length || prefersReducedMotion) {
        if (fallback) typingElement.textContent = fallback;
        return;
    }

    const maxLen = items.reduce((max, text) => Math.max(max, text.length), 0);
    if (window.matchMedia('(max-width: 767px)').matches) {
        typingElement.style.minWidth = '';
    } else {
        typingElement.style.minWidth = maxLen ? `${maxLen}ch` : '';
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timerId = null;
    let paused = false;

    const type = () => {
        if (paused) return;
        const current = items[phraseIndex % items.length];
        const nextText = isDeleting
            ? current.slice(0, Math.max(0, charIndex - 1))
            : current.slice(0, charIndex + 1);

        typingElement.textContent = nextText;
        charIndex = nextText.length;

        let delay = isDeleting ? 35 : 55;

        if (!isDeleting && charIndex === current.length) {
            delay = 1400;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex++;
            delay = 350;
        }

        timerId = setTimeout(type, delay);
    };

    const stopTyping = () => {
        paused = true;
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
    };

    const startTyping = () => {
        if (!paused) return;
        paused = false;
        type();
    };

    const hero = document.getElementById('hero');
    if (hero && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTyping();
                } else {
                    stopTyping();
                }
            });
        }, { threshold: 0.1 });
        observer.observe(hero);
    }

    type();
}

// Initialize typing animation after page load
window.addEventListener('load', initTypingCycle);

// ========== 9. SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ========== 10. PERFORMANCE: REQUEST IDLE CALLBACK ==========
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Load non-critical resources
        console.log('Portfolio loaded successfully');
    });
}

// ========== 11. OFFLINE SUPPORT (Service Worker Registration) ==========
const siteRootPrefix = window.location.pathname.includes('/pages/') ? '../' : './';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(`${siteRootPrefix}sw.js`)
            .then(registration => {
                console.log('ServiceWorker registered:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// ========== 12. PAGE VISIBILITY API ==========
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pause animations');
        // Pause expensive animations when page is hidden
    } else {
        console.log('Page visible - resume animations');
        // Resume animations
    }
});

// ========== 13. PERFORMANCE MONITORING ==========
if ('PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
            console.log('FID:', entry.processingStart - entry.startTime);
        });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
}

// ========== 14. INTERSECTION OBSERVER FOR ANALYTICS ==========
// Track when sections come into view
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Section viewed:', entry.target.id);
            // Send to analytics
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ========== 17.5 PROJECT POPOVER (TOUCH) ==========
const prefersHover = window.matchMedia('(hover: hover)').matches;
if (!prefersHover) {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const liveDemo = e.target.closest('a.live-demo');
            if (liveDemo) {
                return;
            }

            if (!card.classList.contains('show-popover')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                card.classList.add('show-popover');
                setTimeout(() => card.classList.remove('show-popover'), 2500);
            }
        }, true);
    });
}

// ========== 18. METRICS COUNTER ==========
const metrics = document.querySelectorAll('#metrics [data-count]');
if (metrics.length) {
    const metricsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (Number.isNaN(target)) return;
            let current = 0;
            const step = Math.max(1, Math.floor(target / 60));
            const tick = () => {
                current += step;
                if (current >= target) {
                    el.textContent = target + '+';
                    return;
                }
                el.textContent = current;
                requestAnimationFrame(tick);
            };
            tick();
            metricsObserver.unobserve(el);
        });
    }, { threshold: 0.4 });

    metrics.forEach(el => metricsObserver.observe(el));
}

// ========== 15. MICRO-INTERACTIONS ==========
// Add hover effects
document.querySelectorAll('.hover-lift, .hover-glow, .hover-scale').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// ========== 19. TESTIMONIALS (FRAGMENT + CAROUSEL) ==========
async function loadTestimonials() {
    const container = document.getElementById('testimonials-container');
    if (!container) return;
    try {
        const res = await fetch(`${siteRootPrefix}pages/testimonials.html`);
        const html = await res.text();
        container.innerHTML = html;
        initTestimonialsCarousel();
    } catch (err) {
        console.log('Testimonials load failed:', err);
    }
}

function initTestimonialsCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.testimonial-track');
    const cards = carousel.querySelectorAll('.testimonial-card');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let index = 0;

    const update = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
    };

    prevBtn?.addEventListener('click', () => {
        index = (index - 1 + cards.length) % cards.length;
        update();
    });

    nextBtn?.addEventListener('click', () => {
        index = (index + 1) % cards.length;
        update();
    });

    let timer = setInterval(() => {
        index = (index + 1) % cards.length;
        update();
    }, 4500);

    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', () => {
        timer = setInterval(() => {
            index = (index + 1) % cards.length;
            update();
        }, 4500);
    });
}

loadTestimonials();


// ========== 21. INTERACTIVE TERMINAL ==========
function initTerminal() {
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');
    const terminalShell = document.querySelector('.terminal-shell');
    if (!input || !output || !terminalShell) return;
    const ghost = document.createElement('div');
    ghost.className = 'terminal-ghost';
    input.parentElement.appendChild(ghost);

    const printLine = (text) => {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    };

    const statusEl = document.getElementById('terminalStatus');
    const themeChip = statusEl?.querySelector('[data-terminal-theme]');
    const matrixChip = statusEl?.querySelector('[data-terminal-matrix]');

    const updateStatus = () => {
        if (themeChip) {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            themeChip.textContent = `Theme:${theme}`;
        }
        if (matrixChip) {
            const on = window.matrixRain?.isRunning ?? (localStorage.getItem('matrixRain') !== 'off');
            matrixChip.textContent = `Matrix:${on ? 'on' : 'off'}`;
        }
    };

    updateStatus();
    window.addEventListener('themechange', updateStatus);

    const commands = {
        help: () => {
            printLine('<span class="terminal-accent">Core</span> help, status, clear, history');
            printLine('<span class="terminal-accent">Actions</span> theme [dark|light], matrix [on|off]');
            printLine('<span class="terminal-accent">Tools</span> calc &lt;expr&gt;, ping &lt;host&gt;, uptime, whoami, version');
        },
        status: () => {
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            const matrixOn = window.matrixRain?.isRunning ?? (localStorage.getItem('matrixRain') !== 'off');
            printLine(`Theme: <span class="terminal-accent">${theme}</span> · Matrix: <span class="terminal-accent">${matrixOn ? 'on' : 'off'}</span>`);
        },
        clear: () => {
            output.innerHTML = '';
        },
        history: () => {
            if (!history.length) {
                printLine('No history yet.');
                return;
            }
            const slice = history.slice(-8);
            printLine(`Recent: ${slice.map(cmd => `<span class="terminal-accent">${cmd}</span>`).join(' · ')}`);
        },
        theme: (arg) => {
            if (arg === 'dark' || arg === 'light') {
                if (typeof setTheme === 'function') {
                    setTheme(arg);
                }
                updateStatus();
                return;
            }
            if (typeof toggleTheme === 'function') {
                toggleTheme();
            }
            updateStatus();
        },
        matrix: (arg) => {
            if (arg === 'on') {
                if (typeof window.toggleMatrixRain === 'function' && window.matrixRain && !window.matrixRain.isRunning) {
                    window.toggleMatrixRain();
                }
            } else if (arg === 'off') {
                if (typeof window.toggleMatrixRain === 'function' && window.matrixRain && window.matrixRain.isRunning) {
                    window.toggleMatrixRain();
                }
            } else if (typeof window.toggleMatrixRain === 'function') {
                window.toggleMatrixRain();
            }
            updateStatus();
        },
        calc: (arg) => {
            if (!arg) {
                printLine('Usage: <span class="terminal-accent">calc 12*8+3</span>');
                return;
            }
            try {
                const safe = arg.replace(/[^-()/*+%.0-9 ]/g, '');
                const result = Function(`"use strict"; return (${safe})`)();
                printLine(`Result: <span class="terminal-accent">${result}</span>`);
            } catch (err) {
                printLine('Calc error. Check the expression.');
            }
        },
        ping: (arg) => {
            const host = arg || 'localhost';
            const ms = Math.floor(Math.random() * 60) + 12;
            printLine(`Pinging ${host} ... <span class="terminal-accent">${ms}ms</span>`);
        },
        uptime: () => {
            const secs = Math.floor(performance.now() / 1000);
            const mins = Math.floor(secs / 60);
            const hrs = Math.floor(mins / 60);
            printLine(`Uptime: <span class="terminal-accent">${hrs}h ${mins % 60}m ${secs % 60}s</span>`);
        },
        whoami: () => {
            printLine('umang-gupta@ug-soc');
        },
        version: () => {
            printLine('UG-SOC terminal v3.8');
        }
    };

    const aliases = {
        cls: 'clear',
        h: 'help',
        t: 'theme',
        m: 'matrix',
        c: 'calc'
    };

    const commandList = Object.keys(commands);
    const subcommands = {
        theme: ['dark', 'light'],
        matrix: ['on', 'off']
    };
    const history = [];
    let historyIndex = -1;
    const updateGhost = (value) => {
        if (!value) {
            ghost.textContent = '';
            return;
        }
        const tokens = value.split(' ').filter(Boolean);
        if (tokens.length === 1) {
            const match = commandList.find(cmd => cmd.startsWith(tokens[0]));
            if (!match || match === tokens[0]) {
                ghost.textContent = '';
                return;
            }
            ghost.textContent = match.slice(tokens[0].length);
            return;
        }
        const base = tokens[0];
        const tail = tokens[tokens.length - 1];
        const options = subcommands[base];
        if (!options) {
            ghost.textContent = '';
            return;
        }
        const match = options.find(cmd => cmd.startsWith(tail));
        if (!match || match === tail) {
            ghost.textContent = '';
            return;
        }
        ghost.textContent = match.slice(tail.length);
    };

    input.addEventListener('input', () => {
        updateGhost(input.value.trim().toLowerCase());
    });

    input.addEventListener('keydown', (e) => {
        let value = input.value.trim().toLowerCase();

        if (e.key === 'Tab') {
            e.preventDefault();
            if (!value) return;
            const tokens = value.split(' ').filter(Boolean);
            if (tokens.length === 1) {
                const matches = commandList.filter(cmd => cmd.startsWith(tokens[0]));
                if (matches.length === 1) {
                    input.value = matches[0];
                    updateGhost(matches[0]);
                } else if (matches.length > 1) {
                    printLine(`Suggestions: ${matches.map(m => `<span class="terminal-accent">${m}</span>`).join(', ')}`);
                }
            } else {
                const base = tokens[0];
                const tail = tokens[tokens.length - 1];
                const options = subcommands[base] || [];
                const matches = options.filter(cmd => cmd.startsWith(tail));
                if (matches.length === 1) {
                    tokens[tokens.length - 1] = matches[0];
                    input.value = tokens.join(' ');
                    updateGhost(input.value);
                } else if (matches.length > 1) {
                    printLine(`Suggestions: ${matches.map(m => `<span class="terminal-accent">${m}</span>`).join(', ')}`);
                }
            }
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!history.length) return;
            historyIndex = Math.min(historyIndex + 1, history.length - 1);
            input.value = history[history.length - 1 - historyIndex];
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!history.length) return;
            historyIndex = Math.max(historyIndex - 1, -1);
            input.value = historyIndex === -1 ? '' : history[history.length - 1 - historyIndex];
            return;
        }

        if (e.key !== 'Enter') return;
        if (!value) return;

        if (aliases[value]) {
            value = aliases[value];
        }
        printLine(`<span class="terminal-accent">$</span> ${value}`);
        history.push(value);
        historyIndex = -1;
        input.value = '';
        updateGhost('');

        const parts = value.split(' ').filter(Boolean);
        const cmd = parts[0];
        const arg = parts[1];
        if (commands[cmd]) {
            commands[cmd](arg);
        } else {
            printLine(`Unknown command. Type <span class="terminal-accent">help</span>.`);
        }
    });

    terminalShell.querySelectorAll('[data-terminal-cmd]').forEach((btn) => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-terminal-cmd');
            if (!cmd) return;
            input.value = cmd;
            input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            input.focus();
        });
    });
}

// ========== 22. PROJECTS COLLAPSE (MOBILE ONLY) ==========
function initProjectsToggle() {
    const section = document.getElementById('projects');
    const button = document.getElementById('projectsToggle');
    if (!section || !button) return;

    const label = button.querySelector('span');
    const media = window.matchMedia('(max-width: 767px)');
    let isCollapsed = true;

    const applyState = () => {
        if (media.matches) {
            section.classList.toggle('projects-collapsed', isCollapsed);
            button.style.display = 'inline-flex';
            button.setAttribute('aria-expanded', String(!isCollapsed));
            button.classList.toggle('is-expanded', !isCollapsed);
            if (label) {
                label.textContent = isCollapsed ? 'Show more projects' : 'Show fewer projects';
            }
        } else {
            section.classList.remove('projects-collapsed');
            button.style.display = 'none';
        }
    };

    button.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        applyState();
    });

    applyState();
    if (media.addEventListener) {
        media.addEventListener('change', applyState);
    } else if (media.addListener) {
        media.addListener(applyState);
    }
}

initTerminal();
initProjectsToggle();

// ========== 22.1 SKILL CAROUSEL ==========
function initSkillCarousel() {
    const track = document.querySelector('.skill-track');
    if (!track) return;
    const items = track.querySelectorAll('.skill-item');
    const pause = () => track.classList.add('paused');
    const resume = () => track.classList.remove('paused');
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', resume);
    track.addEventListener('click', pause);
    track.addEventListener('pointerleave', resume);
    items.forEach((item) => {
        item.addEventListener('mouseenter', pause);
        item.addEventListener('mouseleave', resume);
        item.addEventListener('focusin', pause);
        item.addEventListener('focusout', resume);
        item.addEventListener('click', () => {
            items.forEach((el) => el.classList.remove('is-active'));
            item.classList.add('is-active');
        });
    });
    setInterval(() => {
        if (track.classList.contains('paused')) {
            resume();
        }
    }, 5000);
}

initSkillCarousel();

// ========== 22.5 METRICS TOGGLE (MOBILE ONLY) ==========
function initMetricsToggle() {
    const section = document.getElementById('metrics');
    const button = document.getElementById('metricsToggle');
    if (!section || !button) return;

    const label = button.querySelector('span');
    const media = window.matchMedia('(max-width: 767px)');
    let isCollapsed = true;

    const applyState = () => {
        if (media.matches) {
            section.classList.toggle('metrics-collapsed', isCollapsed);
            button.style.display = 'inline-flex';
            button.setAttribute('aria-expanded', String(!isCollapsed));
            button.classList.toggle('is-expanded', !isCollapsed);
            if (label) {
                label.textContent = isCollapsed ? 'Show more metrics' : 'Show fewer metrics';
            }
        } else {
            section.classList.remove('metrics-collapsed');
            button.style.display = 'none';
        }
    };

    button.addEventListener('click', () => {
        isCollapsed = !isCollapsed;
        applyState();
    });

    applyState();
    if (media.addEventListener) {
        media.addEventListener('change', applyState);
    } else if (media.addListener) {
        media.addListener(applyState);
    }
}

initMetricsToggle();

// ========== 23. STACK RINGS ==========
document.querySelectorAll('.stack-ring').forEach(ring => {
    const level = Math.min(100, Math.max(0, parseInt(ring.dataset.level || '0', 10)));
    const deg = Math.round((level / 100) * 360);
    ring.style.background = `conic-gradient(#F97316 0deg ${deg}deg, rgba(148, 163, 184, 0.2) ${deg}deg 360deg)`;
});

// ========== 23. SKILL MAP PANEL ==========
function toggleSkillMapPanel(forceOpen) {
    const panel = document.getElementById('skillMapPanel');
    if (!panel) return;
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !panel.classList.contains('open');
    panel.classList.toggle('open', shouldOpen);
    panel.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
}

window.toggleSkillMapPanel = toggleSkillMapPanel;

// Close on outside click
document.addEventListener('click', (e) => {
    const panel = document.getElementById('skillMapPanel');
    if (!panel || !panel.classList.contains('open')) return;
    const toggle = e.target.closest('[data-skillmap-toggle]');
    if (panel.contains(e.target) || toggle) return;
    toggleSkillMapPanel(false);
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const panel = document.getElementById('skillMapPanel');
    if (panel?.classList.contains('open')) {
        toggleSkillMapPanel(false);
    }
    const terminalInput = document.getElementById('terminalInput');
    if (terminalInput && document.activeElement === terminalInput) {
        terminalInput.value = '';
    }
});

// ========== 16. KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', (e) => {
    // Alt + T for theme toggle
    if (e.altKey && e.key === 't') {
        e.preventDefault();
        if (typeof toggleTheme === 'function') {
            toggleTheme();
        }
    }
    
    // Alt + H for home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Alt + C for contact
    if (e.altKey && e.key === 'c') {
        e.preventDefault();
        const contact = document.getElementById('contact');
        if (contact) {
            contact.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ========== 17. REDUCE MOTION FOR ACCESSIBILITY ==========
if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
}

console.log('🚀 Portfolio Enhancements Loaded Successfully');
console.log('⌨️  Keyboard Shortcuts: Ctrl+K (Search), Alt+T (Theme), Alt+H (Home), Alt+C (Contact)');
