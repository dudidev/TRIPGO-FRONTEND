export type CardItem = {
  slug: string;
  titulo: string;
  img: string;
};

export type LugaresData = {
  titulo: string;
  heroImgs: string[];
  items: CardItem[];
};

export const LUGARES_DATA: Record<string, Record<string, LugaresData>> = {
  salento: {
    cabalgatas: {
      titulo: 'Cabalgatas',
      heroImgs: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731482/cabalgata_portada_-_cabal_sd9xro.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731467/cabalgata_portada_2-_cabal_vkqbmf.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731481/cabalgata_portada_-_5_xfwmcd.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765732072/cabalgata_portada_-_3_sysznh.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765731463/cabalgata_-_portada_4_dma1bo.jpg',
      ],
      items: [
        {
          slug: '5',
          titulo: 'Hotel Camino Real Salento',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg'
        },
        {
          slug: 'caminos-y-trochas',
          titulo: 'Cabalgatas Caminos Y Trochas',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733201/portada_-_categoria_5_t7pmpz.jpg'
        },
        {
          slug: 'alquiler-caballos-salento',
          titulo: 'Alquiler De Caballos Salento',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733119/alquiler_de_caballos_jxigjm.jpg'
        },
        {
          slug: 'parque-el-secreto',
          titulo: 'Parque El Secreto',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733591/parque_el_secreto_2_dxc2be.jpg'
        },
        {
          slug: 'equitour',
          titulo: 'Operadora Turistica Equitou',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733157/operadora_-_equiotur_iruxok.jpg'
        },
        {
          slug: 'amigos-caballistas',
          titulo: 'Amigos Caballiztas De Salento',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765733124/amigos_caballiztas_wmm1yd.jpg'
        },
        
      ]
    },

   
    'valle-cocora': {
      titulo: 'Valle del Cocora',
      heroImgs: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729518/cocora_3_blygia.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765685157/salento_1-portada_zkh8fr.jpg',
      ],
      items: [
        {
          slug: '6',
          titulo: 'CocoraTours - Excursión grupal valle del cocora',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644280/Imagen4valle-cocora_q54j6k.png'
        }, 

        
        {
          slug: '4',
          titulo: 'Tour Valle del Cocora',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644290/Imagen2valle-cocora_w9b3ja.png'
        },
        {
          slug: '11',
          titulo: 'Tour Valle del Cocora y sus alrededores',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765732072/cabalgata_portada_-_3_sysznh.jpg'
        },
        {
          slug: '7',
          titulo: 'CocoraTours - Plan Hospedaje Santuario de Palmas',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644269/Imagen3valle-cocora_w0ggkc.png'
        },
        {
          slug: '5',
          titulo: 'Hotel Camino Real Salento',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg'
        },
        
      ]
    },

    "hotel": {
      titulo: 'Hoteles',
      heroImgs: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1771997447/hotel_calle_real_bcugsw.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1771997562/hotel_calle_real_2_fjwhdl.jpg'
      ],
      items: [
        {
          slug: '5',
          titulo: 'Hotel Camino Real Salento',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729515/calle_real_-_categoria_hudaar.jpg'
        },
        
      ]
    },

    "mirador": {
      titulo: 'Miradores',
      heroImgs: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770812553/Cocora_Valley_Magic_-_Stunning_Cocora_Valley_Photography_isxlbg.jpg',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770812553/C%C3%B3cora_valley_i9ceo0.jpg'],
      items: [
        {
          slug: '12',
          titulo: 'Mirador Alto de la Cruz',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1771997990/mirador_alto_de_la_cruz_vl62jj.jpg'
        },
        {
          slug: '13',
          titulo: 'Mirador Las Manos de Dios',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765723552/cocora_bcq0nv.jpg'
        },
        {
          slug: 'mirador-colina-iluminada',
          titulo: 'Mirador Colina Iluminada',
          img: 'https://via.placeholder.com/600x400?text=Mirador+Colina+Iluminada'
        }
      ]
  },

   "senderismo": {
      titulo: 'Senderismo',
      heroImgs: [
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770818967/Imagen1senderismo_pyiubi.png',
        'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770819751/Imagen3_senderismo_cyldjb.png'],
      items: [
        {
          slug: '10',
          titulo: 'Senderismo Valle del Cocora - Acaime',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770819751/Imagen3_senderismo_cyldjb.png'
        },
        {
          slug: '20',
          titulo: 'Cascada Santa Rita',
          img: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644278/img1valle-cocora_azfhwk.png'
        },
        {
          slug: 'mirador-colina-iluminada',
          titulo: 'Mirador Colina Iluminada',
          img: 'https://via.placeholder.com/600x400?text=Mirador+Colina+Iluminada'
        }
      ]
  },
},
  filandia: {
    miradores: {
      titulo: 'Miradores',
      heroImgs: [
        'https://via.placeholder.com/900x500?text=FILANDIA+MIRADORES+1',
        'https://via.placeholder.com/900x500?text=FILANDIA+MIRADORES+2',
      ],
      items: [
        {
          slug: 'mirador-encanto',
          titulo: 'Mirador Encanto',
          img: 'https://via.placeholder.com/600x400?text=Mirador+Encanto'
        }
      ]
    }
  }




};
