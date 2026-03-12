/* ============================================================
   modules/utils.js — GOLAZO STORE
   Utilidades puras: formateo y validación
   ============================================================ */

/**
 * Formatea un número como precio en pesos colombianos.
 * @param {number} n
 * @returns {string}  Ej: "$189.000"
 */
export function formatPrice(n) {
  return '$' + n.toLocaleString('es-CO');
}

/**
 * Valida que una cadena tenga formato de correo electrónico.
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
