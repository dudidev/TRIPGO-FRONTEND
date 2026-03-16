export const DEFAULT_TIPO_PORTADA =
  'https://res.cloudinary.com/dshqbl8d1/image/upload/v1770646756/imagen6valle-cocora_r8sw92.jpg';
 

export const TIPO_PORTADAS: Record<number, string> = {
  // ✅ id_tipo : url
  1: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601592/hotel_uelnlf.webp', // Hotel
  2: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601590/hostal_lrkul1.webp', // Hostal
  3: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773602272/glamping_zbuipr.webp', // Glamping
  4: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601579/cabanas_oeoohj.webp', // Cabana
  5: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773521678/apartahotel_ymdikb.webp', // Apartahotel
  6: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601588/ecohotel_zeom5x.webp', // Ecohotel
  7: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773522135/restaurante_nu865m.webp', // Restaurante
  8: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601571/bar1_o1ohmv.webp', // Bar
  9: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601580/cafes_wisn4t.webp', // Cafe
  10: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601584/discoteca_fsdcqt.webp', // Discoteca
  11: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601596/parque-tematico_1_1_krrsh5.webp', // Parque tematico
  12: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601596/parque-recreacional_lsc5tf.webp', // Centro Recreacional
  13: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773598324/museo_vb4owi.webp', // Museo
  14: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773603516/actividad1_cuhpny.webp', // Actvidad
  15: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773603630/tours1_dfnqde.webp', // Tour Operador
  16: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601589/finca-turistica_pzsjeu.webp', // Finca turistica
  17: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601584/camping_wvjqtr.webp', // Camping
  18: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601568/senderismo_ngirma.webp', // Senderismo
  19: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773600277/cabalgata_sady4p.webp', // Cabalgatas
  20: 'https://res.cloudinary.com/dshqbl8d1/image/upload/v1773601569/mirador_ss0bel.webp' // Mirador
};

export function portadaTipo(idTipo: number | string | undefined | null): string {
  const id = Number(idTipo);
  if (!id || Number.isNaN(id)) return DEFAULT_TIPO_PORTADA;
  return TIPO_PORTADAS[id] ?? DEFAULT_TIPO_PORTADA;
}