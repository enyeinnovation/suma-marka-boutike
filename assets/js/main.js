// assets\js\main.js
const container = document.getElementById("products-container");

// Crear las tarjetas
allProducts.forEach((product, index) => {
  productsImages[product.id] = product.images.map((img) => `store/imgs/${product.folderCategory}/${img}`);
  productsIndex[product.id] = 0;

  product.index = index;

  const card = createProductCard(product, productsImages, productsIndex);
  container.appendChild(card);

  initSlider(product, productsImages, productsIndex);

  // Botón agregar al carrito
  card.querySelector(`#add-to-cart-${product.id}`).addEventListener("click", () => addToCart(product));
});

// Botón fullscreen
document.addEventListener("click", (e) => {
  if (e.target.closest("#fullscreen-btn")) {
    const btn = e.target.closest("#fullscreen-btn");
    const container = btn.closest(".qr-container") || document.documentElement;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.log(err.message));
    } else {
      document.exitFullscreen();
    }
  }
});
