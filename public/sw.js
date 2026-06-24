const CACHE_NAME = 'madiops-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Install — cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

// Fetch — network first, fallback to cache (pour les API calls online only)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Ne pas cacher les appels API / Supabase
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('groq.com') ||
    event.request.method !== 'GET'
  ) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Mettre en cache les nouvelles ressources statiques
        if (response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
      .catch(() => {
        // Fallback sur le cache si offline
        return caches.match(event.request).then((cached) => {
          return cached || caches.match('/index.html')
        })
      })
  )
})
