const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('is-open');
    });
  });
}

const heroCarousel = document.querySelector('.hero-slideshow');
const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
const slideIndex = document.querySelector('.slide-index');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
let slideTimer = 0;

function clearSlideTimer() {
  window.clearTimeout(slideTimer);
  slideTimer = 0;
}

function showSlide(index) {
  if (!heroSlides.length) return;
  clearSlideTimer();
  const previousSlide = heroSlides[activeSlide];
  if (previousSlide?.tagName === 'VIDEO') {
    previousSlide.pause();
    previousSlide.currentTime = 0;
  }
  activeSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, position) => {
    const isActive = position === activeSlide;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  if (slideIndex) {
    slideIndex.textContent = `${String(activeSlide + 1).padStart(2, '0')} / ${String(heroSlides.length).padStart(2, '0')}`;
  }
  startSlideshow();
}

function stopSlideshow() {
  clearSlideTimer();
  const activeItem = heroSlides[activeSlide];
  if (activeItem?.tagName === 'VIDEO') activeItem.pause();
}

function startSlideshow() {
  clearSlideTimer();
  if (!heroSlides.length || prefersReducedMotion.matches || document.hidden) return;
  const activeItem = heroSlides[activeSlide];
  const isVideo = activeItem?.tagName === 'VIDEO';
  let delay = 6500;
  if (isVideo) {
    if (activeItem.ended || activeItem.currentTime >= 10) activeItem.currentTime = 0;
    delay = Math.max(250, (10 - activeItem.currentTime) * 1000);
    activeItem.play().catch(() => {});
  }
  slideTimer = window.setTimeout(() => showSlide(activeSlide + 1), delay);
}

if (heroCarousel && heroSlides.length) {
  heroCarousel.querySelector('[data-slide-prev]')?.addEventListener('click', () => showSlide(activeSlide - 1));
  heroCarousel.querySelector('[data-slide-next]')?.addEventListener('click', () => showSlide(activeSlide + 1));
  heroCarousel.addEventListener('mouseenter', stopSlideshow);
  heroCarousel.addEventListener('mouseleave', startSlideshow);
  heroCarousel.addEventListener('focusin', stopSlideshow);
  heroCarousel.addEventListener('focusout', (event) => {
    if (!heroCarousel.contains(event.relatedTarget)) startSlideshow();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopSlideshow();
    else startSlideshow();
  });
  prefersReducedMotion.addEventListener?.('change', startSlideshow);
  startSlideshow();
}

const productViewer = document.querySelector('#product-viewer');
const productViewerImage = document.querySelector('#product-viewer-image');

document.querySelectorAll('[data-open-product]').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    if (!productViewer || !productViewerImage || !image) return;
    productViewerImage.src = image.currentSrc || image.src;
    productViewerImage.alt = image.alt;
    productViewer.showModal();
  });
});

productViewer?.addEventListener('click', (event) => {
  if (event.target === productViewer) productViewer.close();
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
