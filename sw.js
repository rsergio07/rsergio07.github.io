// Service Worker for caching
const CACHE_NAME = 'portfolio-cache-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/js/main.js',
    '/assets/icons/icons8-github.svg',
    '/assets/icons/icons8-linkedin.svg',
    '/assets/icons/icons8-credly.svg',
    '/assets/icons/icons8-resume.svg',
    '/assets/resume.pdf'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});