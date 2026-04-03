import { useState } from 'react'
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

            <div style={styles.contactCard}>
              <div style={{ ...styles.iconWrap, background: 'rgba(0,107,255,0.1)', borderColor: 'rgba(0,107,255,0.3)' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#006BFF">
                  <path d="M19 4H5a3 3 0 00-3 3v10a3 3 0 003 3h14a3 3 0 003-3V7a3 3 0 00-3-3zm0 2l-7 4.5L5 6h14zm0 12H5a1 1 0 01-1-1V8.37l7.43 4.78a1 1 0 001.14 0L20 8.37V17a1 1 0 01-1 1z"/>
                </svg>
              </div>
              <div>
                <strong style={styles.cardTitle}>{t('contact.calendly')}</strong>
                <span style={styles.cardSub}>{t('contact.calendlySub')}</span>
              </div>
            </div>

            <div style={styles.socialSection}>
              <p style={styles.socialTitle}>{t('contact.follow')}</p>
              <div style={styles.socialLinks}>
                <a href="#" style={styles.socialBtn} title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="#" style={styles.socialBtn} title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="#" style={styles.socialBtn} title="X / Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
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
                <input name="name" type="text" value={form.name} onChange={handleChange} required style={styles.input} placeholder={t('contact.namePlaceholder')} />
              </label>
              <label style={styles.label}>
                {t('contact.email')}
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={styles.input} placeholder={t('contact.emailPlaceholder')} />
              </label>
              <label style={styles.label}>
                {t('contact.message')}
                <textarea name="message" value={form.message} onChange={handleChange} required style={{ ...styles.input, minHeight: '140px', resize: 'vertical' }} placeholder={t('contact.messagePlaceholder')} />
              </label>
              <button type="submit" disabled={status === 'sending'} style={styles.submitBtn}>
                {status === 'sending' ? t('contact.sending') : t('contact.send')}
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
  content: { maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' },
  header: { textAlign: 'center', marginBottom: '3rem' },
  eyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', fontSize: '0.8rem', marginBottom: '1rem' },
  heading: { fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#888', fontSize: '1rem', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  contactCard: { display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' },
  iconWrap: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid', flexShrink: 0 },
  cardTitle: { display: 'block', fontSize: '0.95rem', marginBottom: '0.15rem' },
  cardSub: { fontSize: '0.8rem', color: '#888' },
  arrow: { marginLeft: 'auto', color: '#666', fontSize: '1.1rem' },
  socialSection: { padding: '1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' },
  socialTitle: { fontSize: '0.85rem', color: '#888', margin: '0 0 0.8rem' },
  socialLinks: { display: 'flex', gap: '0.6rem' },
  socialBtn: { width: '40px', height: '40px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', textDecoration: 'none', transition: 'border-color 0.2s' },
  formCard: { padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' },
  formTitle: { fontSize: '1.2rem', fontWeight: 700, margin: '0 0 1.5rem' },
  success: { padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', fontSize: '0.9rem', marginBottom: '1rem' },
  errorMsg: { padding: '0.8rem 1rem', borderRadius: '10px', background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.9rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.9rem', color: '#ccc' },
  input: { padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: 'inherit', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit' },
  submitBtn: { padding: '0.75rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' },
  footer: { textAlign: 'center', padding: '2rem', color: '#555', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
