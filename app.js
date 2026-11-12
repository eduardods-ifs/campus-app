// ===== 1. Registrar o service worker =====
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('✅ Service worker registrado'))
      .catch((erro) => console.log('❌ Erro no service worker:', erro));
  });
}
// ===== 2. Convite de instalação (Android e computador) =====
let pedidoInstalacao = null;
const convite = document.querySelector('#convite');

window.addEventListener('beforeinstallprompt', (evento) => {
  evento.preventDefault();
  pedidoInstalacao = evento;
  convite.hidden = false;
});

document.querySelector('#botao-instalar').addEventListener('click', async () => {
  convite.hidden = true;
  if (!pedidoInstalacao) return;
  pedidoInstalacao.prompt();
  const escolha = await pedidoInstalacao.userChoice;
  console.log('Resposta:', escolha.outcome);
  pedidoInstalacao = null;
});

document.querySelector('#botao-depois').addEventListener('click', () => {
  convite.hidden = true;
});

window.addEventListener('appinstalled', () => {
  convite.hidden = true;
  console.log('🎉 App instalado!');
});
// ===== 3. Aviso para iPhone e iPad =====
const ehIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const jaInstalado = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
const avisoIOS = document.querySelector('#aviso-ios');

if (ehIOS && !jaInstalado) {
  avisoIOS.hidden = false;
}

document.querySelector('#botao-fechar-ios').addEventListener('click', () => {
  avisoIOS.hidden = true;
});