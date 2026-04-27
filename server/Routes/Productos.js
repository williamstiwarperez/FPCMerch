// server/routes/productos.js
const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/productos — todos los productos activos
router.get('/', (req, res) => {
  try {
    const { cat, search, sort } = req.query;
    let sql = `
      SELECT p.*, c.slug AS cat, c.nombre AS categoria_nombre
      FROM productos p
      JOIN categorias c ON c.id = p.categoria_id
      WHERE p.activo = 1`,
    params = [];

    if (cat && cat !== 'todos') {
      sql += ' AND c.slug = ?'; params.push(cat);
    }
    if (search) {
      sql += ' AND (p.nombre LIKE ? OR c.slug LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (sort === 'price-asc')  sql += ' ORDER BY p.precio ASC';
    else if (sort === 'price-desc') sql += ' ORDER BY p.precio DESC';
    else if (sort === 'newest') sql += ' ORDER BY p.creado_en DESC';
    else sql += ' ORDER BY p.id ASC';

    const rows = db.prepare(sql).all(...params);

    // Agregar tallas disponibles a cada producto
    const tallasStmt = db.prepare(
      'SELECT talla, stock FROM producto_tallas WHERE producto_id = ? ORDER BY talla'
    );
    rows.forEach(p => {
      const tallas = tallasStmt.all(p.id);
      p.sizes    = tallas.map(t => t.talla);
      p.stockMap = Object.fromEntries(tallas.map(t => [t.talla, t.stock]));
    });

    res.json({ ok: true, data: rows });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// GET /api/productos/:id — detalle de un producto
router.get('/:id', (req, res) => {
  try {
    const p = db.prepare(`
      SELECT p.*, c.slug AS cat, c.nombre AS categoria_nombre
      FROM productos p JOIN categorias c ON c.id = p.categoria_id
      WHERE p.id = ? AND p.activo = 1
    `).get(req.params.id);

    if (!p) return res.status(404).json({ ok: false, error: 'Producto no encontrado' });

    const tallas = db.prepare(
      'SELECT talla, stock FROM producto_tallas WHERE producto_id = ? ORDER BY talla'
    ).all(p.id);
    p.sizes    = tallas.map(t => t.talla);
    p.stockMap = Object.fromEntries(tallas.map(t => [t.talla, t.stock]));

    res.json({ ok: true, data: p });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;

// POST /api/productos — crear nuevo producto
router.post('/', (req, res) => {
  const { categoria_id, nombre, descripcion, precio,
          precio_anterior, imagen, emoji, bg_clase, badge, es_nuevo } = req.body;
  try {
    const r = db.prepare(`
      INSERT INTO productos
        (categoria_id, nombre, descripcion, precio, precio_anterior,
         imagen, emoji, bg_clase, badge, es_nuevo)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
    ).run(categoria_id, nombre, descripcion, precio, precio_anterior ?? null,
          imagen ?? null, emoji ?? null, bg_clase ?? null,
          badge ?? null, es_nuevo ?? 0);
    res.json({ ok: true, id: r.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// PUT /api/productos/:id — actualizar producto
router.put('/:id', (req, res) => {
  const campos = req.body;
  const sets   = Object.keys(campos).map(k => `${k} = ?`).join(', ');
  try {
    db.prepare(`UPDATE productos SET ${sets} WHERE id = ?`)
      .run(...Object.values(campos), req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

// DELETE /api/productos/:id — desactivar (soft delete)
router.delete('/:id', (req, res) => {
  try {
    db.prepare('UPDATE productos SET activo = 0 WHERE id = ?').run(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});


