import { Link } from 'react-router-dom'
import {
  DollarSign, ShoppingBag, RefreshCw, Mic2, Briefcase,
  CheckSquare, ArrowRight, Zap,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import useScrollReveal from '../hooks/useScrollReveal'

const STRATEGIES = [
  {
    id: 1,
    Icon: DollarSign,
    color: '#6366f1',
    title: 'The "Productized" Service Model',
    body: 'Package your skills into a fixed-scope, fixed-price deliverable. Clients pay for the outcome — not the hours.',
    bullets: [
      'EdTech simulations for corporate training',
      'Advergames for brand engagement campaigns',
      'ROI calculators for real estate developers',
      'Whitelist under your brand or theirs',
    ],
  },
  {
    id: 2,
    Icon: ShoppingBag,
    color: '#a855f7',
    title: 'Marketplaces — The Passive Route',
    body: 'Upload once, earn indefinitely. Marketplaces bring the traffic — you supply the quality.',
    bullets: [
      'Unity Asset Store — game components & shaders',
      'Itch.io — indie games & interactive experiences',
      'ThemeForest — website templates & UI kits',
      'CodeCanyon — plugins, scripts & SaaS starters',
    ],
  },
  {
    id: 3,
    Icon: RefreshCw,
    color: '#10b981',
    title: 'Micro-SaaS — Recurring Revenue',
    body: 'Transform a one-time tool into a subscription product. Recurring revenue is the holy grail of digital income.',
    bullets: [
      'Wrap any tool with a Stripe + auth layer',
      'Charge monthly for AI credits or usage tiers',
      'Flip profitable apps on Acquire.com or Flippa',
      'Target $500–$5k MRR before scaling',
    ],
  },
  {
    id: 4,
    Icon: Mic2,
    color: '#f59e0b',
    title: 'Content & Authority — The Long Game',
    body: 'Build an audience around your niche. Authority compounds — every piece of content works while you sleep.',
    bullets: [
      'YouTube / TikTok build-in-public tutorials',
      'Weekly email newsletter (Kit, Beehiiv)',
      'Substack for premium long-form writing',
      'Monetize via sponsorships, affiliates & products',
    ],
  },
  {
    id: 5,
    Icon: Briefcase,
    color: '#c8a76b',
    title: 'Freelancing & High-Ticket Consulting',
    body: 'Use every project as a portfolio piece. Niche expertise commands 2–5× the going rate.',
    bullets: [
      'Specialize: "React dev for EdTech" not "web dev"',
      'Showcase ROI and outcomes, not just deliverables',
      'Retainer model: $3k–$10k/month',
      'Productize consulting into a course or cohort',
    ],
  },
]

const CHECKLIST = [
  {
    step: 1,
    title: 'Build a Gallery',
    text: 'Host 5–10 of your best interactive pieces on a personal website. Let the work speak first.',
  },
  {
    step: 2,
    title: 'Pick a Niche',
    text: 'Choose one field — FinTech, Health, Gaming, Real Estate. Depth beats breadth when starting out.',
  },
  {
    step: 3,
    title: 'Find the Pain Point',
    text: 'What is a boring, manual task in that field that could be made better with an interactive tool?',
  },
  {
    step: 4,
    title: 'Ship & Iterate',
    text: 'Release a Minimum Viable Product, get 3 paying customers at any price, then refine from real feedback.',
  },
]

function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useScrollReveal(0.1)
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(25px)',
      transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
    }}>
      {children}
    </div>
  )
}

export default function MonetizationGuidePage() {
  return (
    <div style={s.page}>
      <Navbar />

      {/* ── Hero ── */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroGlow2} />
        <div style={s.heroContent}>
          <Reveal>
            <span style={s.eyebrow}>
              <Zap size={13} style={{ marginRight: '0.4rem', verticalAlign: 'middle' }} />
              Monetization Roadmap
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 style={s.heading}>
              Monetizing{' '}
              <span style={s.gradientText}>Digital Creations</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={s.sub}>
              Five proven models to turn your code, games, and tools into
              sustainable income streams — whether you want passive royalties,
              recurring SaaS revenue, or high-ticket consulting.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Strategy Cards ── */}
      <section style={s.section}>
        <Reveal>
          <h2 style={s.sectionHeading}>The 5 Core Monetization Strategies</h2>
          <p style={s.sectionSub}>
            Choose the model that matches your skills, risk tolerance, and time horizon.
          </p>
        </Reveal>
        <div style={s.cardsGrid}>
          {STRATEGIES.map((strat, i) => (
            <Reveal key={strat.id} delay={i * 0.07}>
              <div
                style={s.card}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${strat.color}40`
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = `0 16px 48px ${strat.color}14`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div style={s.cardTop}>
                  <span style={{ ...s.cardNum, color: strat.color }}>0{strat.id}</span>
                  <div style={{ ...s.cardIcon, background: `${strat.color}12`, border: `1px solid ${strat.color}28` }}>
                    <strat.Icon size={22} color={strat.color} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 style={s.cardTitle}>{strat.title}</h3>
                <p style={s.cardBody}>{strat.body}</p>
                <ul style={s.bullets}>
                  {strat.bullets.map((b) => (
                    <li key={b} style={s.bullet}>
                      <span style={{ ...s.bulletDot, background: strat.color }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Implementation Checklist ── */}
      <section style={s.section}>
        <Reveal>
          <div style={s.checklistWrap}>
            <div style={s.checklistHeader}>
              <CheckSquare size={20} color="#6366f1" strokeWidth={1.5} />
              <h2 style={s.checklistTitle}>Implementation Checklist</h2>
            </div>
            <p style={s.checklistSub}>Four steps to your first dollar online.</p>
            <div style={s.checklistItems}>
              {CHECKLIST.map((item, i) => (
                <Reveal key={item.step} delay={i * 0.08}>
                  <div style={s.checklistItem}>
                    <div style={s.checklistStep}>{item.step}</div>
                    <div>
                      <p style={s.checklistItemTitle}>{item.title}</p>
                      <p style={s.checklistText}>{item.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Golden Rule ── */}
      <section style={s.section}>
        <Reveal>
          <div style={s.goldenRule}>
            <span style={s.goldenIcon}>✦</span>
            <blockquote style={s.goldenQuote}>
              "People don't pay for code; they pay for{' '}
              <em>saved time</em>,{' '}
              <em>earned money</em>, or{' '}
              <em>engagement</em>."
            </blockquote>
            <p style={s.goldenCaption}>
              Frame every product around the outcome — not the technology.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ── Bottom CTA ── */}
      <section style={s.ctaSection}>
        <div style={s.ctaGlow} />
        <Reveal>
          <h2 style={s.ctaHeading}>Ready to Start Earning?</h2>
          <p style={s.ctaSub}>
            Browse digital products, explore free tools, or book a strategy session.
          </p>
          <div style={s.ctaButtons}>
            <Link to="/store" style={s.ctaBtnPrimary}>
              Browse Products <ArrowRight size={16} />
            </Link>
            <Link to="/tools" style={s.ctaBtnGhost}>
              Free Tools
            </Link>
            <Link to="/contact" style={s.ctaBtnGold}>
              Book Consulting
            </Link>
          </div>
        </Reveal>
      </section>

      <footer style={s.footer}>
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} Claude.FO — All rights reserved.</p>
      </footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#0a0b0f', color: '#f3f4f6' },

  // Hero
  hero: {
    position: 'relative',
    overflow: 'hidden',
    padding: 'clamp(4rem, 10vh, 7rem) 2rem clamp(3rem, 8vh, 5rem)',
    textAlign: 'center',
  },
  heroGlow: {
    position: 'absolute',
    top: '-10%',
    left: '25%',
    width: '520px',
    height: '380px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroGlow2: {
    position: 'absolute',
    bottom: '-15%',
    right: '20%',
    width: '400px',
    height: '320px',
    background: 'radial-gradient(ellipse, rgba(168,85,247,0.1) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: { maxWidth: '720px', margin: '0 auto', position: 'relative' },
  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.4rem 1.1rem',
    borderRadius: '999px',
    border: '1px solid rgba(200,167,107,0.3)',
    background: 'rgba(200,167,107,0.05)',
    color: '#c8a76b',
    fontSize: '0.82rem',
    marginBottom: '1.5rem',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontWeight: 600,
  },
  heading: {
    fontSize: 'clamp(2rem, 5.5vw, 3.4rem)',
    fontWeight: 800,
    lineHeight: 1.1,
    marginBottom: '1.2rem',
    letterSpacing: '-0.03em',
    color: '#f3f4f6',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  sub: {
    color: '#9ca3af',
    fontSize: '1.05rem',
    lineHeight: 1.75,
    maxWidth: '580px',
    margin: '0 auto',
  },

  // Sections
  section: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: 'clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem)',
  },
  sectionHeading: {
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 800,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
    textAlign: 'center',
    color: '#f3f4f6',
  },
  sectionSub: {
    color: '#9ca3af',
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '2.5rem',
  },

  // Strategy cards
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))',
    gap: '1.5rem',
  },
  card: {
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(4px)',
    padding: '1.8rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
  },
  cardNum: {
    fontSize: '0.75rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    opacity: 0.7,
    fontFamily: 'ui-monospace, Consolas, monospace',
    paddingTop: '2px',
  },
  cardIcon: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: '0 0 0.6rem',
    color: '#f3f4f6',
    lineHeight: 1.3,
  },
  cardBody: {
    color: '#9ca3af',
    fontSize: '0.88rem',
    lineHeight: 1.65,
    margin: '0 0 1.1rem',
  },
  bullets: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.45rem',
  },
  bullet: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.6rem',
    fontSize: '0.82rem',
    color: '#9ca3af',
    lineHeight: 1.5,
  },
  bulletDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: '0.38rem',
  },

  // Checklist
  checklistWrap: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '2.5rem',
    borderRadius: '24px',
    border: '1px solid rgba(99,102,241,0.2)',
    background: 'rgba(99,102,241,0.04)',
    backdropFilter: 'blur(4px)',
  },
  checklistHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    marginBottom: '0.4rem',
  },
  checklistTitle: {
    fontSize: '1.4rem',
    fontWeight: 800,
    margin: 0,
    color: '#f3f4f6',
  },
  checklistSub: {
    color: '#9ca3af',
    fontSize: '0.9rem',
    margin: '0.3rem 0 1.8rem',
  },
  checklistItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  checklistItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 1.2rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.06)',
    background: 'rgba(255,255,255,0.02)',
  },
  checklistStep: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontSize: '0.78rem',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checklistItemTitle: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: '#f3f4f6',
    margin: '0 0 0.2rem',
  },
  checklistText: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    margin: 0,
    lineHeight: 1.6,
  },

  // Golden Rule
  goldenRule: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '2.5rem',
    borderRadius: '24px',
    border: '1px solid rgba(200,167,107,0.3)',
    background: 'rgba(200,167,107,0.05)',
    backdropFilter: 'blur(4px)',
    textAlign: 'center',
  },
  goldenIcon: {
    display: 'block',
    fontSize: '1.4rem',
    color: '#c8a76b',
    marginBottom: '1rem',
  },
  goldenQuote: {
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    fontStyle: 'italic',
    lineHeight: 1.7,
    color: '#f3f4f6',
    margin: '0 0 0.8rem',
    fontWeight: 500,
  },
  goldenCaption: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    margin: 0,
  },

  // CTA
  ctaSection: {
    textAlign: 'center',
    padding: 'clamp(3rem, 8vw, 6rem) 2rem',
    position: 'relative',
  },
  ctaGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '300px',
    background: 'radial-gradient(ellipse, rgba(99,102,241,0.09) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  ctaHeading: {
    fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
    fontWeight: 800,
    marginBottom: '0.5rem',
    position: 'relative',
    color: '#f3f4f6',
    letterSpacing: '-0.02em',
  },
  ctaSub: {
    color: '#9ca3af',
    fontSize: '1rem',
    maxWidth: '500px',
    margin: '0 auto 2rem',
    position: 'relative',
  },
  ctaButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.8rem',
    justifyContent: 'center',
    position: 'relative',
  },
  ctaBtnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2rem',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    fontWeight: 700,
    fontSize: '0.95rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
  },
  ctaBtnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: '#aaa',
    fontWeight: 500,
    fontSize: '0.95rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  ctaBtnGold: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.85rem 2rem',
    borderRadius: '12px',
    border: '1px solid rgba(200,167,107,0.35)',
    background: 'rgba(200,167,107,0.08)',
    color: '#c8a76b',
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },

  // Footer
  footer: {
    textAlign: 'center',
    padding: '2rem',
    color: '#444',
    fontSize: '0.85rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
}
