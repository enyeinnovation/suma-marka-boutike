// assets\js\slider.js
function initSlider(product, productsImages, productsIndex) {
  const card = document.querySelector(`.product-card:nth-child(${product.index + 1})`);
  let autoSlideInterval = null;

  function updateSlider() {
    const track = document.getElementById(`track-${product.id}`);
    track.style.transform = `translateX(-${productsIndex[product.id] * 100}%)`;
    const dots = document.getElementById(`dots-${product.id}`).querySelectorAll(".dot");
    dots.forEach((dot, i) => dot.classList.toggle("active", i === productsIndex[product.id]));
  }

  function nextImageAuto() {
    productsIndex[product.id] = (productsIndex[product.id] + 1) % productsImages[product.id].length;
    updateSlider();
  }

  function nextImageManual() {
    productsIndex[product.id] = (productsIndex[product.id] + 1) % productsImages[product.id].length;
    updateSlider();
    stopAutoSlide();
    card.dataset.autoSlideDisabled = "true";
  }

  function prevImageManual() {
    productsIndex[product.id] =
      (productsIndex[product.id] - 1 + productsImages[product.id].length) % productsImages[product.id].length;
    updateSlider();
    stopAutoSlide();
    card.dataset.autoSlideDisabled = "true";
  }

  function goToImageManual(index) {
    productsIndex[product.id] = index;
    updateSlider();
    stopAutoSlide();
    card.dataset.autoSlideDisabled = "true";
  }

  function startAutoSlide() {
    if (!card.dataset.autoSlideDisabled) autoSlideInterval = setInterval(nextImageAuto, 3000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  // Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => (entry.isIntersecting ? startAutoSlide() : stopAutoSlide())),
    { threshold: 0.5 }
  );
  observer.observe(card);

  // Flechas
  card.querySelector(".arrow-area.left").addEventListener("click", prevImageManual);
  card.querySelector(".arrow-area.right").addEventListener("click", nextImageManual);

  // Dots
  card.querySelectorAll(".dot").forEach((dot, i) => {
    dot.addEventListener("click", () => goToImageManual(i));
  });

  // Swipe táctil
  const track = document.getElementById(`track-${product.id}`);
  let startX = 0;
  track.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
  track.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) diff > 0 ? prevImageManual() : nextImageManual();
  });
}
