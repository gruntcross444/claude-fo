import { useState, useEffect } from 'react'
import { Gift, X, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function ExitIntentPopup() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) return
    if (sessionStorage.getItem('exit_popup_shown')) return

    function handleMouseLeave(e) {
      if (e.clientY < 5) {
        setShow(true)
        sessionStorage.setItem('exit_popup_shown', 'true')
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 5000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isAuthenticated])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/leads', { email, source: 'exit_popup' })
      setSubmitted(true)
    } catch {
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div style={styles.backdrop} onClick={() => setShow(false)}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} style={styles.closeBtn}><X size={18} /></button>

        {!submitted ? (
          <>
            <div style={styles.iconWrap}>
              <Gift size={32} color="#c8a76b" strokeWidth={1.5} />
            </div>
            <h2 style={styles.heading}>Wait — don't leave empty-handed!</h2>
            <p style={styles.sub}>Get <strong>10% off</strong> your first purchase + our free Real Estate Toolkit.</p>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={styles.input}
              />
              <button type="submit" disabled={loading} style={styles.btn}>
                {loading ? 'Sending...' : 'Claim My 10% Off'} {!loading && <ArrowRight size={14} />}
              </button>
            </form>
            <p style={styles.privacy}>No spam. Unsubscribe anytime.</p>
          </>
        ) : (
          <>
            <div style={styles.iconWrap}>
              <Gift size={32} color="#10b981" strokeWidth={1.5} />
            </div>
            <h2 style={styles.heading}>You're in!</h2>
            <p style={styles.sub}>Check your inbox for the discount code and free toolkit.</p>
            <button onClick={() => setShow(false)} style={styles.btn}>Continue Browsing</button>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' },
  modal: { background: '#13141a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '2.5rem', maxWidth: '420px', width: '100%', textAlign: 'center', position: 'relative' },
  closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer' },
  iconWrap: { width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem' },
  heading: { fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.8rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },
  privacy: { fontSize: '0.75rem', color: '#555', marginTop: '1rem' },
}
