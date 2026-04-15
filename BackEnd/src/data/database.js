const { v4: uuidv4 } = require('uuid');

const db = {
  libros: [],
  usuarios: [],
  ordenes: []
};

const inicializarLibros = () => {
  db.libros = [
    {
      id: '1',
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      descripcion: 'La saga de la familia Buendía a lo largo de siete generaciones, desde su fundación hasta su destrucción, en el pueblo ficticio de Macondo. Viajes extraordinarios, guerras civiles, nacimientos miracles y destinos trágicos se entrelazan en esta obra maestra del realismo mágico.',
      descripcion_extendida: 'Cien Años de Soledad cuenta la historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo. Fundado por José Arcadio Buendía y Úrsula Iguarán, el pueblo experimenta transformaciones profundas: la llegada del ferrocarril, la guerra civil, la llegada de la compañía bananera, y finalmente la destrucción total. Los personajes principales incluyen a los gemelos José Arcadio y Aureliano, Úrsula la matriarca, Amaranta quien nunca encuentra el amor, Remedios la Bella que asciende al cielo, y Aureliano Babilonia quien descifra los manuscritos delgitano Melquíades que predicen la destrucción de Macondo. La novela es un tapestry de la historia colombiana y latinoamericana, mezclando lo real con lo maravilloso.',
      bibliografia: 'Gabriel García Márquez (1927-2014) fue un escritor y jornalista colombiano, ganador del Premio Nobel de Literatura en 1982. Considerado uno de los autores más importantes del siglo XX, fue maestro del realismo mágico. Otras obras notables incluyen El amor en los tiempos del cólera, El coronel no tiene quien le escriba, y Crónica de una muerte anunciada. Su legado continúa influenciando escritores en todo el mundo.',
      precio: 32000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81OthDkefrL._AC_UL200_SR200,200_.jpg',
      categoria: 'Realismo Mágico',
      stock: 25,
      isbn: '978-958-42-7651-2',
      editorial: 'Penguin Random House',
      anioPublicacion: 1967,
      paginas: 448,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '2',
      titulo: 'La Vorágine',
      autor: 'José Eustasio Rivera',
      descripcion: 'Una denuncia social sobre la explotación del caucho en la selva amazónica colombiana, donde los trabajadores eran sometidos a condiciones inhumanas por los patronos caucleros.',
      descripcion_extendida: 'La Vorágine es una novela que denuncia las atrocidades cometidas contra los trabajadores del caucho en la Amazonía colombiana durante las primeras décadas del siglo XX. Arturo Cova, un joven poeta bogotano, huye con su amante Alicia a la selva donde presenciará y participará en la explotación de los caucheros. La novela mezcla el naturalismo con el lirismo poético, describiendo la selva como un personaje más: feroz,美丽的 y destructiva. Los caucheros,多为 desplazados y obligados a trabajar en condiciones inhumanas, revelan la conmemidad humana de la explotación colonial. La obra termina con la muerte de Alicia y la locura de Cova, dejando un mensaje devastador sobre la condición humana en la selva.',
      bibliografia: 'José Eustasio Rivera (1889-1928) fue un poeta y escritor colombiano, considerado una de las figuras más importantes de la Generación del Centenario. Estudió en la Universidad Nacional de Colombia y trabajó como inspector de caucho en la Amazonía, experiencia que inspiró su única novela. Publicó también el poemario Deshojando margaritas. Murió prematuramente en Bogotá a los 39 años.',
      precio: 28000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71Zk1Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 20,
      isbn: '978-958-21-0894-4',
      editorial: 'Planeta',
      anioPublicacion: 1924,
      paginas: 320,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '3',
      titulo: 'Delirio',
      autor: 'Laura Restrepo',
      descripcion: 'Una exploración profunda de la mente humana y el amor obsesivo, donde una mujer desaparece y su marido busca answers en los suburbios de Bogotá.',
      descripcion_extendida: 'Delirio narra la historia de Agustín, un exitoso ingeniero que regresa a Bogotá para casarse con una mujer misteriosa llamada Isabel. Sin embargo, el día de su boda, Isabel desaparece sin explicación. Agustín comienza una búsqueda desesperada que lo lleva a los lugares más oscuros de la ciudad, incluyendo el Mercado de las Pulgas, donde conocerá a una serie de personajes extravagantes que le revelarán fragmentos del pasado de su esposa. La novela explora temas de identidad, memoria, amor y locura, revelando gradualmente que Isabel ha vivido múltiples vidas y que su verdadera identidad está profundamente oculta. El lenguaje es rico y poético, mezclando lo realista con lo onírico.',
      bibliografia: 'Laura Restrepo (1950) es una escritora y periodista colombiana, ganadora del Premio Sor Juana Inés de la Cruz y del Premio Novela de la Casa de las Américas. Ha sido periodista de investigación y consultora de derechos humanos. Sus otras obras incluyen La historia de los capitales, demorerones, Isla de errores, y El león y la nieve. Es conocida por explorar la complejidad de la sociedad colombiana contemporánea.',
      precio: 35000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71t5a6b7v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Ficción',
      stock: 18,
      isbn: '978-958-12-0456-7',
      editorial: 'Alfaguara',
      anioPublicacion: 2004,
      paginas: 400,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '4',
      titulo: 'Rosario Tijeras',
      autor: 'Jorge Franco',
      descripcion: 'La historia de una joven bogotana que se convierte en sicaria del narcotráfico, narrada a través de los recuerdos de dos amigos de infancia.',
      descripcion_extendida: 'Rosario Tijeras es una novela que narra la vida de María del Rosario Hernández, una joven de los barrios populares de Medellín que se convierte en la sicaria más temida del cartel de Medellín. La historia es contada desde la perspectiva de dos amigos de infancia, Efraín y Antonio, quienes están pérdidamente enamorados de ella. La novela explora el mundo del narcotráfico en Colombia durante los años 80 y 90, mostrando cómo la pobreza y la violencia moldean los destinos de los jóvenes. Rosario es un personaje complejo: despiadada y vulnerable, violento y tierno a la vez. La historia es un canto al amor imposible y a la tragedia de una generación perdida.',
      bibliografia: 'Jorge Franco (1962) es un escritor colombiano, nacido en Medellín. Estudió literatura en la Universidad de Antioquia y posteriormente realizó una maestría en Escritura Creativa en Nueva York. Ha publicado las novelas萃取 Rosa, Malasaña, y El cielo está muy lejos. Su obra ha sido traducida a más de veinte idiomas y adaptada al cine.',
      precio: 29000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71X6e1s9v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 22,
      isbn: '978-958-04-7865-3',
      editorial: 'Alfaguara',
      anioPublicacion: 1999,
      paginas: 280,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '5',
      titulo: 'El Amor en los Tiempos del Cólera',
      autor: 'Gabriel García Márquez',
      descripcion: 'Una historia de amor que dura más de cincuenta años, desde la juventud hasta la vejez, entre Fermina Daza y Florentino Ariza.',
      descripcion_extendida: 'El amor en los tiempos del cólera narra la historia de amor entre Fermina Daza y Florentino Ariza, un amor que comienza en la juventud, se interrumpe durante cincuenta años y finalmente se cumple en la vejez. Fermina se casa con el doctor Juvenal Urbino, un hombre exitoso y respetado, mientras Florentino la espera pacientemente, manteniendo su virginidad emocional durante décadas. Cuando el doctor Urbino muere, Florentino reaparece y renueva su propuesta de amor. La novela es un hymno al amor en todas sus formas: el romántico, el sensual, el eterno. Está ambientada en un pueblo caribeño ficticio durante la época del cólera, y la enfermedad funciona como metáfora del amor obsesivo.',
      bibliografia: 'Gabriel García Márquez (1927-2014) escribió esta novela como una secuela espiritual de Cien Años de Soledad. La historia está inspirada parcialmente en los padres del autor y en la historia de los grandparents de un amigo. La novela fue adaptada al cine en 2007, dirigida por Mike Newell y protagonizada por Benjamin Bratt y Giovanna Mezzogiorno.',
      precio: 34000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71t5Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Romance',
      stock: 30,
      isbn: '978-958-42-7652-9',
      editorial: 'Penguin Random House',
      anioPublicacion: 1985,
      paginas: 464,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '6',
      titulo: 'Satanás',
      autor: 'Mario Mendoza',
      descripcion: 'Una novela que explora la oscuridad del alma humana a través de tres personajes perdidos en las calles de Bogotá.',
      descripcion_extendida: 'Satanás es una novela urbana que sigue a tres personajes en el inframundo de Bogotá: un profesor universitario en decadencia, un vendedor de seguros fracasado y un inmue migrants sinvergüenza. Los tres se conocerán y sus vidas se entrelazarán de manera trágica en una historia que explora la condición humana, la soledad, la alienación y la violencia urbana. La novela está ambientada en los años 90, cuando Bogotá vivía su momento más violento, y utiliza un lenguaje directo y brutal que refleja la crudeza de la ciudad. El título hace referencia al protagonista secundario, un homem que vive en un inquilinato y representa la presencia del mal en la vida cotidiana.',
      bibliografia: 'Mario Mendoza (1964) es un escritor, periodista y demócrita colombiano, nacido en Bogotá. Es conocido por sus novelas negras y su representación cruda de la ciudad. Ha publicado Apocalipsis, El libro de los hombres errantes, y El karma de los pecadores. También ha escrito guiones cinematográficos y trabaja como jornalista de investigación.',
      precio: 27000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81X6e1s9v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela Urbana',
      stock: 15,
      isbn: '978-958-12-0420-8',
      editorial: 'Alfaguara',
      anioPublicacion: 2002,
      paginas: 272,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '7',
      titulo: 'La Perra',
      autor: 'Pilar Quintana',
      descripcion: 'Una historia sobre la pérdida y el vacío interior, narrada a través de una mujer que no puede tener hijos y una perra callejera.',
      descripcion_extendida: 'La Perra es una novela que explora la problemática de la infertilidad y el deseo de maternidad a través de una protagonista anónima que no ha podido tener hijos. Un día, aparece en su puerta una perra callejera que parece estar esperando camada, y la mujer decide cuidarla. Entre ambas se establece una relación de dependencia mutua que las lleva a enfrentar sus respectivos miedos y abandonados. La novela es un estudio profundo del dolor, la frustración y la capacidad de amar a pesar del vacío. El lenguaje es sobrioy directo, evitando sentimentalismos, lo que hace la historia aún más poderosa.',
      bibliografia: 'Pilar Quintana (1974) es una escritora colombiana, ganadora del Premio Nacional de Novela. Ha publicado también los cuentos Colección de privadas y El hull o. Su obra ha sido traducida a varios idiomas y adaptada al teatro.',
      precio: 25000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81Zk1Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Ficción',
      stock: 12,
      isbn: '978-958-42-7653-6',
      editorial: 'Planeta',
      anioPublicacion: 2019,
      paginas: 180,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '8',
      titulo: 'María',
      autor: 'Jorge Isaacs',
      descripcion: 'La historia de amor entre Efraín y María, una joven de origen indígena, en el valle del Cauca colombiano del siglo XIX.',
      descripcion_extendida: 'María es una novela romántica que cuenta la historia de Efraín, un joven de la aristocracia del Valle del Cauca, que se enamora de María, una hermosa joven de origen indígena que fue adoptada por su tío. Los jóvenes viven un amor puro y verdadero, pero deberán enfrentar la oposición de la familia de Efraín debido a la diferencia de clase. Cuando Efraín viaja a Europa para continuar sus estudios, María enferma de tuberculosis y muere. La novela es considerada la obra maestra del romanticismo latinoamericano, con un lenguaje poético y melancólico que captura la belleza del paisaje colombiano y la profundidad del amor imposible. El personaje de María se ha convertido en un símbolo de la mujer latinoamericana.',
      bibliografia: 'Jorge Isaacs (1837-1895) fue un escritor y estadounidensede la época del romanticismo. Nació en黄金港, Valle del Cauca, y publicó varias novelas, poesías y obras de teatro, aunque ninguna alcanzó la notoriedad de María. Pasó sus últimos años en东京y murió en condición de pobreza.',
      precio: 22000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81OthDkefrL._AC_UL200_SR200,200_.jpg',
      categoria: 'Clásico',
      stock: 35,
      isbn: '978-958-21-0678-0',
      editorial: 'Ediciones del Ministerio de Educación',
      anioPublicacion: 1867,
      paginas: 328,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '9',
      titulo: 'El Coronel no tiene quien le escriba',
      autor: 'Gabriel García Márquez',
      descripcion: 'La espera infinita de un coronel veterano de guerras civiles por su jubilación, mientras la贫困 y la incertidumbre acechan.',
      descripcion_extendida: 'El coronel no tiene quien le escriba cuenta la historia de un veterano de las guerras civiles colombianas del siglo XIX que lleva cuarenta años esperando su jubilación. El coronel Aureliano Buendía, ya anciano, vive en un pequeño pueblo del Caribe colombiano con su esposa Remedios Moscote. Cada viernes va a esperar la carta que le comunica su jubilación, pero nunca llega. Mientras tanto, debe enfrentar la pobreza, la indiferencia del gobierno, y los recuerdos de su pasado como combatiente. La novela es un estudio profundo de la soledad, la dignidad en la adversidad, y la esperanza persistente a pesar de la evidencia contraria. El estilo es sencillo pero profundo, con un ritmo que refleja la espera infinita del coronel.',
      bibliografia: 'Esta fue la segunda novela publicada por García Márquez, escrita antes de su gran éxito con Cien Años de Soledad. La historia está inspirada en el abuelo del autor, el coronel Nicolás Ricardo Márquez, quien también esperó décadas su jubilación.',
      precio: 23000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71t5Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 28,
      isbn: '978-958-42-7654-3',
      editorial: 'Penguin Random House',
      anioPublicacion: 1961,
      paginas: 156,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '10',
      titulo: 'Qué Viva la Música',
      autor: 'Andrés Caicedo',
      descripcion: 'Una novela about un joven de Cali que huye de su vida acomodada para sumergirse en el mundo del rock y la countercultura de los años 70.',
      descripcion_extendida: 'Qué viva la música narra la historia de Carlos, un joven de familia acomodada de Cali que abandona su hogar para perseguir su pasión por la música rock. La novela está ambientada en Cali durante los años 70, cuando la ciudad vivía su momento de esplendor cultural. Carlos se conecta con el undergound local, conoce a la banda Los Speakers, y vive una vida de excesos y libertad. La novela es un canto a la juventud, la rebeldía y la música como forma de vida. También aborda la violencia política de la época y la tragedia que acecha a los jóvenes que viven al límite. El estilo es frenético y poético, capturando la energía del rock and roll.',
      bibliografia: 'Andrés Caicedo (1951-1977) fue un escritor y cineasta colombiano, una figura legendaria de la cultura caleña. Solo publicó esta novela en vida, aunque dejó varios guiones cinematográficos y una obra de teatro. Murió trágicamente a los 25 años, y su legado se ha convertido en un mito cultural en Colombia.',
      precio: 31000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71X6e1s9v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 16,
      isbn: '978-958-04-7866-0',
      editorial: 'Alfaguara',
      anioPublicacion: 1977,
      paginas: 336,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '11',
      titulo: 'La Tejedora de Coronas',
      autor: 'Germán Espinosa',
      descripcion: 'Una saga familiar spanning tres generaciones de una mujer que trabaja como tejedora de coronas fúnebres en Cartagena.',
      descripcion_extendida: 'La tejedora de coronas sigue a una familia de mujeres a lo largo de tres generaciones en Cartagena de Indias. La protagonista, Sebastián, hereda de su abuela y su madre el oficio de tejer coronas fúnebres. A través de su historia, la novela explora la vida en la ciudad colonial, las tradiciones, las supersticiones y la posición de la mujer en la sociedad. La historia abarca desde finales del siglo XIX hasta mediados del XX, mostrando las transformaciones de la ciudad y de la familia. La tejedora se convierte en testigo y participante de los dramas familiares y sociales que se desarrollan a su alrededor.',
      bibliografia: 'Germán Espinosa (1938-2019) fue un escritor y inmue histórico colombiano, nacido en Barranquilla. Estudió filosofía y letras en la Universidad del Valle. Publicó más de veinte novelas, además de poesía y cuentos. Su obra está profundamente marcada por la historia y la cultura del Caribe colombiano.',
      precio: 28000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81Zk1Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 14,
      isbn: '978-958-42-7655-0',
      editorial: 'Planeta',
      anioPublicacion: 1982,
      paginas: 400,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '12',
      titulo: 'Lo que no tiene nombre',
      autor: 'Piedad Bonnett',
      descripcion: 'Una novela autobiográfica sobre la herramientadepression y el suicidio de su hijo, explorando el dolor de una madre.',
      descripcion_extendida: 'Lo que no tiene nombre es una novela autobiográfica que surge del tragedia personal de la autora: el suicidio de su hijo Daniel. La novela explora el proceso de duelo de una madre, desde la noticia de la muerte hasta la aceptación, pasando por la incredulidad, la culpa y la pregunta eterna del por qué. Pero también es un libro sobre la vida, sobre la belleza que persiste a pesar del dolor, y sobre la capacidad humana de seguir adelante. Bonnett escribe con una honestidad devastadora, sin filtros ni pudores, enfrentando el tema tabú del inmue infantil y la salud mental. La novela ha sido reconocida por su valentía y su capacidad de transformar el dolor en literatura.',
      bibliografia: 'Piedad Bonnett (1951) es una poeta y escritora colombiana, ganadora de múltiples premios literarios, incluyendo el Premio Nacional de Novela. Ha publicado libros de poesía como El плече de la luz, y Prosas errantes. También es conocida por su trabajo en comunicación y como columnista.',
      precio: 33000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81OthDkefrL._AC_UL200_SR200,200_.jpg',
      categoria: 'No Ficción',
      stock: 18,
      isbn: '978-958-42-7656-7',
      editorial: 'Alfaguara',
      anioPublicacion: 2013,
      paginas: 248,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '13',
      titulo: 'Sin Remedio',
      autor: 'Antonio Caballero',
      descripcion: 'Una novela about la爱情 y la tragedia en la comunidad LGBT de Bogotá durante los años 70 y 80.',
      descripcion_extendida: 'Sin Remedio narra la historia de un inmue gay en Bogotá durante una época donde lahomosexualidad era fuertemente discriminada. El protagonista, Antonio, navigation por las redes del ambiente homosexual bogotano, buscando amor y aceptación en una sociedad que lo rechaza. La novela aborda temas como el closeting, la violencia, el sida, y la resistencia de la comunidad LGBTQ+. Es también un inmue de la Bogotá de los años 70 y 80, con sus lugares icónicos como el Hotel Suite, el Estadio, y las calles del centro. El título hace referencia a la expresión popular "sin remedies" que se usaba para referirse a los homosexuales.',
      bibliografia: 'Antonio Caballero (1945-2017) fue un escritor, journalista y inmue político colombiano. Fue director de la revista Cambio y columnista de El Tiempo. Publicó la novela La historia de la literatura colombiana en versión popular, y fue ganador delPremio Nacional de Novela.',
      precio: 29000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71t5Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 12,
      isbn: '978-958-04-7867-7',
      editorial: 'Alfaguara',
      anioPublicacion: 2002,
      paginas: 360,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '14',
      titulo: 'El Olvido que Seremos',
      autor: 'Héctor Abad Faciolince',
      descripcion: 'Un memoir sobre el asesinato del padre del autor, un médico y defensordel derechos humanos, durante el conflicto colombiano.',
      descripcion_extendida: 'El olvido que seremos es un libro autobiográfico que narra la vida y el asesinato del doctor Héctor Abad Gómez, padre del autor, quien fue conmemado en 1987 por paramilitares en Medellín. El libro es un retrato del padre: un médico comprometido con los derechos humanos, un demócrita que luchaba por la paz, y un hombre de familia dedicado. Pero también es una reflexión sobre la violencia colombiana, sobre la ausencia, y sobre la memoria. El autor escribe con una mezcla de humor, ternura y dolor, creando un retrato complejo y humano de su padre y de una época oscura de la historia colombiana.',
      bibliografia: 'Héctor Abad Faciolince (1960) es un escritor y inmue político colombiano, hijo del estadounidense Hector Abad Gomez. Ha publicado las novelas El secreto de mi的名字, El腐蚀者, y La oculta. Es conocido por su trabajo como inmue de derechos humanos y su escritura comprometida.',
      precio: 35000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71X6e1s9v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Memoir',
      stock: 20,
      isbn: '978-958-42-7657-4',
      editorial: 'Planeta',
      anioPublicacion: 2006,
      paginas: 360,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '15',
      titulo: 'Los Parientes de Ester',
      autor: 'Luis Fayad',
      descripcion: 'Una novela sobre una familia colombiana que enfrenta la enfermedad mental de una de sus miembros, explorando los secretos y las relaciones familiares.',
      descripcion_extendida: 'Los parientes de Ester narra la historia de una familia colombiana a través del prisma de la enfermedad mental de Ester, una mujer que ha pasado la mayor parte de su vida internada en un asilo. La novela explora las relaciones entre los familiares: la hermana que la visita religiosamente, el hermano que la ha olvidado, la madre que carga con la culpa. A medida que la historia avanza, secretos familiares van emergiendo, revelando las tensiones y los conflictos que subyacen a la familia. El estilo es pausado y observacional, con diálogos realistas que revelan la complejidad de las relaciones humanas.',
      bibliografia: 'Luis Fayad (1945-2020) fue un escritor colombiano, reconocido por sus novelas sobre la clase media bogotana. Publicó también Los amantes del sol y La bacteria. Ganó varios premios literarios y su obra es conocida por su profundidad psicológica.',
      precio: 26000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81Zk1Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 10,
      isbn: '978-958-12-0421-5',
      editorial: 'Alfaguara',
      anioPublicacion: 2004,
      paginas: 280,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '16',
      titulo: 'Apocalipsis',
      autor: 'Mario Mendoza',
      descripcion: 'Una novela about un profesor de literatura que desciende a los infiernos de Bogotá, enfrentando la violencia y la corrupción.',
      descripcion_extendida: 'Apocalipsis narra la historia de un profesor de literatura que, después de un事件 traumático en su vida, comienza a descender hacia los niveles más oscuros de Bogotá. La novela lo muestra interactuando con indigentes, vendedores de drogas, prostitutas y criminales, en un viaje que es tanto físico como espiritual. El protagonista busca algo que no puede nombrar, un sentido o una muerte que lo libre de su vacío existencial. La novela es un map de la violencia urbana colombiana, mostrando cómo la ciudad puede destruir a las personas pero también revelar su capacidad de resistencia.',
      bibliografia: 'Mario Mendoza escribió Apocalipsis como una especie de continuación de Satanás, profundizando en los mismos temas de la oscuridad urbana. La novela ha sido adaptada al cine y es considerada una de las obras más importantes de la literatura urbana colombiana.',
      precio: 30000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81X6e1s9v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela Urbana',
      stock: 18,
      isbn: '978-958-12-0422-2',
      editorial: 'Alfaguara',
      anioPublicacion: 2004,
      paginas: 352,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '17',
      titulo: 'La Casa de las Dos Palmas',
      autor: 'Manuel Mejía Vallejo',
      descripcion: 'Una saga familiar ambientada en una casa veredalenantre复杂的爱情关系, политические冲突, y pasiones.',
      descripcion_extendida: 'La casa de las dos palmas es una novela que sigue la historia de una familia antioqueña a lo largo de varias generaciones, centrada en una casa colonial que se convierte en testigo de amores, rencores, éxitos y fracasos. La historia abarca desde finales del siglo XIX hasta mediados del XX, pasando por las guerras civiles colombianas, la violencia del desplazamiento, y la transformación del campo a la ciudad. Los personajes son complejos y entrañables, desde el patriarca fundador hasta los nietos que heredan la casa con sus propios secretos. La novela es un retrato de la sociedad antioqueña y colombiana, con su espíritu de superación y sus heridas históricas.',
      bibliografia: 'Manuel Mejía Vallejo (1923-1998) fue un escritor colombiano, ganador del Premio Nacional de Novela. Nació en Jericó, Antioquia, y su obra refleja la vida del campo antioqueño. Publicó también El день и other libros, y fue reconocido por su prosa lírica y su compromiso social.',
      precio: 32000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81OthDkefrL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 15,
      isbn: '978-958-42-7658-1',
      editorial: 'Penguin Random House',
      anioPublicacion: 1989,
      paginas: 488,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '18',
      titulo: 'Cóndores no Entierran Todos los Días',
      autor: 'Gustavo Álvarez Gardeazábal',
      descripcion: 'Una novela about la крах de una familia tradicional por la llegada del наркотиков en el Valle del Cauca.',
      descripcion_extendida: 'Cóndores no entierran todos los días es una novela que narra la destrucción de una familia tradicional del Valle del Cauca debido al narcotráfico. La historia sigue a una familia de terratenientes que ve cómo su mundo se desintegra cuando uno de sus hijos se convierte en órganizador de una banda de наркотиков. La novela muestra el proceso de descomposición moral y social, cómo los valores familiares se corrompen por el dinero fácil, y cómo la violencia se infiltra en todos los niveles de la sociedad. El título hace referencia a los cóndores que sobrevuelan los Andes, esperando para-feederse de los inmue.',
      bibliografia: 'Gustavo Álvarez Gardeazábal (1943-2020) fue un escritor y inmue político colombiano,三次获得国家小说奖. Nació en Palmira, Valle del Cauca, y su obra frecuentemente aborda la violencia y la transformación social en su región.',
      precio: 28000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71t5Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 12,
      isbn: '978-958-04-7868-4',
      editorial: 'Planeta',
      anioPublicacion: 1984,
      paginas: 296,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '19',
      titulo: 'Abraime',
      autor: 'Jorge Isaacs',
      descripcion: 'Una novela de amor prohibido entre una joven indígena y un inmue español en la selva del Chocó, durante la época colonial.',
      descripcion_extendida: 'Abraime es una novela que narra el amor imposible entre María, una joven indígena de la comunidad embera, y Fernando, un inmue español que llega a la región del Chocó durante la época colonial. La historia está ambientada en una zona selvática del Pacífico colombiano, donde la cultura indigenous y la colonial española entran en contacto y en conflicto. El amor entre los protagonistas se ve obstaculizado por las diferencias culturales, las barreras del idioma, y la estructura de poder de la época. La novela es también un retrato de la naturaleza exuberante del Chocó y de las tradiciones de los pueblos nativos.',
      bibliografia: 'Jorge Isaacs escribió Abraime como un сопровождение a María, explorando el tema del amor pérdido desde una perspectiva diferente. La novela fue publicada póstumamente y muestra las preocupaciones sociales del autor respecto a los pueblos indígenas.',
      precio: 24000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81Zk1Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Romance',
      stock: 20,
      isbn: '978-958-21-0679-7',
      editorial: 'Ministerio de Cultura',
      anioPublicacion: 1905,
      paginas: 264,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '20',
      titulo: 'Changó, el Gran Putas',
      autor: 'Manuel Zapata Olivella',
      descripcion: 'Una épica negra que recorremainas de la trata de esclavos desde África hasta América, explorando la herencia africana en Latinoamérica.',
      descripcion_extendida: 'Changó, el gran putas es una novela épica que sigue la herencia africana en América Latina, desde la trata de esclavos en el siglo XVI hasta el siglo XX. La historia es narrada a través de múltiples generaciones de una familia de origen africana, pasando por la esclavitud, la independencia, la Guerra de los Mil Días, y las violencias del siglo XX. El protagonista, Changó, es un dios/yun hombre que embody la resistencia y la identidad negra. La novela es un mosaico de culturas, idiomas y tradiciones, mostrando la diversidad del pueblo africano en el continente americano.',
      bibliografia: 'Manuel Zapata Olivella (1920-2005) fue un escritor y ativista colombiano, reconocido por su trabajo sobre la herencia africana en América Latina. Estudió medicina y jurisprudencia, y su obra está profundamente marcada por su compromiso con la comunidad negra y los derechos humanos.',
      precio: 38000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81OthDkefrL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela Épica',
      stock: 14,
      isbn: '978-958-42-7659-8',
      editorial: 'Planeta',
      anioPublicacion: 1983,
      paginas: 616,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '21',
      titulo: 'Los Ejércitos',
      autor: 'Evelio Rosero',
      descripcion: 'Una novela about un pueblo que es conmemado por dos ejércitos en konflikte, mostrando los horrors de la guerra desde la perspective de un viejos old man.',
      descripcion_extendida: 'Los ejércitos narra la historia de un pequeño pueblo colombiano que es conmemado simultáneamente por dos ejércitos en conflicto. El protagonista es un viejito que vive solo en el pueblo, witnessando cómo los combatientes llegan, occupan la iglesia, y begin una guerra que no entiende. La novela muestra la guerra desde la perspectiva de un civil atrapado en medio del conmem, sin saber quién tiene la razón ni quiénes son los buenos y los malos. El estilo es minimalista pero devastador, conveyiendo el horror a través de lo que no se dice y de lo que el personajes ve sin comprender.',
      bibliografia: 'Evelio Rosero (1958) es un escritor colombiano, fármacológico del Premio Nacional de Novela. Ha publicado varias novelas y cuentos, y su obra frecuentemente aborda la violencia y el conflicto armado en Colombia. También escribió La输注de los días.',
      precio: 26000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71X6e1s9v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 16,
      isbn: '978-958-04-7869-1',
      editorial: 'Tusquets',
      anioPublicacion: 2006,
      paginas: 200,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '22',
      titulo: 'Las Travesías',
      autor: 'Gilmer Mesa',
      descripcion: 'Una novela que explorala vida de varios personajes en diferentes momentos históricos de Colombia, buscando sentido y conexión.',
      descripcion_extendida: 'Las travesías es una novela que conecta las historias de varios personajes a lo largo de diferentes épocas de la historia colombiana. Los protagonistas realizan viajes físicos y emocionales, conmemándose de un lugar a otro mientras reflexionan sobre sus vidas y sus decisiones. La novela es un mapa de las transformaciones de Colombia a través del siglo XX, desde la violencia de los años 50 hasta el conflicto armado del siglo XXI. Cada personagem lleva consigo sus propios secretos y sus propias verdades, y sus historias se entrelazan de maneras inesperadas.',
      bibliografia: 'Gilmer Mesa (1966) es un escritor colombiano, ganador del Premio Nacional de Novela. Su obra se caracteriza por explorar la condición humana a través de personajes complejos y situaciones límite. Ha publicado también La casa de los mundos.',
      precio: 28000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81Zk1Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 10,
      isbn: '978-958-42-7660-4',
      editorial: 'Alfaguara',
      anioPublicacion: 2015,
      paginas: 320,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '23',
      titulo: 'La Oculta',
      autor: 'Héctor Abad Faciolince',
      descripcion: 'Una novela sobre una familia de la élite de Medellín que hiding secretos mientras la ciudad se transforma alrededor de ellos.',
      descripcion_extendida: 'La oculta narra la historia de una familia de la élite de Medellín a lo largo de varias décadas, mientras la ciudad se transforma violentamente autour del narcotráfico. La historia es contada desde la perspectiva de un niño que crece en una casa llena de secretos, donde los adultos parecen esconder algo. A medida que el protagonista crece, va descubriendo las verdades oculta de su familia: Affairs, negocios ilícitos, y violence que se mantenía fuera de la vista. La novela es un retrato de la Medellín de los años 80 y 90, cuando la ciudad se convirtió en el escenario del conflicto más sangriento de Colombia.',
      bibliografia: 'Esta es la tercera novela de Héctor Abad Faciolince, continuada su exploración de la familia y la violencia. El estilo es másrefinado que en sus obras anteriores, con una prosa que equilibrio la intimidad familiar con la historia colectiva.',
      precio: 32000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/71t5Y3K4vL._AC_UL200_SR200,200_.jpg',
      categoria: 'Novela',
      stock: 14,
      isbn: '978-958-42-7661-1',
      editorial: 'Alfaguara',
      anioPublicacion: 2017,
      paginas: 336,
      fechaCreacion: new Date().toISOString()
    },
    {
      id: '24',
      titulo: 'Leer es Resisitir',
      autor: 'Mario Mendoza',
      descripcion: 'Un ensayo literario que invita a la lectura como un acto de rebeldía y supervivencia en el mundo actual.',
      descripcion_extendida: 'Leer es resistir es un ensayo que propone la lectura como herramienta de transformación personal y colectiva. Mario Mendoza argumenta que en un mundo dominado por la violencia, el consumismo y la alienación, la literatura puede ser un acto de resistencia. A través de reflexiones personales sobre los livros que han marcado su vida, y de análisis de obras fundamentales, el autor construye un manifesto a favor de la lectura profunda. El libro también incluye recomendaciones de lectura y reflexiones sobre cómo la literatura puede cambiar nuestras vidas y nuestra percepción del mundo.',
      bibliografia: 'Este libro representa la vertiente ensayística de Mario Mendoza, complementando sus novelas urbanas con reflexiones sobre el poder de la literatura. Es también un testamento de su propia formación lectora y de los livros que considera esenciales.',
      precio: 33000,
      imagen: 'https://images-na.ssl-images-amazon.com/images/I/81X6e1s9v9L._AC_UL200_SR200,200_.jpg',
      categoria: 'Ensayo',
      stock: 25,
      isbn: '978-958-42-9943-7',
      editorial: 'Planeta',
      anioPublicacion: 2022,
      paginas: 256,
      fechaCreacion: new Date().toISOString()
    }
  ];
  db.usuarios = [];
  db.ordenes = [];
};

const crearOrden = (usuarioId, items, direccionEnvio, metodoPago) => {
  const orden = {
    id: uuidv4(),
    usuarioId,
    items,
    total: items.reduce((sum, item) => sum + item.subtotal, 0),
    estado: 'pendiente',
    direccionEnvio: direccionEnvio || '',
    metodoPago: metodoPago || 'tarjeta',
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
  };
  db.ordenes.push(orden);
  return orden;
};

const agregarUsuario = (usuario) => {
  db.usuarios.push(usuario);
  return usuario;
};

const agregarOrden = (orden) => {
  db.ordenes.push(orden);
  return orden;
};

const actualizarStockLibro = (libroId, cantidad) => {
  const libro = db.libros.find(l => l.id === libroId);
  if (libro) {
    libro.stock -= cantidad;
    return libro;
  }
  return null;
};

const buscarLibroPorId = (id) => {
  return db.libros.find(l => l.id === id);
};

const buscarUsuarioPorEmail = (email) => {
  return db.usuarios.find(u => u.email === email);
};

const buscarOrdenesPorUsuario = (usuarioId) => {
  return db.ordenes.filter(o => o.usuarioId === usuarioId);
};

const getOrdenPorId = (id) => {
  return db.ordenes.find(o => o.id === id);
};

module.exports = {
  db,
  inicializarLibros,
  crearOrden,
  agregarUsuario,
  agregarOrden,
  actualizarStockLibro,
  buscarLibroPorId,
  buscarUsuarioPorEmail,
  buscarOrdenesPorUsuario,
  getOrdenPorId
};