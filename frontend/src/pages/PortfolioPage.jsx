import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Code2, Bot, Smartphone, Palette, ShoppingCart,
  BarChart3, Kanban, Dumbbell, MapPin, PenTool, Video, FileText,
  Wand2, Mail, MessageSquare, Send, Megaphone, ShoppingBag,
  ExternalLink, ArrowRight, Zap, TrendingUp, Clock,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n/LanguageContext'

const CATEGORIES = ['All', 'Real Estate', 'Web Development', 'AI & Automation', 'Mobile Apps', 'Logo & Branding']

const CATEGORY_ICONS = {
  'Real Estate': Building2,
  'Web Development': Code2,
  'AI & Automation': Bot,
  'Mobile Apps': Smartphone,
  'Logo & Branding': Palette,
}

const projects = [
  // ── FEATURED ─────────────────────────────────────────────
  {
    title: 'Brickell Rental Communities',
    category: 'Real Estate',
    description: 'Luxury furnished apartment rental platform for Brickell, Miami. Bilingual, WhatsApp-integrated lead flow with pricing tiers and amenity showcases.',
    outcome: '3× more qualified leads in month one',
    color: '#c8a76b',
    Icon: Building2,
    tags: ['HTML/CSS', 'Netlify', 'WhatsApp API', 'Bilingual'],
    link: 'https://brickell-rentals.netlify.app',
    status: 'live',
    featured: true,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=500&fit=crop',
  },
  // ── Real Estate ──────────────────────────────────────────
  {
    title: 'Doral Living Hub',
    category: 'Real Estate',
    description: 'Community portal for lease rentals in Doral with neighborhood guides, virtual tours, and resident onboarding.',
    outcome: 'Zero cold calls — all inbound',
    color: '#f59e0b',
    Icon: MapPin,
    tags: ['React', 'Maps API', 'CMS'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=300&fit=crop',
  },
  {
    title: 'Real Estate Lead Funnel',
    category: 'Real Estate',
    description: 'End-to-end lead generation funnel — landing page, lead magnet, email drip, and CRM integration for a Miami rental agency.',
    outcome: '200+ qualified leads in 30 days',
    color: '#8b5cf6',
    Icon: Send,
    tags: ['Make.com', 'Mailchimp', 'CRM', 'Funnel'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=300&fit=crop',
  },
  // ── Web Development ──────────────────────────────────────
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'Full-stack online store with cart, Stripe payments, inventory management, and real-time admin dashboard.',
    outcome: 'Launched in 5 days — 3 sales day one',
    color: '#6366f1',
    Icon: ShoppingCart,
    tags: ['React', 'FastAPI', 'Stripe', 'PostgreSQL'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=300&fit=crop',
  },
  {
    title: 'SaaS Analytics Dashboard',
    category: 'Web Development',
    description: 'Real-time data visualization platform with role-based access, custom reporting, and exportable insights.',
    outcome: '40% faster reporting for the team',
    color: '#14b8a6',
    Icon: BarChart3,
    tags: ['React', 'D3.js', 'FastAPI', 'WebSockets'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=300&fit=crop',
  },
  {
    title: 'Task Management App',
    category: 'Web Development',
    description: 'Drag-and-drop Kanban board with real-time collaboration, team workspaces, and Slack notifications.',
    outcome: 'Replaced $150/mo Asana subscription',
    color: '#8b5cf6',
    Icon: Kanban,
    tags: ['React', 'WebSockets', 'PostgreSQL'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=300&fit=crop',
  },
  // ── AI & Automation ──────────────────────────────────────
  {
    title: 'Real Estate Prompt Library',
    category: 'AI & Automation',
    description: '50+ ready-to-use prompts for property listings, tenant communications, market analysis, and investor reports.',
    outcome: 'Cuts listing write-up time by 80%',
    color: '#f59e0b',
    Icon: Wand2,
    tags: ['ChatGPT', 'Real Estate', '50+ Prompts'],
    status: 'store',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop',
  },
  {
    title: 'AI-Powered Email Campaigns',
    category: 'AI & Automation',
    description: 'Automated email blast system with AI-generated copy, audience segmentation, A/B testing, and performance tracking.',
    outcome: '2× open rates vs. manual campaigns',
    color: '#6366f1',
    Icon: Mail,
    tags: ['OpenAI', 'Mailchimp', 'Zapier'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=600&h=300&fit=crop',
  },
  {
    title: 'SMS Marketing Automation',
    category: 'AI & Automation',
    description: 'Bulk SMS campaigns with AI-personalized messages, scheduling, opt-in/out management, and delivery reports.',
    outcome: '35% reply rate on cold outreach',
    color: '#14b8a6',
    Icon: MessageSquare,
    tags: ['Twilio', 'Make.com', 'Automation'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=300&fit=crop',
  },
  {
    title: 'Marketing & Sales Prompt Pack',
    category: 'AI & Automation',
    description: 'Ad copy, email campaigns, cold outreach scripts, social media posts, and full sales funnel content.',
    outcome: 'Used by 100+ marketers',
    color: '#f43f5e',
    Icon: Megaphone,
    tags: ['ChatGPT', 'Marketing', '75+ Prompts'],
    status: 'store',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=300&fit=crop',
  },
  // ── Mobile Apps ──────────────────────────────────────────
  {
    title: 'Property Finder App',
    category: 'Mobile Apps',
    description: 'Mobile app for browsing rental listings with map view, smart filters, saved searches, and push notifications.',
    outcome: '4.8★ rating, 500+ downloads',
    color: '#f59e0b',
    Icon: MapPin,
    tags: ['React Native', 'Maps', 'Push Notifications'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=300&fit=crop',
  },
  {
    title: 'Mobile Fitness Tracker',
    category: 'Mobile Apps',
    description: 'Cross-platform workout tracker with progress analytics, personalized AI plans, and streak gamification.',
    outcome: '72% 30-day retention rate',
    color: '#ec4899',
    Icon: Dumbbell,
    tags: ['React Native', 'Node.js', 'OpenAI'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=600&h=300&fit=crop',
  },
  // ── Logo & Branding ──────────────────────────────────────
  {
    title: 'Real Estate Brand Identity',
    category: 'Logo & Branding',
    description: 'Complete visual identity for a luxury rental brand — logo, color palette, typography, print collateral, and digital assets.',
    outcome: 'Brand recognized across Miami market',
    color: '#c8a76b',
    Icon: Palette,
    tags: ['Figma', 'Illustrator', 'Print', 'Digital'],
    status: 'confidential',
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=300&fit=crop',
  },
  {
    title: 'Full Vector Logo Suite',
    category: 'Logo & Branding',
    description: 'Custom vector logos with full brand guidelines — scalable from favicon to billboard, delivered in all formats.',
    outcome: 'Delivered in 48 hours',
    color: '#a855f7',
    Icon: PenTool,
    tags: ['Illustrator', 'SVG', 'Vector', 'Brand Book'],
    status: 'store',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=300&fit=crop',
  },
  {
    title: 'Social Media Kit',
    category: 'Logo & Branding',
    description: '50+ editable templates for Instagram, TikTok, and LinkedIn — stories, posts, reels covers, and carousels.',
    outcome: '3× more consistent posting',
    color: '#f43f5e',
    Icon: ShoppingBag,
    tags: ['Canva', 'Figma', 'Templates'],
    status: 'store',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=300&fit=crop',
  },
]

const STATUS_CONFIG = {
  live:        { label: 'Live', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  confidential:{ label: 'Client Work', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  store:       { label: 'In Store', color: '#c8a76b', bg: 'rgba(200,167,107,0.12)' },
}

// ── Featured Card ────────────────────────────────────────────────────────────
function FeaturedCard({ project, t }) {
  const [ref, visible] = useScrollReveal(0.05)
  const { Icon } = project
  const status = STATUS_CONFIG[project.status]

  return (
    <div
      ref={ref}
      style={{
        ...s.featured,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: 'all 0.7s ease',
      }}
    >
      <div style={s.featuredImageWrap}>
        <img src={project.image} alt={project.title} style={s.featuredImage} loading="lazy" />
        <div style={s.featuredOverlay} />
        <span style={s.featuredBadge}>★ Featured Project</span>
      </div>
      <div style={s.featuredBody}>
        <div style={s.featuredMeta}>
          <span style={{ ...s.statusBadge, color: status.color, background: status.bg }}>{status.label}</span>
          <span style={{ ...s.categoryLabel, color: project.color }}>{project.category}</span>
        </div>
        <h2 style={s.featuredTitle}>{project.title}</h2>
        <p style={s.featuredDesc}>{project.description}</p>
        <div style={{ ...s.outcomeBox, borderColor: `${project.color}30`, background: `${project.color}08` }}>
          <TrendingUp size={15} color={project.color} />
          <span style={{ color: project.color, fontSize: '0.88rem', fontWeight: 600 }}>{project.outcome}</span>
        </div>
        <div style={s.featuredTags}>
          {project.tags.map((tag) => (
            <span key={tag} style={s.tag}>{tag}</span>
          ))}
        </div>
        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ ...s.visitBtn, background: `linear-gradient(135deg, ${project.color}, ${project.color}cc)` }}>
            <ExternalLink size={14} /> {t('portfolio.visitSite')}
          </a>
        )}
      </div>
    </div>
  )
}

// ── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, delay, t }) {
  const [ref, visible] = useScrollReveal(0.05)
  const { Icon } = project
  const status = STATUS_CONFIG[project.status]

  return (
    <div
      ref={ref}
      style={{
        ...s.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease ${delay}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${project.color}35`
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 20px 40px ${project.color}10`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.transform = visible ? 'translateY(0)' : 'translateY(20px)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={s.cardHeader}>
        <img src={project.image} alt={project.title} style={s.cardImage} loading="lazy" />
        <div style={s.cardImageOverlay} />
        <div style={{ ...s.iconBadge, background: `${project.color}dd` }}>
          <Icon size={15} color="#fff" strokeWidth={2} />
        </div>
        <span style={{ ...s.statusBadge, ...s.statusBadgeImg, color: status.color, background: status.bg }}>
          {status.label}
        </span>
      </div>
      <div style={s.cardBody}>
        <span style={{ ...s.categoryLabel, color: project.color }}>{project.category}</span>
        <h3 style={s.title}>{project.title}</h3>
        <p style={s.description}>{project.description}</p>
        {project.outcome && (
          <div style={{ ...s.outcomeBox, borderColor: `${project.color}25`, background: `${project.color}06`, marginBottom: '0.8rem' }}>
            <TrendingUp size={12} color={project.color} />
            <span style={{ color: project.color, fontSize: '0.78rem', fontWeight: 600 }}>{project.outcome}</span>
          </div>
        )}
        <div style={s.tags}>
          {project.tags.map((tag) => (
            <span key={tag} style={s.tag}>{tag}</span>
          ))}
        </div>
        <div style={s.links}>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ ...s.linkBtn, borderColor: `${project.color}40`, color: project.color }}>
              <ExternalLink size={12} /> {t('portfolio.visitSite')}
            </a>
          )}
          {project.status === 'store' && (
            <a href="/store" style={{ ...s.linkBtn, borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}>
              <ShoppingBag size={12} /> {t('portfolio.viewInStore')}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PortfolioPage() {
  const [active, setActive] = useState('All')
  const { t } = useLang()
  const navigate = useNavigate()

  const featured = useMemo(() => projects.find((p) => p.featured), [])
  const rest = useMemo(() => projects.filter((p) => !p.featured), [])
  const filteredProjects = useMemo(
    () => active === 'All' ? rest : rest.filter((p) => p.category === active),
    [active, rest]
  )

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>

        {/* ── Header ───────────────────────────────────── */}
        <div style={s.header}>
          <div style={s.headerGlow} />
          <div style={s.availBadge}>
            <span style={s.availDot} />
            Available for new projects
          </div>
          <h1 style={s.heading}>{t('portfolio.heading')}</h1>
          <p style={s.sub}>{t('portfolio.sub')}</p>
          <div style={s.headerStats}>
            <div style={s.hStat}><span style={s.hStatNum}>50+</span><span style={s.hStatLabel}>Projects</span></div>
            <div style={s.hStatDivider} />
            <div style={s.hStat}><span style={s.hStatNum}>30+</span><span style={s.hStatLabel}>Clients</span></div>
            <div style={s.hStatDivider} />
            <div style={s.hStat}><span style={s.hStatNum}>5</span><span style={s.hStatLabel}>Avg. days to ship</span></div>
          </div>
        </div>

        {/* ── Featured ─────────────────────────────────── */}
        {featured && <FeaturedCard project={featured} t={t} />}

        {/* ── Filter Tabs ───────────────────────────────── */}
        <div style={s.tabs}>
          {CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat]
            const count = cat === 'All' ? rest.length : filteredProjects.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{ ...s.tab, ...(active === cat ? s.tabActive : {}) }}
              >
                {CatIcon && <CatIcon size={13} />} {cat}
                {active !== cat && <span style={s.tabCount}>{count}</span>}
              </button>
            )
          })}
        </div>

        {/* ── Grid ─────────────────────────────────────── */}
        <div style={s.grid}>
          {filteredProjects.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={(i % 3) * 0.08} t={t} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <p style={s.empty}>{t('portfolio.empty')}</p>
        )}

        {/* ── Bottom CTA ───────────────────────────────── */}
        <div style={s.bottomCta}>
          <div style={s.bottomCtaGlow} />
          <span style={s.bottomCtaEyebrow}>Ready to be next?</span>
          <h2 style={s.bottomCtaHeading}>Let's build something that converts.</h2>
          <p style={s.bottomCtaSub}>Every project above started with one conversation. Yours can too.</p>
          <div style={s.bottomCtaBtns}>
            <button style={s.bottomCtaBtn} onClick={() => navigate('/register')}>
              Start Your Project <ArrowRight size={15} />
            </button>
            <button style={s.bottomCtaGhost} onClick={() => navigate('/contact')}>
              Book a Free Call
            </button>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes pulse-avail {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          50% { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        @media (max-width: 768px) {
          [data-featured] { flex-direction: column !important; }
          [data-featured-image] { height: 200px !important; width: 100% !important; }
        }
      `}</style>
    </div>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────
const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)' },

  // Header
  header: { marginBottom: '3rem', textAlign: 'center', position: 'relative' },
  headerGlow: { position: 'absolute', top: '-60px', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
  availBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.06)', color: '#10b981', fontSize: '0.78rem', fontWeight: 600, marginBottom: '1.2rem' },
  availDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse-avail 2s ease-in-out infinite', display: 'inline-block' },
  heading: { fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '1rem', margin: '0 0 2rem' },
  headerStats: { display: 'inline-flex', alignItems: 'center', gap: '1.5rem', padding: '0.9rem 2rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(8px)' },
  hStat: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  hStatNum: { fontSize: '1.2rem', fontWeight: 800, background: 'linear-gradient(135deg, #c8a76b, #f0d89c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.2 },
  hStatLabel: { fontSize: '0.68rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.06em' },
  hStatDivider: { width: '1px', height: '32px', background: 'rgba(255,255,255,0.08)' },

  // Featured
  featured: { display: 'flex', gap: 0, borderRadius: '24px', border: '1px solid rgba(200,167,107,0.2)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', marginBottom: '3rem', backdropFilter: 'blur(8px)' },
  featuredImageWrap: { position: 'relative', width: '50%', minHeight: '320px', flexShrink: 0 },
  featuredImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  featuredOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(10,10,20,0.95))' },
  featuredBadge: { position: 'absolute', top: '16px', left: '16px', padding: '0.3rem 0.8rem', borderRadius: '999px', background: 'rgba(200,167,107,0.9)', color: '#0a0a14', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em' },
  featuredBody: { padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 },
  featuredMeta: { display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.8rem' },
  featuredTitle: { fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 800, margin: '0 0 0.8rem', letterSpacing: '-0.02em' },
  featuredDesc: { color: '#888', fontSize: '0.92rem', lineHeight: 1.7, margin: '0 0 1.2rem' },
  visitBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.4rem', borderRadius: '12px', border: 'none', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'none', marginTop: '1rem', width: 'fit-content' },

  // Outcome
  outcomeBox: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '10px', border: '1px solid' },

  // Status badge
  statusBadge: { display: 'inline-block', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.04em' },
  statusBadgeImg: { position: 'absolute', top: '12px', right: '12px' },

  // Category label
  categoryLabel: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 },

  // Tabs
  tabs: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', marginBottom: '2.5rem' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#777', fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: '1px solid transparent' },
  tabCount: { fontSize: '0.68rem', background: 'rgba(255,255,255,0.07)', padding: '0.1rem 0.4rem', borderRadius: '999px', color: '#555' },

  // Grid + Cards
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: '1.2rem', marginBottom: '4rem' },
  card: { borderRadius: '18px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(4px)', overflow: 'hidden', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
  cardHeader: { height: '170px', position: 'relative', overflow: 'hidden' },
  cardImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  cardImageOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,11,15,0.85) 0%, transparent 55%)' },
  iconBadge: { position: 'absolute', bottom: '12px', left: '14px', width: '30px', height: '30px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  title: { fontSize: '1rem', fontWeight: 700, margin: '0.2rem 0 0.4rem', color: '#f3f4f6' },
  description: { color: '#777', fontSize: '0.83rem', lineHeight: 1.6, margin: '0 0 0.6rem' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.3rem', margin: '0.3rem 0 0.8rem' },
  tag: { fontSize: '0.72rem', padding: '0.18rem 0.5rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#888' },
  links: { marginTop: 'auto', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' },
  linkBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.2s' },

  // Bottom CTA
  bottomCta: { textAlign: 'center', padding: '5rem 2rem', position: 'relative', borderRadius: '24px', border: '1px solid rgba(99,102,241,0.15)', background: 'rgba(99,102,241,0.03)', overflow: 'hidden', marginBottom: '2rem' },
  bottomCtaGlow: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' },
  bottomCtaEyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(200,167,107,0.3)', background: 'rgba(200,167,107,0.08)', color: '#c8a76b', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.2rem' },
  bottomCtaHeading: { fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.7rem', position: 'relative' },
  bottomCtaSub: { color: '#666', fontSize: '1rem', marginBottom: '2rem', position: 'relative' },
  bottomCtaBtns: { display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' },
  bottomCtaBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.3)' },
  bottomCtaGhost: { padding: '0.9rem 2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#aaa', fontSize: '0.95rem', cursor: 'pointer' },

  empty: { textAlign: 'center', color: '#555', padding: '3rem', fontSize: '1rem' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
