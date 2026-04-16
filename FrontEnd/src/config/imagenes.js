// Mapeo de IDs de libros a imágenes locales en /public/img/
const IMAGENES_LOCALES = {
  '1': '/img/1-cien-anos-de-soledad.jpg',
  '2': '/img/2-la-voragine.jpg',
  '3': '/img/3-delirio.jpg',
  '4': '/img/4-rosario-tijeras.jpg',
  '5': '/img/5-el-amor-en-los-tiempos-del-colera.jpg',
  '6': '/img/6-satanas.jpg',
  '7': '/img/7-la-perra.jpg',
  '8': '/img/8-maria.jpg',
  '9': '/img/9-el-coronel-no-tiene-quien-le-escriba.jpg',
  '10': '/img/10-que-viva-la-musica.jpg',
  '11': '/img/11-la-tejedora-de-coronas.jpg',
  '12': '/img/12-lo-que-no-tiene-nombre.jpg',
  '13': '/img/13-sin-remedio.jpg',
  '14': '/img/14-el-olvido-que-seremos.jpg',
  '15': '/img/15-los-parientes-de-ester.jpg',
  '16': '/img/16-apocalipsis.jpg',
  '17': '/img/17-la-casa-de-las-dos-palmas.jpg',
  '18': '/img/18-condores-no-entierran-todos-los-dias.jpg',
  '19': '/img/19-abraime.jpg',
  '20': '/img/20-chango-el-gran-putas.jpg',
  '21': '/img/21-los-ejercitos.jpg',
  '22': '/img/22-las-travesias.jpg',
  '23': '/img/23-la-oculta.jpg',
  '24': '/img/24-leer-es-resistir.jpg',
}

export const getLibroImagen = (libro) => {
  if (!libro) return null
  const local = IMAGENES_LOCALES[libro.id]
  if (local) return local
  return libro.imagen_url || libro.imagen || null
}
