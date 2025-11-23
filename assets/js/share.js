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
