/**
 * Portfolio Enhancements Script
 * Includes: Matrix Rain, Scroll Animations, Parallax, Lazy Loading, Performance Optimizations
 * Author: Umang Gupta
 * Version: 2.0
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========== 1. LOADING SCREEN (FAST DISMISS) ==========
const dismissLoadingScreen = () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.style.transition = 'opacity 0.25s ease-out, visibility 0.25s ease-out';
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.add('page-transition');
        }, 250);
    }
};

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    dismissLoadingScreen();
} else {
    document.addEventListener('DOMContentLoaded', dismissLoadingScreen, { once: true });
}
// Fallback in case anything blocks DOMContentLoaded
setTimeout(dismissLoadingScreen, 1200);

// ========== 2. MATRIX RAIN EFFECT (OPTIMIZED 30 FPS / ZERO REFLOW) ==========
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
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
        this.theme = document.documentElement.getAttribute('data-theme') || 'light';

        this.animFrameId = null;
        this.isRunning = false;
        this.lastTime = 0;
        this.fpsInterval = 1000 / 30; // Cap at 30fps to save battery & CPU
        this.cachedScrollRatio = 0;
        this.cachedBaseHue = 24;
        this.cachedRange = 22;
        this.isPageVisible = !document.hidden;

        this.updateThemeCache();
        this.init();
    }

    updateThemeCache() {
        this.theme = document.documentElement.getAttribute('data-theme') || 'light';
        const styles = getComputedStyle(document.documentElement);
        this.cachedBaseHue = this.theme === 'dark'
            ? parseFloat(styles.getPropertyValue('--matrix-hue-dark')) || 24
            : parseFloat(styles.getPropertyValue('--matrix-hue-light')) || 28;
        this.cachedRange = parseFloat(styles.getPropertyValue('--matrix-hue-range')) || 22;
    }

    init() {
        window.addEventListener('resize', () => this.resize(), { passive: true });
        window.addEventListener('themechange', (e) => {
            this.theme = e.detail?.theme || this.theme;
            this.updateThemeCache();
        }, { passive: true });
        document.addEventListener('visibilitychange', () => {
            this.isPageVisible = !document.hidden;
            if (this.isPageVisible && this.isRunning && !this.animFrameId) {
                this.loop(performance.now());
            }
        });
        this.start();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.canvas.style.display = 'block';
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        if (this.animFrameId) {
            cancelAnimationFrame(this.animFrameId);
            this.animFrameId = null;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.style.display = 'none';
    }

    loop(currentTime) {
        if (!this.isRunning) return;
        this.animFrameId = requestAnimationFrame((t) => this.loop(t));

        if (!this.isPageVisible) return;

        const elapsed = currentTime - this.lastTime;
        if (elapsed > this.fpsInterval) {
            this.lastTime = currentTime - (elapsed % this.fpsInterval);
            this.draw();
        }
    }

    updateScrollRatio(ratio) {
        this.cachedScrollRatio = ratio;
    }

    draw() {
        const fade = this.theme === 'dark' ? 'rgba(2, 6, 23, 0.08)' : 'rgba(248, 250, 252, 0.12)';
        this.ctx.fillStyle = fade;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const hue = this.cachedBaseHue + (this.cachedScrollRatio * this.cachedRange);
        const sat = this.theme === 'dark' ? 82 : 76;
        const light = this.theme === 'dark' ? 58 : 48;
        this.ctx.fillStyle = `hsl(${hue} ${sat}% ${light}%)`;
        this.ctx.font = this.fontSize + 'px monospace';

        const charsLen = this.chars.length;
        const dropLimit = this.canvas.height;
        for (let i = 0; i < this.drops.length; i++) {
            const text = this.chars[Math.floor(Math.random() * charsLen)];
            this.ctx.fillText(text, i * this.fontSize, this.drops[i] * this.fontSize);

            if (this.drops[i] * this.fontSize > dropLimit && Math.random() > 0.975) {
                this.drops[i] = 0;
            }
            this.drops[i]++;
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(this.canvas.width / this.fontSize);
        this.drops = Array(this.columns).fill(1);
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

// ========== 3. UNIFIED HIGH-PERFORMANCE SCROLL MANAGER ==========
let scrollTicking = false;
let scrollProgressEl = null;
let backToTopEl = null;
let parallaxEls = [];

function initScrollManager() {
    scrollProgressEl = document.querySelector('.scroll-progress');
    backToTopEl = document.querySelector('.back-to-top');
    parallaxEls = prefersReducedMotion ? [] : Array.from(document.querySelectorAll('.parallax'));

    if (backToTopEl) {
        backToTopEl.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const onScrollTick = () => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollRatio = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;

        // Progress bar
        if (scrollProgressEl) {
            scrollProgressEl.style.width = (scrollRatio * 100) + '%';
        }

        // Back to top visibility
        if (backToTopEl) {
            if (scrollY > 300) {
                backToTopEl.classList.add('visible');
            } else {
                backToTopEl.classList.remove('visible');
            }
        }

        // Parallax elements
        if (parallaxEls.length) {
            parallaxEls.forEach((el) => {
                const speed = parseFloat(el.dataset.speed) || 0.5;
                el.style.transform = `translate3d(0, ${-(scrollY * speed)}px, 0)`;
            });
        }

        // Update Matrix Rain color hue based on scroll
        if (window.matrixRain && window.matrixRain.isRunning) {
            window.matrixRain.updateScrollRatio(scrollRatio);
        }

        scrollTicking = false;
    };

    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(onScrollTick);
            scrollTicking = true;
        }
    }, { passive: true });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollManager, { once: true });
} else {
    initScrollManager();
}

// ========== 4. SCROLL-TRIGGERED ANIMATIONS ==========
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
            }
        });
    }
}

new ScrollAnimations();

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

// ========== 22.2 VAULT FILTERS ==========
function initVaultFilters() {
    const filterWrap = document.querySelector('.vault-filters');
    const grid = document.querySelector('.vault-grid');
    const searchInput = document.querySelector('.vault-search input');
    if (!filterWrap || !grid) return;

    const items = grid.querySelectorAll('.vault-item');
    items.forEach((item) => {
        if (item.getAttribute('data-category')) {
            const key = item.getAttribute('data-key');
            if (!key) {
                const text = item.textContent || '';
                item.setAttribute('data-key', text.trim().toLowerCase());
            }
            return;
        }
        const img = item.querySelector('img');
        if (!img) return;
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const name = src.split('/').pop() || '';
        const ext = src.split('.').pop()?.toLowerCase() || '';
        let category = 'personal';
        if (ext === 'png') category = 'projects';
        if (ext === 'webp') category = 'certificates';
        if (ext === 'pdf') category = 'docs';
        if (ext === 'svg') category = 'resources';
        item.setAttribute('data-category', category);
        item.setAttribute('data-key', `${alt} ${name}`.toLowerCase());
    });

    const applyFilter = (filter, query) => {
        filterWrap.querySelectorAll('.vault-filter').forEach((btn) => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });
        items.forEach((item) => {
            const cat = item.getAttribute('data-category') || 'personal';
            const key = item.getAttribute('data-key') || '';
            const matchesQuery = !query || key.includes(query);
            const matchesFilter = filter === 'all' || filter === cat;
            item.style.display = (matchesFilter && matchesQuery) ? '' : 'none';
        });
    };

    filterWrap.querySelectorAll('.vault-filter').forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter') || 'all';
            const query = searchInput?.value.trim().toLowerCase() || '';
            applyFilter(filter, query);
        });
    });

    searchInput?.addEventListener('input', () => {
        const active = filterWrap.querySelector('.vault-filter.active');
        const filter = active?.getAttribute('data-filter') || 'all';
        const query = searchInput.value.trim().toLowerCase();
        applyFilter(filter, query);
    });
}

initVaultFilters();

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

// ========== 22.6 CERTIFICATE & BUILT-IN PDF VIEWER MODAL ==========
function initCertificateModal() {
    const modal = document.getElementById('certModal');
    const dialog = modal?.querySelector('.cert-modal-dialog');
    const titleEl = document.getElementById('certModalTitle');
    const imageEl = document.getElementById('certModalImage');
    const pdfEl = document.getElementById('certModalPdf');
    const detailsEl = document.getElementById('certModalDetails');
    const actionsEl = document.getElementById('certModalActions');
    const openPdfEl = document.getElementById('certModalOpenPdf');
    const downloadPdfEl = document.getElementById('certModalDownloadPdf');

    // Built-in PDF.js viewer controls
    const pdfViewerContainer = document.getElementById('pdfViewerContainer');
    const pdfLoadingSpinner = document.getElementById('pdfLoadingSpinner');
    const pdfCanvas = document.getElementById('certModalPdfCanvas');
    const pdfPrevPage = document.getElementById('pdfPrevPage');
    const pdfNextPage = document.getElementById('pdfNextPage');
    const pdfPageNum = document.getElementById('pdfPageNum');
    const pdfPageCount = document.getElementById('pdfPageCount');
    const pdfZoomIn = document.getElementById('pdfZoomIn');
    const pdfZoomOut = document.getElementById('pdfZoomOut');
    const pdfZoomLevel = document.getElementById('pdfZoomLevel');
    const pdfControls = document.getElementById('pdfControls');

    if (!modal || !dialog || !titleEl || !imageEl || !detailsEl) return;

    let currentPdfDoc = null;
    let currentPdfPage = 1;
    let currentPdfScale = 1.0;
    let pageRendering = false;
    let pageNumPending = null;

    let pdfJsPromise = null;
    const getPdfLib = () => {
        if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
        if (!pdfJsPromise) {
            pdfJsPromise = new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
                s.async = true;
                s.onload = () => {
                    if (window.pdfjsLib) {
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        resolve(window.pdfjsLib);
                    } else {
                        reject(new Error('PDF.js not loaded'));
                    }
                };
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }
        return pdfJsPromise;
    };

    const renderPdfPage = (num) => {
        if (!currentPdfDoc || !pdfCanvas) return;
        pageRendering = true;

        currentPdfDoc.getPage(num).then((page) => {
            const ctx = pdfCanvas.getContext('2d');
            const viewport = page.getViewport({ scale: currentPdfScale });

            const outputScale = window.devicePixelRatio || 1;
            pdfCanvas.width = Math.floor(viewport.width * outputScale);
            pdfCanvas.height = Math.floor(viewport.height * outputScale);
            pdfCanvas.style.width = Math.floor(viewport.width) + 'px';
            pdfCanvas.style.height = Math.floor(viewport.height) + 'px';

            const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

            const renderContext = {
                canvasContext: ctx,
                transform: transform,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
                pageRendering = false;
                if (pageNumPending !== null) {
                    renderPdfPage(pageNumPending);
                    pageNumPending = null;
                }
            });
        }).catch((err) => {
            console.error('PDF page render error:', err);
            pageRendering = false;
        });

        if (pdfPageNum) pdfPageNum.textContent = num;
        if (pdfPageCount && currentPdfDoc) pdfPageCount.textContent = currentPdfDoc.numPages;
        if (pdfPrevPage) pdfPrevPage.disabled = (num <= 1);
        if (pdfNextPage && currentPdfDoc) pdfNextPage.disabled = (num >= currentPdfDoc.numPages);
        if (pdfZoomLevel) pdfZoomLevel.textContent = Math.round(currentPdfScale * 100) + '%';
    };

    const queueRenderPage = (num) => {
        if (pageRendering) {
            pageNumPending = num;
        } else {
            renderPdfPage(num);
        }
    };

    if (pdfPrevPage) {
        pdfPrevPage.addEventListener('click', () => {
            if (currentPdfPage <= 1) return;
            currentPdfPage--;
            queueRenderPage(currentPdfPage);
        });
    }

    if (pdfNextPage) {
        pdfNextPage.addEventListener('click', () => {
            if (!currentPdfDoc || currentPdfPage >= currentPdfDoc.numPages) return;
            currentPdfPage++;
            queueRenderPage(currentPdfPage);
        });
    }

    if (pdfZoomIn) {
        pdfZoomIn.addEventListener('click', () => {
            if (currentPdfScale >= 2.5) return;
            currentPdfScale = Math.min(2.5, +(currentPdfScale + 0.2).toFixed(1));
            queueRenderPage(currentPdfPage);
        });
    }

    if (pdfZoomOut) {
        pdfZoomOut.addEventListener('click', () => {
            if (currentPdfScale <= 0.6) return;
            currentPdfScale = Math.max(0.6, +(currentPdfScale - 0.2).toFixed(1));
            queueRenderPage(currentPdfPage);
        });
    }

    const openModal = (src, title, details, mode = 'image') => {
        titleEl.textContent = title || 'Document Preview';

        if (actionsEl) actionsEl.hidden = true;
        if (openPdfEl) openPdfEl.setAttribute('href', '#');
        if (downloadPdfEl) downloadPdfEl.setAttribute('href', '#');
        imageEl.removeAttribute('src');
        imageEl.style.display = 'none';
        if (pdfEl) {
            pdfEl.removeAttribute('src');
            pdfEl.style.display = 'none';
        }
        if (pdfViewerContainer) pdfViewerContainer.style.display = 'none';
        if (pdfLoadingSpinner) pdfLoadingSpinner.style.display = 'none';

        dialog.classList.remove('is-text-preview');
        dialog.classList.remove('is-pdf-preview');
        detailsEl.classList.remove('active');
        detailsEl.innerHTML = '';

        if (mode === 'pdf' && src) {
            const absolutePdfUrl = new URL(src, window.location.href).href;
            dialog.classList.add('is-pdf-preview');
            if (actionsEl) actionsEl.hidden = false;
            if (openPdfEl) openPdfEl.setAttribute('href', absolutePdfUrl);
            if (downloadPdfEl) downloadPdfEl.setAttribute('href', absolutePdfUrl);

            if (pdfViewerContainer && pdfCanvas) {
                pdfViewerContainer.style.display = 'flex';
                if (pdfLoadingSpinner) pdfLoadingSpinner.style.display = 'flex';
                if (pdfControls) pdfControls.style.display = 'inline-flex';

                const containerWidth = Math.min(window.innerWidth * 0.85, 900);
                currentPdfScale = containerWidth < 600 ? 0.75 : 1.1;
                currentPdfPage = 1;

                getPdfLib().then((pdfjsLib) => {
                    return pdfjsLib.getDocument(absolutePdfUrl).promise;
                }).then((pdfDoc) => {
                    currentPdfDoc = pdfDoc;
                    if (pdfLoadingSpinner) pdfLoadingSpinner.style.display = 'none';
                    if (pdfPageCount) pdfPageCount.textContent = pdfDoc.numPages;
                    renderPdfPage(currentPdfPage);
                }).catch((err) => {
                    console.warn('PDF.js dynamic load/render failed, falling back to iframe:', err);
                    if (pdfLoadingSpinner) pdfLoadingSpinner.style.display = 'none';
                    if (pdfViewerContainer) pdfViewerContainer.style.display = 'none';
                    if (pdfControls) pdfControls.style.display = 'none';
                    if (pdfEl) {
                        pdfEl.src = `${absolutePdfUrl}#view=FitH`;
                        pdfEl.style.display = 'block';
                    }
                });
            } else if (pdfEl) {
                if (pdfControls) pdfControls.style.display = 'none';
                pdfEl.src = `${absolutePdfUrl}#view=FitH`;
                pdfEl.style.display = 'block';
            }
        } else if (src) {
            imageEl.src = encodeURI(src);
            imageEl.style.display = 'block';
        } else {
            dialog.classList.add('is-text-preview');
            const points = (details || '').split('|').map(p => p.trim()).filter(Boolean);
            const parsed = points.map((p) => {
                const idx = p.indexOf(':');
                if (idx === -1) return null;
                return {
                    heading: p.slice(0, idx).trim(),
                    body: p.slice(idx + 1).trim()
                };
            }).filter(Boolean);

            if (parsed.length) {
                const getMeta = (heading) => {
                    const key = heading.toLowerCase();
                    if (key.includes('cert')) {
                        return { cls: 'cert-modal-section--certifications', icon: 'fa-solid fa-certificate' };
                    }
                    if (key.includes('intern')) {
                        return { cls: 'cert-modal-section--internships', icon: 'fa-solid fa-briefcase' };
                    }
                    if (key.includes('project')) {
                        return { cls: 'cert-modal-section--projects', icon: 'fa-solid fa-diagram-project' };
                    }
                    return { cls: '', icon: 'fa-solid fa-list-check' };
                };

                detailsEl.innerHTML = `
                    <div class="cert-modal-sections">
                        ${parsed.map(item => `
                            <div class="cert-modal-section ${getMeta(item.heading).cls}">
                                <h4><i class="${getMeta(item.heading).icon}"></i>${item.heading}</h4>
                                <ul class="cert-modal-list">
                                    ${item.body
                                        .split(/,|;|•/)
                                        .map(x => x.trim())
                                        .filter(Boolean)
                                        .map(point => `<li class="cert-modal-item"><i class="fa-solid fa-angle-right"></i><span>${point}</span></li>`)
                                        .join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                detailsEl.innerHTML = `<ul>${points.map(p => `<li>${p}</li>`).join('')}</ul>`;
            }
            detailsEl.classList.add('active');
        }

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        imageEl.removeAttribute('src');
        imageEl.style.display = '';
        if (pdfEl) {
            pdfEl.removeAttribute('src');
            pdfEl.style.display = 'none';
        }
        if (pdfViewerContainer) pdfViewerContainer.style.display = 'none';
        currentPdfDoc = null;
        dialog.classList.remove('is-text-preview');
        dialog.classList.remove('is-pdf-preview');
        detailsEl.classList.remove('active');
        detailsEl.innerHTML = '';
        if (actionsEl) actionsEl.hidden = true;
        if (openPdfEl) openPdfEl.setAttribute('href', '#');
        if (downloadPdfEl) downloadPdfEl.setAttribute('href', '#');
    };

    document.querySelectorAll('.cert-card[data-cert-image]').forEach((card) => {
        const src = card.getAttribute('data-cert-image');
        const title = card.getAttribute('data-cert-title') || '';
        const details = card.getAttribute('data-cert-details') || '';
        if (!src) return;

        card.addEventListener('click', () => openModal(src, title, details, 'image'));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(src, title, details, 'image');
            }
        });
    });

    document.querySelectorAll('.cert-card[data-cert-details]:not([data-cert-image])').forEach((card) => {
        const title = card.getAttribute('data-cert-title') || '';
        const details = card.getAttribute('data-cert-details') || '';
        card.addEventListener('click', () => openModal('', title, details, 'text'));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal('', title, details, 'text');
            }
        });
    });

    // Handle all academic & resume documents with data-doc-pdf
    document.querySelectorAll('[data-doc-pdf]').forEach((doc) => {
        const src = doc.getAttribute('data-doc-pdf');
        const title = doc.getAttribute('data-doc-title') || 'Academic Document';
        if (!src) return;

        doc.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
            e.preventDefault();
            openModal(src, title, '', 'pdf');
        });
    });

    // Project card click delegation to repo link
    document.querySelectorAll('.project-card[data-repo]').forEach((card) => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            const repo = card.getAttribute('data-repo');
            if (repo) window.open(repo, '_blank', 'noopener,noreferrer');
        });
        card.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a, button')) {
                e.preventDefault();
                const repo = card.getAttribute('data-repo');
                if (repo) window.open(repo, '_blank', 'noopener,noreferrer');
            }
        });
    });

    modal.querySelectorAll('[data-cert-close]').forEach((el) => {
        el.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

initCertificateModal();

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

// ========== 23. SUBPAGE UNIFIED INTERACTIONS ==========
function initSubpageInteractions() {
    // 1. Highlight active subpage link
    const path = window.location.pathname.toLowerCase();
    document.querySelectorAll('.subpage-link').forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        const cleanHref = href.replace(/^\.\.\//, '').replace(/^\.\//, '');
        if (cleanHref && path.endsWith(cleanHref)) {
            link.classList.add('active');
        }
    });

    // 2. Universal Code Block Copy Buttons
    document.querySelectorAll('.code-copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.code-block-wrapper');
            const codeEl = wrapper?.querySelector('code, pre');
            const textToCopy = btn.getAttribute('data-copy') || codeEl?.textContent || '';
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy.trim());
                const originalHtml = btn.innerHTML;
                btn.classList.add('copied');
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = originalHtml;
                }, 2000);
            } catch (err) {
                console.warn('Copy failed:', err);
            }
        });
    });

    // 3. Subpage Generic Filter & Search (Tool Index, Archive, Blog, Log)
    const filterWrappers = document.querySelectorAll('[data-filter-group]');
    filterWrappers.forEach(group => {
        const targetSelector = group.getAttribute('data-filter-target');
        const items = document.querySelectorAll(targetSelector);
        const searchInput = group.querySelector('.subpage-search-input');
        const filterPills = group.querySelectorAll('.filter-pill');

        const runFilter = () => {
            const activePill = group.querySelector('.filter-pill.active');
            const category = activePill ? activePill.getAttribute('data-category') : 'all';
            const query = (searchInput?.value || '').trim().toLowerCase();

            items.forEach(item => {
                const itemCat = (item.getAttribute('data-category') || 'all').toLowerCase();
                const itemText = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
                const matchesCat = category === 'all' || itemCat.split(' ').includes(category);
                const matchesQuery = !query || itemText.includes(query);
                item.style.display = (matchesCat && matchesQuery) ? '' : 'none';
            });

            // Update item count if present
            const countEl = group.querySelector('.filter-count');
            if (countEl) {
                const visibleCount = Array.from(items).filter(i => i.style.display !== 'none').length;
                countEl.textContent = `Showing ${visibleCount} of ${items.length}`;
            }
        };

        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                runFilter();
            });
        });

        if (searchInput) {
            searchInput.addEventListener('input', runFilter);
        }
    });

    // 4. Blog Article Modal Reader
    const articleModal = document.getElementById('articleModal');
    if (articleModal) {
        const modalBackdrop = articleModal.querySelector('.article-modal-backdrop');
        const modalClose = articleModal.querySelector('.article-modal-close');
        const modalContent = document.getElementById('articleModalContent');

        const closeArticle = () => {
            articleModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (modalBackdrop) modalBackdrop.addEventListener('click', closeArticle);
        if (modalClose) modalClose.addEventListener('click', closeArticle);

        document.querySelectorAll('[data-read-article]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const articleId = trigger.getAttribute('data-read-article');
                const articleSource = document.getElementById(`article-data-${articleId}`);
                if (articleSource && modalContent) {
                    modalContent.innerHTML = articleSource.innerHTML;
                    articleModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    // 5. Vault Lightbox
    const vaultLightbox = document.getElementById('vaultLightbox');
    if (vaultLightbox) {
        const lightboxImg = document.getElementById('vaultLightboxImg');
        const lightboxTitle = document.getElementById('vaultLightboxTitle');
        const lightboxDownload = document.getElementById('vaultLightboxDownload');
        const lightboxClose = vaultLightbox.querySelector('.vault-lightbox-close');
        const lightboxBackdrop = vaultLightbox.querySelector('.vault-lightbox-backdrop');

        const closeLightbox = () => {
            vaultLightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

        document.querySelectorAll('.vault-item img').forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', () => {
                const src = img.getAttribute('src');
                const alt = img.getAttribute('alt') || 'Vault Media Preview';
                if (lightboxImg) lightboxImg.src = src;
                if (lightboxTitle) lightboxTitle.textContent = alt;
                if (lightboxDownload) lightboxDownload.href = src;
                vaultLightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }

    // 6. Global Escape handler for subpage modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const articleModal = document.getElementById('articleModal');
            if (articleModal && articleModal.classList.contains('active')) {
                articleModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            const vaultLightbox = document.getElementById('vaultLightbox');
            if (vaultLightbox && vaultLightbox.classList.contains('active')) {
                vaultLightbox.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubpageInteractions);
} else {
    initSubpageInteractions();
}

console.log('🚀 Portfolio Enhancements Loaded Successfully');
console.log('⌨️  Keyboard Shortcuts: Ctrl+K (Search), Alt+T (Theme), Alt+H (Home), Alt+C (Contact)');
