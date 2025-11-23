// assets\script.js

const allProducts = [
  ...(typeof zptProducts !== "undefined" ? zptProducts : []),
  ...(typeof sbrProducts !== "undefined" ? sbrProducts : []),
  ...(typeof mntProducts !== "undefined" ? mntProducts : []),
  ...(typeof artProducts !== "undefined" ? artProducts : []),
];

const productsImages = {};
const productsIndex = {};

function loadCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("cartCount", cart.length);
  window.dispatchEvent(new Event("storage"));
}

function addToCart(product) {
  const cart = loadCart();
  cart.push(product);
  saveCart(cart);
  const wspBtn = document.querySelector("whatsapp-button");
  if (wspBtn && typeof wspBtn.shake === "function") {
    wspBtn.shake();
  }
}

function shareProduct(product) {
  const url = window.location.href;
  const text = `Producto: ${product.name}\nPrecio: ${product.currency || ""}${product.price || ""}\n${url}`;
  if (navigator.share) {
    navigator.share({ title: product.name, text, url });
  } else {
    navigator.clipboard.writeText(text);
    alert("📋 Enlace copiado al portapapeles");
  }
}

const container = document.getElementById("products-container");

allProducts.forEach((product) => {
  productsImages[product.id] = product.images.map((img) => `store/imgs/${product.folderCategory}/${img}`);
  productsIndex[product.id] = 0;

  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
      <div class="image-container">
        <div class="slider-track" id="track-${product.id}">
          ${productsImages[product.id].map((img) => `<img src="${img}" alt="${product.name}">`).join("")}
        </div>
        <div class="arrow-area left" onclick="prevImage('${product.id}')">
          <i class="fa-solid fa-chevron-left arrow"></i>
        </div>
        <div class="arrow-area right" onclick="nextImage('${product.id}')">
          <i class="fa-solid fa-chevron-right arrow"></i>
        </div>
      </div>
      <div class="dots-container" id="dots-${product.id}">
        ${productsImages[product.id]
          .map(
            (_, idx) =>
              `<span class="dot ${idx === 0 ? "active" : ""}" onclick="goToImage('${product.id}', ${idx})"></span>`
          )
          .join("")}
      </div>
      <h3>${product.sku.toUpperCase() || product.name}</h3>
      <div class="product-actions">
        <button class="action-btn" onclick="toggleDetails('${product.id}')">
          <i id="icon-${product.id}" class="fa-solid fa-circle-info"></i>
        </button>
        ${
          product.tiktok
            ? `<button class="action-btn" onclick="openTikTokEmbed('${product.tiktok}')">
          <i class="fa-brands fa-tiktok"></i>
        </button>`
            : ""
        }
        <button class="action-btn" onclick='addToCart(${JSON.stringify(product)})'>
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
      <div id="details-${product.id}" class="details hidden">
        <p><b>Nombre:</b> ${product.name}</p>
        <p><b>Descripción:</b> ${product.description}</p>
        ${product.price ? `<p><b>Precio:</b> ${product.currency}${product.price}</p>` : ""}
        <p><b>SKU:</b> ${product.sku.toUpperCase()}</p>
      </div>
    `;
  container.appendChild(card);
});

// --- FUNCIONES SLIDER ---
function updateSlider(id) {
  const track = document.getElementById(`track-${id}`);
  const index = productsIndex[id];
  track.style.transform = `translateX(-${index * 100}%)`;
  updateDots(id);
}

function nextImage(id) {
  const total = productsImages[id].length;
  productsIndex[id] = (productsIndex[id] + 1) % total;
  updateSlider(id);
}

function prevImage(id) {
  const total = productsImages[id].length;
  productsIndex[id] = (productsIndex[id] - 1 + total) % total;
  updateSlider(id);
}

function goToImage(id, index) {
  productsIndex[id] = index;
  updateSlider(id);
}

function updateDots(id) {
  const dotsContainer = document.getElementById(`dots-${id}`);
  if (!dotsContainer) return;
  const dots = dotsContainer.querySelectorAll(".dot");
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === productsIndex[id]);
  });
}

function toggleDetails(id) {
  const box = document.getElementById(`details-${id}`);
  const icon = document.getElementById(`icon-${id}`);
  box.classList.toggle("hidden");
  icon.classList.toggle("fa-circle-info");
  icon.classList.toggle("fa-minus");
}

const fsBtn = document.getElementById("fullscreen-btn");
fsBtn.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => console.log(err.message));
  } else {
    document.exitFullscreen();
  }
});

// --- SWIPE TÁCTIL Y MOUSE ---
// Swipe para cada slider
allProducts.forEach((product) => {
  const track = document.getElementById(`track-${product.id}`);
  let startX = 0;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX; // invertimos la resta
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prevImageManual(); // swipe derecha → imagen anterior
      } else {
        nextImageManual(); // swipe izquierda → siguiente imagen
      }
    }
  });
});

allProducts.forEach((product, idx) => {
  const card = document.querySelector(`.product-card:nth-child(${idx + 1})`);
  let autoSlideInterval = null;

  // --- FUNCIONES DE SLIDER LOCAL ---
  const updateSlider = () => {
    const track = document.getElementById(`track-${product.id}`);
    track.style.transform = `translateX(-${productsIndex[product.id] * 100}%)`;

    const dots = document.getElementById(`dots-${product.id}`).querySelectorAll(".dot");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === productsIndex[product.id]));
  };

  const nextImageAuto = () => {
    productsIndex[product.id] = (productsIndex[product.id] + 1) % productsImages[product.id].length;
    updateSlider();
  };

  const nextImageManual = () => {
    productsIndex[product.id] = (productsIndex[product.id] + 1) % productsImages[product.id].length;
    updateSlider();
    stopAutoSlide();
    card.dataset.autoSlideDisabled = "true";
  };

  const prevImageManual = () => {
    productsIndex[product.id] =
      (productsIndex[product.id] - 1 + productsImages[product.id].length) % productsImages[product.id].length;
    updateSlider();
    stopAutoSlide();
    card.dataset.autoSlideDisabled = "true";
  };

  const goToImageManual = (index) => {
    productsIndex[product.id] = index;
    updateSlider();
    stopAutoSlide();
    card.dataset.autoSlideDisabled = "true";
  };

  // --- AUTO-SLIDE ---
  const startAutoSlide = () => {
    if (!card.dataset.autoSlideDisabled) {
      autoSlideInterval = setInterval(nextImageAuto, 3000);
    }
  };

  const stopAutoSlide = () => clearInterval(autoSlideInterval);

  // --- OBSERVER PARA DETECTAR VISIBILIDAD ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAutoSlide();
        else stopAutoSlide();
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(card);

  // --- EVENTOS MANUALES ---
  const leftArrow = card.querySelector(".arrow-area.left");
  const rightArrow = card.querySelector(".arrow-area.right");
  leftArrow.addEventListener("click", prevImageManual);
  rightArrow.addEventListener("click", nextImageManual);

  const dotsContainer = card.querySelector(".dots-container");
  dotsContainer.querySelectorAll(".dot").forEach((dot, i) => {
    dot.addEventListener("click", () => goToImageManual(i));
  });

  // --- SWIPE TÁCTIL ---
  const track = document.getElementById(`track-${product.id}`);
  let startX = 0;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImageManual();
      else prevImageManual();
    }
  });
});

//
