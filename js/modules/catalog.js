/* ============================================================
   modules/catalog.js — GOLAZO STORE
   Catálogo: filtros, renderizado, tarjetas, detalle de producto
   ============================================================ */

import { APP } from '../state/app.js';
import { PRODUCTS } from '../data/products.js';
import { formatPrice } from './utils.js';
import { showPage, showToast } from './ui.js';
import { addToCart } from './cart.js';

/* ── Filtros ─────────────────────────────────────────────── */

/**
 * Establece un valor de filtro en APP.filters.
 * @param {'cat'|'price'|'size'|'sort'|'search'} key
 * @param {*} val
 */
export function setFilter(key, val) {
  APP.filters[key] = val;
  if (key === 'cat') {
    const radio = document.querySelector(`#filterCategory input[value="${val}"]`);
    if (radio) radio.checked = true;
  }
}

/**
 * Devuelve el array de productos aplicando todos los filtros activos.
 * @returns {Array}
 */
export function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (APP.filters.cat && APP.filters.cat !== 'todos') {
    list = list.filter(p => p.cat === APP.filters.cat);
  }

  list = list.filter(p => p.price <= APP.filters.price);

  if (APP.filters.size && APP.filters.size !== 'todas') {
    list = list.filter(p => p.sizes.includes(APP.filters.size));
  }

  if (APP.filters.search) {
    const q = APP.filters.search.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
    );
  }

  switch (APP.filters.sort) {
    case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'name-asc':   list.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'newest':     list = list.filter(p => p.isNew).concat(list.filter(p => !p.isNew)); break;
  }

  return list;
}

/**
 * Re-renderiza el grid del catálogo con los filtros activos.
 */
export function renderCatalog() {
  const grid    = document.getElementById('catalogGrid');
  const noRes   = document.getElementById('noResults');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  const products = getFilteredProducts();

  grid.innerHTML = '';
  if (products.length === 0) {
    noRes?.classList.remove('hidden');
    if (countEl) countEl.textContent = '0 resultados';
  } else {
    noRes?.classList.add('hidden');
    if (countEl) countEl.textContent =
      `${products.length} ${products.length === 1 ? 'producto' : 'productos'} encontrados`;
    products.forEach(p => grid.appendChild(createProductCard(p)));
  }
}

/**
 * Limpia todos los filtros y re-renderiza el catálogo.
 */
export function clearAllFilters() {
  APP.filters = { cat: 'todos', price: 500000, size: 'todas', sort: 'default', search: '' };

  const radio = document.querySelector('#filterCategory input[value="todos"]');
  if (radio) radio.checked = true;

  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.value = 500000;
    const priceVal = document.getElementById('priceVal');
    if (priceVal) priceVal.textContent = '$500.000';
  }

  document.querySelectorAll('.size-chip').forEach(c =>
    c.classList.toggle('active', c.dataset.size === 'todas')
  );

  const sortSel = document.getElementById('sortSelect');
  if (sortSel) sortSel.value = 'default';

  renderCatalog();
}
// Exponemos clearAllFilters globalmente para los onclick inline del HTML
window.clearAllFilters = clearAllFilters;

/* ── Inicializar Filtros ─────────────────────────────────── */

export function initCatalogFilters() {
  // Categoría
  document.querySelectorAll('#filterCategory input').forEach(radio => {
    radio.addEventListener('change', () => {
      setFilter('cat', radio.value);
      renderCatalog();
    });
  });

  // Precio
  const priceRange = document.getElementById('priceRange');
  const priceVal   = document.getElementById('priceVal');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      APP.filters.price = +priceRange.value;
      if (priceVal) priceVal.textContent = formatPrice(+priceRange.value);
      renderCatalog();
    });
  }

  // Tallas
  document.querySelectorAll('.size-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.size-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      setFilter('size', chip.dataset.size);
      renderCatalog();
    });
  });

  // Ordenar
  const sortSel = document.getElementById('sortSelect');
  if (sortSel) {
    sortSel.addEventListener('change', () => {
      setFilter('sort', sortSel.value);
      renderCatalog();
    });
  }

  // Limpiar filtros
  document.getElementById('clearFilters')
    ?.addEventListener('click', clearAllFilters);

  // Toggle filtros en móvil
  const filterToggle = document.getElementById('filterToggleMobile');
  const sidebar      = document.querySelector('.catalog-sidebar');
  if (filterToggle && sidebar) {
    filterToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      document.getElementById('navOverlay')?.classList.toggle('open');
    });
  }
}

/* ── Tarjeta de Producto ─────────────────────────────────── */

/**
 * Crea y devuelve un elemento DOM con la tarjeta de un producto.
 * @param {Object} p  - Objeto de producto de PRODUCTS
 * @returns {HTMLElement}
 */
export function createProductCard(p) {
  const stars  = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);
  const badge  = p.badge
    ? `<span class="product-badge badge-${p.badge}">${
        p.badge === 'new' ? 'Nuevo' : p.badge === 'sale' ? 'Oferta' : 'Popular'
      }</span>`
    : '';
  const oldP = p.oldPrice
    ? `<span class="product-price-old">${formatPrice(p.oldPrice)}</span>`
    : '';

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.id = p.id;
  card.innerHTML = `
    <div class="product-img-wrap ${p.bg}">
      <div class="product-img-svg">${p.emoji}</div>
      ${badge}
      <button class="quick-add-btn" data-id="${p.id}">+ Agregar al carrito</button>
    </div>
    <div class="product-info">
      <span class="product-cat">${p.cat}</span>
      <h3 class="product-name">${p.name}</h3>
      <span class="product-stars">${stars}</span>
      <span class="product-sizes">Tallas: ${p.sizes.slice(0, 4).join(', ')}${p.sizes.length > 4 ? '…' : ''}</span>
      <div class="product-price-row">
        <span class="product-price">${formatPrice(p.price)}</span>
        ${oldP}
      </div>
    </div>
  `;

  // Abrir detalle al hacer click en la tarjeta
  card.addEventListener('click', e => {
    if (e.target.closest('.quick-add-btn')) return;
    showProductDetail(p.id);
  });

  // Agregar rápido al carrito
  card.querySelector('.quick-add-btn').addEventListener('click', e => {
    e.stopPropagation();
    addToCart({ ...p, selectedSize: p.sizes[1] || p.sizes[0], qty: 1 });
  });

  return card;
}

/* ── Productos Destacados (Home) ─────────────────────────── */

export function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PRODUCTS.filter(p => p.badge || p.isNew)
          .slice(0, 8)
          .forEach(p => grid.appendChild(createProductCard(p)));
}

/* ── Detalle de Producto ─────────────────────────────────── */

export function showProductDetail(id) {
  const p = PRODUCTS.find(pr => pr.id === id);
  if (!p) return;

  APP.currentProduct = { ...p, selectedSize: p.sizes[1] || p.sizes[0], qty: 1 };

  const container = document.getElementById('productDetail');
  const discount  = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  const stars     = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);

  container.innerHTML = `
    <div style="grid-column:1/-1;">
      <button class="btn-back" id="btnBackToShop">← Volver al catálogo</button>
    </div>

    <div class="detail-gallery">
      <div class="detail-img-main ${p.bg}" style="font-size:8rem;">${p.emoji}</div>
      <div class="detail-img-thumbs">
        <div class="detail-thumb ${p.bg} active">${p.emoji}</div>
        <div class="detail-thumb bg-gray">📦</div>
        <div class="detail-thumb bg-gray">🏷️</div>
      </div>
    </div>

    <div class="detail-info">
      <span class="detail-cat">${p.cat.toUpperCase()}</span>
      <h1 class="detail-name">${p.name}</h1>
      <div class="detail-rating">
        <span class="detail-stars">${stars}</span>
        <span class="detail-reviews">(${p.stars * 47 + 12} reseñas)</span>
      </div>
      <div class="detail-price-row">
        <span class="detail-price">${formatPrice(p.price)}</span>
        ${p.oldPrice ? `<span class="detail-price-old">${formatPrice(p.oldPrice)}</span>` : ''}
        ${discount   ? `<span class="detail-discount">-${discount}%</span>` : ''}
      </div>
      <p class="detail-desc">${p.desc}</p>
      <hr class="detail-divider" />

      <div>
        <span class="detail-label">Talla: <strong id="selectedSizeLabel">${APP.currentProduct.selectedSize}</strong></span>
        <div class="size-selector" id="sizeSelector">
          ${p.sizes.map(s =>
            `<button class="size-opt ${s === APP.currentProduct.selectedSize ? 'active' : ''}" data-size="${s}">${s}</button>`
          ).join('')}
        </div>
      </div>

      <hr class="detail-divider" />

      <div class="detail-qty-row">
        <div class="qty-control">
          <button class="qty-btn" id="qtyMinus">−</button>
          <div class="qty-val" id="qtyVal">1</div>
          <button class="qty-btn" id="qtyPlus">+</button>
        </div>
        <button class="btn-add-cart" id="btnAddToCart">🛒 Agregar al carrito</button>
      </div>

      <div class="detail-features">
        ${(p.features || []).map(f => `<div class="feature-item"><span>✓</span><span>${f}</span></div>`).join('')}
        <div class="feature-item"><span>🚚</span><span>Envío gratis en este producto</span></div>
        <div class="feature-item"><span>↩️</span><span>Devolución gratuita en 30 días</span></div>
      </div>
    </div>
  `;

  showPage('product');

  // Eventos del detalle
  document.getElementById('btnBackToShop')
    ?.addEventListener('click', () => showPage('catalog'));

  document.querySelectorAll('.size-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      APP.currentProduct.selectedSize = btn.dataset.size;
      const lbl = document.getElementById('selectedSizeLabel');
      if (lbl) lbl.textContent = btn.dataset.size;
    });
  });

  document.getElementById('qtyMinus')?.addEventListener('click', () => {
    if (APP.currentProduct.qty > 1) {
      APP.currentProduct.qty--;
      const el = document.getElementById('qtyVal');
      if (el) el.textContent = APP.currentProduct.qty;
    }
  });

  document.getElementById('qtyPlus')?.addEventListener('click', () => {
    if (APP.currentProduct.qty < 10) {
      APP.currentProduct.qty++;
      const el = document.getElementById('qtyVal');
      if (el) el.textContent = APP.currentProduct.qty;
    }
  });

  document.getElementById('btnAddToCart')
    ?.addEventListener('click', () => addToCart({ ...APP.currentProduct }));
}
