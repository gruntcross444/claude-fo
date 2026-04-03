import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CheckCircle, Loader2, XCircle, ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

export default function ApplicationConfirmationPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { t } = useLang()

  const [verifying, setVerifying] = useState(!!sessionId)
  const [verified, setVerified] = useState(!sessionId)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) return
    api.get(`/verify-purchase?session_id=${sessionId}`)
      .then((res) => {
        if (res.data.verified) setVerified(true)
        else setError(t('application.verifyFailed'))
      })
      .catch(() => setError(t('application.verifyFailed')))
      .finally(() => setVerifying(false))
  }, [sessionId])

  if (verifying) {
    return (
      <div style={s.page}>
        <Navbar />
        <div style={s.content}>
          <Loader2 size={48} color="#c8a76b" style={{ animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
          <h1 style={s.heading}>{t('application.verifying')}</h1>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={s.page}>
        <Navbar />
        <div style={s.content}>
          <XCircle size={48} color="#f87171" strokeWidth={1.5} style={{ marginBottom: '1.5rem' }} />
          <h1 style={s.heading}>{t('application.verifyFailed')}</h1>
          <p style={s.sub}>{error}</p>
          <a href="/brickell" style={s.backLink}>{t('application.confirmBack')} <ArrowRight size={14} /></a>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.glow} />
        <div style={s.iconWrap}>
          <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
        </div>
        <h1 style={s.heading}>{t('application.confirmTitle')}</h1>
        <p style={s.sub}>{t('application.confirmSub')}</p>

        <div style={s.card}>
          <div style={s.nextSteps}>
            <p style={s.nextStepsTitle}>&#9889; {t('application.confirmNext')}</p>
          </div>
        </div>

        <a href="/brickell" style={s.backBtn}>
          {t('application.confirmBack')} <ArrowRight size={14} />
        </a>
      </div>

      <footer style={s.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '520px', margin: '0 auto', padding: 'clamp(3rem, 10vh, 5rem) 2rem', textAlign: 'center', position: 'relative' },
  glow: { position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  iconWrap: { marginBottom: '1.5rem', position: 'relative' },
  heading: { fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', position: 'relative' },
  sub: { color: '#888', marginBottom: '2rem', position: 'relative', lineHeight: 1.6 },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem', backdropFilter: 'blur(8px)', position: 'relative' },
  nextSteps: {},
  nextStepsTitle: { color: '#6ee7b7', fontSize: '1rem', lineHeight: 1.7, margin: 0 },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2.2rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none', boxShadow: '0 4px 20px rgba(200,167,107,0.3)', transition: 'all 0.3s', position: 'relative' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', textDecoration: 'none', fontSize: '0.95rem' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
