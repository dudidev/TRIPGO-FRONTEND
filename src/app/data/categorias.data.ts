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
      { key: 'actividad', label: 'actividad', img: '' },
      
    ],
    itinerarios: [
      { titulo: 'Aventura entre palmas y colores', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729518/cocora_3_blygia.jpg' },
      { titulo: 'Naturaleza en el Valle de Cocora', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685157/salento_1-portada_zkh8fr.jpg' },
      { titulo: 'Miradores + atardecer', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765722352/Colombia_a5gesq.jpg' },
      { titulo: 'Ruta de café y cata', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Calle Real + artesanías', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg' },
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
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },

    ]
  },
  calarca: {
    nombre: 'calarca',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339220/jardin-botanico-calarca_qlgdk7.webp',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339146/cafe-bar-de-carlos-3_ogxnji.webp',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339212/el-domo-aves-y-cafe-calarca_nmw5dk.webp',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339199/cafe-bar-de-carlos_j0cmqm.webp',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339192/el-cafe-de-carlos_o7o6zj.webp',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339182/cafe-bar-de-carlos-2_g2kpnb.webp',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773339718/finca_la_bella_extr5h.webp',
      
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },

    ]
  }, 

  montenegro: {
    nombre: 'Montenegro',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685155/Parque_del_cafe_ani4un.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685154/Img_Parque_del_cafe_ruzil0.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685156/parque_del_cafe3-portada_zhiusk.jpg'
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },

  quimbaya:{
    nombre: 'Quimbaya',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773405942/panaca2_qwhhfu.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773405943/panaca3_pioukf.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773405878/mama_lulu_2_zdsqtl.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773405878/finca_mama_lulu_quimbaya_yrzuvo.jpg',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773405817/panaca6_fzbkha.webp',
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406008/panaca5_twp1f7.webp'
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
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
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406545/img_de_fondo_para_categorias_pyucuh.jpg',
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },

  armenia: {
    nombre: 'Armenia',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406545/img_de_fondo_para_categorias_pyucuh.jpg',
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },

  buenavista: {
    nombre: 'Buenavista',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406545/img_de_fondo_para_categorias_pyucuh.jpg',
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },

  pijao: {
    nombre: 'Pijao',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406545/img_de_fondo_para_categorias_pyucuh.jpg',
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },

  cordoba: {
    nombre: 'Cordoba',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406545/img_de_fondo_para_categorias_pyucuh.jpg',
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },

  tebaida: {
    nombre: 'Latebaida',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406545/img_de_fondo_para_categorias_pyucuh.jpg',
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },

  genova: {
    nombre: 'Genova',
    sliderImgs: [
      'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773406545/img_de_fondo_para_categorias_pyucuh.jpg',
    ],
    categorias: [
      { key: 'miradores', label: 'Miradores', img: 'https://via.placeholder.com/600x400?text=MIRADORES' },
    ],
    itinerarios: [
      { titulo: 'Ruta cultural', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg' },
      { titulo: 'Mirador + fotografía', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg' },
      { titulo: 'Plan cafetero', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729552/tour_cafe_-_categoria_be5nev.jpg' },
      { titulo: 'Plan relax: cafés y fotos', img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729512/cafes_-_categorias_f9s1db.jpg' },
    ]
  },


  
}
