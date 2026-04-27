/* ============================================================
   modules/catalog.js — FPCMerch
   Catálogo: filtros, renderizado, tarjetas, detalle de producto
   Versión dinámica: consume la API REST en lugar del array estático
   ============================================================ */

import { APP }                         from '../state/app.js';
import { fetchProducts, fetchProductById } from '../data/products.js';
import { formatPrice }                 from './utils.js';
import { showPage, showToast }         from './ui.js';
import { addToCart }                   from './cart.js';

/* ── Normalización de campos ─────────────────────────────────
   La API devuelve los nombres de la BD (nombre, precio, etc.).
   Esta función los convierte al formato que usa el frontend
   (name, price, etc.) para no tener que tocar el resto del código.
   ─────────────────────────────────────────────────────────── */
function normalizeProduct(p) {
  return {
    id:       p.id,
    name:     p.nombre,
    cat:      p.cat,               // slug de la categoría (viene del JOIN)
    price:    p.precio,
    oldPrice: p.precio_anterior,   // null si no hay descuento
    emoji:    p.emoji    || '⚽',
    bg:       p.bg_clase || 'bg-gray',
    sizes:    p.sizes    || [],    // array armado en el backend
    stars:    p.estrellas,
    badge:    p.badge,             // 'new' | 'sale' | 'hot' | null
    isNew:    p.es_nuevo === 1,
    desc:     p.descripcion || '',
    imagen:   p.imagen || null,    // ruta img/producto.jpg o null
    features: [],                  // se puede agregar a la BD en el futuro
  };
}

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
 * Obtiene los productos desde la API y aplica los filtros
 * de precio y talla en el cliente (los demás se pasan a la API).
 * @returns {Promise<Array>}
 */
export async function getFilteredProducts() {
  // Filtros que se envían a la API como query params
  const params = {};
  if (APP.filters.cat && APP.filters.cat !== 'todos') params.cat    = APP.filters.cat;
  if (APP.filters.search)                              params.search = APP.filters.search;
  if (APP.filters.sort && APP.filters.sort !== 'default') params.sort = APP.filters.sort;

  const raw = await fetchProducts(params);
  let list  = raw.map(normalizeProduct);

  // Filtros que se aplican en el cliente (precio y talla)
  list = list.filter(p => p.price <= APP.filters.price);

  if (APP.filters.size && APP.filters.size !== 'todas') {
    list = list.filter(p => p.sizes.includes(APP.filters.size));
  }

  return list;
}

/**
 * Re-renderiza el grid del catálogo con los filtros activos.
 */
export async function renderCatalog() {
  const grid    = document.getElementById('catalogGrid');
  const noRes   = document.getElementById('noResults');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  // Mostrar estado de carga mientras llega la respuesta
  grid.innerHTML = `
    <div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted);">
      <span style="font-size:2rem; display:block; margin-bottom:0.5rem;">⏳</span>
      Cargando productos...
    </div>`;

  const products = await getFilteredProducts();

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
 * Construye el HTML de la imagen del producto.
 * Si tiene ruta de imagen real → la muestra con fallback al emoji.
 * Si no tiene imagen → muestra el emoji directamente.
 */
function buildImageHtml(p) {
  if (p.imagen) {
    // Imagen real con fallback: si no carga el archivo, muestra el emoji
    return `
      <img
        src="${p.imagen}"
        alt="${p.name}"
        style="width:100%; height:100%; object-fit:cover; display:block;"
        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
      />
      <div class="product-img-svg" style="display:none;">${p.emoji}</div>
    `;
  }
  // Sin imagen: mostrar emoji como siempre
  return `<div class="product-img-svg">${p.emoji}</div>`;
}

/**
 * Crea y devuelve un elemento DOM con la tarjeta de un producto.
 * @param {Object} p  - Producto normalizado
 * @returns {HTMLElement}
 */
export function createProductCard(p) {
  const stars = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);

  const badge = p.badge
    ? `<span class="product-badge badge-${p.badge}">${
        p.badge === 'new' ? 'Nuevo' : p.badge === 'sale' ? 'Oferta' : 'Popular'
      }</span>`
    : '';

  const oldP = p.oldPrice
    ? `<span class="product-price-old">${formatPrice(p.oldPrice)}</span>`
    : '';

  const card = document.createElement('div');
  card.className  = 'product-card';
  card.dataset.id = p.id;

  card.innerHTML = `
    <div class="product-img-wrap ${p.bg}">
      ${buildImageHtml(p)}
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

  // Abrir detalle al hacer clic en la tarjeta
  card.addEventListener('click', e => {
    if (e.target.closest('.quick-add-btn')) return;
    showProductDetail(p.id);
  });

  // Botón rápido "Agregar al carrito"
  card.querySelector('.quick-add-btn').addEventListener('click', e => {
    e.stopPropagation();
    addToCart({ ...p, selectedSize: p.sizes[1] || p.sizes[0], qty: 1 });
  });

  return card;
}

/* ── Productos Destacados (Home) ─────────────────────────── */

export async function renderFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  // Estado de carga
  grid.innerHTML = `
    <div style="grid-column:1/-1; text-align:center; padding:2rem; color:var(--muted);">
      Cargando destacados...
    </div>`;

  // Traer todos los productos (sin filtros) y quedarse con los destacados
  const raw      = await fetchProducts();
  const products = raw.map(normalizeProduct);

  grid.innerHTML = '';
  products
    .filter(p => p.badge || p.isNew)
    .slice(0, 8)
    .forEach(p => grid.appendChild(createProductCard(p)));
}

/* ── Detalle de Producto ─────────────────────────────────── */

export async function showProductDetail(id) {
  const container = document.getElementById('productDetail');

  // Mostrar carga mientras se obtiene el detalle
  container.innerHTML = `
    <div style="grid-column:1/-1; text-align:center; padding:4rem; color:var(--muted);">
      <span style="font-size:3rem; display:block; margin-bottom:1rem;">⏳</span>
      Cargando producto...
    </div>`;
  showPage('product');

  // Obtener el producto desde la API
  const raw = await fetchProductById(id);
  if (!raw) {
    container.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:4rem; color:var(--muted);">
        <span style="font-size:3rem; display:block; margin-bottom:1rem;">😕</span>
        Producto no encontrado.
        <br/><br/>
        <button class="btn-back" id="btnBackToShop">← Volver al catálogo</button>
      </div>`;
    document.getElementById('btnBackToShop')
      ?.addEventListener('click', () => showPage('catalog'));
    return;
  }

  const p = normalizeProduct(raw);
  APP.currentProduct = { ...p, selectedSize: p.sizes[1] || p.sizes[0], qty: 1 };

  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  const stars    = '★'.repeat(p.stars) + '☆'.repeat(5 - p.stars);

  // Imagen principal del detalle (con fallback al emoji)
  const mainImgHtml = p.imagen
    ? `<img
         src="${p.imagen}"
         alt="${p.name}"
         style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius-lg);"
         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
       />
       <div style="display:none; font-size:8rem; align-items:center; justify-content:center; width:100%; height:100%;">${p.emoji}</div>`
    : `<div style="font-size:8rem;">${p.emoji}</div>`;

  container.innerHTML = `
    <div style="grid-column:1/-1;">
      <button class="btn-back" id="btnBackToShop">← Volver al catálogo</button>
    </div>

    <div class="detail-gallery">
      <div class="detail-img-main ${p.bg}" style="overflow:hidden;">
        ${mainImgHtml}
      </div>
      <div class="detail-img-thumbs">
        <div class="detail-thumb ${p.bg} active"
             style="overflow:hidden; font-size:1.5rem; display:flex; align-items:center; justify-content:center;">
          ${p.imagen
            ? `<img src="${p.imagen}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'; this.parentElement.textContent='${p.emoji}';" />`
            : p.emoji}
        </div>
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
        <span class="detail-label">
          Talla: <strong id="selectedSizeLabel">${APP.currentProduct.selectedSize}</strong>
        </span>
        <div class="size-selector" id="sizeSelector">
          ${p.sizes.map(s => `
            <button class="size-opt ${s === APP.currentProduct.selectedSize ? 'active' : ''}"
                    data-size="${s}">${s}</button>
          `).join('')}
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
        ${(p.features || []).map(f =>
          `<div class="feature-item"><span>✓</span><span>${f}</span></div>`
        ).join('')}
        <div class="feature-item"><span>🚚</span><span>Envío gratis en este producto</span></div>
        <div class="feature-item"><span>↩️</span><span>Devolución gratuita en 30 días</span></div>
      </div>
    </div>
  `;

  // ── Eventos del detalle ───────────────────────────────────

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



