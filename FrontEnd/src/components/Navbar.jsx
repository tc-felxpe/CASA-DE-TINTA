import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import './Navbar.css'

export default function Navbar() {
  const [busqueda, setBusqueda] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { token, user, logout, obtenerCantidadTotal } = useCarrito()
  const cantidad = obtenerCantidadTotal()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (busqueda.trim()) {
      navigate(`/?q=${encodeURIComponent(busqueda.trim())}`)
    }
  }

  const getUserInitials = (nombre) => {
    if (!nombre) return '?'
    const parts = nombre.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return nombre.substring(0, 2).toUpperCase()
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/img/logo_casa_tinta.png" alt="Casa De Tinta" className="logo-img" />
        </Link>

        <form onSubmit={handleSubmit} className="navbar-search">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Buscar libros..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="search-input"
            />
          </div>
          <Link to="/" className="search-btn" title="Ver todos los libros">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5C4 18.837 4.26379 18.2011 4.73223 17.7322C5.20067 17.2638 5.83657 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83657 22 5.20067 21.7362 4.73223 21.2678C4.26379 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26379 3.20107 4.73223 2.73223C5.20067 2.26379 5.83657 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </form>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/carrito" className="nav-link cart-link" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span>Carrito</span>
            {cantidad > 0 && <span className="cart-badge">{cantidad}</span>}
          </Link>
          
          {token ? (
            <>
              <div className="user-menu">
                <div className="user-avatar">
                  {getUserInitials(user?.nombre)}
                </div>
                <div className="user-info">
                  <span className="user-name">{user?.nombre || 'Usuario'}</span>
                  <span className="user-role">Bienvenido</span>
                </div>
              </div>
              <Link to="/historial" className="nav-link pedidos-link" onClick={() => setMenuOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <path d="M9 12h6"/>
                  <path d="M9 16h6"/>
                </svg>
                <span>Mis Pedidos</span>
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="nav-link logout-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                <span>Salir</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link login-link" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <span>Iniciar Sesión</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
