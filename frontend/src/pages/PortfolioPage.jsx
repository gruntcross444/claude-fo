import { useState } from 'react'
import Navbar from '../components/Navbar'

const CATEGORIES = ['All', 'Real Estate', 'Web Development', 'AI & Automation', 'Mobile Apps', 'Logo & Branding']

const projects = [
  // ── Real Estate ──────────────────────────────────────────────
  {
    title: 'Brickell Rental Communities',
    category: 'Real Estate',
    description: 'Luxury furnished apartment rental platform for Brickell, Miami. Featuring pricing tiers, amenity showcases, and WhatsApp-integrated lead flow.',
    color: '#c8a76b',
    tags: ['HTML/CSS', 'Netlify', 'WhatsApp API', 'Bilingual'],
    link: 'https://brickell-rentals.netlify.app',
  },
  {
    title: 'Doral Living Hub',
    category: 'Real Estate',
    description: 'Community portal for lease rentals in Doral with neighborhood guides, virtual tours, and resident onboarding.',
    color: '#0a1428',
    tags: ['React', 'Maps API', 'CMS'],
  },
  // ── Web Development ──────────────────────────────────────────
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    description: 'Full-stack online store with cart, payments, and admin dashboard.',
    color: '#6366f1',
    tags: ['React', 'FastAPI', 'Stripe'],
  },
  {
    title: 'SaaS Analytics Dashboard',
    category: 'Web Development',
    description: 'Real-time data visualization dashboard with role-based access and custom reporting.',
    color: '#14b8a6',
    tags: ['React', 'D3.js', 'FastAPI'],
  },
  {
    title: 'Task Management App',
    category: 'Web Development',
    description: 'Drag-and-drop Kanban board with real-time collaboration and team workspaces.',
    color: '#8b5cf6',
    tags: ['React', 'WebSockets', 'PostgreSQL'],
  },
  // ── Mobile Apps ──────────────────────────────────────────────
  {
    title: 'Mobile Fitness Tracker',
    category: 'Mobile Apps',
    description: 'Cross-platform workout tracker with progress analytics and personalized plans.',
    color: '#ec4899',
    tags: ['React Native', 'Node.js', 'Charts'],
  },
  {
    title: 'Property Finder App',
    category: 'Mobile Apps',
    description: 'Mobile app for browsing rental listings with map view, filters, and saved searches.',
    color: '#f59e0b',
    tags: ['React Native', 'Maps', 'Push Notifications'],
  },
  // ── Logo & Branding ──────────────────────────────────────────
  {
    title: 'Full Vector Logo Suite',
    category: 'Logo & Branding',
    description: 'Custom vector logos with full brand guidelines — scalable from favicon to billboard.',
    color: '#a855f7',
    tags: ['Illustrator', 'SVG', 'Vector', 'Brand Book'],
  },
  {
    title: 'Animated Logo Package',
    category: 'Logo & Branding',
    description: 'Motion logo animations for intros, socials, and loading screens — delivered in Lottie, GIF, and MP4.',
    color: '#f472b6',
    tags: ['After Effects', 'Lottie', 'Motion Design'],
  },
  {
    title: 'Real Estate Brand Identity',
    category: 'Logo & Branding',
    description: 'Complete visual identity for luxury rental communities — logo, color palette, typography, and collateral.',
    color: '#c8a76b',
    tags: ['Figma', 'Illustrator', 'Print', 'Digital'],
  },
  // ── Magic Prompts ─────────────────────────────────────────────
  {
    title: 'Real Estate Prompt Library',
    category: 'AI & Automation',
    description: '50+ ready-to-use prompts for property listings, tenant communications, market analysis, and investor reports.',
    color: '#f59e0b',
    tags: ['ChatGPT', 'Real Estate', '50+ Prompts'],
    storeLink: true,
  },
  {
    title: 'Marketing & Sales Prompts',
    category: 'AI & Automation',
    description: 'Ad copy, email campaigns, cold outreach scripts, social media posts, and sales funnel content — all plug-and-play.',
    color: '#f43f5e',
    tags: ['ChatGPT', 'Marketing', '75+ Prompts'],
    storeLink: true,
  },
  {
    title: 'Business Productivity Pack',
    category: 'AI & Automation',
    description: 'SOPs, meeting agendas, proposals, financial reports, and workflow automation prompts for any business.',
    color: '#10b981',
    tags: ['ChatGPT', 'Business', '60+ Prompts'],
    storeLink: true,
  },
  {
    title: 'Content Creator Toolkit',
    category: 'AI & Automation',
    description: 'Blog posts, video scripts, newsletters, SEO content, and social media captions — never face a blank page again.',
    color: '#8b5cf6',
    tags: ['ChatGPT', 'Content', '80+ Prompts'],
    storeLink: true,
  },
  // ── AI & Automation ───────────────────────────────────────────
  {
    title: 'Real Estate Lead Funnel',
    category: 'AI & Automation',
    description: 'End-to-end lead generation funnel for rental communities — landing page, lead magnet, email sequence, and CRM integration.',
    color: '#8b5cf6',
    tags: ['Make.com', 'Mailchimp', 'CRM', 'Funnel'],
  },
  {
    title: 'AI-Powered Email Campaigns',
    category: 'AI & Automation',
    description: 'Automated email blast system with AI-generated copy, audience segmentation, and performance tracking.',
    color: '#6366f1',
    tags: ['OpenAI', 'Mailchimp', 'Zapier', 'Analytics'],
  },
  {
    title: 'SMS Marketing Automation',
    category: 'AI & Automation',
    description: 'Bulk SMS campaigns with personalized messages, scheduling, opt-in/out management, and delivery reports.',
    color: '#14b8a6',
    tags: ['Twilio', 'Make.com', 'Automation'],
  },
  // ── Digital Products (filed under their service category) ────
  {
    title: 'Monthly Finance Tracker',
    category: 'Web Development',
    description: 'Spreadsheet template for personal and business budgeting — income, expenses, goals, and visual dashboards.',
    color: '#10b981',
    tags: ['Google Sheets', 'Excel', 'Notion'],
    storeLink: true,
  },
  {
    title: 'Social Media Kit',
    category: 'Logo & Branding',
    description: '50+ editable templates for Instagram, TikTok, and LinkedIn — stories, posts, reels covers, and carousels.',
    color: '#f43f5e',
    tags: ['Canva', 'Figma', 'Templates'],
    storeLink: true,
  },
  {
    title: 'Website Templates Pack',
    category: 'Web Development',
    description: 'Ready-to-deploy landing page and portfolio templates built with React — clean, fast, responsive.',
    color: '#6366f1',
    tags: ['React', 'Tailwind', 'Vite'],
    storeLink: true,
  },
]

export default function PortfolioPage() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.heading}>Portfolio</h1>
          <p style={styles.sub}>Selected work across real estate, web, mobile, and design</p>
        </div>

        <div style={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{
                ...styles.tab,
                ...(active === cat ? styles.tabActive : {}),
              }}
            >
              {cat}
              {active !== cat && (
                <span style={styles.tabCount}>
                  {cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={styles.grid}>
          {filtered.map((p) => (
            <div key={p.title} style={styles.card}>
              <div style={{ ...styles.cardHeader, background: `linear-gradient(135deg, ${p.color}33, ${p.color}11)`, borderBottom: `1px solid ${p.color}33` }}>
                <span style={{ ...styles.dot, background: p.color }} />
              </div>
              <div style={styles.cardBody}>
                <span style={styles.category}>{p.category}</span>
                <h3 style={styles.title}>{p.title}</h3>
                <p style={styles.description}>{p.description}</p>
                <div style={styles.tags}>
                  {p.tags.map((t) => (
                    <span key={t} style={styles.tag}>{t}</span>
                  ))}
                </div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noopener noreferrer" style={styles.visitLink}>
                    Visit site &rarr;
                  </a>
                )}
                {p.storeLink && (
                  <a href="/store" style={styles.storeLink}>
                    View in store &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={styles.empty}>No projects in this category yet. Stay tuned!</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  header: {
    marginBottom: '2rem',
  },
  heading: {
    fontSize: '2.2rem',
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
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  tab: {
    padding: '0.5rem 1rem',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: '#888',
    fontSize: '0.85rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: 'linear-gradient(135deg, #6366f1, #a855f7)',
    color: '#fff',
    border: '1px solid transparent',
  },
  tabCount: {
    fontSize: '0.75rem',
    background: 'rgba(255,255,255,0.1)',
    padding: '0.1rem 0.45rem',
    borderRadius: '999px',
    color: '#666',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    overflow: 'hidden',
    transition: 'border-color 0.2s',
  },
  cardHeader: {
    height: '100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    opacity: 0.7,
  },
  cardBody: {
    padding: '1.5rem',
  },
  category: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#888',
    display: 'block',
    marginBottom: '0.4rem',
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: '0 0 0.5rem',
  },
  description: {
    color: '#888',
    fontSize: '0.9rem',
    lineHeight: 1.6,
    margin: '0 0 1rem',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.4rem',
  },
  tag: {
    fontSize: '0.75rem',
    padding: '0.25rem 0.6rem',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#aaa',
  },
  visitLink: {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#a5b4fc',
    fontSize: '0.85rem',
    textDecoration: 'none',
    fontWeight: 500,
  },
  storeLink: {
    display: 'inline-block',
    marginTop: '1rem',
    color: '#10b981',
    fontSize: '0.85rem',
    textDecoration: 'none',
    fontWeight: 500,
  },
  empty: {
    textAlign: 'center',
    color: '#555',
    padding: '3rem',
    fontSize: '1rem',
  },
}
