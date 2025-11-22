class WhatsAppButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.phone = this.getAttribute("phone") || "";
    this.defaultMessage = this.getAttribute("message") || "Hola, deseo más información.";

    const linkFA = document.createElement("link");
    linkFA.rel = "stylesheet";
    this.shadowRoot.appendChild(linkFA);

    this.shadowRoot.innerHTML = `
<style>
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css');

  .whatsapp-btn {
    position: fixed;
    bottom: 22px;
    right: 22px;
    background: #25D366;
    color: white;
    font-weight: bold;
    font-size: 16px;
    padding: 12px 18px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
    z-index: 9999;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .whatsapp-btn:hover { background: #1ebe5c; }
  .icon-whatsapp { font-size: 20px; }

  /* Shake desktop */
  @keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
  }

  .whatsapp-btn.shake {
    animation: shake 0.3s;
  }

  /* Mobile centering y shake */
  @media (max-width: 768px) {
    .whatsapp-btn {
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      white-space: nowrap;
    }

    @keyframes shake-mobile {
      0% { transform: translateX(-50%); }
      25% { transform: translateX(calc(-50% - 5px)); }
      50% { transform: translateX(calc(-50% + 5px)); }
      75% { transform: translateX(calc(-50% - 5px)); }
      100% { transform: translateX(-50%); }
    }

    .whatsapp-btn.shake {
      animation: shake-mobile 0.3s;
    }
  }

  /* Modal */
  .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: none; justify-content: center; align-items: center; z-index: 10000; }
  .modal { background: #fff; padding: 20px; max-width: 400px; width: 90%; max-height: 80%; overflow-y: auto; }
  .modal h2 { margin-top: 0; }
  .product { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; }
  .product button { background: #ff4d4f; border: none; color: white; padding: 4px 8px; cursor: pointer; }
  .actions { display: flex; justify-content: space-between; margin-top: 16px; }
  .actions button { flex: 1; margin: 0 4px; padding: 8px; border: none; cursor: pointer; color: white; font-weight: bold; }
  .buy { background: #1890ff; }
  .consult { background: #52c41a; }
  .clear { background: #ff4d4f; }
</style>


  <a class="whatsapp-btn">
    <i class="fa-brands fa-whatsapp icon-whatsapp"></i>
    <span id="wsp-text">913676003</span>
  </a>

  <div class="modal-overlay" id="modal">
    <div class="modal">
      <h2>Lista de productos</h2>
      <div id="products-list"></div>
      <div class="actions">
        <button class="buy">Comprar</button>
        <button class="consult">Consultar</button>
        <button class="clear">Limpiar lista</button>
      </div>
    </div>
  </div>
`;

    this.btn = this.shadowRoot.querySelector("a.whatsapp-btn");
    this.text = this.shadowRoot.querySelector("#wsp-text");
    this.modal = this.shadowRoot.querySelector("#modal");
    this.productsList = this.shadowRoot.querySelector("#products-list");
    this.buyBtn = this.shadowRoot.querySelector(".buy");
    this.consultBtn = this.shadowRoot.querySelector(".consult");
    this.clearBtn = this.shadowRoot.querySelector(".clear");

    this.btn.addEventListener("click", (e) => {
      e.preventDefault();
      this.showModal();
    });

    this.buyBtn.addEventListener("click", () => this.sendCart());
    this.consultBtn.addEventListener("click", () => this.sendCart());
    this.clearBtn.addEventListener("click", () => {
      localStorage.setItem("cart", "[]");
      this.updateView();
      this.renderProducts();
      this.hideModal();
    });

    // Cerrar modal si se da click fuera
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.hideModal();
    });
  }

  connectedCallback() {
    this.updateView();
    window.addEventListener("storage", () => {
      this.updateView();
      this.renderProducts();
    });
  }

  updateView() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    this.text.textContent = cart.length > 0 ? `Productos (${cart.length})` : "913676003";
  }

  renderProducts() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    this.productsList.innerHTML = "";

    if (cart.length === 0) {
      this.productsList.innerHTML = "<p>No hay productos en el carrito.</p>";
      return;
    }

    cart.forEach((p, i) => {
      const displayName = p.name && p.name.trim() !== "" ? p.name : p.sku; // Si name vacío o null, usar SKU

      const div = document.createElement("div");
      div.classList.add("product");
      div.innerHTML = `
      <span>
        ${displayName} ${p.price !== null ? `- ${p.currency}${p.price}` : ""}
      </span>
      <button data-index="${i}">&times;</button>
    `;
      div.querySelector("button").addEventListener("click", () => this.removeProduct(i));
      this.productsList.appendChild(div);
    });
  }

  removeProduct(index) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    this.updateView();
    this.renderProducts();
  }

  showModal() {
    this.renderProducts();
    this.modal.style.display = "flex";
  }

  hideModal() {
    this.modal.style.display = "none";
  }

  sendCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    let message = "";

    if (cart.length === 0) {
      message = this.defaultMessage;
    } else {
      message = "🛒 Consulta carrito:\n\n";
      cart.forEach((p, i) => {
        message += `${i + 1}) ${p.name} - ${p.currency}${p.price} - SKU: ${p.sku}\n`;
      });
      message += `\n¡Gracias!`;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${this.phone}?text=${encoded}`;
    window.open(url, "_blank");
    this.hideModal();
  }

  shake() {
    this.btn.classList.add("shake");
    setTimeout(() => {
      this.btn.classList.remove("shake");
    }, 300);
  }
}

customElements.define("whatsapp-button", WhatsAppButton);
