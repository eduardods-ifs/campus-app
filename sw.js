// Nome da caixa (cache). Mude o número quando atualizar o app: v1, v2, v3...
const VERSAO = 'campus-v1';

// Arquivos guardados no celular para o app abrir sem internet
const ARQUIVOS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
// 1. INSTALAÇÃO: baixa e guarda os arquivos da lista
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(VERSAO).then((cache) => cache.addAll(ARQUIVOS))
  );
  self.skipWaiting();
});
// 2. ATIVAÇÃO: apaga as caixas de versões antigas
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes.filter((nome) => nome !== VERSAO).map((nome) => caches.delete(nome))
      )
    )
  );
  self.clients.claim();
});
// 3. BUSCA: tenta a internet; se não conseguir, usa a cópia guardada
self.addEventListener('fetch', (evento) => {
  if (evento.request.method !== 'GET') return;
  if (!evento.request.url.startsWith(self.location.origin)) return;

  evento.respondWith(
    fetch(evento.request)
      .then((resposta) => {
        const copia = resposta.clone();
        caches.open(VERSAO).then((cache) => cache.put(evento.request, copia));
        return resposta;
      })
      .catch(() => caches.match(evento.request))
  );
});