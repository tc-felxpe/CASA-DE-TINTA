import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Carrito from './pages/Carrito'
import Historial from './pages/Historial'
import Login from './pages/Login'

const colors = ['orange', 'purple', 'blue', 'pink', 'green', 'gold', 'coral', 'teal']

const Butterfly = ({ className, color }) => {
  const colorMap = {
    orange: { primary: '#e07a38', secondary: '#f4a261', accent: '#f9ca24' },
    purple: { primary: '#9b59b6', secondary: '#8e44ad', accent: '#e8daef' },
    blue: { primary: '#3498db', secondary: '#2980b9', accent: '#ebf5fb' },
    pink: { primary: '#e91e63', secondary: '#c2185b', accent: '#fce4ec' },
    green: { primary: '#27ae60', secondary: '#1e8449', accent: '#e8f8f5' },
    gold: { primary: '#f1c40f', secondary: '#d4ac0d', accent: '#fef9e7' },
    coral: { primary: '#ff6b6b', secondary: '#ee5a5a', accent: '#ffeaa7' },
    teal: { primary: '#00b894', secondary: '#00a884', accent: '#d4f1f4' },
  }
  const c = colorMap[color] || colorMap.orange
  
  return (
    <div className={`butterfly ${className}`}>
      <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`wg-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.primary} />
            <stop offset="50%" stopColor={c.secondary} />
            <stop offset="100%" stopColor={c.accent} />
          </linearGradient>
          <linearGradient id={`wgd-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c.secondary} />
            <stop offset="100%" stopColor={c.primary} />
          </linearGradient>
          <filter id={`gf-${color}`}>
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        <g filter={`url(#gf-${color})`}>
          <path className="wl" d="M50 35 Q32 20, 15 12 Q5 8, 3 18 Q0 30, 12 42 Q24 50, 42 42 Q50 38, 50 35Z" fill={`url(#wg-${color})`} opacity="0.92" />
          <path className="wl" d="M50 42 Q30 45, 15 55 Q8 65, 14 72 Q28 78, 42 70 Q52 60, 50 50Z" fill={`url(#wgd-${color})`} opacity="0.88" />
          <path className="wr" d="M50 35 Q68 20, 85 12 Q95 8, 97 18 Q100 30, 88 42 Q76 50, 58 42 Q50 38, 50 35Z" fill={`url(#wg-${color})`} opacity="0.92" />
          <path className="wr" d="M50 42 Q70 45, 85 55 Q92 65, 86 72 Q72 78, 58 70 Q48 60, 50 50Z" fill={`url(#wgd-${color})`} opacity="0.88" />
          
          <ellipse cx="22" cy="25" rx="7" ry="5" fill={c.accent} opacity="0.55" />
          <ellipse cx="78" cy="25" rx="7" ry="5" fill={c.accent} opacity="0.55" />
          <circle cx="20" cy="22" r="3.5" fill={c.primary} opacity="0.6" />
          <circle cx="80" cy="22" r="3.5" fill={c.primary} opacity="0.6" />
          <circle cx="28" cy="32" r="2" fill={c.accent} opacity="0.4" />
          <circle cx="72" cy="32" r="2" fill={c.accent} opacity="0.4" />
          
          <ellipse cx="50" cy="52" rx="3.5" ry="16" fill="#3d3d3d" />
          <ellipse cx="50" cy="38" rx="3" ry="9" fill="#2d2d2d" />
          <circle cx="50" cy="29" r="4.5" fill="#1d1d1d" />
          <circle cx="48" cy="28" r="1.8" fill="#fff" opacity="0.85" />
          <circle cx="52" cy="28" r="1.8" fill="#fff" opacity="0.85" />
          
          <path className="ant" d="M48 26 Q44 18, 40 10" stroke="#2d2d2d" strokeWidth="0.9" fill="none" />
          <path className="ant" d="M52 26 Q56 18, 60 10" stroke="#2d2d2d" strokeWidth="0.9" fill="none" />
          <circle cx="40" cy="9" r="1.8" fill="#1d1d1d" />
          <circle cx="60" cy="9" r="1.8" fill="#1d1d1d" />
        </g>
      </svg>
    </div>
  )
}

export default function App() {
  return (
    <div className="app">
      <Butterfly className="bf-1" color="orange" />
      <Butterfly className="bf-2" color="purple" />
      <Butterfly className="bf-3" color="blue" />
      <Butterfly className="bf-4" color="pink" />
      <Butterfly className="bf-5" color="green" />
      <Butterfly className="bf-6" color="gold" />
      <Butterfly className="bf-7" color="coral" />
      <Butterfly className="bf-8" color="teal" />
      <Butterfly className="bf-9" color="orange" />
      <Butterfly className="bf-10" color="purple" />
      <Butterfly className="bf-11" color="blue" />
      <Butterfly className="bf-12" color="pink" />
      <Butterfly className="bf-13" color="green" />
      <Butterfly className="bf-14" color="gold" />
      <Butterfly className="bf-15" color="coral" />
      <Butterfly className="bf-16" color="teal" />
      <Butterfly className="bf-17" color="orange" />
      <Butterfly className="bf-18" color="purple" />
      <Butterfly className="bf-19" color="blue" />
      <Butterfly className="bf-20" color="pink" />
      <Butterfly className="bf-21" color="green" />
      <Butterfly className="bf-22" color="gold" />
      <Butterfly className="bf-23" color="coral" />
      <Butterfly className="bf-24" color="teal" />
      <Butterfly className="bf-25" color="orange" />
      <Butterfly className="bf-26" color="purple" />
      <Butterfly className="bf-27" color="blue" />
      <Butterfly className="bf-28" color="pink" />
      <Butterfly className="bf-29" color="green" />
      <Butterfly className="bf-30" color="gold" />
      <Butterfly className="bf-31" color="coral" />
      <Butterfly className="bf-32" color="teal" />
      <Butterfly className="bf-33" color="orange" />
      <Butterfly className="bf-34" color="purple" />
      <Butterfly className="bf-35" color="blue" />
      
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </div>
  )
}
