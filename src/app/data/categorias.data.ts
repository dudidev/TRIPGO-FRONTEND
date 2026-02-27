export type CategoriaItem = { key: string; label: string; img: string };
export type ItinerarioItem = { titulo: string; img: string };
export type CategoriaData = {
  nombre: string;
  sliderImgs: string[];
  categorias: CategoriaItem[];
  itinerarios: ItinerarioItem[];
};
export const CATEGORIAS_DATA: Record<string, CategoriaData> = {
  salento: {
    nombre: 'Salento',
    sliderImgs: [
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729535/portada_-_categorias_ooyums.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729647/portada_-_categorias_2_zpvmbp.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729531/portada_-_categoria_5_ulppr2.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729542/portada_8_jrmbd6.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729543/portada_9_ulkcgh.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729538/portada_6_lbjntm.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729528/portada_-_categoria_3_sl5x04.jpg",
      "https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729524/portaa_-_categorias_4_isekut.jpg"
    ],
    categorias: [
      { key: 'valle-cocora', label: 'Valle del Cocora', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729518/cocora_3_blygia.jpg' },
      { key: 'senderismo', label: 'Senderismo', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { key: 'cabalgatas', label: 'Cabalgatas', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729510/cabalgata_-_categorias_lzojcq.jpg' },

      { key: 'miradores', label: 'Miradores', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { key: 'cafe-tour', label: 'Tour de Café', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { key: 'calle-real', label: 'Calle Real', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg' },

      { key: 'cafes', label: 'Cafés', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
      { key: 'restaurantes', label: 'Restaurantes', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729548/restaurante_-_categoria_prasz2.jpg' },
      { key: 'bares', label: 'Bares', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729507/bares_-_categorias_drm5rl.jpg' },

      { key: 'artesanias', label: 'Artesanías', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729506/artesanias_-_categorias_cmhfdw.jpg' },
      { key: 'avistamiento-aves', label: 'Avistamiento de aves', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765725175/avistamento_aves_portada_-_suge_kpizdw.jpg' },
      { key: 'jeep-willys', label: 'Jeep Willys', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729520/Jeep_Willys_-_categorias_sarw7o.jpg' },
    ],
    itinerarios: [
      { titulo: 'Aventura entre palmas y colores', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729518/cocora_3_blygia.jpg' },
      { titulo: 'Naturaleza en el Valle de Cocora', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685157/salento_1-portada_zkh8fr.jpg' },
      { titulo: 'Miradores + atardecer', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765722352/Colombia_a5gesq.jpg' },
      { titulo: 'Ruta de café y cata', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Calle Real + artesanías', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg' },
      { titulo: 'Cabalgata por senderos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733201/portada_-_categoria_5_t7pmpz.jpg' },
      { titulo: 'Avistamiento de aves temprano', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765725175/avistamento_aves_portada_-_suge_kpizdw.jpg' },
      { titulo: 'Gastronomía típica del Quindío', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729535/portada_-_categorias_ooyums.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
    ]
  },

  filandia: {
    nombre: 'Filandia',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765722321/filandia_portada_-_carrucel_yvkncf.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/filandia_1-portada_tu13tg.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_3-_portada_pdxw7k.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_2-portada_e7tr5m.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729528/portada_-_categoria_3_sl5x04.jpg'
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
      { key: 'cafes', label: 'Cafés', img: 'https://via.placeholder.com/600x400?text=CAFES' },
      { key: 'artesanias', label: 'Artesanías', img: 'https://via.placeholder.com/600x400?text=ARTESANIAS' },
      { key: 'cultura', label: 'Cultura', img: 'https://via.placeholder.com/600x400?text=CULTURA' },
      { key: 'cultura', label: 'Cultura', img: 'https://via.placeholder.com/600x400?text=CULTURA' },
      { key: 'paseo', label: 'Paseo', img: 'https://via.placeholder.com/600x400?text=PASEO' },


    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },

    ]
  },
  circasia: {
    nombre: 'Circasia',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765722223/circasia_portada_-_carrucel_ouyjxj.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/circasia_1-portada_ryk00f.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_3-_portada_pdxw7k.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685143/gastronomia_2-portada_e7tr5m.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729528/portada_-_categoria_3_sl5x04.jpg'
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
      { key: 'cafes', label: 'Cafés', img: 'https://via.placeholder.com/600x400?text=CAFES' },
      { key: 'artesanias', label: 'Artesanías', img: 'https://via.placeholder.com/600x400?text=ARTESANIAS' },
      { key: 'cultura', label: 'Cultura', img: 'https://via.placeholder.com/600x400?text=CULTURA' },
      { key: 'cultura', label: 'Cultura', img: 'https://via.placeholder.com/600x400?text=CULTURA' },
      { key: 'paseo', label: 'Paseo', img: 'https://via.placeholder.com/600x400?text=PASEO' },


    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },

    ]
  }
};
