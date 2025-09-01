// Service Worker for Luxe Fragrances
const CACHE_NAME = 'luxe-fragrances-v1.0.0';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/login.html',
    '/admin.html',
    '/account.html',
    '/css/styles.css',
    '/css/admin.css',
    '/js/auth.js',
    '/js/script.js',
    '/js/admin.js',
    '/js/aliexpress.js',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/favicon-32x32.png',
    '/favicon-16x16.png'
];

// External resources to cache
const EXTERNAL_RESOURCES = [
    'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Montserrat:wght@300;400;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-regular-400.woff2'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Failed to cache static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/css/')) {
        // Cache JavaScript and CSS files
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (url.pathname.startsWith('/images/') || url.pathname.includes('placeholder.com')) {
        // Cache images with network-first strategy
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else if (url.pathname === '/' || url.pathname.endsWith('.html')) {
        // Cache HTML pages
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://cdnjs.cloudflare.com') {
        // Cache external resources
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else {
        // Default network-first strategy for other requests
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Cache-first strategy
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Cache-first strategy failed:', error);
        return new Response('Network error', { status: 503 });
    }
}

// Network-first strategy
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
        }
        
        return new Response('Offline content not available', { status: 503 });
    }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Sync offline data when connection is restored
        console.log('Performing background sync...');
        
        // You can implement offline data synchronization here
        // For example, sync offline cart items, wishlist changes, etc.
        
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/favicon-32x32.png',
            badge: '/favicon-16x16.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Products',
                    icon: '/favicon-16x16.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/favicon-16x16.png'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});

// Performance monitoring
self.addEventListener('fetch', (event) => {
    const startTime = performance.now();
    
    event.waitUntil(
        (async () => {
            try {
                await event.respondWith(fetch(event.request));
                const endTime = performance.now();
                const duration = endTime - startTime;
                
                // Log slow requests for performance monitoring
                if (duration > 1000) {
                    console.warn(`Slow request: ${event.request.url} took ${duration.toFixed(2)}ms`);
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        })()
    );
});
