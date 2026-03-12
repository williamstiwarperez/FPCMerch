/* ============================================================
   data/products.js — GOLAZO STORE
   Array PRODUCTS: 24 productos del catálogo (sin lógica)
   ============================================================ */

export const PRODUCTS = [
  // ── CAMISETAS ──────────────────────────────────────────────
  {
    id: 1, name: 'Camiseta Colombia Titular', cat: 'camisetas',
    price: 189000, oldPrice: 230000, emoji: '🟡', bg: 'bg-orange',
    sizes: ['S','M','L','XL','XXL'], stars: 5, badge: 'hot', isNew: false,
    desc: 'Camiseta oficial de la Selección Colombia. Tecnología Dry-Fit, bordado oficial en el pecho. Edición 2025.',
    features: ['100% Poliéster técnico','Tecnología Dry-Fit','Bordado oficial','Corte ajustado'],
  },
  {
    id: 2, name: 'Camiseta Real Madrid Local', cat: 'camisetas',
    price: 215000, oldPrice: null, emoji: '⚪', bg: 'bg-gray',
    sizes: ['XS','S','M','L','XL'], stars: 5, badge: 'new', isNew: true,
    desc: 'Réplica premium de la camiseta del Real Madrid temporada 2024/25. Parche de campeón incluido.',
    features: ['Material premium','Escudo bordado','Parche UCL','Corte slim fit'],
  },
  {
    id: 3, name: 'Camiseta Atlético Nacional', cat: 'camisetas',
    price: 145000, oldPrice: 170000, emoji: '🟢', bg: 'bg-green',
    sizes: ['S','M','L','XL','XXL'], stars: 4, badge: 'sale', isNew: false,
    desc: 'Camiseta oficial del Verde de la Montaña. Diseño clásico con franjas verticales verdes.',
    features: ['Franjas verticales','Escudo oficial','Secado rápido','Tela transpirable'],
  },
  {
    id: 4, name: 'Camiseta Bayern Munich', cat: 'camisetas',
    price: 210000, oldPrice: null, emoji: '🔴', bg: 'bg-red',
    sizes: ['S','M','L','XL'], stars: 5, badge: 'new', isNew: true,
    desc: 'Camiseta local del FC Bayern Munich 2024/25. Rojo carmín característico con detalles en blanco.',
    features: ['Material reciclado','Tecnología AeroReady','Bordado triple corona','Slim fit'],
  },
  {
    id: 5, name: 'Camiseta Millonarios FC', cat: 'camisetas',
    price: 140000, oldPrice: null, emoji: '🔵', bg: 'bg-blue',
    sizes: ['S','M','L','XL','XXL'], stars: 4, badge: null, isNew: false,
    desc: 'Camiseta oficial del embajador. Azul rey con detalles plateados y escudo bordado.',
    features: ['Azul rey oficial','Escudo bordado','Talla regular','Poliéster 100%'],
  },
  {
    id: 6, name: 'Camiseta Barcelona Visitante', cat: 'camisetas',
    price: 195000, oldPrice: 240000, emoji: '🟣', bg: 'bg-purple',
    sizes: ['XS','S','M','L','XL'], stars: 4, badge: 'sale', isNew: false,
    desc: 'Camiseta visitante del FC Barcelona. Diseño minimalista amarillo con escudo clásico blaugrana.',
    features: ['Diseño minimalista','Escudo clásico','Jersey ligero','Tecnología DryCell'],
  },

  // ── PANTALONES ─────────────────────────────────────────────
  {
    id: 7, name: 'Pantaloneta Nike Dri-FIT', cat: 'pantalones',
    price: 89000, oldPrice: null, emoji: '⚫', bg: 'bg-gray',
    sizes: ['S','M','L','XL','XXL'], stars: 5, badge: null, isNew: false,
    desc: 'Pantaloneta deportiva con tecnología Dri-FIT. Cintura elástica ajustable, bolsillos laterales.',
    features: ['Tecnología Dri-FIT','Cintura elástica','2 bolsillos laterales','Interior de malla'],
  },
  {
    id: 8, name: 'Short Adidas Tiro 23', cat: 'pantalones',
    price: 79000, oldPrice: 95000, emoji: '⬛', bg: 'bg-blue',
    sizes: ['S','M','L','XL'], stars: 4, badge: 'sale', isNew: false,
    desc: 'Short de entrenamiento Adidas Tiro 23. Clásico negro con franjas blancas laterales.',
    features: ['Franjas clásicas','Material AEROREADY','Ajuste regular','Sin forro interno'],
  },
  {
    id: 9, name: 'Pantaloneta Colombia 2025', cat: 'pantalones',
    price: 95000, oldPrice: null, emoji: '🟡', bg: 'bg-orange',
    sizes: ['S','M','L','XL','XXL'], stars: 5, badge: 'new', isNew: true,
    desc: 'Pantaloneta oficial de la Selección Colombia 2025. Combina perfecto con la camiseta titular.',
    features: ['Combinación oficial','Cintura ajustable','Bolsillos con cremallera','Sello oficial FCF'],
  },
  {
    id: 10, name: 'Short Portero Pro', cat: 'pantalones',
    price: 65000, oldPrice: null, emoji: '🟤', bg: 'bg-orange',
    sizes: ['S','M','L','XL'], stars: 4, badge: null, isNew: false,
    desc: 'Short largo de portero con protección en caderas. Diseño ergonómico y cómodo.',
    features: ['Corte largo','Protección de cadera','Material elástico 4D','Cintura elástica'],
  },

  // ── CHAQUETAS ──────────────────────────────────────────────
  {
    id: 11, name: 'Chaqueta Técnica Track Jacket', cat: 'chaquetas',
    price: 249000, oldPrice: 295000, emoji: '🧥', bg: 'bg-blue',
    sizes: ['S','M','L','XL','XXL'], stars: 5, badge: 'sale', isNew: false,
    desc: 'Chaqueta de entrenamiento técnica. Resistente al agua, cierre completo con capucha desmontable.',
    features: ['Resistente al agua','Capucha desmontable','2 bolsillos con cierre','Costuras termoselladas'],
  },
  {
    id: 12, name: 'Chaqueta Selección Colombia', cat: 'chaquetas',
    price: 275000, oldPrice: null, emoji: '🟡', bg: 'bg-orange',
    sizes: ['S','M','L','XL'], stars: 5, badge: 'new', isNew: true,
    desc: 'Chaqueta oficial de la Selección Colombia. Diseño tricolor con el escudo de la FCF.',
    features: ['Diseño tricolor','Escudo FCF oficial','Rompevientos','Bolsillos interiores'],
  },
  {
    id: 13, name: 'Hoodie Fútbol Club Premium', cat: 'chaquetas',
    price: 185000, oldPrice: 220000, emoji: '⚫', bg: 'bg-gray',
    sizes: ['S','M','L','XL','XXL'], stars: 4, badge: 'sale', isNew: false,
    desc: 'Hoodie de algodón premium con capucha y bolsillo canguro. Diseño street football.',
    features: ['Algodón premium 380g','Capucha con cordón','Bolsillo canguro','Costuras reforzadas'],
  },

  // ── MEDIAS ─────────────────────────────────────────────────
  {
    id: 14, name: 'Medias Profesionales Verdes', cat: 'medias',
    price: 28000, oldPrice: null, emoji: '🟢', bg: 'bg-green',
    sizes: ['S','M','L'], stars: 4, badge: null, isNew: false,
    desc: 'Medias de fútbol profesional. Antideslizantes, con refuerzo en talón y puntera.',
    features: ['Antideslizantes','Refuerzo en talón','100% algodón','Talla única S-L'],
  },
  {
    id: 15, name: 'Pack x3 Medias Colombia', cat: 'medias',
    price: 72000, oldPrice: 90000, emoji: '🟡', bg: 'bg-orange',
    sizes: ['S','M','L'], stars: 5, badge: 'sale', isNew: false,
    desc: 'Pack de 3 pares de medias oficiales de la Selección Colombia. Colores tricolor.',
    features: ['3 pares incluidos','Colores tricolor','Material técnico','Ajuste alto hasta rodilla'],
  },
  {
    id: 16, name: 'Medias Negras Pro', cat: 'medias',
    price: 25000, oldPrice: null, emoji: '⚫', bg: 'bg-gray',
    sizes: ['S','M','L','XL'], stars: 4, badge: null, isNew: false,
    desc: 'Medias negras de alto rendimiento. Compresión graduada para mejor circulación.',
    features: ['Compresión graduada','Anti-olor','Secado ultra-rápido','Refuerzo en arco'],
  },

  // ── UNIFORMES ──────────────────────────────────────────────
  {
    id: 17, name: 'Kit Completo Local Verde', cat: 'uniformes',
    price: 320000, oldPrice: 380000, emoji: '🟢', bg: 'bg-green',
    sizes: ['S','M','L','XL','XXL'], stars: 5, badge: 'hot', isNew: false,
    desc: 'Kit completo: camiseta + pantaloneta + medias. Personalización gratis con nombre y número.',
    features: ['3 piezas incluidas','Personalización gratis','Calidad profesional','Entrega en 3 días'],
  },
  {
    id: 18, name: 'Uniforme Nacional Azul', cat: 'uniformes',
    price: 290000, oldPrice: null, emoji: '🔵', bg: 'bg-blue',
    sizes: ['S','M','L','XL'], stars: 4, badge: 'new', isNew: true,
    desc: 'Uniforme completo estilo selección nacional azul. Ideal para equipos amateur y semiprofesionales.',
    features: ['Corte moderno','Escudo personalizable','Tela transpirable','Resistente a lavados'],
  },
  {
    id: 19, name: 'Kit Junior 5-12 años', cat: 'uniformes',
    price: 185000, oldPrice: 210000, emoji: '🟡', bg: 'bg-orange',
    sizes: ['4','6','8','10','12'], stars: 5, badge: 'sale', isNew: false,
    desc: 'Kit completo para niños de 5 a 12 años. Resistente, cómodo y lavable a máquina.',
    features: ['Tallas infantiles','Resistente a lavado','Colores duraderos','Personalización disponible'],
  },

  // ── ACCESORIOS ─────────────────────────────────────────────
  {
    id: 20, name: 'Balón Fútbol Pro Match', cat: 'accesorios',
    price: 145000, oldPrice: null, emoji: '⚽', bg: 'bg-gray',
    sizes: ['Talla 5'], stars: 5, badge: 'hot', isNew: false,
    desc: 'Balón de partido profesional. Cámara de látex, costura manual. Certificado FIFA Basic.',
    features: ['Certificado FIFA Basic','Cámara de látex','32 paneles cosidos','Resistente a humedad'],
  },
  {
    id: 21, name: 'Espinilleras Pro Lite', cat: 'accesorios',
    price: 55000, oldPrice: 70000, emoji: '🦵', bg: 'bg-blue',
    sizes: ['S','M','L'], stars: 4, badge: 'sale', isNew: false,
    desc: 'Espinilleras ultraligeras con tobillera integrada. EVA de alto impacto.',
    features: ['EVA de alto impacto','Tobillera incluida','Ultraligeras 180g','Sistema de ajuste'],
  },
  {
    id: 22, name: 'Guantes Portero GK Elite', cat: 'accesorios',
    price: 120000, oldPrice: null, emoji: '🧤', bg: 'bg-green',
    sizes: ['7','8','9','10','11'], stars: 5, badge: 'new', isNew: true,
    desc: 'Guantes de portero con palma de látex alemán. Cierre de muñeca ajustable.',
    features: ['Látex alemán Grade 4','Cierre muñeca Velcro','Corte Flat','Dedo desmontable'],
  },
  {
    id: 23, name: 'Bolsa Deporte Stadium', cat: 'accesorios',
    price: 89000, oldPrice: 110000, emoji: '👜', bg: 'bg-gray',
    sizes: ['Única'], stars: 4, badge: 'sale', isNew: false,
    desc: 'Bolsa deportiva de 45L con compartimento para calzado. Impermeable y duradera.',
    features: ['45 litros de capacidad','Compartimento calzado','Resistente al agua','Asa y mochila'],
  },
  {
    id: 24, name: 'Gorra Técnica GOLAZO', cat: 'accesorios',
    price: 42000, oldPrice: null, emoji: '🧢', bg: 'bg-green',
    sizes: ['Única'], stars: 4, badge: null, isNew: false,
    desc: 'Gorra de visera curva con logo bordado. Material técnico con filtro UV50+.',
    features: ['Filtro UV50+','Logo bordado','Cierre ajustable','Material técnico transpirable'],
  },
];
