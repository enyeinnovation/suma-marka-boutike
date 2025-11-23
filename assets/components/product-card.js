// assets/js/product-card.js
function createProductCard(product, productsImages, productsIndex) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.id = product.id;

  // 👉 Añadir category y subcategory para que los chips filtren
  card.dataset.category = product.category.toLowerCase();
  card.dataset.subcategory = product.subCategory.toLowerCase();

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
              <i class="fa-brands fa-tiktok"></i>
            </button>`
          : ""
      }

      <button class="action-btn" id="add-to-cart-${product.id}">
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

  // 👉 Ocultar flechas y puntos si solo hay 1 imagen
  if (productsImages[product.id].length <= 1) {
    card.querySelector(".arrow-area.left").style.display = "none";
    card.querySelector(".arrow-area.right").style.display = "none";
    // card.querySelector(".dots-container").style.display = "none";
  }

  return card;
}

function toggleDetails(id) {
  const box = document.getElementById(`details-${id}`);
  const icon = document.getElementById(`icon-${id}`);
  box.classList.toggle("hidden");
  icon.classList.toggle("fa-circle-info");
  icon.classList.toggle("fa-minus");
}

// Hacer global
window.toggleDetails = toggleDetails;
