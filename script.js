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
const slideDots = Array.from(document.querySelectorAll('.slide-dot'));
const slideIndex = document.querySelector('.slide-index');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
let slideTimer = 0;

function showSlide(index) {
  if (!heroSlides.length) return;
  activeSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, position) => {
    const isActive = position === activeSlide;
    slide.classList.toggle('is-active', isActive);
    slide.setAttribute('aria-hidden', String(!isActive));
  });
  slideDots.forEach((dot, position) => {
    const isCurrent = position === activeSlide;
    dot.classList.toggle('is-current', isCurrent);
    dot.setAttribute('aria-pressed', String(isCurrent));
  });
  if (slideIndex) slideIndex.textContent = `0${activeSlide + 1} / 0${heroSlides.length}`;
}

function stopSlideshow() {
  window.clearInterval(slideTimer);
  slideTimer = 0;
}

function startSlideshow() {
  stopSlideshow();
  if (!heroSlides.length || prefersReducedMotion.matches || document.hidden) return;
  slideTimer = window.setInterval(() => showSlide(activeSlide + 1), 6500);
}

if (heroCarousel && heroSlides.length) {
  heroCarousel.querySelector('[data-slide-prev]')?.addEventListener('click', () => {
    showSlide(activeSlide - 1);
    startSlideshow();
  });
  heroCarousel.querySelector('[data-slide-next]')?.addEventListener('click', () => {
    showSlide(activeSlide + 1);
    startSlideshow();
  });
  slideDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.slideTo));
      startSlideshow();
    });
  });
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
