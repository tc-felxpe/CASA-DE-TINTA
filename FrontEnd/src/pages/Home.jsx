import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ModalLibro from '../components/ModalLibro'
import BookCard from '../components/BookCard'
import { apiFetch } from '../config/api'
import './Home.css'

export default function Home() {
  const [libros, setLibros] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [libroSeleccionado, setLibroSeleccionado] = useState(null)

  useEffect(() => {
    const fetchLibros = async () => {
      setCargando(true)
      setError(null)
      try {
        const url = query
          ? `/api/libros?query=${encodeURIComponent(query)}&limit=100`
          : '/api/libros?limit=100'
        const res = await apiFetch(url)
        const data = await res.json()
        console.log('Libros recibidos:', data.data?.libros?.length, 'Total:', data.data?.pagination?.total)
        if (data.success) {
          setLibros(data.data.libros)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError('Error al conectar con el servidor')
      } finally {
        setCargando(false)
      }
    }
    fetchLibros()
  }, [query])

  const handleBuscar = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const q = formData.get('q')
    if (q) {
      setSearchParams({ q })
    }
  }

  if (cargando) return <div className="loading">Cargando libros...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="home">
      <div className="home-header">
        {!query && (
          <img 
            src="/img/logo_casa_tinta.png" 
            alt="Casa De Tinta" 
            className="home-logo" 
          />
        )}
        <h1>
          {query 
            ? <>Resultados para <span>"{query}"</span></>
            : <>Explora nuestros <span>Libros</span></>
          }
        </h1>
        <p className="home-subtitle">
          {query ? 'Encuentra el libro perfecto para ti' : 'Exploración de géneros, autores y temáticas a través de una colección en constante actualización. La biblioteca dispone de una amplia gama de títulos que incluyen narrativa, ensayo, obras técnicas y ediciones especiales, garantizando opciones para cada perfil de lector.'}
        </p>
        <form onSubmit={handleBuscar} className="home-search">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por título, autor..."
            className="input"
          />
          <button type="submit" className="btn btn-primary">Buscar</button>
          {query && (
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="btn btn-secondary"
            >
              Limpiar
            </button>
          )}
        </form>
      </div>

      {libros.length === 0 ? (
        <div className="no-results">
          <div className="no-results-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 19.5C4 18.837 4.26379 18.2011 4.73223 17.7322C5.20067 17.2638 5.83657 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5C5.83657 22 5.20067 21.7362 4.73223 21.2678C4.26379 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26379 3.20107 4.73223 2.73223C5.20067 2.26379 5.83657 2 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 9L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>No se encontraron libros</h2>
          <p>Intenta con otra búsqueda o explora nuestro catálogo completo</p>
          {query && (
            <button
              onClick={() => setSearchParams({})}
              className="btn btn-primary"
            >
              Ver todos los libros
            </button>
          )}
        </div>
      ) : (
        <div className="libros-grid">
          {libros.map((libro) => (
            <BookCard
              key={libro.id}
              title={libro.titulo}
              author={libro.autor}
              price={libro.precio}
              image={libro.imagen_url || libro.imagen}
              onClick={() => setLibroSeleccionado(libro)}
            />
          ))}
        </div>
      )}

      {libroSeleccionado && (
        <ModalLibro 
          libro={libroSeleccionado} 
          onClose={() => setLibroSeleccionado(null)} 
        />
      )}
    </div>
  )
}
