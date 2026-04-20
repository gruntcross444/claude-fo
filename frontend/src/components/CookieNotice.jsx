import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { X, Cookie } from 'lucide-react'
import { useLang } from '../i18n/LanguageContext'

/**
 * Minimal cookie notice. We only use essential cookies (session token +
 * banner dismiss flags), so this is a transparency notice — not a GDPR
 * consent gate. One-time dismiss, stored in localStorage.
 */
const STORAGE_KEY = 'cookieNoticeAck'

const HIDE_ON = new Set(['/privacy', '/terms'])

export default function CookieNotice() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      // localStorage blocked (private mode, iframe) — skip banner.
    }
  }, [])

  if (!visible || HIDE_ON.has(pathname)) return null

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* noop */ }
    setVisible(false)
  }

  return (
    <div style={s.wrap} role="region" aria-label="Cookie notice">
      <div style={s.iconWrap}>
        <Cookie size={16} color="#c8a76b" />
      </div>
      <p style={s.text}>
        {t('cookies.body')}{' '}
        <Link to="/privacy" style={s.link}>{t('cookies.link')}</Link>
      </p>
      <button type="button" onClick={dismiss} style={s.btn} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  )
}

const s = {
  wrap: {
    position: 'fixed',
    left: '1rem',
    bottom: '1rem',
    zIndex: 60,
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    maxWidth: 'calc(100vw - 2rem)',
    width: 'min(420px, calc(100vw - 2rem))',
    padding: '0.8rem 0.95rem',
    borderRadius: '14px',
    background: 'rgba(10,11,15,0.92)',
    border: '1px solid rgba(200,167,107,0.2)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  },
  iconWrap: {
    flexShrink: 0,
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(200,167,107,0.1)',
    border: '1px solid rgba(200,167,107,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    margin: 0,
    fontSize: '0.78rem',
    color: '#cbd5e1',
    lineHeight: 1.5,
    flex: 1,
  },
  link: {
    color: '#c8a76b',
    textDecoration: 'underline',
    textDecorationColor: 'rgba(200,167,107,0.4)',
    textUnderlineOffset: '2px',
  },
  btn: {
    flexShrink: 0,
    width: '26px',
    height: '26px',
    padding: 0,
    borderRadius: '7px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#9ca3af',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}
