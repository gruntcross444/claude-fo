import { useState } from 'react'
import { Mail, ArrowRight } from 'lucide-react'
import api from '../api'
import { useLang } from '../i18n/LanguageContext'

export default function EmailGate({ source, children }) {
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem('email_unlocked') === 'true')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { t } = useLang()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !email.includes('@')) {
      setError(t('emailGate.error'))
      return
    }
    setLoading(true)
    try {
      await api.post('/leads', { email, source: source || 'tool' })
    } catch {
      // Still unlock — the lead might already exist or network hiccup
    }
    sessionStorage.setItem('email_unlocked', 'true')
    setUnlocked(true)
    setLoading(false)
  }

  if (unlocked) return children

  return (
    <div style={styles.gate}>
      <div style={styles.blurContent}>{children}</div>
      <div style={styles.overlay}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>
            <Mail size={28} color="#c8a76b" strokeWidth={1.5} />
          </div>
          <h3 style={styles.heading}>{t('emailGate.heading')}</h3>
          <p style={styles.sub}>{t('emailGate.sub')}</p>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={styles.input}
            />
            <button type="submit" disabled={loading} style={styles.btn}>
              {loading ? t('emailGate.unlocking') : t('emailGate.btn')} {!loading && <ArrowRight size={14} />}
            </button>
          </form>
          <p style={styles.privacy}>{t('emailGate.privacy')}</p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  gate: { position: 'relative' },
  blurContent: { filter: 'blur(8px)', pointerEvents: 'none', userSelect: 'none' },
  overlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(10,11,15,0.6)', backdropFilter: 'blur(4px)', borderRadius: '12px' },
  card: { textAlign: 'center', padding: '2.5rem', maxWidth: '380px' },
  iconWrap: { width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' },
  heading: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem' },
  sub: { color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 },
  error: { color: '#f87171', fontSize: '0.85rem', marginBottom: '0.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.7rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', outline: 'none', textAlign: 'center' },
  btn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.7rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
  privacy: { fontSize: '0.75rem', color: '#555', marginTop: '1rem' },
}
