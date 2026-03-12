/* ============================================================
   state/app.js — GOLAZO STORE
   Estado global de la aplicación + helpers de persistencia
   ============================================================ */

export const APP = {
  cart:           JSON.parse(localStorage.getItem('golazo_cart') || '[]'),
  user:           JSON.parse(localStorage.getItem('golazo_user') || 'null'),
  currentPage:    'home',
  currentProduct: null,
  filters: {
    cat:    'todos',
    price:  500000,
    size:   'todas',
    sort:   'default',
    search: '',
  },
  carousel: { current: 0, total: 3, timer: null },
};

/** Persiste el carrito en localStorage */
export function saveCart() {
  localStorage.setItem('golazo_cart', JSON.stringify(APP.cart));
}

/** Persiste el usuario en localStorage */
export function saveUser() {
  localStorage.setItem('golazo_user', JSON.stringify(APP.user));
}
