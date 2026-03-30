import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import SocialAuth from '../components/SocialAuth'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.access_token)
      navigate('/portfolio')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>Claude.FO</Link>
        <h1 style={styles.heading}>Welcome back</h1>
        <p style={styles.sub}>Log in to access the portfolio</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
              placeholder="you@example.com"
            />
          </label>
          <label style={styles.label}>
            Password
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
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <SocialAuth setError={setError} />

        <p style={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={styles.footerLink}>Sign up</Link>
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
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '2.5rem',
    textAlign: 'center',
  },
  logo: {
    display: 'block',
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'inherit',
    textDecoration: 'none',
    marginBottom: '1.5rem',
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
    padding: '0.65rem 0.9rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: 'inherit',
    fontSize: '0.95rem',
    outline: 'none',
  },
  btn: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  footer: {
    fontSize: '0.9rem',
    color: '#888',
  },
  footerLink: {
    color: '#a5b4fc',
    textDecoration: 'none',
  },
}
