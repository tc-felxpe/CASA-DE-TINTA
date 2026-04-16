const API_BASE = import.meta.env.VITE_API_URL || ''

export const apiFetch = (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`
  return fetch(url, options)
}

export default API_BASE
