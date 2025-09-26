const CACHE_NAME = "meu-pwa-v1";
const arquivos = ["/", "/index.html", "/assets/styles/main.css", "/assets/src/main.js", "/assets/images/icons/icon-192.png", "/assets/images/icons/icon-512.png"];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(arquivos)));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request).then(r => r || fetch(event.request)));
});


/*
self.addEventListener("install", () => {
  console.log("Service Worker instalado");
});

self.addEventListener("activate", () => {
  console.log("Service Worker ativado");
});

self.addEventListener("fetch", (event) => {
  console.log("Interceptando:", event.request.url);
});
*/