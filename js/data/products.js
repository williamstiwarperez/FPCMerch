/* ============================================================
   js/data/products.js — FPCMerch
   Funciones que consumen la API REST del servidor.
   Este es el archivo FRONTEND (browser), NO el de Express.
   ============================================================ */

const API_BASE = '/api/productos';

/**
 * Obtiene la lista de productos desde la API.
 * @param {Object} params  - Filtros opcionales: { cat, search, sort }
 * @returns {Promise<Array>} - Array de productos crudos de la BD
 */
export async function fetchProducts(params = {}) {
  const qs  = new URLSearchParams(params).toString();
  const url = qs ? `${API_BASE}?${qs}` : API_BASE;

  const res  = await fetch(url);
  const data = await res.json();

  if (!data.ok) throw new Error(data.error || 'Error al obtener productos');
  return data.data;
}

/**
 * Obtiene el detalle de un producto por su ID.
 * @param {number|string} id
 * @returns {Promise<Object|null>} - Producto o null si no existe
 */
export async function fetchProductById(id) {
  const res  = await fetch(`${API_BASE}/${id}`);
  const data = await res.json();

  if (!data.ok) return null;
  return data.data;
}



