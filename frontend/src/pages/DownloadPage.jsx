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
  'finance-tracker': { name: 'Monthly Finance Tracker', file: null },
  'website-templates': { name: 'Website Templates Pack', file: null },
  'real-estate-template': { name: 'Real Estate Landing Template', file: null },
  'social-media-kit': { name: 'Social Media Kit', file: null },
  'content-calendar': { name: 'Content Calendar Planner', file: null },
  'lead-funnel-template': { name: 'Lead Funnel Blueprint', file: null },
  'email-sms-playbook': { name: 'Email & SMS Playbook', file: null },
  'automation-starter-kit': { name: 'Automation Starter Kit', file: null },
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
          <h1 style={s.heading}>Verifying your purchase...</h1>
          <p style={s.sub}>This will only take a moment.</p>
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
          <h1 style={s.heading}>Verification Failed</h1>
          <p style={s.sub}>{error}</p>
          <a href="/store" style={s.backLink}>
            Back to Store <ArrowRight size={14} />
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
        <div style={s.iconWrap}>
          <CheckCircle size={48} color="#10b981" strokeWidth={1.5} />
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
  content: { maxWidth: '500px', margin: '0 auto', padding: '5rem 2rem', textAlign: 'center' },
  iconWrap: { marginBottom: '1.5rem' },
  heading: { fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', marginBottom: '2rem' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' },
  productName: { fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' },
  downloadBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.3s' },
  pendingMsg: { color: '#888', lineHeight: 1.6 },
  small: { fontSize: '0.85rem', color: '#555', marginTop: '0.5rem' },
  backLink: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#a5b4fc', textDecoration: 'none', fontSize: '0.95rem' },
}
