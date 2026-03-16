// ══════════════════════════════════════════════════════════════
//  servicios-establecimiento.data.ts
//  Servicios/amenidades quemados por tipo de establecimiento
//  Ajusta los servicios según la info real de cada lugar.
// ══════════════════════════════════════════════════════════════

export function getServiciosByTipo(idTipo: number): string[] {
  const map: Record<number, string[]> = {

    // 1 — Hotel
    1: [
      'WiFi gratis', 'Recepción 24h', 'Parqueadero',
      'Piscina', 'Restaurante', 'Room service',
      'Aire acondicionado', 'TV cable', 'Caja fuerte',
      'Lavandería', 'Salón de eventos', 'Acceso para discapacitados',
    ],

    // 2 — Hostal
    2: [
      'WiFi gratis', 'Cocina compartida', 'Lockers',
      'Parqueadero bicicletas', 'Zona social', 'Terraza',
      'Agua caliente', 'Consigna de equipaje', 'Tours locales',
      'Recepción 24h', 'Zona de lectura',
    ],

    // 3 — Glamping
    3: [
      'WiFi gratis', 'Desayuno incluido', 'Jacuzzi privado',
      'Fogata nocturna', 'Vista a la montaña', 'Zona BBQ',
      'Bicicletas disponibles', 'Senderos naturales', 'Mascotas permitidas',
      'Traslado aeropuerto', 'Hamacas y zonas de descanso',
    ],

    // 4 — Cabaña
    4: [
      'WiFi gratis', 'Cocina equipada', 'Zona BBQ',
      'Chimenea', 'Jacuzzi', 'Parqueadero privado',
      'Terraza con vista', 'Mascotas permitidas', 'Ropa de cama incluida',
      'TV Smart', 'Zona de juegos', 'Senderos naturales',
    ],

    // 5 — Apartahotel
    5: [
      'WiFi gratis', 'Cocina equipada', 'Lavadora',
      'Parqueadero', 'Gimnasio', 'Piscina',
      'Recepción 24h', 'Servicio de limpieza', 'TV cable',
      'Ascensor', 'Aire acondicionado', 'Zona de trabajo',
    ],

    // 6 — Ecohotel
    6: [
      'WiFi gratis', 'Desayuno orgánico', 'Paneles solares',
      'Reciclaje y compostaje', 'Senderos ecológicos', 'Avistamiento de aves',
      'Huerta orgánica', 'Yoga y meditación', 'Taller de café',
      'Zona de camping', 'Mascotas permitidas', 'Sin plástico de un solo uso',
    ],

    // 7 — Restaurante
    7: [
      'Menú del día', 'Carta variada', 'Opciones vegetarianas',
      'Servicio a domicilio', 'Reservas disponibles', 'Zona al aire libre',
      'Parqueadero', 'WiFi gratis', 'Caja de regalos / catering',
      'Zona infantil', 'Música en vivo fines de semana', 'Bar integrado',
    ],

    // 8 — Bar
    8: [
      'Cervezas artesanales', 'Cócteles de autor', 'Música en vivo',
      'Terraza exterior', 'TV para eventos deportivos', 'Reservas de mesa',
      'Picadas y snacks', 'Happy hour', 'WiFi gratis',
      'Zona fumadores', 'Juegos de mesa', 'Karaoke fines de semana',
    ],

    // 9 — Café
    9: [
      'Café de origen', 'Métodos de preparación alternativos', 'Cursos de barismo',
      'WiFi gratis', 'Zona de trabajo', 'Música ambiente',
      'Productos artesanales', 'Desayunos y brunch', 'Terraza exterior',
      'Venta de café en grano', 'Menú vegano disponible', 'Pet friendly',
    ],

    // 10 — Discoteca
    10: [
      'Pista de baile', 'DJ residente', 'Música electrónica y tropical',
      'Servicio de botellería', 'Zona VIP', 'Guardarropa',
      'Seguridad privada', 'Estacionamiento cercano', 'Bar completo',
      'Reservas de mesa', 'Shows en vivo', 'Ambiente temático',
    ],

    // 11 — Parque temático
    11: [
      'Montañas rusas', 'Atracciones acuáticas', 'Shows y espectáculos',
      'Zona de picnic', 'Restaurantes internos', 'Estacionamiento amplio',
      'Acceso para discapacitados', 'Enfermería', 'Zona infantil',
      'Recorrido en tren', 'Tienda de souvenirs', 'Fotografía profesional',
    ],

    // 12 — Centro recreacional
    12: [
      'Piscinas múltiples', 'Toboganes', 'Canchas deportivas',
      'Zona de camping', 'Restaurante interno', 'Estacionamiento',
      'Área de picnic y BBQ', 'Juegos infantiles', 'Salón de eventos',
      'Servicio de salvavidas', 'Alquiler de implementos', 'WiFi en zonas comunes',
    ],

    // 13 — Museo
    13: [
      'Guías especializados', 'Audioguías disponibles', 'Salas interactivas',
      'Tienda de souvenirs', 'Zona de lectura', 'Acceso para discapacitados',
      'Fotografía permitida', 'Talleres educativos', 'Estacionamiento cercano',
      'Cafetería interna', 'Grupos y visitas escolares', 'Exposiciones temporales',
    ],

    // 14 — Actividad
    14: [
      'Instructor certificado', 'Equipos de seguridad incluidos', 'Seguro de accidente',
      'Apto para principiantes', 'Fotografía de la experiencia', 'Grupos reducidos',
      'Recogida en hotel disponible', 'Hidratación incluida', 'Briefing previo',
      'Certificado de participación', 'Edad mínima requerida', 'Apto para todas las edades',
    ],

    // 15 — Tour operador
    15: [
      'Guía bilingüe', 'Transporte incluido', 'Almuerzo en ruta',
      'Seguro de viaje', 'Grupos pequeños (máx. 12)', 'Recogida en hotel',
      'Degustación de productos locales', 'Fotografía incluida', 'Visita a comunidades locales',
      'Equipo de senderismo disponible', 'Mapa de ruta', 'Acceso a zonas exclusivas',
    ],

    // 16 — Finca turística
    16: [
      'Recorrido cafetero', 'Catación de café', 'Cabalgatas',
      'Zona de camping', 'Piscina natural', 'Desayuno campesino',
      'WiFi gratis', 'Actividades de ordeño', 'Senderos internos',
      'Fogata nocturna', 'Zona BBQ', 'Mascotas permitidas',
    ],

    // 17 — Camping
    17: [
      'Parcelas demarcadas', 'Baños y duchas', 'Agua potable',
      'Zona de fogata', 'Recolección de basura', 'Alquiler de carpas',
      'Tienda de camping básica', 'Senderos señalizados', 'Zona de hamacas',
      'Iluminación nocturna', 'Parqueadero seguro', 'Guía de senderismo',
    ],

    // 18 — Senderismo
    18: [
      'Rutas señalizadas', 'Guía experto local', 'Equipo de primeros auxilios',
      'Bastones de trekking disponibles', 'Hidratación en ruta', 'Puntos de descanso',
      'Miradores panorámicos', 'Fotografía de flora y fauna', 'Nivel de dificultad indicado',
      'Grupos máx. 10 personas', 'Kit de lluvia disponible', 'Apto para familias',
    ],

    // 19 — Cabalgatas
    19: [
      'Caballos mansos y entrenados', 'Instructor acompañante', 'Equipo de seguridad',
      'Rutas por senderos naturales', 'Apto para principiantes', 'Visita a miradores',
      'Fotografía en ruta', 'Hidratación incluida', 'Duración flexible',
      'Grupos pequeños', 'Niños desde 5 años', 'Desayuno campesino disponible',
    ],

    // 20 — Mirador
    20: [
      'Vista panorámica 360°', 'Acceso a pie y en vehículo', 'Zona de descanso',
      'Café y bebidas disponibles', 'Amanecer y atardecer espectaculares', 'Fotografía profesional',
      'Telescopio disponible', 'Guía interpretativo', 'Tienda de artesanías',
      'Sendero de acceso señalizado', 'Iluminación nocturna', 'Estacionamiento cercano',
    ],
  };

  return map[idTipo] ?? [
    'Atención personalizada', 'Zona de descanso', 'Acceso fácil',
    'Información turística local', 'Ambiente familiar',
  ];
}
