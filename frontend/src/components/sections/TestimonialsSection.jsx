import { Star } from 'lucide-react'
import useScrollReveal from '../../hooks/useScrollReveal'
import { useLang } from '../../i18n/LanguageContext'

// Schema: { name, role, text, metric?, stars, accent }
// When a real testimonial with verifiable metric lands, drop it in here.
const TESTIMONIALS = [
  {
    name: 'Maria G.',
    role: 'Real Estate Agent — Miami, FL',
    text: 'The AI prompt pack changed how I run my entire business. Writing listings used to take me hours. Now it takes minutes, and my reply rate doubled. This paid for itself in week one.',
    metric: 'Listing copy time: ~2h → under 15 min',
    stars: 5,
    accent: '#c8a76b',
  },
  {
    name: 'Carlos R.',
    role: 'Founder, Digital Growth Co.',
    text: 'They built our lead funnel from scratch and wired it into our CRM in under 6 weeks. Manual outreach dropped dramatically — the team finally stopped drowning in copy-paste work.',
    metric: 'Launched in < 6 weeks, end-to-end',
    stars: 5,
    accent: '#6366f1',
  },
  {
    name: 'Jessica T.',
    role: 'E-Commerce Owner',
    text: 'Launched my store in 5 days. Clean, fast, and it actually converts — 3 sales on day one without spending a dollar on ads. These guys know what they are doing.',
    metric: '3 organic sales in the first 24h',
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
      {item.metric && (
        <div style={{ ...styles.metric, borderColor: `${item.accent}40`, color: item.accent }}>
          {item.metric}
        </div>
      )}
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
  metric: {
    alignSelf: 'flex-start',
    padding: '0.3rem 0.65rem',
    borderRadius: '999px',
    border: '1px solid',
    background: 'rgba(255,255,255,0.02)',
    fontSize: '0.72rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
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
