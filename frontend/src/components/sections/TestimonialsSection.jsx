import { Star } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useLang } from '../../i18n/LanguageContext'

const TESTIMONIALS = [
  {
    name: 'Maria G.',
    role: 'Real Estate Agent, Miami',
    text: 'The prompt pack alone saved me 10+ hours a week on listings and emails. Best $14 I ever spent.',
    stars: 5,
    accent: '#c8a76b',
  },
  {
    name: 'Carlos R.',
    role: 'Marketing Director',
    text: 'Claude.FO built our lead funnel from scratch. We went from 0 to 200+ leads in the first month.',
    stars: 5,
    accent: '#6366f1',
  },
  {
    name: 'Jessica T.',
    role: 'E-Commerce Owner',
    text: 'The website templates are clean, fast, and actually look premium. Deployed in under an hour.',
    stars: 5,
    accent: '#a855f7',
  },
]

function TestimonialCard({ item, delay }) {
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
      <div style={styles.stars}>
        {Array.from({ length: item.stars }).map((_, i) => (
          <Star key={i} size={14} fill="#c8a76b" color="#c8a76b" />
        ))}
      </div>
      <p style={styles.text}>&ldquo;{item.text}&rdquo;</p>
      <div style={styles.author}>
        <div style={{ ...styles.avatar, background: `${item.accent}20`, border: `1px solid ${item.accent}40` }}>
          <span style={{ ...styles.avatarText, color: item.accent }}>{item.name.charAt(0)}</span>
        </div>
        <div>
          <span style={styles.name}>{item.name}</span>
          <span style={styles.role}>{item.role}</span>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const { t } = useLang()

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>{t('testimonials.heading')}</h2>
      <p style={styles.subheading}>{t('testimonials.sub')}</p>
      <div style={styles.grid}>
        {TESTIMONIALS.map((item, i) => (
          <TestimonialCard key={item.name} item={item} delay={i * 0.15} />
        ))}
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.2rem',
    textAlign: 'left',
  },
  card: {
    padding: '1.8rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  text: {
    color: '#ccc',
    fontSize: '0.95rem',
    lineHeight: 1.7,
    fontStyle: 'italic',
    flex: 1,
  },
  author: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginTop: '0.5rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: '1rem',
    fontWeight: 700,
  },
  name: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#f3f4f6',
  },
  role: {
    display: 'block',
    fontSize: '0.78rem',
    color: '#666',
  },
}
