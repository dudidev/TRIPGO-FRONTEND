// ══════════════════════════════════════════════════════════════
//  menu-presupuesto.data.ts
//  Menús quemados por tipo de establecimiento (id_tipo)
//  Precios en COP — se muestran también en USD con tasa dinámica
//  Cuando el backend tenga los precios reales, solo reemplaza
//  este archivo con la respuesta de la API.
// ══════════════════════════════════════════════════════════════

export type ItemMenu = {
  categoria : string;   // Encabezado del grupo (ej: "🛏️ Alojamiento")
  nombre    : string;   // Nombre del producto
  precio    : number;   // Precio en COP
  selected  : boolean;
};

export type MenuPresupuesto = ItemMenu[];

/** Tasa de cambio COP → USD (actualizar periódicamente o traer de API) */
export const TASA_COP_USD = 4100; // 1 USD = ~4100 COP (ajustar según mercado)

/** Convierte COP a USD formateado */
export function copToUsd(cop: number): string {
  return (cop / TASA_COP_USD).toFixed(2);
}

// ──────────────────────────────────────────────────────────────
//  MENÚS POR ID_TIPO
// ──────────────────────────────────────────────────────────────

const MENU_HOTEL: MenuPresupuesto = [
  { categoria: '🛏️ Alojamiento', nombre: 'Noche doble (2 personas)', precio: 180000, selected: false },
  { categoria: '🛏️ Alojamiento', nombre: 'Noche individual',          precio: 110000, selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Desayuno buffet x2',        precio: 32000,  selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Cena especial x2',          precio: 60000,  selected: false },
  { categoria: '🏊 Servicios',    nombre: 'Acceso piscina / spa',      precio: 25000,  selected: false },
  { categoria: '🏊 Servicios',    nombre: 'Parqueadero por noche',     precio: 15000,  selected: false },
];

const MENU_HOSTAL: MenuPresupuesto = [
  { categoria: '🛏️ Alojamiento', nombre: 'Cama en dormitorio compartido', precio: 35000, selected: false },
  { categoria: '🛏️ Alojamiento', nombre: 'Habitación privada doble',      precio: 90000, selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Desayuno continental',          precio: 15000, selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Almuerzo del día',              precio: 18000, selected: false },
  { categoria: '🎒 Extras',       nombre: 'Alquiler de bicicleta',         precio: 20000, selected: false },
  { categoria: '🎒 Extras',       nombre: 'Tour guiado por el pueblo',     precio: 25000, selected: false },
];

const MENU_GLAMPING: MenuPresupuesto = [
  { categoria: '⛺ Alojamiento',  nombre: 'Noche en domo/tienda (2 pax)', precio: 220000, selected: false },
  { categoria: '⛺ Alojamiento',  nombre: 'Noche adicional',              precio: 200000, selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Desayuno campestre x2',        precio: 30000,  selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Cena romántica x2',            precio: 80000,  selected: false },
  { categoria: '🌿 Experiencias', nombre: 'Caminata guiada al amanecer',  precio: 35000,  selected: false },
  { categoria: '🌿 Experiencias', nombre: 'Noche de fogata + smores',     precio: 25000,  selected: false },
  { categoria: '🌿 Experiencias', nombre: 'Avistamiento de aves',         precio: 20000,  selected: false },
];

const MENU_CABANA: MenuPresupuesto = [
  { categoria: '🏡 Alojamiento',  nombre: 'Cabaña para 2 personas / noche', precio: 160000, selected: false },
  { categoria: '🏡 Alojamiento',  nombre: 'Cabaña familiar (4 pax) / noche',precio: 260000, selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Desayuno típico x2',             precio: 28000,  selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Bandeja paisa x2',               precio: 40000,  selected: false },
  { categoria: '🔥 Extras',       nombre: 'Kit de asado / BBQ',             precio: 35000,  selected: false },
  { categoria: '🔥 Extras',       nombre: 'Jacuzzi privado (2 horas)',       precio: 40000,  selected: false },
];

const MENU_APARTAHOTEL: MenuPresupuesto = [
  { categoria: '🏢 Alojamiento',  nombre: 'Apartamento estudio / noche',    precio: 130000, selected: false },
  { categoria: '🏢 Alojamiento',  nombre: 'Apartamento 2 habitaciones',     precio: 200000, selected: false },
  { categoria: '🍳 Alimentación', nombre: 'Desayuno incluido x2',           precio: 24000,  selected: false },
  { categoria: '🏊 Servicios',    nombre: 'Acceso gimnasio',                precio: 10000,  selected: false },
  { categoria: '🏊 Servicios',    nombre: 'Lavandería',                     precio: 15000,  selected: false },
];

const MENU_ECOHOTEL: MenuPresupuesto = [
  { categoria: '🌱 Alojamiento',  nombre: 'Habitación ecológica / noche',  precio: 150000, selected: false },
  { categoria: '🌱 Alojamiento',  nombre: 'Suite eco (vista montaña)',      precio: 220000, selected: false },
  { categoria: '🥗 Alimentación', nombre: 'Desayuno orgánico x2',          precio: 35000,  selected: false },
  { categoria: '🥗 Alimentación', nombre: 'Almuerzo vegano x2',            precio: 42000,  selected: false },
  { categoria: '🌿 Experiencias', nombre: 'Taller de café / agroturismo',   precio: 30000,  selected: false },
  { categoria: '🌿 Experiencias', nombre: 'Senderismo guiado',             precio: 25000,  selected: false },
];

const MENU_RESTAURANTE: MenuPresupuesto = [
  { categoria: '🍽️ Platos fuertes', nombre: 'Bandeja paisa',              precio: 28000, selected: false },
  { categoria: '🍽️ Platos fuertes', nombre: 'Trucha a la plancha',        precio: 32000, selected: false },
  { categoria: '🍽️ Platos fuertes', nombre: 'Chuleta de cerdo + arroz',   precio: 26000, selected: false },
  { categoria: '🥗 Entradas',        nombre: 'Patacones con hogao',        precio: 12000, selected: false },
  { categoria: '🥗 Entradas',        nombre: 'Ensalada campesina',         precio: 10000, selected: false },
  { categoria: '🥤 Bebidas',         nombre: 'Jugo natural (lulo/mora)',   precio: 8000,  selected: false },
  { categoria: '🥤 Bebidas',         nombre: 'Limonada de coco',           precio: 9000,  selected: false },
  { categoria: '🍮 Postres',         nombre: 'Postre del día',             precio: 8000,  selected: false },
];

const MENU_BAR: MenuPresupuesto = [
  { categoria: '🍺 Cervezas',    nombre: 'Cerveza artesanal local',     precio: 12000, selected: false },
  { categoria: '🍺 Cervezas',    nombre: '6-pack artesanal',            precio: 60000, selected: false },
  { categoria: '🍹 Cócteles',    nombre: 'Cóctel de frutas tropicales', precio: 18000, selected: false },
  { categoria: '🍹 Cócteles',    nombre: 'Cóctel signature del bar',    precio: 22000, selected: false },
  { categoria: '🍟 Picadas',     nombre: 'Picada mixta para 2',         precio: 35000, selected: false },
  { categoria: '🍟 Picadas',     nombre: 'Alitas BBQ (6 unidades)',     precio: 22000, selected: false },
  { categoria: '☕ Sin alcohol', nombre: 'Café de origen',               precio: 8000,  selected: false },
];

const MENU_CAFE: MenuPresupuesto = [
  { categoria: '☕ Cafés',        nombre: 'Café de origen filtrado',    precio: 8000,  selected: false },
  { categoria: '☕ Cafés',        nombre: 'Espresso doble',             precio: 6000,  selected: false },
  { categoria: '☕ Cafés',        nombre: 'Capuchino especial',         precio: 9000,  selected: false },
  { categoria: '☕ Cafés',        nombre: 'Café helado con leche',      precio: 10000, selected: false },
  { categoria: '🥐 Acompañantes', nombre: 'Tostadas con mantequilla',   precio: 7000,  selected: false },
  { categoria: '🥐 Acompañantes', nombre: 'Croissant de jamón',         precio: 9000,  selected: false },
  { categoria: '🥐 Acompañantes', nombre: 'Torta de café',              precio: 8000,  selected: false },
  { categoria: '🧃 Jugos',        nombre: 'Jugo de lulo natural',       precio: 7000,  selected: false },
];

const MENU_DISCOTECA: MenuPresupuesto = [
  { categoria: '🎫 Ingreso',     nombre: 'Entrada general (noche)',    precio: 20000, selected: false },
  { categoria: '🎫 Ingreso',     nombre: 'Mesa VIP (mín. 4 personas)', precio: 80000, selected: false },
  { categoria: '🍾 Botellas',    nombre: 'Botella aguardiente',        precio: 80000, selected: false },
  { categoria: '🍾 Botellas',    nombre: 'Botella ron',                precio: 90000, selected: false },
  { categoria: '🍹 Tragos',      nombre: 'Trago sencillo',             precio: 15000, selected: false },
  { categoria: '🥤 No alcohólicos', nombre: 'Gaseosa / agua',          precio: 5000,  selected: false },
];

const MENU_PARQUE_TEMATICO: MenuPresupuesto = [
  { categoria: '🎟️ Entradas',    nombre: 'Entrada adulto',             precio: 60000, selected: false },
  { categoria: '🎟️ Entradas',    nombre: 'Entrada niño (3-12 años)',   precio: 45000, selected: false },
  { categoria: '🎟️ Entradas',    nombre: 'Entrada adulto mayor',       precio: 45000, selected: false },
  { categoria: '🍦 Alimentos',   nombre: 'Combo almuerzo + bebida',    precio: 28000, selected: false },
  { categoria: '🍦 Alimentos',   nombre: 'Helado artesanal de café',   precio: 8000,  selected: false },
  { categoria: '🎡 Adicionales', nombre: 'Atracción especial (cabalgata)', precio: 25000, selected: false },
  { categoria: '🎡 Adicionales', nombre: 'Foto recuerdo impresa',      precio: 15000, selected: false },
];

const MENU_RECREACIONAL: MenuPresupuesto = [
  { categoria: '🎟️ Entradas',    nombre: 'Entrada adulto (día completo)', precio: 35000, selected: false },
  { categoria: '🎟️ Entradas',    nombre: 'Entrada niño',                  precio: 25000, selected: false },
  { categoria: '🏊 Servicios',   nombre: 'Acceso piscinas + toboganes',   precio: 20000, selected: false },
  { categoria: '🏊 Servicios',   nombre: 'Alquiler cabaña BBQ (4 horas)', precio: 60000, selected: false },
  { categoria: '🍔 Alimentos',   nombre: 'Combo hamburguesa + papas',     precio: 22000, selected: false },
  { categoria: '🍔 Alimentos',   nombre: 'Picada familiar',               precio: 45000, selected: false },
];

const MENU_MUSEO: MenuPresupuesto = [
  { categoria: '🎟️ Entradas',    nombre: 'Entrada adulto',              precio: 12000, selected: false },
  { categoria: '🎟️ Entradas',    nombre: 'Entrada niño / estudiante',   precio: 8000,  selected: false },
  { categoria: '🎟️ Entradas',    nombre: 'Entrada adulto mayor',        precio: 8000,  selected: false },
  { categoria: '🎧 Guías',       nombre: 'Tour guiado (grupo hasta 10)',precio: 30000, selected: false },
  { categoria: '🎧 Guías',       nombre: 'Audioguía',                   precio: 10000, selected: false },
  { categoria: '🛍️ Tienda',      nombre: 'Souvenir artesanal',          precio: 15000, selected: false },
];

const MENU_ACTIVIDAD: MenuPresupuesto = [
  { categoria: '🏄 Actividad',   nombre: 'Actividad principal (1 persona)', precio: 45000, selected: false },
  { categoria: '🏄 Actividad',   nombre: 'Actividad en pareja',             precio: 80000, selected: false },
  { categoria: '🎽 Equipos',     nombre: 'Alquiler de equipo completo',     precio: 20000, selected: false },
  { categoria: '🎽 Equipos',     nombre: 'Seguro de actividad',             precio: 10000, selected: false },
  { categoria: '📸 Recuerdos',   nombre: 'Fotos + video de la actividad',   precio: 25000, selected: false },
];

const MENU_TOUR: MenuPresupuesto = [
  { categoria: '🗺️ Tours',       nombre: 'Tour medio día (hasta 4h)',    precio: 60000, selected: false },
  { categoria: '🗺️ Tours',       nombre: 'Tour día completo (8h)',        precio: 110000,selected: false },
  { categoria: '🗺️ Tours',       nombre: 'Tour privado (máx. 4 pax)',     precio: 200000,selected: false },
  { categoria: '🍱 Incluidos',   nombre: 'Almuerzo típico en ruta',       precio: 25000, selected: false },
  { categoria: '🍱 Incluidos',   nombre: 'Degustación de café',           precio: 12000, selected: false },
  { categoria: '🚐 Transporte',  nombre: 'Transporte ida y vuelta',        precio: 20000, selected: false },
];

const MENU_FINCA: MenuPresupuesto = [
  { categoria: '🌄 Alojamiento', nombre: 'Noche en finca (por persona)',  precio: 90000, selected: false },
  { categoria: '🌄 Alojamiento', nombre: 'Noche en finca (pareja)',        precio: 160000,selected: false },
  { categoria: '🥗 Alimentación',nombre: 'Desayuno típico campesino x2', precio: 28000, selected: false },
  { categoria: '🥗 Alimentación',nombre: 'Almuerzo del campo x2',         precio: 40000, selected: false },
  { categoria: '☕ Agroturismo', nombre: 'Recorrido cafetero + catación', precio: 35000, selected: false },
  { categoria: '🐴 Actividades', nombre: 'Cabalgata por la finca (1h)',   precio: 25000, selected: false },
  { categoria: '🐴 Actividades', nombre: 'Ordeño + actividades rurales',  precio: 20000, selected: false },
];

const MENU_CAMPING: MenuPresupuesto = [
  { categoria: '⛺ Acampar',     nombre: 'Parcela camping / noche',       precio: 25000, selected: false },
  { categoria: '⛺ Acampar',     nombre: 'Alquiler carpa (2 personas)',    precio: 35000, selected: false },
  { categoria: '⛺ Acampar',     nombre: 'Sleeping bag + colchoneta',      precio: 15000, selected: false },
  { categoria: '🔥 Servicios',   nombre: 'Kit fogata + leña',              precio: 18000, selected: false },
  { categoria: '🔥 Servicios',   nombre: 'Acceso baños / duchas',          precio: 5000,  selected: false },
  { categoria: '🥾 Actividades', nombre: 'Senderismo guiado (3h)',         precio: 20000, selected: false },
];

const MENU_SENDERISMO: MenuPresupuesto = [
  { categoria: '🥾 Senderismo',  nombre: 'Ruta corta (hasta 3h)',          precio: 25000, selected: false },
  { categoria: '🥾 Senderismo',  nombre: 'Ruta media (3-6h)',               precio: 40000, selected: false },
  { categoria: '🥾 Senderismo',  nombre: 'Ruta larga / todo el día',        precio: 65000, selected: false },
  { categoria: '🎽 Equipos',     nombre: 'Alquiler bastones de trekking',   precio: 8000,  selected: false },
  { categoria: '🎽 Equipos',     nombre: 'Alquiler kit lluvia / poncho',    precio: 10000, selected: false },
  { categoria: '🥗 Snacks',      nombre: 'Merienda energética en ruta',     precio: 12000, selected: false },
  { categoria: '📸 Recuerdos',   nombre: 'Sesión de fotos en miradores',    precio: 20000, selected: false },
];

const MENU_CABALGATA: MenuPresupuesto = [
  { categoria: '🐴 Cabalgatas',  nombre: 'Cabalgata 1 hora (1 persona)',   precio: 30000, selected: false },
  { categoria: '🐴 Cabalgatas',  nombre: 'Cabalgata 2 horas (1 persona)',  precio: 50000, selected: false },
  { categoria: '🐴 Cabalgatas',  nombre: 'Cabalgata en pareja (2h)',        precio: 90000, selected: false },
  { categoria: '🐴 Cabalgatas',  nombre: 'Cabalgata al amanecer',           precio: 45000, selected: false },
  { categoria: '📸 Recuerdos',   nombre: 'Fotos + video de la cabalgata',   precio: 20000, selected: false },
  { categoria: '🥗 Extras',      nombre: 'Desayuno campesino post-ruta',    precio: 18000, selected: false },
];

const MENU_MIRADOR: MenuPresupuesto = [
  { categoria: '🎟️ Ingreso',     nombre: 'Entrada mirador (persona)',      precio: 8000,  selected: false },
  { categoria: '☕ Consumo',     nombre: 'Café de origen en el mirador',   precio: 8000,  selected: false },
  { categoria: '☕ Consumo',     nombre: 'Tinto + colaciones',              precio: 10000, selected: false },
  { categoria: '🍦 Consumo',     nombre: 'Helado artesanal',               precio: 7000,  selected: false },
  { categoria: '📸 Recuerdos',   nombre: 'Sesión fotográfica (30 min)',     precio: 30000, selected: false },
  { categoria: '🛍️ Tienda',      nombre: 'Artesanías del lugar',           precio: 20000, selected: false },
];

// ──────────────────────────────────────────────────────────────
//  MAPA ID_TIPO → MENÚ
// ──────────────────────────────────────────────────────────────
export function getMenuByTipo(idTipo: number): MenuPresupuesto {
  const map: Record<number, MenuPresupuesto> = {
    1 : MENU_HOTEL,
    2 : MENU_HOSTAL,
    3 : MENU_GLAMPING,
    4 : MENU_CABANA,
    5 : MENU_APARTAHOTEL,
    6 : MENU_ECOHOTEL,
    7 : MENU_RESTAURANTE,
    8 : MENU_BAR,
    9 : MENU_CAFE,
    10: MENU_DISCOTECA,
    11: MENU_PARQUE_TEMATICO,
    12: MENU_RECREACIONAL,
    13: MENU_MUSEO,
    14: MENU_ACTIVIDAD,
    15: MENU_TOUR,
    16: MENU_FINCA,
    17: MENU_CAMPING,
    18: MENU_SENDERISMO,
    19: MENU_CABALGATA,
    20: MENU_MIRADOR,
  };
  // Deep clone para que cada instancia tenga su propio estado
  const menu = map[idTipo] ?? MENU_ACTIVIDAD;
  return menu.map(item => ({ ...item, selected: false }));
}
