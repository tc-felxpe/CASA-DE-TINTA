import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { apiFetch } from '../config/api'
import './Historial.css'

export default function Historial() {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [debugInfo, setDebugInfo] = useState(null)
  const { token } = useCarrito()

  useEffect(() => {
    if (!token) {
      setCargando(false)
      return
    }

    const fetchOrdenes = async () => {
      try {
        const res = await apiFetch('/api/ordenes/mis-ordenes', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        
        if (!res.ok) {
          setDebugInfo(`Error ${res.status}: ${data.message || data.error}`)
        } else if (data.success && Array.isArray(data.data)) {
          setOrdenes(data.data)
        } else {
          setDebugInfo('Datos recibidos no son un array')
        }
      } catch (err) {
        setDebugInfo('Error de conexión: ' + err.message)
      } finally {
        setCargando(false)
      }
    }
    fetchOrdenes()
  }, [token])

  const formatearPrecio = (precio) => {
    const num = parseFloat(precio)
    if (isNaN(num)) return '$0.00'
    return '$' + num.toFixed(2)
  }

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible'
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return fecha
    }
  }

  const getEstadoClass = (estado) => {
    const est = (estado || '').toLowerCase().trim()
    if (est === 'pendiente') return 'estado-pendiente'
    if (est === 'procesando') return 'estado-procesando'
    if (est === 'enviado') return 'estado-enviado'
    if (est === 'entregado' || est === 'completada') return 'estado-entregado'
    if (est === 'cancelado' || est === 'cancelada') return 'estado-cancelado'
    return 'estado-pendiente'
  }

  if (cargando) return <div className="loading">Cargando historial...</div>

  if (!token) {
    return (
      <div className="historial-login">
        <div className="historial-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <h1>Inicia sesión para ver tu historial</h1>
        <p>Accede a tu cuenta para ver todas tus compras</p>
        <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
      </div>
    )
  }

  if (debugInfo) {
    return (
      <div className="historial">
        <div className="error-message">
          <h3>Error al cargar historial</h3>
          <p>{debugInfo}</p>
        </div>
      </div>
    )
  }

  if (ordenes.length === 0) {
    return (
      <div className="historial-vacio">
        <div className="historial-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
            <line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <h1>No tienes compras aún</h1>
        <p>Cuando realices tu primera compra, aparecerá aquí</p>
        <Link to="/" className="btn btn-primary">Ver Libros</Link>
      </div>
    )
  }

  return (
    <div className="historial">
      <div className="historial-header">
        <div className="historial-header-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h1>Historial de Compras</h1>
      </div>
      <p className="historial-subtitle">Todas tus órdenes en un solo lugar</p>

      <div className="ordenes-container">
        {ordenes.map((orden, index) => (
          <div 
            key={orden.id} 
            className="orden-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="orden-header">
              <div className="orden-info">
                <div className="orden-id">
                  <span className="orden-id-label">Orden</span>
                  <span className="orden-id-value">#{String(orden.id).slice(-8).toUpperCase()}</span>
                </div>
                <div className="orden-fecha">
                  <span className="orden-fecha-label">Fecha</span>
                  <span className="orden-fecha-value">{formatearFecha(orden.fecha_creacion)}</span>
                </div>
              </div>
              <div className="orden-total">
                <span className="orden-total-label">Total</span>
                <span className="orden-total-value">{formatearPrecio(orden.total)}</span>
              </div>
              <span className={`estado ${getEstadoClass(orden.estado)}`}>
                {orden.estado || 'Pendiente'}
              </span>
            </div>
            
            <div className="orden-detalles">
              <div className="orden-libros-header">
                {orden.libros?.length || 0} libro{orden.libros?.length !== 1 ? 's' : ''} en esta orden
              </div>
              <ul className="libros-lista">
                {orden.libros?.map((libro, idx) => {
                  const cantidad = parseInt(libro.cantidad) || 0
                  const precioUnitario = parseFloat(libro.precio) || 0
                  const subtotal = cantidad * precioUnitario
                  
                  return (
                    <li key={idx} className="libro-item">
                      <div className="libro-imagen">
                        {libro.imagen ? (
                          <img src={libro.imagen} alt={libro.titulo} />
                        ) : (
                          <div className="libro-sin-imagen">📖</div>
                        )}
                      </div>
                      <div className="libro-info">
                        <span className="libro-titulo">{libro.titulo || 'Libro'}</span>
                        {libro.autor && <span className="libro-autor">{libro.autor}</span>}
                      </div>
                      <div className="libro-meta">
                        <span className="libro-cantidad">x{cantidad}</span>
                        {precioUnitario > 0 && (
                          <span className="libro-precio-unitario">{formatearPrecio(precioUnitario)} c/u</span>
                        )}
                        <span className="libro-subtotal">{formatearPrecio(subtotal)}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
