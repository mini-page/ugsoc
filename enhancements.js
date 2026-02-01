/**
 * Portfolio Enhancements Script
 * Includes: Matrix Rain, Scroll Animations, Parallax, Lazy Loading, Performance Optimizations
 * Author: Umang Gupta
 * Version: 2.0
 */

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
        
        this.chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        this.fontSize = 14;
        this.columns = this.canvas.width / this.fontSize;
        this.drops = Array(Math.floor(this.columns)).fill(1);
        
        this.init();
    }
    
    init() {
        setInterval(() => this.draw(), 33);
        window.addEventListener('resize', () => this.resize());
    }
    
    draw() {
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#8B5CF6';
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
    new MatrixRain('matrix-canvas');
});

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
        if (this.elements.length === 0) return;
        
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
class TypingAnimation {
    constructor(element, text, speed = 50) {
        if (!element) return;
        
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.charIndex = 0;
        
        this.type();
    }
    
    type() {
        if (this.charIndex < this.text.length) {
            this.element.textContent += this.text.charAt(this.charIndex);
            this.charIndex++;
            setTimeout(() => this.type(), this.speed);
        }
    }
}

// Initialize typing animation after page load
window.addEventListener('load', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        new TypingAnimation(typingElement, text, 50);
    }
});

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
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
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

// ========== 15. MICRO-INTERACTIONS ==========
// Add hover effects
document.querySelectorAll('.hover-lift, .hover-glow, .hover-scale').forEach(el => {
    el.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
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
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
}

console.log('🚀 Portfolio Enhancements Loaded Successfully');
console.log('⌨️  Keyboard Shortcuts: Ctrl+K (Search), Alt+T (Theme), Alt+H (Home), Alt+C (Contact)');
