import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

const PROVIDER_LABELS = {
  discord: 'Discord',
  google: 'Google',
}

export default function OAuthCallback() {
  const { provider } = useParams()
  const { t } = useLang()
  const [searchParams] = useSearchParams()
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setError(`${t('authExtra.noCode')} ${PROVIDER_LABELS[provider] || provider}`)
      return
    }

    // Echo back the exact redirect_uri we used in the initial auth request,
    // otherwise the OAuth token exchange will be rejected with
    // redirect_uri_mismatch. Must match SocialAuth.redirectUriFor(provider).
    const redirect_uri = `${window.location.origin}/auth/${provider}/callback`

    api.post(`/auth/${provider}`, { code, redirect_uri })
      .then((res) => {
        login(res.data.access_token)
        navigate('/portfolio', { replace: true })
      })
      .catch((err) => {
        setError(err.response?.data?.detail || `${PROVIDER_LABELS[provider] || provider} ${t('authExtra.loginFailed')}`)
      })
  }, [provider, searchParams, login, navigate])

  if (error) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.error}>{error}</p>
          <a href="/login" style={styles.link}>{t('authExtra.backToLogin')}</a>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <p style={styles.text}>{t('authExtra.loggingIn')} {PROVIDER_LABELS[provider] || provider}...</p>
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
    textAlign: 'center',
  },
  text: {
    color: '#888',
    fontSize: '1rem',
  },
  error: {
    color: '#f87171',
    fontSize: '0.95rem',
    marginBottom: '1rem',
  },
  link: {
    color: '#a5b4fc',
    textDecoration: 'none',
  },
}
