import { createContext, useContext, useState, useEffect } from 'react'
import { apiFetch } from '../config/api'

const CarritoContext = createContext()

const STORAGE_KEY = 'carrito_libreria'

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  const agregarLibro = (libro) => {
    setCarrito(prev => {
      const existente = prev.find(item => item.id === libro.id)
      if (existente) {
        return prev.map(item =>
          item.id === libro.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      }
      return [...prev, { ...libro, cantidad: 1 }]
    })
  }

  const actualizarCantidad = (id, cantidad) => {
    if (cantidad < 1) {
      eliminarLibro(id)
      return
    }
    setCarrito(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad } : item
      )
    )
  }

  const eliminarLibro = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id))
  }

  const limpiarCarrito = () => {
    setCarrito([])
  }

  const obtenerTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
  }

  const obtenerCantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0)
  }

  const login = async (email, password) => {
    const res = await apiFetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (!data.success) {
      throw new Error(data.error)
    }
    setToken(data.data.token)
    setUser(data.data.usuario)
    return data.data
  }

  const registro = async (nombre, email, password) => {
    const res = await apiFetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    })
    const data = await res.json()
    if (!data.success) {
      throw new Error(data.error)
    }
    return data.data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
  }

  const pagar = async () => {
    if (!token) throw new Error('Debes iniciar sesión')
    const res = await apiFetch('/api/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ libros: carrito })
    })
    const data = await res.json()
    if (!data.success) {
      throw new Error(data.error)
    }
    limpiarCarrito()
    return data.data
  }

  return (
    <CarritoContext.Provider value={{
      carrito,
      token,
      user,
      agregarLibro,
      actualizarCantidad,
      eliminarLibro,
      limpiarCarrito,
      obtenerTotal,
      obtenerCantidadTotal,
      login,
      registro,
      logout,
      pagar,
      setUser
    }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => {
  const context = useContext(CarritoContext)
  if (!context) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  }
  return context
}