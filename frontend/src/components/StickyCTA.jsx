import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const HIDDEN_PATHS = ['/login', '/register', '/contact', '/auth']

export default function StickyCTA() {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('cta_dismissed') === 'true')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (dismissed) return null
  if (HIDDEN_PATHS.some((p) => location.pathname.startsWith(p))) return null

  function handleDismiss() {
    sessionStorage.setItem('cta_dismissed', 'true')
    setDismissed(true)
  }

  return (
    <div style={styles.bar}>
      <div style={styles.inner}>
        <p style={styles.text}>
          Ready to start your project?
        </p>
        <button
          style={styles.btn}
          onClick={() => navigate(isAuthenticated ? '/contact' : '/register')}
        >
          {isAuthenticated ? 'Get in Touch' : 'Get a Free Consultation'} <ArrowRight size={14} />
        </button>
        <button onClick={handleDismiss} style={styles.close} aria-label="Dismiss">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

const styles = {
  bar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'rgba(10,11,15,0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid rgba(200,167,107,0.2)',
    zIndex: 900,
    padding: '0.7rem 1rem',
  },
  inner: {
    maxWidth: '1100px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  text: {
    color: '#aaa',
    fontSize: '0.9rem',
    margin: 0,
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1.2rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  close: {
    background: 'none',
    border: 'none',
    color: '#555',
    cursor: 'pointer',
    padding: '4px',
  },
}
