import useScrollReveal from '../../hooks/useScrollReveal'
import { Bed, Bath, Maximize2, MapPin, ArrowRight, Tag, Building2, CalendarDays, DollarSign } from 'lucide-react'

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(30px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  )
}

const ZILLOW_URL = 'https://www.zillow.com/homedetails/8739-NW-109th-Ct-Doral-FL-33178/66179054_zpid/'

const STATS = [
  { Icon: Bed,        label: 'Bedrooms',   value: '4' },
  { Icon: Bath,       label: 'Bathrooms',  value: '3' },
  { Icon: Maximize2,  label: 'Sq Ft',      value: '2,277' },
  { Icon: Building2,  label: 'Type',       value: 'Townhouse' },
  { Icon: CalendarDays, label: 'Built',    value: '2009' },
  { Icon: DollarSign, label: 'HOA / mo',   value: '$340' },
]

export default function DealOfTheWeek() {
  return (
    <section style={s.section}>
      {/* Background glow */}
      <div style={s.glow} />

      <div style={s.inner}>
        {/* Header */}
        <Reveal>
          <div style={s.badge}>
            <Tag size={12} />
            &nbsp; DEAL OF THE WEEK
          </div>
          <h2 style={s.heading}>
            Exclusive <span style={s.gold}>Owner-Listed</span> Property in Doral
          </h2>
          <p style={s.sub}>
            Listed directly by the owner. Agent commissions negotiable and contingent on offer received.
          </p>
        </Reveal>

        {/* Card */}
        <Reveal delay={0.15}>
          <div style={s.card}>
            {/* Left — visual panel */}
            <div style={s.visual}>
              <div style={s.visualInner}>
                <span style={s.fsboTag}>FSBO</span>
                <div style={s.addressBlock}>
                  <MapPin size={14} color="#c8a76b" />
                  <span style={s.address}>8739 NW 109th Ct<br />Doral, FL 33178</span>
                </div>
                <div style={s.priceBlock}>
                  <span style={s.priceLabel}>Listing Price</span>
                  <span style={s.price}>$797,000</span>
                  <span style={s.priceNote}>Est. $5,704 / mo</span>
                </div>
              </div>
            </div>

            {/* Right — details */}
            <div style={s.details}>
              <p style={s.description}>
                Stunning 4-bedroom townhouse in the heart of Doral — one of Miami's most sought-after
                communities. Built in 2009, this 2,277 sqft home features a private pool, 2-car garage,
                tile roof, and modern finishes throughout. Listed directly by the owner. Agent
                commissions are negotiable and will be determined based on the offer received.
              </p>

              {/* Stats grid */}
              <div style={s.statsGrid}>
                {STATS.map(({ Icon, label, value }) => (
                  <div key={label} style={s.statItem}>
                    <div style={s.statIcon}>
                      <Icon size={15} color="#c8a76b" />
                    </div>
                    <span style={s.statValue}>{value}</span>
                    <span style={s.statLabel}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div style={s.highlights}>
                {['Private Pool', '2-Car Garage', 'Tile Roof', 'Gated Community', 'Commission Negotiable'].map(h => (
                  <span key={h} style={s.highlight}>{h}</span>
                ))}
              </div>

              {/* CTA */}
              <a
                href={ZILLOW_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={s.cta}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                View Full Listing on Zillow <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const s = {
  section: {
    padding: '5rem 2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '700px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(200,167,107,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  inner: {
    maxWidth: '1000px',
    margin: '0 auto',
    position: 'relative',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.35rem 1rem',
    borderRadius: '999px',
    border: '1px solid rgba(200,167,107,0.35)',
    background: 'rgba(200,167,107,0.06)',
    color: '#c8a76b',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    fontWeight: 700,
    marginBottom: '1.2rem',
    textTransform: 'uppercase',
  },
  heading: {
    fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
    fontWeight: 800,
    letterSpacing: '-0.02em',
    marginBottom: '0.7rem',
  },
  gold: {
    background: 'linear-gradient(135deg, #c8a76b, #f0d89c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sub: {
    color: '#777',
    fontSize: '1rem',
    marginBottom: '2.5rem',
  },

  // Card
  card: {
    display: 'flex',
    borderRadius: '20px',
    border: '1px solid rgba(200,167,107,0.15)',
    background: 'rgba(255,255,255,0.02)',
    backdropFilter: 'blur(12px)',
    overflow: 'hidden',
    flexWrap: 'wrap',
  },

  // Left visual panel
  visual: {
    flex: '0 0 280px',
    minHeight: '380px',
    background: 'linear-gradient(160deg, #1a1108 0%, #0d0d0d 50%, #0f1020 100%)',
    display: 'flex',
    alignItems: 'stretch',
    position: 'relative',
    overflow: 'hidden',
  },
  visualInner: {
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    backgroundImage: `
      radial-gradient(ellipse at 20% 20%, rgba(200,167,107,0.12) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.1) 0%, transparent 60%)
    `,
  },
  fsboTag: {
    display: 'inline-block',
    padding: '0.3rem 0.9rem',
    borderRadius: '8px',
    background: 'rgba(200,167,107,0.15)',
    border: '1px solid rgba(200,167,107,0.3)',
    color: '#c8a76b',
    fontSize: '0.72rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    alignSelf: 'flex-start',
  },
  addressBlock: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  address: {
    color: '#ccc',
    fontSize: '0.9rem',
    lineHeight: 1.5,
  },
  priceBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  priceLabel: {
    fontSize: '0.72rem',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  price: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #c8a76b, #f0d89c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    lineHeight: 1.1,
  },
  priceNote: {
    fontSize: '0.78rem',
    color: '#666',
  },

  // Right details
  details: {
    flex: '1 1 360px',
    padding: '2rem 2rem 2rem 2.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4rem',
    justifyContent: 'center',
  },
  description: {
    color: '#999',
    fontSize: '0.92rem',
    lineHeight: 1.7,
    margin: 0,
  },

  // Stats
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.8rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    padding: '0.8rem 0.5rem',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    textAlign: 'center',
  },
  statIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(200,167,107,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#e0e0e0',
  },
  statLabel: {
    fontSize: '0.68rem',
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  // Highlights
  highlights: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  highlight: {
    padding: '0.3rem 0.8rem',
    borderRadius: '999px',
    background: 'rgba(99,102,241,0.08)',
    border: '1px solid rgba(99,102,241,0.15)',
    color: '#a0a0ff',
    fontSize: '0.75rem',
    fontWeight: 500,
  },

  // CTA
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 1.8rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #c8a76b, #a88a4e)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.9rem',
    textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(200,167,107,0.25)',
    transition: 'opacity 0.2s ease',
    alignSelf: 'flex-start',
  },
}

// Responsive
if (typeof document !== 'undefined') {
  const id = 'dotw-responsive'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = `
      @media (max-width: 680px) {
        .dotw-card { flex-direction: column !important; }
        .dotw-visual { flex: unset !important; min-height: 220px !important; }
      }
    `
    document.head.appendChild(style)
  }
}
