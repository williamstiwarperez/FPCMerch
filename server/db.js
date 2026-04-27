// server/db.js
const Database = require('better-sqlite3');
const path     = require('path');

// La BD está en la raíz del proyecto (un nivel arriba de /server)
const db = new Database(path.join(__dirname, '..', 'devFPCMerch.db'), {
  // verbose: console.log  // Descomenta para ver las queries en consola
});

// Activar foreign keys (SQLite las tiene desactivadas por defecto)
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL'); // Mejor rendimiento en lecturas

module.exports = db;
