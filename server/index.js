// server/index.js
const express    = require('express');
const cors       = require('cors');
const path       = require('path');
require('dotenv').config();

const productosRoutes = require('./Routes/Productos');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// ── Servir el frontend estático ──────────────────────────
// Esto permite abrir http://localhost:3000 y ver index.html
app.use(express.static(path.join(__dirname, '..')));

// ── API Routes ───────────────────────────────────────────
app.use('/api/productos', productosRoutes);

// Ruta de prueba
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, msg: 'API FPCMerch funcionando 🚀' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📦 API: http://localhost:${PORT}/api/productos`);
});



