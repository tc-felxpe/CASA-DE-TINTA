import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { getLibroImagen } from '../config/imagenes'
import './Carrito.css'

export default function Carrito() {
  const navigate = useNavigate()
  const { carrito, actualizarCantidad, eliminarLibro, obtenerTotal, obtenerCantidadTotal, pagar, token } = useCarrito()
  const [error, setError] = useState('')
  const [procesando, setProcesando] = useState(false)
  const total = obtenerTotal()
  const cantidad = obtenerCantidadTotal()

  const handlePagar = async () => {
    if (!token) {
      navigate('/login')
      return
    }
    setError('')
    setProcesando(true)
    try {
      await pagar()
      navigate('/historial')
    } catch (err) {
      setError(err.message)
    } finally {
      setProcesando(false)
    }
  }

  if (carrito.length === 0) {
    return (
      <div className="carrito-vacio">
        <div className="carrito-vacio-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </div>
        <h1>Tu carrito está vacío</h1>
        <p>Explora nuestros libros y añade los que más te gusten</p>
        <Link to="/" className="btn btn-primary">Ver Libros</Link>
      </div>
    )
  }

  return (
    <div className="carrito">
      <h1>Tu Carrito de Compras</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="carrito-content">
        <div className="carrito-items">
          {carrito.map(item => (
            <div key={item.id} className="carrito-item">
              <div className="item-imagen">
                {getLibroImagen(item) ? (
                  <img src={getLibroImagen(item)} alt={item.titulo} />
                ) : (
                  <div className="item-sin-imagen">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 19.5C4 18.837 4.26379 18.2011 4.73223 17.7322C5.20067 17.2638 5.83657 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6.5 2H20V22H6.5C5.83657 22 5.20067 21.7362 4.73223 21.2678C4.26379 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26379 3.20107 4.73223 2.73223C5.20067 2.26379 5.83657 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 6L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 9L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="item-info">
                <h3>{item.titulo}</h3>
                <p className="item-autor">{item.autor}</p>
                <p className="item-precio">${item.precio.toFixed(2)} c/u</p>
              </div>
              <div className="item-cantidad">
                <button onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}>−</button>
                <span>{item.cantidad}</span>
                <button onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}>+</button>
              </div>
              <div className="item-total">
                ${(item.precio * item.cantidad).toFixed(2)}
              </div>
              <button onClick={() => eliminarLibro(item.id)} className="btn-eliminar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <div className="resumen-header">
            <span className="resumen-header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </span>
            <h2>Resumen del Pedido</h2>
          </div>
          
          <div className="resumen-items">
            <div className="resumen-item">
              <span>Libros <span className="resumen-item-count">{cantidad}</span></span>
              <span>{carrito.length} títulos</span>
            </div>
          </div>

          <div className="resumen-row">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="resumen-row">
            <span>Envío</span>
            <span style={{ color: '#10b981' }}>Gratis</span>
          </div>
          <div className="resumen-row total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button
            onClick={handlePagar}
            disabled={procesando}
            className="btn btn-primary btn-pagar"
          >
            {procesando ? 'Procesando...' : token ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                </svg>
                Completar Pedido
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Iniciar Sesión para Pagar
              </>
            )}
          </button>
          
          <div className="resumen-seguro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Compra 100% segura
          </div>
        </div>
      </div>
    </div>
  )
}
