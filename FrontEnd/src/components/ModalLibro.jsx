import { useEffect } from 'react'
import { useCarrito } from '../context/CarritoContext'
import { getLibroImagen } from '../config/imagenes'
import './ModalLibro.css'

export default function ModalLibro({ libro, onClose }) {
  const { agregarLibro } = useCarrito()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleAgregarCarrito = () => {
    agregarLibro(libro)
    onClose()
  }

  if (!libro) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-libro" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="modal-content">
          <div className="modal-imagen">
            {getLibroImagen(libro) ? (
              <img src={getLibroImagen(libro)} alt={libro.titulo} />
            ) : (
              <div className="modal-sin-imagen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5C4 18.837 4.26379 18.2011 4.73223 17.7322C5.20067 17.2638 5.83657 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 2H20V22H6.5C5.83657 22 5.20067 21.7362 4.73223 21.2678C4.26379 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26379 3.20107 4.73223 2.73223C5.20067 2.26379 5.83657 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>

          <div className="modal-info">
            <div className="modal-header">
              <h2 className="modal-titulo">{libro.titulo}</h2>
              <span className="modal-categoria">{libro.categoria}</span>
            </div>

            <div className="modal-autor-seccion">
              <span className="modal-autor-label">Autor</span>
              <span className="modal-autor-nombre">{libro.autor}</span>
            </div>

            <div className="modal-descripcion">
              <h3>Sinopsis</h3>
              <p>{libro.descripcion_extendida || libro.descripcion}</p>
            </div>

            <div className="modal-bibliografia">
              <h3>Sobre el Autor</h3>
              <p>{libro.bibliografia}</p>
            </div>

            <div className="modal-detalles">
              <div className="modal-detalle">
                <span className="detalle-label">ISBN</span>
                <span className="detalle-value">{libro.isbn}</span>
              </div>
              <div className="modal-detalle">
                <span className="detalle-label">Editorial</span>
                <span className="detalle-value">{libro.editorial}</span>
              </div>
              <div className="modal-detalle">
                <span className="detalle-label">Año</span>
                <span className="detalle-value">{libro.anioPublicacion}</span>
              </div>
              <div className="modal-detalle">
                <span className="detalle-label">Páginas</span>
                <span className="detalle-value">{libro.paginas}</span>
              </div>
              <div className="modal-detalle">
                <span className="detalle-label">Stock</span>
                <span className="detalle-value">{libro.stock} unidades</span>
              </div>
            </div>

            <div className="modal-footer">
              <span className="modal-precio">${libro.precio?.toFixed(2)}</span>
              <button onClick={handleAgregarCarrito} className="btn btn-primary modal-btn-agregar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}