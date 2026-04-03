import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'
import SocialAuth from '../components/SocialAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.access_token)
      navigate('/portfolio')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.glow} />
      <div style={styles.glow2} />
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>
          <span style={styles.logoAccent}>Claude</span>.FO
        </Link>
        <h1 style={styles.heading}>{t('auth.registerHeading')}</h1>
        <p style={styles.sub}>{t('auth.registerSub')}</p>

        {error && <p style={styles.error}>{error}</p>}

        <SocialAuth setError={setError} />

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            {t('auth.name')}
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder={t('contact.namePlaceholder')}
            />
          </label>
          <label style={styles.label}>
            {t('auth.email')}
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder={t('contact.emailPlaceholder')}
            />
          </label>
          <label style={styles.label}>
            {t('auth.password')}
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="••••••••"
            />
          </label>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? t('auth.creating') : t('auth.registerBtn')}
          </button>
        </form>

        <p style={styles.footer}>
          {t('auth.hasAccount')}{' '}
          <Link to="/login" style={styles.footerLink}>{t('auth.logIn')}</Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '10%',
    left: '30%',
    width: '500px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'float 8s ease-in-out infinite',
  },
  glow2: {
    position: 'absolute',
    bottom: '10%',
    right: '20%',
    width: '400px',
    height: '300px',
    background: 'radial-gradient(ellipse, rgba(200,167,107,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    animation: 'float 10s ease-in-out infinite reverse',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '2.5rem',
    textAlign: 'center',
    backdropFilter: 'blur(12px)',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    display: 'block',
    fontWeight: 800,
    fontSize: '1.3rem',
    color: '#fff',
    textDecoration: 'none',
    marginBottom: '1.5rem',
  },
  logoAccent: {
    background: 'linear-gradient(135deg, #6366f1, #c8a76b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: 700,
    marginBottom: '0.4rem',
  },
  sub: {
    color: '#888',
    fontSize: '0.9rem',
    marginBottom: '2rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.9rem',
    marginBottom: '1rem',
    background: 'rgba(248,113,113,0.1)',
    padding: '0.6rem 1rem',
    borderRadius: '8px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    textAlign: 'left',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    fontSize: '0.9rem',
    color: '#ccc',
  },
  input: {
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(4px)',
    color: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.85rem',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    boxShadow: '0 4px 15px rgba(99,102,241,0.25)',
    transition: 'all 0.3s ease',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#888',
  },
  footerLink: {
    color: '#a5b4fc',
    textDecoration: 'none',
  },
}
