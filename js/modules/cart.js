/* ============================================================
   modules/cart.js — GOLAZO STORE
   Lógica del carrito: CRUD, drawer, página, checkout
   ============================================================ */

import { APP, saveCart } from '../state/app.js';
import { formatPrice } from './utils.js';
import { showPage, showToast, openCartDrawer, closeCartDrawer } from './ui.js';

/* ── Badge del carrito ───────────────────────────────────── */

export function getCartCount() {
  return APP.cart.reduce((sum, i) => sum + i.qty, 0);
}

export function getCartTotal() {
  return APP.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = getCartCount();
}

/* ── CRUD del carrito ────────────────────────────────────── */

/**
 * Agrega un producto al carrito (o incrementa su cantidad si ya existe).
 * @param {Object} product  - Debe incluir id, selectedSize, qty
 */
export function addToCart(product) {
  const existing = APP.cart.find(
    i => i.id === product.id && i.selectedSize === product.selectedSize
  );

  if (existing) {
    existing.qty = Math.min(existing.qty + (product.qty || 1), 10);
  } else {
    APP.cart.push({
      id:           product.id,
      name:         product.name,
      price:        product.price,
      emoji:        product.emoji,
      bg:           product.bg,
      cat:          product.cat,
      selectedSize: product.selectedSize || product.sizes?.[0] || 'M',
      qty:          product.qty || 1,
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast('¡Producto agregado al carrito! 🛒', 'success');
}

/**
 * Elimina un ítem del carrito por id + talla.
 */
export function removeFromCart(id, size) {
  APP.cart = APP.cart.filter(i => !(i.id === id && i.selectedSize === size));
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  if (APP.currentPage === 'cart') renderCartPage();
}

/**
 * Cambia la cantidad de un ítem (delta: +1 / -1).
 */
export function updateCartQty(id, size, delta) {
  const item = APP.cart.find(i => i.id === id && i.selectedSize === size);
  if (!item) return;
  item.qty = Math.max(1, Math.min(10, item.qty + delta));
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  if (APP.currentPage === 'cart') renderCartPage();
}

/* ── Cart Drawer ─────────────────────────────────────────── */

export function initCartDrawer() {
  document.getElementById('cartBtn')?.addEventListener('click', () => {
    renderCartDrawer();
    openCartDrawer();
  });
  document.getElementById('closeCartDrawer')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cartDrawerOverlay')?.addEventListener('click', closeCartDrawer);
}

export function renderCartDrawer() {
  const body   = document.getElementById('cartDrawerBody');
  const footer = document.getElementById('cartDrawerFooter');
  const count  = document.getElementById('cartDrawerCount');
  if (!body) return;

  if (count) count.textContent = `(${getCartCount()})`;

  if (APP.cart.length === 0) {
    body.innerHTML = `
      <div class="drawer-empty">
        <span>🛒</span>
        <p>Tu carrito está vacío</p>
        <button class="btn-auth" style="margin-top:0;"
          id="drawerGoToCatalog">Ir al catálogo</button>
      </div>`;
    footer.innerHTML = '';
    document.getElementById('drawerGoToCatalog')?.addEventListener('click', () => {
      closeCartDrawer();
      showPage('catalog');
    });
    return;
  }

  body.innerHTML = APP.cart.map(item => `
    <div class="drawer-item">
      <div class="drawer-item-img ${item.bg}">${item.emoji}</div>
      <div class="drawer-item-info">
        <div class="drawer-item-name">${item.name}</div>
        <div class="drawer-item-meta">Talla: ${item.selectedSize} · ${item.cat}</div>
        <div class="drawer-item-bottom">
          <span class="drawer-item-price">${formatPrice(item.price * item.qty)}</span>
          <div class="drawer-qty">
            <button class="drawer-qty-btn"
              data-id="${item.id}" data-size="${item.selectedSize}" data-delta="-1">−</button>
            <span class="drawer-qty-val">${item.qty}</span>
            <button class="drawer-qty-btn"
              data-id="${item.id}" data-size="${item.selectedSize}" data-delta="1">+</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  footer.innerHTML = `
    <div class="drawer-total-row">
      <span class="drawer-total-label">Total:</span>
      <span class="drawer-total-val">${formatPrice(getCartTotal())}</span>
    </div>
    <button class="btn-go-cart" id="drawerViewCart">Ver carrito completo</button>
    <button class="btn-go-checkout" id="drawerCheckout">Finalizar compra →</button>
  `;

  // Eventos de qty en drawer
  body.querySelectorAll('.drawer-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateCartQty(+btn.dataset.id, btn.dataset.size, +btn.dataset.delta);
    });
  });

  document.getElementById('drawerViewCart')?.addEventListener('click', () => {
    closeCartDrawer();
    showPage('cart');
  });
  document.getElementById('drawerCheckout')?.addEventListener('click', handleCheckout);
}

/* ── Página Carrito Completa ─────────────────────────────── */

export function renderCartPage() {
  const layout = document.getElementById('cartLayout');
  if (!layout) return;

  if (APP.cart.length === 0) {
    layout.innerHTML = `
      <div class="cart-empty" style="grid-column:1/-1;">
        <span class="empty-icon">🛒</span>
        <p>Tu carrito está vacío</p>
        <button class="btn-primary" data-page="catalog">Explorar productos</button>
      </div>`;
    return;
  }

  const envio    = getCartTotal() >= 150000 ? 0 : 12000;
  const subtotal = getCartTotal();
  const total    = subtotal + envio;

  layout.innerHTML = `
    <div class="cart-items-col">
      <h2 style="font-family:var(--font-display);font-weight:900;text-transform:uppercase;
                 margin-bottom:1.25rem;font-size:1.2rem;">
        ${getCartCount()} artículo${getCartCount() !== 1 ? 's' : ''}
      </h2>
      ${APP.cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img ${item.bg}">${item.emoji}</div>
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-meta">Talla: ${item.selectedSize} · ${item.cat}</div>
            <div class="cart-item-price">${formatPrice(item.price)}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn"
                data-id="${item.id}" data-size="${item.selectedSize}" data-delta="-1">−</button>
              <div class="qty-val">${item.qty}</div>
              <button class="qty-btn"
                data-id="${item.id}" data-size="${item.selectedSize}" data-delta="1">+</button>
            </div>
            <strong style="font-family:var(--font-display);color:var(--green);font-size:1.1rem;">
              ${formatPrice(item.price * item.qty)}
            </strong>
            <button class="cart-remove-btn"
              data-id="${item.id}" data-size="${item.selectedSize}">🗑 Eliminar</button>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="cart-summary">
      <h2>Resumen del pedido</h2>
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
      <div class="summary-row">
        <span>Envío</span>
        <span>${envio === 0 ? '🎉 Gratis' : formatPrice(envio)}</span>
      </div>
      ${envio > 0
        ? `<p style="font-size:0.78rem;color:var(--muted);margin-bottom:0.5rem;">
             Agrega ${formatPrice(150000 - subtotal)} más para envío gratis</p>`
        : ''}
      <div class="summary-row total">
        <span>Total</span><span>${formatPrice(total)}</span>
      </div>

      <div class="coupon-row">
        <input class="coupon-input" placeholder="Código de descuento" id="couponInput" />
        <button class="coupon-btn" id="couponApply">Aplicar</button>
      </div>
      <div id="couponMsg" style="font-size:0.8rem;color:var(--green);min-height:16px;"></div>

      <button class="btn-checkout" id="checkoutBtn">Finalizar compra →</button>
      <p style="text-align:center;font-size:0.78rem;color:var(--muted);margin-top:0.75rem;">
        🔒 Pago 100% seguro</p>
    </div>
  `;

  // Eventos qty
  layout.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      updateCartQty(+btn.dataset.id, btn.dataset.size, +btn.dataset.delta);
    });
  });

  // Eliminar
  layout.querySelectorAll('.cart-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCart(+btn.dataset.id, btn.dataset.size);
    });
  });

  // Cupón
  document.getElementById('couponApply')?.addEventListener('click', applyCoupon);

  // Checkout
  document.getElementById('checkoutBtn')?.addEventListener('click', handleCheckout);
}

/* ── Cupón ───────────────────────────────────────────────── */

export function applyCoupon() {
  const code = document.getElementById('couponInput')?.value.trim().toUpperCase();
  const msg  = document.getElementById('couponMsg');
  if (!msg) return;

  const valid = {
    'GOLAZO10': '10% de descuento aplicado ✓',
    'FUTBOL20': '20% de descuento aplicado ✓',
  };

  if (valid[code]) {
    msg.textContent   = valid[code];
    msg.style.color   = 'var(--green)';
  } else {
    msg.textContent   = 'Código no válido';
    msg.style.color   = 'var(--red)';
  }
}

/* ── Checkout ────────────────────────────────────────────── */

export function handleCheckout() {
  if (!APP.user) {
    showToast('Debes iniciar sesión para finalizar la compra', 'info');
    closeCartDrawer();
    setTimeout(() => showPage('login'), 400);
    return;
  }

  showToast('🎉 ¡Pedido realizado con éxito! Te enviaremos un correo de confirmación.', 'success');
  APP.cart = [];
  saveCart();
  updateCartBadge();
  renderCartDrawer();
  closeCartDrawer();
  setTimeout(() => showPage('profile'), 800);
}
