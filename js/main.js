/* ============================================================
   main.js — GOLAZO STORE
   Punto de entrada: inicializa todos los módulos al cargar el DOM
   ============================================================ */

import { APP }                 from './state/app.js';
import { showPage,
         initCarousel,
         initNavMobile,
         initNavScroll,
         initSearch }          from './modules/ui.js';
import { initCatalogFilters,
         renderFeatured }      from './modules/catalog.js';
import { initCartDrawer,
         updateCartBadge }     from './modules/cart.js';
import { initAuth,
         initContact,
         updateUserUI }        from './modules/auth.js';

/* ── Delegación global de clics (data-page) ──────────────── */
document.addEventListener('click', function(e) {
  const target = e.target.closest('[data-page]');
  if (!target) return;
  e.preventDefault();

  const page   = target.dataset.page;
  const filter = target.dataset.filter;

  // Botón usuario: si hay sesión → perfil; si no → login
  if (target.id === 'userBtn') {
    showPage(APP.user ? 'profile' : 'login');
    return;
  }

  showPage(page, { filter });
});

/* ── Inicialización principal ────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initCatalogFilters();
  initAuth();
  initContact();
  initSearch();
  initNavMobile();
  initNavScroll();
  initCartDrawer();

  updateUserUI();
  updateCartBadge();
  renderFeatured();

  console.info('[GOLAZO STORE] Demo login: demo@golazo.co / 123456');
});
