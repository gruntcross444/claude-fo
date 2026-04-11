import { useState, useEffect } from 'react'
import { X, Download, FileText, ArrowRight, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { useLang } from '../i18n/LanguageContext'

export default function FreePdfOffer() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('offer') // offer → success
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  useEffect(() => {
    if (isAuthenticated) return
    if (sessionStorage.getItem('free_pdf_shown')) return
    const timer = setTimeout(() => {
      setShow(true)
      sessionStorage.setItem('free_pdf_shown', 'true')
    }, 30000)
    return () => clearTimeout(timer)
  }, [isAuthenticated])

  if (!show || isAuthenticated) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/leads', { email, source: 'free_pdf_offer' })
    } catch { /* already captured */ }
    setLoading(false)
    setPhase('success')
  }

  return (
    <div style={s.backdrop} onClick={() => setShow(false)}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <button onClick={() => setShow(false)} style={s.close}><X size={16} /></button>

        {phase === 'offer' ? (
          <>
            {/* Top badge */}
            <div style={s.badge}>{t('freePdf.badge')}</div>

            {/* Icon */}
            <div style={s.iconWrap}>
              <FileText size={28} color="#c8a76b" strokeWidth={1.5} />
            </div>

            <h2 style={s.heading}>{t('freePdf.heading')}</h2>
            <p style={s.sub}>{t('freePdf.sub')}</p>

            {/* Feature list */}
            <div style={s.features}>
              {['freePdf.f1', 'freePdf.f2', 'freePdf.f3'].map(k => (
                <div key={k} style={s.feature}>
                  <div style={s.dot} />
                  <span>{t(k)}</span>
                </div>
              ))}
            </div>

            {/* Price callout */}
            <div style={s.priceRow}>
              <span style={s.free}>{t('freePdf.free')}</span>
              <span style={s.original}>$14</span>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder={t('freePdf.placeholder')}
                style={s.input}
              />
              <button type="submit" disabled={loading} style={s.btn}>
                {loading ? t('freePdf.loading') : <>{t('freePdf.cta')} <ArrowRight size={14} /></>}
              </button>
            </form>
            <p style={s.privacy}>{t('freePdf.privacy')}</p>
          </>
        ) : (
          <>
            <div style={s.successIcon}>
              <CheckCircle size={40} color="#10b981" strokeWidth={1.5} />
            </div>
            <h2 style={s.heading}>{t('freePdf.successHeading')}</h2>
            <p style={s.sub}>{t('freePdf.successSub')}</p>
            <a
              href="/downloads/Real-Estate-Prompt-Pack-ClaudeFO.pdf"
              download
              style={s.downloadBtn}
            >
              <Download size={16} /> {t('freePdf.download')}
            </a>
            <button onClick={() => setShow(false)} style={s.skipBtn}>
              {t('freePdf.continue')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  backdrop: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 10000, padding: '1rem',
  },
  modal: {
    background: '#0f1015',
    border: '1px solid rgba(200,167,107,0.2)',
    borderRadius: '24px',
    padding: 'clamp(1.5rem, 5vw, 2.5rem)',
    maxWidth: 'min(400px, calc(100vw - 2rem))',
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,167,107,0.08)',
  },
  close: {
    position: 'absolute', top: '1rem', right: '1rem',
    background: 'none', border: 'none',
    color: '#555', cursor: 'pointer',
    padding: '4px', borderRadius: '6px',
    transition: 'color 0.2s',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    background: 'rgba(200,167,107,0.1)',
    border: '1px solid rgba(200,167,107,0.25)',
    color: '#c8a76b',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '1.25rem',
  },
  iconWrap: {
    width: '64px', height: '64px',
    borderRadius: '18px',
    background: 'rgba(200,167,107,0.08)',
    border: '1px solid rgba(200,167,107,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 1.25rem',
  },
  heading: {
    fontSize: 'clamp(1.2rem, 4vw, 1.45rem)',
    fontWeight: 800,
    color: '#f3f4f6',
    margin: '0 0 0.6rem',
    lineHeight: 1.3,
    letterSpacing: '-0.02em',
  },
  sub: {
    color: '#888',
    fontSize: '0.88rem',
    lineHeight: 1.6,
    margin: '0 0 1.2rem',
  },
  features: {
    display: 'flex', flexDirection: 'column', gap: '0.45rem',
    margin: '0 0 1.25rem',
    textAlign: 'left',
  },
  feature: {
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    fontSize: '0.83rem', color: '#bbb',
  },
  dot: {
    width: '5px', height: '5px', borderRadius: '50%',
    background: '#c8a76b', flexShrink: 0,
  },
  priceRow: {
    display: 'flex', alignItems: 'baseline',
    justifyContent: 'center', gap: '0.6rem',
    marginBottom: '1.25rem',
  },
  free: {
    fontSize: '1.6rem', fontWeight: 800,
    color: '#10b981',
  },
  original: {
    fontSize: '1rem', color: '#555',
    textDecoration: 'line-through',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  input: {
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff', fontSize: '0.95rem',
    outline: 'none', textAlign: 'center',
    transition: 'border-color 0.2s',
  },
  btn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
    padding: '0.85rem',
    borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    color: '#fff', fontWeight: 700, fontSize: '0.95rem',
    cursor: 'pointer', transition: 'opacity 0.2s',
  },
  privacy: {
    fontSize: '0.72rem', color: '#444',
    marginTop: '0.75rem',
  },
  successIcon: { marginBottom: '1.25rem' },
  downloadBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    padding: '0.85rem 2rem',
    borderRadius: '12px', border: 'none',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff', fontWeight: 700, fontSize: '0.95rem',
    textDecoration: 'none', marginBottom: '0.75rem',
    boxShadow: '0 4px 20px rgba(16,185,129,0.25)',
  },
  skipBtn: {
    display: 'block', width: '100%',
    padding: '0.7rem',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'transparent',
    color: '#666', fontSize: '0.85rem',
    cursor: 'pointer',
  },
}
