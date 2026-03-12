/* ============================================================
   modules/ui.js — GOLAZO STORE
   Navegación SPA, toasts, navbar móvil, buscador, carrusel
   ============================================================ */

import { APP } from '../state/app.js';
import { renderCatalog, renderFeatured, setFilter } from './catalog.js';
import { renderCartPage } from './cart.js';
import { loadProfileData } from './auth.js';

/* ── Navegación entre páginas ────────────────────────────── */

/**
 * Muestra la página indicada y oculta el resto.
 * @param {string} pageId   - ID sin el prefijo "page-"
 * @param {Object} [opts]   - { filter } para pre-filtrar el catálogo
 */
export function showPage(pageId, opts = {}) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const page = document.getElementById('page-' + pageId);
  if (page) {
    page.classList.add('active');
    APP.currentPage = pageId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Resaltar link activo en navbar
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  closeNavMobile();

  // Acciones específicas por página
  if (pageId === 'catalog') {
    if (opts.filter) setFilter('cat', opts.filter);
    renderCatalog();
  }
  if (pageId === 'home')    renderFeatured();
  if (pageId === 'cart')    renderCartPage();
  if (pageId === 'profile') {
    if (!APP.user) { showPage('login'); return; }
    loadProfileData();
  }
}

/* ── Toast Notifications ─────────────────────────────────── */

/**
 * Muestra un toast en la esquina inferior derecha.
 * @param {string} msg
 * @param {'success'|'error'|'info'} [type='success']
 */
export function showToast(msg, type = 'success') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || '📣'}</span><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Cart Drawer: abrir / cerrar ─────────────────────────── */

export function openCartDrawer() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartDrawerOverlay')?.classList.add('open');
}

export function closeCartDrawer() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartDrawerOverlay')?.classList.remove('open');
}

/* ── Navbar Móvil ────────────────────────────────────────── */

export function initNavMobile() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const overlay   = document.getElementById('navOverlay');

  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    overlay.classList.toggle('open', isOpen);
  });

  overlay?.addEventListener('click', closeNavMobile);
}

export function closeNavMobile() {
  document.getElementById('navLinks')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('active');
  document.getElementById('navOverlay')?.classList.remove('open');
  document.querySelector('.catalog-sidebar')?.classList.remove('open');
}

/* ── Navbar: efecto scroll ───────────────────────────────── */

export function initNavScroll() {
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── Buscador ────────────────────────────────────────────── */

export function initSearch() {
  const searchWrap  = document.getElementById('searchWrap');
  const searchBtn   = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  searchBtn.addEventListener('click', () => {
    if (!searchWrap.classList.contains('open')) {
      searchWrap.classList.add('open');
      searchInput.focus();
    } else if (searchInput.value.trim()) {
      APP.filters.search = searchInput.value.trim();
      showPage('catalog');
    } else {
      searchWrap.classList.remove('open');
    }
  });

  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      APP.filters.search = searchInput.value.trim();
      showPage('catalog');
      searchWrap.classList.remove('open');
    }
    if (e.key === 'Escape') {
      searchWrap.classList.remove('open');
      APP.filters.search = '';
    }
  });
}

/* ── Carrusel Hero ───────────────────────────────────────── */

export function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const dotsEl = document.getElementById('carouselDots');
  if (!track) return;

  // Crear dots
  dotsEl.innerHTML = '';
  for (let i = 0; i < APP.carousel.total; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i + 1));
    dot.addEventListener('click', () => goToSlide(i));
    dotsEl.appendChild(dot);
  }

  // Controles prev / next
  document.getElementById('carouselPrev')?.addEventListener('click', () => {
    goToSlide((APP.carousel.current - 1 + APP.carousel.total) % APP.carousel.total);
  });
  document.getElementById('carouselNext')?.addEventListener('click', () => {
    goToSlide((APP.carousel.current + 1) % APP.carousel.total);
  });

  // Auto-play
  startCarouselTimer();

  // Pausar al hover
  const carousel = track.closest('.hero-carousel');
  carousel?.addEventListener('mouseenter', stopCarouselTimer);
  carousel?.addEventListener('mouseleave', startCarouselTimer);

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0
        ? goToSlide((APP.carousel.current + 1) % APP.carousel.total)
        : goToSlide((APP.carousel.current - 1 + APP.carousel.total) % APP.carousel.total);
    }
  });
}

function goToSlide(idx) {
  APP.carousel.current = idx;
  document.getElementById('carouselTrack').style.transform = `translateX(-${idx * 100}%)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
}

function startCarouselTimer() {
  stopCarouselTimer();
  APP.carousel.timer = setInterval(() => {
    goToSlide((APP.carousel.current + 1) % APP.carousel.total);
  }, 5000);
}

function stopCarouselTimer() {
  if (APP.carousel.timer) clearInterval(APP.carousel.timer);
}
