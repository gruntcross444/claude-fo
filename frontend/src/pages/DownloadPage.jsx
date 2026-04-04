import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, CheckCircle, ArrowRight, Loader2, XCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

const PRODUCT_FILES = {
  'prompts-real-estate': { name: 'Real Estate Prompt Pack', file: '/downloads/Real-Estate-Prompt-Pack-ClaudeFO.pdf' },
  'prompts-marketing': { name: 'Marketing & Sales Prompts', file: '/downloads/Marketing-Sales-Prompts-ClaudeFO.pdf' },
  'prompts-business': { name: 'Business & Productivity Pack', file: '/downloads/Business-Productivity-Prompts-ClaudeFO.pdf' },
  'prompts-content': { name: 'Content Creator Toolkit', file: '/downloads/Content-Creator-Toolkit-ClaudeFO.pdf' },
  'finance-tracker': { name: 'Monthly Finance Tracker', file: '/downloads/Monthly-Finance-Tracker-ClaudeFO.pdf' },
  'website-templates': { name: 'Website Templates Pack', file: '/downloads/Website-Templates-Pack-ClaudeFO.pdf' },
  'real-estate-template': { name: 'Real Estate Landing Template', file: '/downloads/Real-Estate-Landing-Template-ClaudeFO.pdf' },
  'social-media-kit': { name: 'Social Media Kit', file: '/downloads/Social-Media-Kit-ClaudeFO.pdf' },
  'content-calendar': { name: 'Content Calendar Planner', file: '/downloads/Content-Calendar-Planner-ClaudeFO.pdf' },
  'lead-funnel-template': { name: 'Lead Funnel Blueprint', file: '/downloads/Lead-Funnel-Blueprint-ClaudeFO.pdf' },
  'email-sms-playbook': { name: 'Email & SMS Playbook', file: '/downloads/Email-SMS-Playbook-ClaudeFO.pdf' },
  'automation-starter-kit': { name: 'Automation Starter Kit', file: '/downloads/Automation-Starter-Kit-ClaudeFO.pdf' },
}

export default function DownloadPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get('product')
  const sessionId = searchParams.get('session_id')
  const product = PRODUCT_FILES[productId]
  const { t } = useLang()

  const [verifying, setVerifying] = useState(!!sessionId)
  const [verified, setVerified] = useState(!sessionId) // if no session_id, skip verification
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionId) return

    api.get(`/verify-purchase?session_id=${sessionId}`)
      .then((res) => {
        if (res.data.verified) {
          setVerified(true)
        } else {
          setError('Payment could not be verified.')
        }
      })
      .catch(() => {
        setError('Payment verification failed. If you were charged, please contact support.')
      })
      .finally(() => {
        setVerifying(false)
      })
  }, [sessionId])

  // Verifying state
  if (verifying) {
    return (
      <div style={s.page}>
        <Navbar />
        <div style={s.content}>
          <Loader2 size={48} color="#c8a76b" style={{ animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
          <h1 style={s.heading}>{t('download.verifying')}</h1>
          <p style={s.sub}>{t('download.verifyingNote')}</p>
        </div>
      </div>
    )
  }

  // Verification failed
  if (error) {
    return (
      <div style={s.page}>
        <Navbar />
        <div style={s.content}>
          <div style={s.iconWrap}>
            <XCircle size={48} color="#f87171" strokeWidth={1.5} />
          </div>
          <h1 style={s.heading}>{t('download.verificationFailed')}</h1>
          <p style={s.sub}>{error}</p>
          <a href="/store" style={s.backLink}>
            {t('download.back')} <ArrowRight size={14} />
          </a>
        </div>
      </div>
    )
  }

  // Verified — show download
  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.glow} />
        <div style={s.iconWrap}>
          <CheckCircle size={56} color="#10b981" strokeWidth={1.5} />
        </div>
        <h1 style={s.heading}>{t('download.heading')}</h1>
        <p style={s.sub}>{t('download.sub')}</p>

        {product && verified ? (
          <div style={s.card}>
            <h2 style={s.productName}>{product.name}</h2>
            {product.file ? (
              <a href={product.file} download style={s.downloadBtn}>
                <Download size={18} /> {t('download.btn')}
              </a>
            ) : (
              <div style={s.pendingMsg}>
                <p>{t('download.pending')}</p>
                <p style={s.small}>{t('download.pendingSub')}</p>
              </div>
            )}
          </div>
        ) : (
          <div style={s.card}>
            <p>{t('download.pending')}</p>
          </div>
        )}

        <a href="/store" style={s.backLink}>
          {t('download.back')} <ArrowRight size={14} />
        </a>
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '520px', margin: '0 auto', padding: 'clamp(3rem, 10vh, 5rem) 2rem', textAlign: 'center', position: 'relative' },
  glow: { position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '300px', background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' },
  iconWrap: { marginBottom: '1.5rem', position: 'relative' },
  heading: { fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em', position: 'relative' },
  sub: { color: '#888', marginBottom: '2rem', position: 'relative' },
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '20px', padding: '2.5rem', marginBottom: '2rem', backdropFilter: 'blur(8px)', position: 'relative' },
  productName: { fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' },
  downloadBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2.5rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' },
  pendingMsg: { color: '#888', lineHeight: 1.6 },
  small: { fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', textDecoration: 'none', fontSize: '0.95rem', position: 'relative' },
}
