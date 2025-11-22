// ---------- TikTok Modal ----------
const tiktokModal = document.getElementById("tiktok-modal");
const tiktokContainer = document.getElementById("tiktok-container");
const closeBtn = document.getElementById("close-tiktok");

let scrollListenerAdded = false;

// Abrir modal con video TikTok
function openTikTokEmbed(url) {
  tiktokContainer.innerHTML = "";

  // Extraer videoId de la URL
  const match = url.match(/\/video\/(\d+)/);
  if (!match) return;
  const videoId = match[1];

  // Crear blockquote embed
  const blockquote = document.createElement("blockquote");
  blockquote.className = "tiktok-embed";
  blockquote.setAttribute("data-video-id", videoId);
  blockquote.style.width = "325px";
  blockquote.style.height = "580px";
  blockquote.innerHTML = "<section></section>";
  tiktokContainer.appendChild(blockquote);

  // Script para TikTok embed
  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  tiktokContainer.appendChild(script);

  // Mostrar modal
  tiktokModal.classList.remove("hidden");

  // Push state para manejar botón atrás
  history.pushState({ tiktokModalOpen: true }, "");
  window.addEventListener("popstate", handlePopState);

  // Cerrar modal al terminar el video
  window.addEventListener("message", function listener(e) {
    if (e.origin.includes("tiktok.com") && e.data && e.data.event === "finish") {
      closeTikTokModal();
      window.removeEventListener("message", listener);
    }
  });

  // Cerrar modal al hacer scroll (solo una vez)
  if (!scrollListenerAdded) {
    window.addEventListener("scroll", closeTikTokModalOnScroll);
    scrollListenerAdded = true;
  }
}

// Función para cerrar modal al hacer scroll
function closeTikTokModalOnScroll() {
  if (!tiktokModal.classList.contains("hidden")) {
    closeTikTokModal();
  }
}

// Cerrar modal
function closeTikTokModal() {
  tiktokModal.classList.add("hidden");
  tiktokContainer.innerHTML = "";

  // Eliminar listener de popstate
  window.removeEventListener("popstate", handlePopState);

  // Eliminar listener de scroll
  window.removeEventListener("scroll", closeTikTokModalOnScroll);
  scrollListenerAdded = false;
}

// Manejar popstate (botón atrás)
function handlePopState(e) {
  if (!tiktokModal.classList.contains("hidden")) {
    closeTikTokModal();
    // Prevenir navegación hacia atrás real
    history.pushState(null, "");
  }
}

// Cerrar modal con click en X
closeBtn.addEventListener("click", closeTikTokModal);

// Cerrar modal al click fuera del contenido
tiktokModal.addEventListener("click", (e) => {
  if (e.target === tiktokModal) closeTikTokModal();
});
