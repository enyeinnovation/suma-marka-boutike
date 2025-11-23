const allProducts = [
  ...(typeof zptProducts !== "undefined" ? zptProducts : []),
  ...(typeof sbrProducts !== "undefined" ? sbrProducts : []),
  ...(typeof mntProducts !== "undefined" ? mntProducts : []),
  ...(typeof artProducts !== "undefined" ? artProducts : []),
];

const productsImages = {};
const productsIndex = {};

allProducts.forEach((product, idx) => {
  productsImages[product.id] = product.images.map((img) => `store/imgs/${product.folderCategory}/${img}`);
  productsIndex[product.id] = 0;

  // Crear la tarjeta
  const card = document.createElement("div");
  card.className = "product-card";

  card.innerHTML = `
    <div class="image-container">
      <div class="slider-track" id="track-${product.id}">
        ${productsImages[product.id].map((img) => `<img src="${img}" alt="${product.name}">`).join("")}
      </div>
      <div class="arrow-area left">
        <i class="fa-solid fa-chevron-left arrow"></i>
      </div>
      <div class="arrow-area right">
        <i class="fa-solid fa-chevron-right arrow"></i>
      </div>
    </div>
    <div class="dots-container" id="dots-${product.id}">
      ${productsImages[product.id].map((_, i) => `<span class="dot ${i === 0 ? "active" : ""}"></span>`).join("")}
    </div>
    <h3>${product.sku.toUpperCase() || product.name}</h3>
    <div class="product-actions">
      <button class="action-btn" onclick="toggleDetails('${product.id}')">
        <i id="icon-${product.id}" class="fa-solid fa-circle-info"></i>
      </button>
      ${
        product.tiktok
          ? `<button class="action-btn" onclick="openTikTokEmbed('${product.tiktok}')">
        <i class="fa-brands fa-tiktok"></i></button>`
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
  document.getElementById("products-container").appendChild(card);

  // --- VARIABLES DE SLIDER ---
  let autoSlideInterval = null;

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

  // --- EVENTOS FLECHAS ---
  const leftArrow = card.querySelector(".arrow-area.left");
  const rightArrow = card.querySelector(".arrow-area.right");
  leftArrow.addEventListener("click", prevImageManual);
  rightArrow.addEventListener("click", nextImageManual);

  // --- EVENTOS DOTS ---
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
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) prevImageManual(); // swipe derecha → anterior
      else nextImageManual(); // swipe izquierda → siguiente
    }
  });
});
