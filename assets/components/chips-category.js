document.addEventListener("DOMContentLoaded", () => {
  const chipsContainer = document.getElementById("filter-chips");

  // --- Función para centrar el chip activo ---
  function scrollChipToCenter(chip) {
    const container = chipsContainer;

    const chipRect = chip.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const offset = chipRect.left - (containerRect.left + (containerRect.width / 2 - chipRect.width / 2));

    container.scrollBy({
      left: offset,
      behavior: "smooth",
    });
  }

  // Obtener subcategorías únicas desde los productos
  const subCategoriesSet = new Set();

  allProducts.forEach((p) => {
    if (p.subCategory) {
      subCategoriesSet.add(p.subCategory.trim());
    }
  });

  const subCategories = Array.from(subCategoriesSet);

  // Crear chip "Todo"
  const allChip = document.createElement("div");
  allChip.className = "chip active";
  allChip.textContent = "Todo";
  allChip.dataset.filter = "all";
  chipsContainer.appendChild(allChip);

  // Crear chips de subcategorías
  subCategories.forEach((sub) => {
    const chip = document.createElement("div");
    chip.className = "chip";
    chip.textContent = sub;
    chip.dataset.filter = sub;
    chipsContainer.appendChild(chip);
  });

  // Centrar por defecto el chip "Todo"
  setTimeout(() => scrollChipToCenter(allChip), 100);

  // Manejador de clicks
  chipsContainer.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    // Cambiar clase activa
    document.querySelectorAll(".chip").forEach((c) => c.classList.remove("active"));
    chip.classList.add("active");

    // 👉 Centrar chip seleccionado
    scrollChipToCenter(chip);

    // Filtrar tarjetas
    const filter = chip.dataset.filter;

    document.querySelectorAll(".product-card").forEach((card) => {
      const product = allProducts.find((p) => p.id === card.dataset.id);

      if (filter === "all" || product.subCategory === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});
