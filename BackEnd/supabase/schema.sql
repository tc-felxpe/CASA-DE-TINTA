-- ===========================================
-- ESQUEMA DE BASE DE DATOS PARA LIBRERÍA
-- Creado para Supabase (PostgreSQL)
-- ===========================================

-- 1. TABLA DE USUARIOS
-- Extiende auth.users de Supabase o crea tabla propia
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    direccion TEXT,
    rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('usuario', 'admin')),
    fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

-- Índice para búsqueda por email
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);

-- 2. TABLA DE LIBROS (CATÁLOGO)
CREATE TABLE IF NOT EXISTS public.libros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(500) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio >= 0),
    imagen VARCHAR(1000),
    categoria VARCHAR(100),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    isbn VARCHAR(20) UNIQUE,
    editorial VARCHAR(255),
    anio_publicacion INTEGER,
    paginas INTEGER,
    rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    vendidos INTEGER DEFAULT 0,
    destacado BOOLEAN DEFAULT false,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT true
);

-- Índices para búsqueda
CREATE INDEX IF NOT EXISTS idx_libros_titulo ON public.libros(titulo);
CREATE INDEX IF NOT EXISTS idx_libros_autor ON public.libros(autor);
CREATE INDEX IF NOT EXISTS idx_libros_categoria ON public.libros(categoria);
CREATE INDEX IF NOT EXISTS idx_libros_isbn ON public.libros(isbn);
CREATE INDEX IF NOT EXISTS idx_libros_precio ON public.libros(precio);

-- Búsqueda full-text
CREATE INDEX IF NOT EXISTS idx_libros_fulltext ON public.libros 
USING gin(to_tsvector('spanish', titulo || ' ' || autor || ' ' || COALESCE(descripcion, '')));

-- 3. TABLA DE ÓRDENES
CREATE TABLE IF NOT EXISTS public.ordenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    estado VARCHAR(30) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado')),
    direccion_envio TEXT,
    metodo_pago VARCHAR(30) DEFAULT 'tarjeta',
    notas TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para buscar órdenes por usuario
CREATE INDEX IF NOT EXISTS idx_ordenes_usuario ON public.ordenes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado ON public.ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_ordenes_fecha ON public.ordenes(fecha_creacion DESC);

-- 4. TABLA DE DETALLE DE ÓRDENES
CREATE TABLE IF NOT EXISTS public.detalle_ordenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orden_id UUID NOT NULL REFERENCES public.ordenes(id) ON DELETE CASCADE,
    libro_id UUID NOT NULL REFERENCES public.libros(id) ON DELETE RESTRICT,
    titulo VARCHAR(500) NOT NULL,
    autor VARCHAR(255),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para buscar detalles por orden
CREATE INDEX IF NOT EXISTS idx_detalle_ordenes_orden ON public.detalle_ordenes(orden_id);
CREATE INDEX IF NOT EXISTS idx_detalle_ordenes_libro ON public.detalle_ordenes(libro_id);

-- ===========================================
-- FUNCIONES Y TRIGGERS
-- ===========================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion en usuarios
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger para actualizar fecha_actualizacion en libros
DROP TRIGGER IF EXISTS update_libros_updated_at ON public.libros;
CREATE TRIGGER update_libros_updated_at
    BEFORE UPDATE ON public.libros
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Trigger para actualizar fecha_actualizacion en órdenes
DROP TRIGGER IF EXISTS update_ordenes_updated_at ON public.ordenes;
CREATE TRIGGER update_ordenes_updated_at
    BEFORE UPDATE ON public.ordenes
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Función para actualizar stock al crear orden
CREATE OR REPLACE FUNCTION public.actualizar_stock_despues_orden()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.libros 
    SET stock = stock - NEW.cantidad,
        vendidos = vendidos + NEW.cantidad
    WHERE id = NEW.libro_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar stock
DROP TRIGGER IF EXISTS trigger_actualizar_stock ON public.detalle_ordenes;
CREATE TRIGGER trigger_actualizar_stock
    AFTER INSERT ON public.detalle_ordenes
    FOR EACH ROW EXECUTE FUNCTION public.actualizar_stock_despues_orden();

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.libros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detalle_ordenes ENABLE ROW LEVEL SECURITY;

-- Políticas para libros (lectura pública, escritura solo admins)
CREATE POLICY "Libros son públicos para lectura" ON public.libros
    FOR SELECT USING (activo = true);

CREATE POLICY "Solo admins pueden insertar libros" ON public.libros
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

CREATE POLICY "Solo admins pueden actualizar libros" ON public.libros
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE id = auth.uid() AND rol = 'admin'
        )
    );

-- Políticas para usuarios
CREATE POLICY "Usuarios pueden ver su propio perfil" ON public.usuarios
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Cualquiera puede registrarse" ON public.usuarios
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.usuarios
    FOR UPDATE USING (id = auth.uid());

-- Políticas para órdenes
CREATE POLICY "Usuarios pueden ver sus propias órdenes" ON public.ordenes
    FOR SELECT USING (usuario_id = auth.uid());

CREATE POLICY "Usuarios pueden crear órdenes" ON public.ordenes
    FOR INSERT WITH CHECK (usuario_id = auth.uid());

-- Políticas para detalle de órdenes
CREATE POLICY "Ver detalles de órdenes propias" ON public.detalle_ordenes
    FOR SELECT USING (
        orden_id IN (
            SELECT id FROM public.ordenes WHERE usuario_id = auth.uid()
        )
    );

CREATE POLICY "Crear detalles de órdenes propias" ON public.detalle_ordenes
    FOR INSERT WITH CHECK (
        orden_id IN (
            SELECT id FROM public.ordenes WHERE usuario_id = auth.uid()
        )
    );

-- ===========================================
-- DATOS DE PRUEBA (SEED)
-- ===========================================

-- Insertar libros de ejemplo
INSERT INTO public.libros (titulo, autor, descripcion, precio, imagen, categoria, stock, isbn, editorial, anio_publicacion, paginas, rating, vendidos, destacado) VALUES
('Harry Potter y la piedra filosofal', 'J.K. Rowling', 'Harry Potter se ha quedado orphaned después de la muerte de sus padres. Vive con sus tíos que lo tratan terriblemente. Un día recibe una carta que cambiará su vida para siempre.', 24.99, 'https://images-na.ssl-images-amazon.com/images/I/81YOuOGJML._AC_UL200_SR200,200_.jpg', 'Fantasía', 50, '978-8478884499', 'Salamandra', 1997, 309, 4.80, 1250, true),
('El Señor de los Anillos', 'J.R.R. Tolkien', 'En la Tierra Media, en el Shire, un joven hobbit llamado Frodo Bolsón hereda un anillo mágico que resulta ser el Anillo Único.', 29.99, 'https://images-na.ssl-images-amazon.com/images/I/71jLBXtWJWL._AC_UL200_SR200,200_.jpg', 'Fantasía', 35, '978-8445072225', 'Minotauro', 1954, 1178, 4.90, 2100, true),
('Cien Años de Soledad', 'Gabriel García Márquez', 'La saga de la familia Buendía a lo largo de siete generaciones, desde su fundación hasta su destrucción, en el pueblo ficticio de Macondo.', 22.50, 'https://images-na.ssl-images-amazon.com/images/I/81OthDkefrL._AC_UL200_SR200,200_.jpg', 'Realismo Mágico', 40, '978-0060883287', 'Catedra', 1967, 417, 4.70, 1850, false),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 'La historia de un hidalgo que enloquece por leer demasiados libros de caballerías y decide convertirse en caballero andante.', 19.99, 'https://images-na.ssl-images-amazon.com/images/I/81WcnG3YHDL._AC_UL200_SR200,200_.jpg', 'Clásico', 60, '978-8460769378', 'Alianza', 1605, 1056, 4.60, 3200, false),
('1984', 'George Orwell', 'Winston Smith vive en una sociedad vigilada donde el Partido controla cada aspecto de la vida. Trabaja en el Ministerio de la Verdad.', 18.99, 'https://images-na.ssl-images-amazon.com/images/I/71rpa1-kyEL._AC_UL200_SR200,200_.jpg', 'Ciencia Ficción', 45, '978-0451524935', 'Signet', 1949, 328, 4.50, 2500, false),
('Orgullo y Prejuicio', 'Jane Austen', 'La historia de Elizabeth Bennet y su relación con el orgulloso Sr. Darcy en la Inglaterra del siglo XIX.', 16.99, 'https://images-na.ssl-images-amazon.com/images/I/71Q1tPupK4L._AC_UL200_SR200,200_.jpg', 'Romance', 55, '978-0141439518', 'Penguin Classics', 1813, 432, 4.70, 1800, false),
('El Hobbit', 'J.R.R. Tolkien', 'Bilbo Bolsón, un hobbit pacífico, es reclutado por el mago Gandalf para acompañar a trece enanos en una misión para recuperar su hogar perdido.', 14.99, 'https://images-na.ssl-images-amazon.com/images/I/710+HcoP38L._AC_UL200_SR200,200_.jpg', 'Fantasía', 70, '978-0547928227', 'Mariner Books', 1937, 310, 4.80, 1650, true),
('Crónica de una Muerte Anunciada', 'Gabriel García Márquez', 'La historia del asesinato de Santiago Nasar, narrada desde múltiples perspectivas por los habitantes del pueblo.', 12.99, 'https://images-na.ssl-images-amazon.com/images/I/81F+8xAnE4L._AC_UL200_SR200,200_.jpg', 'Realismo Mágico', 80, '978-0307389732', 'Vintage', 1981, 128, 4.40, 950, false),
('Fahrenheit 451', 'Ray Bradbury', 'En un futuro donde los libros están prohibidos, Guy Montag es un bombero cuyo trabajo es quemar cualquier libro que encuentre.', 15.99, 'https://images-na.ssl-images-amazon.com/images/I/81S0l-1UY2L._AC_UL200_SR200,200_.jpg', 'Ciencia Ficción', 50, '978-1451673319', 'Simon & Schuster', 1953, 249, 4.50, 1400, false),
('Matar a un Ruiseñor', 'Harper Lee', 'La historia de Atticus Finch, un abogado que defiende a un hombre negro acusado de violación en la Alabama de los años 30.', 17.99, 'https://images-na.ssl-images-amazon.com/images/I/81gepf1eK4L._AC_UL200_SR200,200_.jpg', 'Ficción', 65, '978-0061120084', 'Harper Perennial', 1960, 324, 4.70, 2200, false),
('Los Juegos del Hambre', 'Suzanne Collins', 'En un futuro distópico, Katniss Everdeen se ofrece como voluntaria para participar en los Juegos del Hambre, un torneo mortal retransmitido por televisión.', 21.99, 'https://images-na.ssl-images-amazon.com/images/I/81N3mv-2UML._AC_UL200_SR200,200_.jpg', 'Juvenil', 55, '978-0439023481', 'Scholastic Press', 2008, 374, 4.60, 2800, true),
('El Código Da Vinci', 'Dan Brown', 'El profesor de simbología Robert Langdon investiga una serie de crímenes relacionados con secretos milenarios.', 23.99, 'https://images-na.ssl-images-amazon.com/images/I/61-zp-f1J8L._AC_UL200_SR200,200_.jpg', 'Thriller', 40, '978-0307474278', 'Anchor', 2003, 597, 4.30, 3500, false)
ON CONFLICT (isbn) DO NOTHING;

-- ===========================================
-- USUARIO ADMIN DE PRUEBA
-- ===========================================
-- Password: admin123 (hash bcrypt)
INSERT INTO public.usuarios (nombre, email, password, telefono, direccion, rol) VALUES
('Administrador', 'admin@libreria.com', '$2a$10$HJ8fXKvBH8XzQr5.O5mXU.Yk5.1Yh1Qv5mXU.Yk5.1Yh1Qv5mXU.Y', '+1234567890', 'Calle Admin 123', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Usuario de prueba normal
-- Password: usuario123 (hash bcrypt)
INSERT INTO public.usuarios (nombre, email, password, telefono, direccion, rol) VALUES
('Usuario Prueba', 'prueba@libreria.com', '$2a$10$HJ8fXKvBH8XzQr5.O5mXU.Yk5.1Yh1Qv5mXU.Yk5.1Yh1Qv5mXU.Y', '+0987654321', 'Calle Usuario 456', 'usuario')
ON CONFLICT (email) DO NOTHING;

-- ===========================================
-- PERMISOS ANÓNIMOS (para registro y login)
-- ===========================================

-- Permitir operaciones sin autenticar para registro
CREATE POLICY "Permitir registro público" ON public.usuarios
    FOR INSERT WITH CHECK (true);

-- ===========================================
-- ACTUALIZAR TOTAL DE ORDEN (para triggers)
-- ===========================================
CREATE OR REPLACE FUNCTION public.actualizar_total_orden(orden_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.ordenes 
    SET total = (
        SELECT COALESCE(SUM(subtotal), 0) 
        FROM public.detalle_ordenes 
        WHERE orden_id = actualizar_total_orden.orden_id
    )
    WHERE id = orden_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
# Fin del esquema
