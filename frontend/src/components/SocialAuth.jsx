import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

// ── OAuth URL builders ─────────────────────────────────────────

function discordUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
    redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URI || 'http://localhost:5173/auth/discord/callback',
    response_type: 'code',
    scope: 'identify email',
  })
  return `https://discord.com/api/oauth2/authorize?${params}`
}

function googleUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/google/callback',
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

function facebookUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_FACEBOOK_APP_ID || '',
    redirect_uri: import.meta.env.VITE_FACEBOOK_REDIRECT_URI || 'http://localhost:5173/auth/facebook/callback',
    response_type: 'code',
    scope: 'email public_profile',
  })
  return `https://www.facebook.com/v19.0/dialog/oauth?${params}`
}

function appleUrl() {
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_APPLE_CLIENT_ID || '',
    redirect_uri: import.meta.env.VITE_APPLE_REDIRECT_URI || 'http://localhost:5173/auth/apple/callback',
    response_type: 'code',
    scope: 'name email',
    response_mode: 'query',
  })
  return `https://appleid.apple.com/auth/authorize?${params}`
}

// ── SVG icons ──────────────────────────────────────────────────

function DiscordIcon() {
  return (
    <svg width="20" height="15" viewBox="0 0 71 55" fill="none">
      <path d="M60.1 4.9A58.5 58.5 0 0045.4.2a.2.2 0 00-.2.1 40.7 40.7 0 00-1.8 3.7 54 54 0 00-16.2 0A26.4 26.4 0 0025.4.3a.2.2 0 00-.2-.1A58.4 58.4 0 0010.5 5 .2.2 0 0010.4 5C1.5 18.3-.9 31.2.3 43.9v.1a58.7 58.7 0 0017.7 9 .2.2 0 00.3-.1 42 42 0 003.6-5.9.2.2 0 00-.1-.3 38.7 38.7 0 01-5.5-2.6.2.2 0 01 0-.4l1.1-.9a.2.2 0 01.2 0 41.9 41.9 0 0035.6 0 .2.2 0 01.2 0l1.1.9a.2.2 0 010 .4 36.3 36.3 0 01-5.5 2.6.2.2 0 00-.1.3 47.2 47.2 0 003.6 5.9.2.2 0 00.3.1A58.5 58.5 0 0070.3 44v-.1c1.4-14.7-2.3-27.5-9.9-38.8a.2.2 0 00-.1-.1zM23.7 36c-3.4 0-6.1-3.1-6.1-6.9s2.7-6.9 6.1-6.9 6.2 3.1 6.1 6.9c0 3.8-2.7 6.9-6.1 6.9zm22.6 0c-3.4 0-6.1-3.1-6.1-6.9s2.7-6.9 6.1-6.9 6.2 3.1 6.1 6.9c0 3.8-2.7 6.9-6.1 6.9z" fill="white"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0 12 12 0 0011.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

// ── Telegram popup handler ─────────────────────────────────────

function handleTelegramLogin(login, navigate, setError) {
  const botName = import.meta.env.VITE_TELEGRAM_BOT_NAME
  if (!botName) {
    setError('Telegram bot not configured')
    return
  }
  const width = 550, height = 470
  const left = window.screenX + (window.outerWidth - width) / 2
  const top = window.screenY + (window.outerHeight - height) / 2
  const popup = window.open(
    `https://oauth.telegram.org/auth?bot_id=${botName}&origin=${window.location.origin}&request_access=write`,
    'telegram_login',
    `width=${width},height=${height},left=${left},top=${top}`
  )

  function onMessage(e) {
    if (e.origin !== 'https://oauth.telegram.org') return
    window.removeEventListener('message', onMessage)
    if (popup) popup.close()

    const data = JSON.parse(e.data)
    if (data.event === 'auth_result' && data.result) {
      api.post('/auth/telegram', data.result)
        .then((res) => {
          login(res.data.access_token)
          navigate('/portfolio')
        })
        .catch((err) => setError(err.response?.data?.detail || 'Telegram login failed'))
    }
  }
  window.addEventListener('message', onMessage)
}

// ── Shared component ───────────────────────────────────────────

export default function SocialAuth({ setError }) {
  const { login } = useAuth()
  const navigate = useNavigate()

  const hasGoogle = !!import.meta.env.VITE_GOOGLE_CLIENT_ID
  const hasFacebook = !!import.meta.env.VITE_FACEBOOK_APP_ID
  const hasApple = !!import.meta.env.VITE_APPLE_CLIENT_ID
  const hasDiscord = !!import.meta.env.VITE_DISCORD_CLIENT_ID
  const hasTelegram = !!import.meta.env.VITE_TELEGRAM_BOT_NAME

  const hasAny = hasGoogle || hasFacebook || hasApple || hasDiscord || hasTelegram
  if (!hasAny) return null

  return (
    <>
      <div style={styles.divider}>
        <span style={styles.dividerLine} />
        <span style={styles.dividerText}>or continue with</span>
        <span style={styles.dividerLine} />
      </div>

      <div style={styles.socialGrid}>
        {hasDiscord && (
          <a href={discordUrl()} style={{ ...styles.socialBtn, background: '#5865F2', gridColumn: hasGoogle || hasFacebook || hasApple ? undefined : '1 / -1' }}>
            <DiscordIcon /> Discord
          </a>
        )}
        {hasGoogle && (
          <a href={googleUrl()} style={{ ...styles.socialBtn, background: '#444' }}>
            <GoogleIcon /> Google
          </a>
        )}
        {hasFacebook && (
          <a href={facebookUrl()} style={{ ...styles.socialBtn, background: '#1877F2' }}>
            <FacebookIcon /> Facebook
          </a>
        )}
        {hasApple && (
          <a href={appleUrl()} style={{ ...styles.socialBtn, background: '#000' }}>
            <AppleIcon /> iCloud
          </a>
        )}
        {hasTelegram && (
          <button
            type="button"
            onClick={() => handleTelegramLogin(login, navigate, setError)}
            style={{ ...styles.socialBtn, background: '#2AABEE', border: 'none', gridColumn: '1 / -1' }}
          >
            <TelegramIcon /> Telegram
          </button>
        )}
      </div>
    </>
  )
}

const styles = {
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    margin: '1.5rem 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: '#666',
    fontSize: '0.85rem',
    whiteSpace: 'nowrap',
  },
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.6rem',
    marginBottom: '1.5rem',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '0.65rem 0.8rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    fontWeight: 500,
    fontSize: '0.85rem',
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'opacity 0.2s',
  },
}
