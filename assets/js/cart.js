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
  if (wspBtn && typeof wspBtn.shake === "function") wspBtn.shake();
}
