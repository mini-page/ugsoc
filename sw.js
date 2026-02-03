/**
 * Service Worker for UG-SOC Portfolio
 * Provides offline functionality and performance optimization through caching
 */

const CACHE_NAME = 'ug-soc-v1.0.0';
const RUNTIME_CACHE = 'ug-soc-runtime-v1.0.0';

// Resources to cache immediately
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/blog.html',
    '/case-studies.html',
    '/tool-index.html',
    '/testimonials.html',
    '/style.css',
    '/scripts.js',
    '/CommandPalette.js',
    '/enhancements.js',
    '/manifest.json',
    '/assets/resume-preview.svg',
    '/assets/project-asllock.svg',
    '/assets/project-secretjuice.svg',
    '/assets/project-sejdacrack.svg',
    '/assets/project-trackify.svg',
    '/assets/project-sniprun.svg',
    '/assets/project-syncmaster.svg',
    '/assets/project-cyberpath.svg',
    '/assets/project-skfitness.svg',
    '/assets/project-rahulsoni.svg',
    '/assets/UmangGupta_Resume.pdf',
    '/icon.svg'
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('[ServiceWorker] Install event');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[ServiceWorker] Pre-caching offline resources');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[ServiceWorker] Activate event');
    
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!currentCaches.includes(cacheName)) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin) && 
        !event.request.url.includes('cdn') && 
        !event.request.url.includes('fonts')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                console.log('[ServiceWorker] Serving from cache:', event.request.url);
                return cachedResponse;
            }
            
            return caches.open(RUNTIME_CACHE).then(cache => {
                return fetch(event.request).then(response => {
                    // Cache successful responses
                    if (response.status === 200) {
                        cache.put(event.request, response.clone());
                    }
                    return response;
                }).catch(error => {
                    console.log('[ServiceWorker] Fetch failed:', error);
                    
                    // Return offline page for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                    
                    throw error;
                });
            });
        })
    );
});

// Background sync
self.addEventListener('sync', event => {
    if (event.tag === 'sync-portfolio') {
        console.log('[ServiceWorker] Background sync');
        event.waitUntil(syncPortfolio());
    }
});

async function syncPortfolio() {
    // Sync logic here
    console.log('[ServiceWorker] Syncing portfolio data');
}

// Push notifications (optional)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icon-192.png',
            badge: '/badge-72.png',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            }
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});

console.log('[ServiceWorker] Loaded successfully');
