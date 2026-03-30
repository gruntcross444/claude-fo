import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const STORE_CATEGORIES = ['All', 'Real Estate', 'Web Development', 'AI & Automation', 'Mobile Apps', 'Logo & Branding']

const products = [
  // ── Real Estate ──────────────────────────────────────────────
  {
    id: 'real-estate-template',
    title: 'Real Estate Landing Template',
    subtitle: 'Rental Community Page',
    description: 'High-converting landing page template designed for rental communities. Pricing tiers, amenity sections, WhatsApp integration, and bilingual support.',
    price: 24,
    originalPrice: 39,
    category: 'Real Estate',
    color: '#c8a76b',
    features: ['Luxury design', 'Pricing section', 'WhatsApp CTA', 'Bilingual ready', 'Mobile-first', 'Netlify deploy'],
    badge: 'New',
  },
  // ── Web Development ──────────────────────────────────────────
  {
    id: 'finance-tracker',
    title: 'Monthly Finance Tracker',
    subtitle: 'Personal & Business Budgeting',
    description: 'Track income, expenses, savings goals, and investments with automated dashboards. Includes 12-month overview, category breakdowns, and visual charts.',
    price: 19,
    originalPrice: 29,
    category: 'Web Development',
    color: '#10b981',
    features: ['Google Sheets + Excel', 'Auto-calculated dashboards', '12-month annual view', 'Expense categories', 'Savings goal tracker', 'Dark & light themes'],
    badge: 'Best Seller',
  },
  {
    id: 'website-templates',
    title: 'Website Templates Pack',
    subtitle: 'React + Vite Ready-to-Deploy',
    description: 'Collection of 5 professionally designed landing pages and portfolio templates. Clean code, responsive, fast — just add your content and deploy.',
    price: 39,
    originalPrice: 69,
    category: 'Web Development',
    color: '#6366f1',
    features: ['5 unique designs', 'React + Vite', 'Fully responsive', 'Dark & light mode', 'SEO optimized', 'Deploy in minutes'],
    badge: null,
  },
  // ── Magic Prompts ─────────────────────────────────────────────
  {
    id: 'prompts-real-estate',
    title: 'Real Estate Prompt Pack',
    subtitle: '50+ Ready-to-Use Prompts',
    description: 'Property listings, tenant emails, market analysis, investor reports, social posts for agents — just fill in your details and go.',
    price: 14,
    originalPrice: 29,
    category: 'AI & Automation',
    color: '#f59e0b',
    features: ['50+ prompts', 'Listing descriptions', 'Tenant comms', 'Market reports', 'Social captions', 'Fill-in-the-blank'],
    badge: 'Best Seller',
  },
  {
    id: 'prompts-marketing',
    title: 'Marketing & Sales Prompts',
    subtitle: '75+ Plug-and-Play Prompts',
    description: 'Ad copy, email sequences, cold outreach, social media campaigns, and sales scripts — for any industry.',
    price: 19,
    originalPrice: 39,
    category: 'AI & Automation',
    color: '#f43f5e',
    features: ['75+ prompts', 'Ad copy generators', 'Email sequences', 'Cold DM scripts', 'Launch campaigns', 'A/B test variants'],
    badge: 'Popular',
  },
  {
    id: 'prompts-business',
    title: 'Business & Productivity Pack',
    subtitle: '60+ Professional Prompts',
    description: 'SOPs, meeting agendas, project proposals, financial summaries, hiring templates, and workflow automations.',
    price: 14,
    originalPrice: 29,
    category: 'AI & Automation',
    color: '#10b981',
    features: ['60+ prompts', 'SOP generators', 'Proposal templates', 'Report writers', 'Hiring scripts', 'Process automations'],
    badge: null,
  },
  {
    id: 'prompts-content',
    title: 'Content Creator Toolkit',
    subtitle: '80+ Creative Prompts',
    description: 'Blog posts, YouTube scripts, newsletter intros, SEO articles, podcast outlines, and social media carousels.',
    price: 19,
    originalPrice: 34,
    category: 'AI & Automation',
    color: '#8b5cf6',
    features: ['80+ prompts', 'Blog post outlines', 'Video scripts', 'Newsletter hooks', 'SEO frameworks', 'Carousel templates'],
    badge: 'New',
  },
  // ── AI & Automation ───────────────────────────────────────────
  {
    id: 'lead-funnel-template',
    title: 'Lead Funnel Blueprint',
    subtitle: 'Complete Funnel Setup Guide',
    description: 'Step-by-step guide to building a high-converting lead funnel — landing page, lead magnet, email sequence, and CRM setup. Includes templates for every stage.',
    price: 34,
    originalPrice: 59,
    category: 'AI & Automation',
    color: '#8b5cf6',
    features: ['Funnel architecture', 'Email sequence templates', 'Lead magnet ideas', 'CRM setup guide', 'A/B testing tips', 'Conversion tracking'],
    badge: 'New',
  },
  {
    id: 'email-sms-playbook',
    title: 'Email & SMS Playbook',
    subtitle: 'Campaign Templates + Strategy',
    description: 'Ready-to-use email blast and SMS campaign templates with audience segmentation strategies, scheduling, and AI prompt templates for copy generation.',
    price: 24,
    originalPrice: 44,
    category: 'AI & Automation',
    color: '#6366f1',
    features: ['20+ email templates', '10+ SMS templates', 'AI copy prompts', 'Segmentation guide', 'Scheduling strategy', 'Compliance checklist'],
    badge: 'Popular',
  },
  {
    id: 'automation-starter-kit',
    title: 'Automation Starter Kit',
    subtitle: 'Make.com + Zapier Workflows',
    description: 'Pre-built workflow automations for lead capture, follow-ups, social posting, and CRM updates. Just import and customize.',
    price: 19,
    originalPrice: 39,
    category: 'AI & Automation',
    color: '#14b8a6',
    features: ['15+ workflows', 'Make.com blueprints', 'Zapier templates', 'Lead nurture flows', 'Social auto-post', 'Setup video guide'],
    badge: null,
  },
  // ── Logo & Branding ──────────────────────────────────────────
  {
    id: 'social-media-kit',
    title: 'Social Media Kit',
    subtitle: '50+ Editable Templates',
    description: 'Professional templates for Instagram posts, stories, reels covers, carousels, and LinkedIn banners. Fully customizable in Canva or Figma.',
    price: 29,
    originalPrice: 49,
    category: 'Logo & Branding',
    color: '#f43f5e',
    features: ['50+ templates', 'Instagram, TikTok, LinkedIn', 'Canva & Figma formats', 'Stories, posts, carousels', 'Brand color customization', 'Commercial license'],
    badge: 'Popular',
  },
  {
    id: 'content-calendar',
    title: 'Content Calendar Planner',
    subtitle: '90-Day Social Strategy',
    description: 'Plan, schedule, and track your social media content across all platforms. Includes content pillars, posting schedule, and performance tracking.',
    price: 14,
    originalPrice: 24,
    category: 'Logo & Branding',
    color: '#8b5cf6',
    features: ['90-day planner', 'Multi-platform', 'Content pillars', 'Post ideas bank', 'Analytics tracker', 'Notion + Sheets'],
    badge: null,
  },
  // ── Free Real Estate Tools ───────────────────────────────────
  {
    id: 'mortgage-calc',
    title: 'Mortgage Calculator',
    subtitle: 'Free Interactive Tool',
    description: 'Calculate your monthly mortgage payment instantly. Adjust home price, down payment, rate, and term.',
    price: 0,
    originalPrice: 0,
    category: 'Real Estate',
    color: '#c8a76b',
    features: ['Instant calculation', 'Adjustable inputs', 'Total interest view', 'Mobile friendly', 'No signup required', 'Always free'],
    badge: 'Free',
    toolLink: '/tools',
  },
  {
    id: 'recast-calc',
    title: 'Recast Calculator',
    subtitle: 'Free Interactive Tool',
    description: 'See how a lump-sum payment reduces your monthly mortgage. Compare before and after instantly.',
    price: 0,
    originalPrice: 0,
    category: 'Real Estate',
    color: '#c8a76b',
    features: ['Before/after view', 'Annual savings', 'Easy inputs', 'Mobile friendly', 'No signup required', 'Always free'],
    badge: 'Free',
    toolLink: '/tools',
  },
  {
    id: 'first-home',
    title: 'First Home Checklist',
    subtitle: 'Free Interactive Guide',
    description: '10-step interactive checklist with tips to prepare for buying your first home.',
    price: 0,
    originalPrice: 0,
    category: 'Real Estate',
    color: '#c8a76b',
    features: ['10 key steps', 'Progress tracking', 'Expert tips', 'Interactive checkboxes', 'No signup required', 'Always free'],
    badge: 'Free',
    toolLink: '/tools',
  },
  {
    id: 'rent-vs-buy',
    title: 'Rent vs Buy Comparison',
    subtitle: 'Free Interactive Tool',
    description: 'Compare the total cost of renting vs buying over any time period. Includes equity estimates.',
    price: 0,
    originalPrice: 0,
    category: 'Real Estate',
    color: '#c8a76b',
    features: ['Side-by-side view', 'Equity estimates', 'Rent increase factor', 'Custom timeframe', 'No signup required', 'Always free'],
    badge: 'Free',
    toolLink: '/tools',
  },
  {
    id: 'pq-quiz',
    title: 'Pre-Qualification Assessment',
    subtitle: 'Free Self-Assessment Quiz',
    description: '5-question quiz to evaluate your readiness to buy a home. Get personalized feedback instantly.',
    price: 0,
    originalPrice: 0,
    category: 'Real Estate',
    color: '#c8a76b',
    features: ['5 quick questions', 'Instant results', 'Personalized advice', 'Score breakdown', 'No signup required', 'Always free'],
    badge: 'Free',
    toolLink: '/tools',
  },
]

export default function StorePage() {
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(null)
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const success = searchParams.get('success')
  const canceled = searchParams.get('canceled')

  async function handleBuy(productId) {
    if (!isAuthenticated) {
      navigate('/register')
      return
    }
    setLoading(productId)
    try {
      const res = await api.post('/checkout', { product_id: productId })
      window.location.href = res.data.url
    } catch {
      alert('Checkout failed. Please try again.')
      setLoading(null)
    }
  }

  const filtered = active === 'All'
    ? products
    : products.filter((p) => p.category === active)

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.eyebrow}>Digital Products</span>
          <h1 style={styles.heading}>Store</h1>
          <p style={styles.sub}>Templates, trackers, and tools to level up your business</p>
        </div>

        {success && (
          <div style={styles.successBanner}>
            Payment successful! Check your email for the download link.
          </div>
        )}
        {canceled && (
          <div style={styles.cancelBanner}>
            Checkout was canceled. No charge was made.
          </div>
        )}

        <div style={styles.tabs}>
          {STORE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                ...styles.tab,
                ...(active === cat ? styles.tabActive : {}),
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          {filtered.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={{ ...styles.cardTop, background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)` }}>
                <div style={{ ...styles.iconCircle, background: `${p.color}33`, border: `1px solid ${p.color}44` }}>
                  <span style={{ ...styles.iconDot, background: p.color }} />
                </div>
                {p.badge && (
                  <span style={{ ...styles.badge, background: p.color }}>{p.badge}</span>
                )}
              </div>

              <div style={styles.cardBody}>
                <span style={styles.category}>{p.category}</span>
                <h3 style={styles.title}>{p.title}</h3>
                <p style={styles.subtitle}>{p.subtitle}</p>
                <p style={styles.description}>{p.description}</p>

                <ul style={styles.features}>
                  {p.features.map((f) => (
                    <li key={f} style={styles.feature}>
                      <span style={styles.check}>&#10003;</span> {f}
                    </li>
                  ))}
                </ul>

                <div style={styles.priceRow}>
                  {p.price === 0 ? (
                    <span style={{ ...styles.price, color: '#6ee7b7' }}>Free</span>
                  ) : (
                    <>
                      <span style={styles.price}>${p.price}</span>
                      <span style={styles.originalPrice}>${p.originalPrice}</span>
                      <span style={styles.discount}>
                        {Math.round((1 - p.price / p.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                {p.toolLink ? (
                  <a href={p.toolLink} style={{ ...styles.buyBtn, background: p.color, textDecoration: 'none', textAlign: 'center', display: 'block' }}>
                    Use Free Tool
                  </a>
                ) : (
                  <button
                    onClick={() => handleBuy(p.id)}
                    disabled={loading === p.id}
                    style={{ ...styles.buyBtn, background: p.color, opacity: loading === p.id ? 0.6 : 1 }}
                  >
                    {loading === p.id ? 'Redirecting...' : 'Buy Now'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — All rights reserved</p>
      </footer>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
  },
  content: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  header: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  eyebrow: {
    display: 'inline-block',
    padding: '0.3rem 0.9rem',
    borderRadius: '999px',
    border: '1px solid rgba(16,185,129,0.4)',
    color: '#6ee7b7',
    fontSize: '0.8rem',
    marginBottom: '1rem',
  },
  heading: {
    fontSize: '2.4rem',
    fontWeight: 800,
    marginBottom: '0.5rem',
    letterSpacing: '-0.02em',
  },
  sub: {
    color: '#888',
    fontSize: '1rem',
    margin: 0,
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '2.5rem',
  },
  tab: {
    padding: '0.5rem 1.2rem',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: '#888',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    border: '1px solid transparent',
  },
  successBanner: {
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    background: 'rgba(16,185,129,0.1)',
    border: '1px solid rgba(16,185,129,0.3)',
    color: '#6ee7b7',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  cancelBanner: {
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    background: 'rgba(248,113,113,0.1)',
    border: '1px solid rgba(248,113,113,0.3)',
    color: '#f87171',
    textAlign: 'center',
    marginBottom: '2rem',
    fontSize: '0.95rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTop: {
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDot: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
  },
  badge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '0.2rem 0.7rem',
    borderRadius: '999px',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardBody: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  category: {
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#666',
    marginBottom: '0.3rem',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 700,
    margin: '0 0 0.2rem',
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#999',
    margin: '0 0 0.8rem',
  },
  description: {
    color: '#777',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    margin: '0 0 1rem',
  },
  features: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.4rem',
  },
  feature: {
    fontSize: '0.78rem',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  check: {
    color: '#10b981',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.6rem',
    marginBottom: '1rem',
    marginTop: 'auto',
  },
  price: {
    fontSize: '1.6rem',
    fontWeight: 800,
  },
  originalPrice: {
    fontSize: '0.95rem',
    color: '#666',
    textDecoration: 'line-through',
  },
  discount: {
    fontSize: '0.75rem',
    color: '#10b981',
    fontWeight: 600,
    background: 'rgba(16,185,129,0.1)',
    padding: '0.15rem 0.5rem',
    borderRadius: '999px',
  },
  buyBtn: {
    padding: '0.75rem',
    borderRadius: '10px',
    border: 'none',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
    width: '100%',
    transition: 'opacity 0.2s',
  },
  footer: {
    textAlign: 'center',
    padding: '2rem',
    color: '#555',
    fontSize: '0.85rem',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
}
