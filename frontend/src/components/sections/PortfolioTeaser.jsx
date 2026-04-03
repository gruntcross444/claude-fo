import { useNavigate } from 'react-router-dom'
import { Lock, ArrowRight, Code2, Building2, Bot } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../i18n/LanguageContext'
import useScrollReveal from '../../hooks/useScrollReveal'

const teaserProjects = [
  { title: 'Brickell Rental Platform', category: 'Real Estate', Icon: Building2, color: '#c8a76b', tags: ['React', 'WhatsApp API'] },
  { title: 'E-Commerce Dashboard', category: 'Web Development', Icon: Code2, color: '#6366f1', tags: ['FastAPI', 'Stripe'] },
  { title: 'AI Lead Funnel System', category: 'AI & Automation', Icon: Bot, color: '#f59e0b', tags: ['Make.com', 'CRM'] },
]

function TeaserCard({ project, delay }) {
  const [ref, visible] = useScrollReveal(0.1)

  return (
    <div
      ref={ref}
      style={{
        ...styles.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.6s ease ${delay}s`,
      }}
    >
      <div style={{ ...styles.cardGlow, background: `radial-gradient(ellipse at center, ${project.color}15 0%, transparent 70%)` }} />
      <div style={styles.cardInner}>
        <div style={{ ...styles.iconBadge, background: `${project.color}15`, border: `1px solid ${project.color}30` }}>
          <project.Icon size={20} color={project.color} strokeWidth={1.5} />
        </div>
        <span style={{ ...styles.cardCategory, color: project.color }}>{project.category}</span>
        <h3 style={styles.cardTitle}>{project.title}</h3>
        <div style={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} style={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
      <div style={styles.lockOverlay}>
        <Lock size={16} color="#c8a76b" strokeWidth={1.5} />
      </div>
    </div>
  )
}

export default function PortfolioTeaser() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  return (
    <section id="portfolio" style={styles.section}>
      <h2 style={styles.heading}>{t('portfolioTeaser.heading')}</h2>
      <p style={styles.subheading}>{t('portfolioTeaser.sub')}</p>

      <div style={styles.grid}>
        {teaserProjects.map((p, i) => (
          <TeaserCard key={p.title} project={p} delay={i * 0.15} />
        ))}
        <div style={styles.moreOverlay}>
          <span style={styles.moreText}>+18 more projects</span>
        </div>
      </div>

      <div style={styles.cta}>
        <button
          style={styles.ctaBtn}
          onClick={() => navigate(isAuthenticated ? '/portfolio' : '/register')}
          onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)' }}
          onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = 'none' }}
        >
          {isAuthenticated ? t('portfolioTeaser.ctaAuth') : t('portfolioTeaser.cta')} <ArrowRight size={16} />
        </button>
        {!isAuthenticated && (
          <p style={styles.ctaNote}>{t('portfolioTeaser.ctaText')}</p>
        )}
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
    gap: '1.2rem',
    marginBottom: '2.5rem',
    position: 'relative',
  },
  card: {
    position: 'relative',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.02)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  },
  cardGlow: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  cardInner: {
    padding: '2rem 1.5rem',
    position: 'relative',
  },
  iconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  cardCategory: {
    fontSize: '0.72rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    fontWeight: 600,
    display: 'block',
    marginBottom: '0.3rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: '0 0 0.8rem',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.3rem',
  },
  tag: {
    fontSize: '0.72rem',
    padding: '0.2rem 0.55rem',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#999',
  },
  lockOverlay: {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(200,167,107,0.1)',
    border: '1px solid rgba(200,167,107,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80px',
    background: 'linear-gradient(to top, #0a0b0f, transparent)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: '0.5rem',
    pointerEvents: 'none',
  },
  moreText: {
    fontSize: '0.85rem',
    color: '#666',
    fontWeight: 500,
  },
  cta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.8rem',
  },
  ctaBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2.5rem',
    borderRadius: '10px',
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  ctaNote: {
    color: '#555',
    fontSize: '0.85rem',
    margin: 0,
  },
}
