// Service Worker for ClinicalForge
const CACHE_NAME = 'clinical-forge-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/favicon.svg',
  '/default-avatar.svg',
  '/globals.css',
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.origin === self.location.origin) {
    // Same origin requests
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    // Google Fonts - cache first
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        });
      })
    );
  } else if (url.hostname.includes('firebase')) {
    // Firebase requests - network first
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  } else {
    // Other external requests - network first
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle offline submissions
  const offlineData = await getOfflineData();
  if (offlineData.length > 0) {
    // Sync offline data when online
    for (const data of offlineData) {
      try {
        await syncOfflineSubmission(data);
        await removeOfflineData(data.id);
      } catch (error) {
        console.error('Failed to sync offline data:', error);
      }
    }
  }
}

// Store offline data
async function storeOfflineData(data) {
  const db = await openDB();
  await db.add('offline-submissions', {
    ...data,
    timestamp: Date.now(),
  });
}

// Get offline data
async function getOfflineData() {
  const db = await openDB();
  return await db.getAll('offline-submissions');
}

// Remove offline data
async function removeOfflineData(id) {
  const db = await openDB();
  await db.delete('offline-submissions', id);
}

// Open IndexedDB
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ClinicalForgeDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('offline-submissions')) {
        db.createObjectStore('offline-submissions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Sync offline submission
async function syncOfflineSubmission(data) {
  // This would be implemented to sync with Firebase
  console.log('Syncing offline submission:', data);
} 