import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import './Login.css'

export default function Login() {
  const [esRegistro, setEsRegistro] = useState(false)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const { login, registro } = useCarrito()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      if (esRegistro) {
        await registro(nombre, email, password)
      }
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src="/img/logo_casa_tinta.png" alt="Casa De Tinta" className="login-logo" />
          <h1>{esRegistro ? 'Crear Cuenta' : 'Bienvenido'}</h1>
        </div>
        <p className="login-card-subtitle">
          {esRegistro 
            ? 'Regístrate para comenzar a comprar' 
            : 'Inicia sesión para continuar'}
        </p>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {esRegistro && (
            <div className="form-group">
              <label>Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="input"
                placeholder="Tu nombre"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
          <button type="submit" disabled={cargando} className="btn btn-primary">
            {cargando ? 'Procesando...' : (esRegistro ? 'Crear Cuenta' : 'Iniciar Sesión')}
          </button>
        </form>

        <div className="login-divider">o</div>

        <p className="login-switch">
          {esRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button onClick={() => setEsRegistro(!esRegistro)}>
            {esRegistro ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>

        <Link to="/" className="btn-link">
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  )
}
