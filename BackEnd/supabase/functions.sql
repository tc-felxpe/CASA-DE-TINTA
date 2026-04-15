-- Función para incrementar stock (usada al cancelar órdenes)
CREATE OR REPLACE FUNCTION public.incrementar_stock(libro_id UUID, cantidad INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE public.libros 
    SET stock = stock + cantidad,
        vendidos = GREATEST(vendidos - cantidad, 0)
    WHERE id = libro_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para buscar libros con full-text search
CREATE OR REPLACE FUNCTION public.buscar_libros(texto_busqueda TEXT)
RETURNS TABLE(
    id UUID,
    titulo VARCHAR,
    autor VARCHAR,
    descripcion TEXT,
    precio DECIMAL,
    imagen VARCHAR,
    categoria VARCHAR,
    rating DECIMAL,
    vendidos INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        l.id,
        l.titulo,
        l.autor,
        l.descripcion,
        l.precio,
        l.imagen,
        l.categoria,
        l.rating,
        l.vendidos
    FROM public.libros l
    WHERE l.activo = true
    AND (
        l.titulo ILIKE '%' || texto_busqueda || '%'
        OR l.autor ILIKE '%' || texto_busqueda || '%'
        OR l.descripcion ILIKE '%' || texto_busqueda || '%'
        OR l.isbn ILIKE '%' || texto_busqueda || '%'
    )
    ORDER BY l.destacado DESC, l.rating DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas
CREATE OR REPLACE FUNCTION public.obtener_estadisticas()
RETURNS TABLE(
    total_libros BIGINT,
    total_usuarios BIGINT,
    total_ordenes BIGINT,
    ordenes_pendientes BIGINT,
    ordenes_completadas BIGINT,
    ventas_totales DECIMAL,
    libros_vendidos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM public.libros WHERE activo = true),
        (SELECT COUNT(*) FROM public.usuarios WHERE activo = true),
        (SELECT COUNT(*) FROM public.ordenes),
        (SELECT COUNT(*) FROM public.ordenes WHERE estado = 'pendiente'),
        (SELECT COUNT(*) FROM public.ordenes WHERE estado = 'entregado'),
        COALESCE((SELECT SUM(total) FROM public.ordenes WHERE estado != 'cancelado'), 0),
        COALESCE((SELECT SUM(cantidad) FROM public.detalle_ordenes), 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
