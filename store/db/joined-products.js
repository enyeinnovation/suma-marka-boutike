// store/db/joined-products.js

// Unir todos los productos
const allProducts = [
  ...(typeof zptProducts !== "undefined" ? zptProducts : []),
  ...(typeof sbrProducts !== "undefined" ? sbrProducts : []),
  ...(typeof mntProducts !== "undefined" ? mntProducts : []),
  ...(typeof artProducts !== "undefined" ? artProducts : []),
];

// Map de imágenes e índices
const productsImages = {};
const productsIndex = {};

// --------------------------------------------------------
//            GENERAR categoriesDB AUTOMÁTICAMENTE
// --------------------------------------------------------
(function () {
  const map = {};

  allProducts.forEach((p) => {
    const cat = p.category?.trim();
    const sub = p.subCategory?.trim();
    if (!cat || !sub) return;

    const catName = capitalize(cat);
    const subName = capitalize(sub);

    if (!map[catName]) map[catName] = new Set();
    map[catName].add(subName);
  });

  window.categoriesDB = {
    categories: Object.entries(map).map(([name, subs]) => ({
      name,
      subCategories: Array.from(subs),
    })),
  };

  console.log("✔ categoriesDB generado:", window.categoriesDB);

  function capitalize(str) {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }
})();
