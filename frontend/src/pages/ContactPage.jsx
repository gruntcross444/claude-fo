import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

export default function ContactPage() {
  const { t } = useLang()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'sent' | 'error'

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.post('/contact', form)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.headerGlow} />
          <span style={styles.eyebrow}>{t('contact.eyebrow')}</span>
          <h1 style={styles.heading}>{t('contact.heading')}</h1>
          <p style={styles.sub}>{t('contact.sub')}</p>
        </div>

        <div style={styles.grid} data-contact-grid>
          {/* ── Quick Contact Cards ─────────────────────── */}
          <div style={styles.sidebar}>
            <a
              href="https://wa.me/13057999003?text=Hi%2C%20I'm%20interested%20in%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.contactCard}
            >
              <div style={{ ...styles.iconWrap, background: 'rgba(37,211,102,0.1)', borderColor: 'rgba(37,211,102,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <strong style={styles.cardTitle}>{t('contact.whatsapp')}</strong>
                <span style={styles.cardSub}>{t('contact.whatsappSub')}</span>
              </div>
              <span style={styles.arrow}>&rarr;</span>
            </a>


            <a
              href="https://calendly.com/lieskaram/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.contactCard}
            >
              <div style={{ ...styles.iconWrap, background: 'rgba(0,107,255,0.1)', borderColor: 'rgba(0,107,255,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#006BFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div>
                <strong style={styles.cardTitle}>{t('contact.calendly')}</strong>
                <span style={styles.cardSub}>{t('contact.calendlySub')}</span>
              </div>
              <span style={styles.arrow}>&rarr;</span>
            </a>

            <div style={styles.socialSection}>
              <p style={styles.socialTitle}>{t('contact.follow')}</p>
              <div style={styles.socialLinks}>
                <a
                  href="https://www.instagram.com/eliaskaramrealtor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.socialBtn}
                  title="Instagram"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* ── Contact Form ───────────────────────────── */}
          <div style={styles.formCard}>
            <h2 style={styles.formTitle}>{t('contact.formTitle')}</h2>

            {status === 'sent' && (
              <div style={styles.success}>{t('contact.sent')}</div>
            )}
            {status === 'error' && (
              <div style={styles.errorMsg}>{t('contact.error')}</div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>
                {t('contact.name')}
                <input name="name" type="text" value={form.name} onChange={handleChange} required maxLength={100} style={styles.input} placeholder={t('contact.namePlaceholder')} />
              </label>
              <label style={styles.label}>
                {t('contact.email')}
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={styles.input} placeholder={t('contact.emailPlaceholder')} />
              </label>
              <label style={styles.label}>
                {t('contact.message')}
                <textarea name="message" value={form.message} onChange={handleChange} required maxLength={5000} style={{ ...styles.input, minHeight: '140px', resize: 'vertical' }} placeholder={t('contact.messagePlaceholder')} />
              </label>
              <button type="submit" disabled={status === 'sending'} style={styles.submitBtn}>
                {status === 'sending' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite', display: 'inline-block', verticalAlign: 'middle', marginRight: '0.4rem' }} />{t('contact.sending')}</> : t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1000px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 3rem) 2rem' },
  header: { textAlign: 'center', marginBottom: '3rem', position: 'relative', overflow: 'hidden' },
  headerGlow: { position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
  eyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(200,167,107,0.3)', background: 'rgba(200,167,107,0.08)', color: '#c8a76b', fontSize: '0.82rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 },
  heading: { fontSize: 'clamp(1.8rem, 5vw, 2.4rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#888', fontSize: '1rem', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  contactCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)', textDecoration: 'none', color: 'inherit', transition: 'all 0.3s ease' },
  iconWrap: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', flexShrink: 0 },
  cardTitle: { display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' },
  cardSub: { fontSize: '0.8rem', color: '#888' },
  arrow: { marginLeft: 'auto', color: '#666', fontSize: '1.1rem' },
  socialSection: { padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' },
  socialTitle: { fontSize: '0.85rem', color: '#888', margin: '0 0 0.8rem' },
  socialLinks: { display: 'flex', gap: '0.6rem' },
  socialBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: '#aaa', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 500, transition: 'border-color 0.2s, color 0.2s' },
  formCard: { padding: '2rem', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(8px)' },
  formTitle: { fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem' },
  success: { padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: '1rem' },
  errorMsg: { padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.9rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#ccc' },
  input: { padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { padding: '0.85rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem', boxShadow: '0 4px 15px rgba(99,102,241,0.25)', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  footer: { textAlign: 'center', padding: '2rem', color: '#555', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
