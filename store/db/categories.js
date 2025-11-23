// Espera que estén cargados los archivos de productos

(function () {
  // Asegurar que existan las listas
  const groups = [
    window.zptProducts || [],
    window.sbrProducts || [],
    window.mntProducts || [],
    window.artProducts || [],
  ];

  const all = groups.flat();

  const map = {};

  all.forEach((p) => {
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

  console.log("✔ Categorías generadas:", JSON.stringify(window.categoriesDB, null, 2));

  function capitalize(str) {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }
})();
