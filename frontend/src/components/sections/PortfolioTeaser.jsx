import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../i18n/LanguageContext'

const teaserProjects = [
  { title: 'Project Alpha', category: 'Web App', color: '#6366f1' },
  { title: 'Project Beta', category: 'Mobile', color: '#8b5cf6' },
  { title: 'Project Gamma', category: 'Design', color: '#a855f7' },
]

export default function PortfolioTeaser() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  return (
    <section id="portfolio" style={styles.section}>
      <h2 style={styles.heading}>{t('portfolioTeaser.heading')}</h2>
      <p style={styles.subheading}>{t('portfolioTeaser.sub')}</p>

      <div style={styles.grid}>
        {teaserProjects.map((p) => (
          <div key={p.title} style={styles.card}>
            <div style={{ ...styles.cardBg, background: p.color }} />
            <div style={styles.blur} />
            <div style={styles.cardContent}>
              <span style={styles.category}>{p.category}</span>
              <h3 style={styles.cardTitle}>{p.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.cta}>
        <p style={styles.ctaText}>{t('portfolioTeaser.ctaText')}</p>
        <button
          style={styles.ctaBtn}
          onClick={() => navigate(isAuthenticated ? '/portfolio' : '/register')}
        >
          {isAuthenticated ? t('portfolioTeaser.ctaAuth') : t('portfolioTeaser.cta')}
        </button>
      </div>
    </section>
  )
}

const styles = {
  section: {
    padding: '5rem 2rem',
    maxWidth: '1000px',
    margin: '0 auto',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  heading: {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  subheading: {
    color: '#888',
    marginBottom: '3rem',
    fontSize: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem',
    position: 'relative',
  },
  card: {
    position: 'relative',
    height: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  cardBg: {
    position: 'absolute',
    inset: 0,
    opacity: 0.3,
  },
  blur: {
    position: 'absolute',
    inset: 0,
    backdropFilter: 'blur(12px)',
    background: 'rgba(0,0,0,0.4)',
  },
  cardContent: {
    position: 'relative',
    padding: '1.5rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    filter: 'blur(4px)',
    userSelect: 'none',
  },
  category: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#aaa',
    marginBottom: '0.3rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 600,
    margin: 0,
  },
  cta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  ctaText: {
    color: '#888',
    margin: 0,
  },
  ctaBtn: {
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
  },
}
