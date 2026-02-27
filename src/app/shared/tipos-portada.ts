export const DEFAULT_TIPO_PORTADA =
  'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770646756/imagen6valle-cocora_r8sw92.jpg';
 

export const TIPO_PORTADAS: Record<number, string> = {
  // ✅ id_tipo : url
  14: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770644280/Imagen4valle-cocora_q54j6k.png', // Actividades
  1: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770646756/imagen6valle-cocora_r8sw92.jpg', // Hotel
  18: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729551/senderismo_-_categorias_sqngzv.jpg', // Senderismo
  7: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729535/portada_-_categorias_ooyums.jpg', // Restaurantes
  11: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765724011/parque_del_cafe_portada_-_sugerencias_wkryck.jpg', // Parquen temático
  3: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770815648/10_Glampings_en_Colombia_para_una_Escapada_%C3%9Anica_u8iiew.jpg', // Glaping
  4: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1771992161/cabana-colibri_ncxhjj.jpg', // Cabana
  20: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1765729523/mirador_-_categoria_omagyv.jpg', // Miradores
};

export function portadaTipo(idTipo: number | string | undefined | null): string {
  const id = Number(idTipo);
  if (!id || Number.isNaN(id)) return DEFAULT_TIPO_PORTADA;
  return TIPO_PORTADAS[id] ?? DEFAULT_TIPO_PORTADA;
}