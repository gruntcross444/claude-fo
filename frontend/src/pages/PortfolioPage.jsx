import { useState } from 'react'
import { Building2, Code2, Bot, Smartphone, Palette, ShoppingCart, BarChart3, Kanban, Dumbbell, MapPin, PenTool, Video, FileText, Wand2, Mail, MessageSquare, Send, Megaphone, ArrowUpRight, ShoppingBag, ExternalLink } from 'lucide-react'
import Navbar from '../components/Navbar'
import useScrollReveal from '../hooks/useScrollReveal'

const CATEGORIES = ['All', 'Real Estate', 'Web Development', 'AI & Automation', 'Mobile Apps', 'Logo & Branding']

const CATEGORY_ICONS = {
  'Real Estate': Building2,
  'Web Development': Code2,
  'AI & Automation': Bot,
  'Mobile Apps': Smartphone,
  'Logo & Branding': Palette,
}

const projects = [
  // ── Real Estate
  { title: 'Brickell Rental Communities', category: 'Real Estate', description: 'Luxury furnished apartment rental platform for Brickell, Miami. Featuring pricing tiers, amenity showcases, and WhatsApp-integrated lead flow.', color: '#c8a76b', Icon: Building2, tags: ['HTML/CSS', 'Netlify', 'WhatsApp API', 'Bilingual'], link: 'https://brickell-rentals.netlify.app' },
  { title: 'Doral Living Hub', category: 'Real Estate', description: 'Community portal for lease rentals in Doral with neighborhood guides, virtual tours, and resident onboarding.', color: '#0a1428', Icon: MapPin, tags: ['React', 'Maps API', 'CMS'] },
  // ── Web Development
  { title: 'E-Commerce Platform', category: 'Web Development', description: 'Full-stack online store with cart, payments, and admin dashboard.', color: '#6366f1', Icon: ShoppingCart, tags: ['React', 'FastAPI', 'Stripe'] },
  { title: 'SaaS Analytics Dashboard', category: 'Web Development', description: 'Real-time data visualization dashboard with role-based access and custom reporting.', color: '#14b8a6', Icon: BarChart3, tags: ['React', 'D3.js', 'FastAPI'] },
  { title: 'Task Management App', category: 'Web Development', description: 'Drag-and-drop Kanban board with real-time collaboration and team workspaces.', color: '#8b5cf6', Icon: Kanban, tags: ['React', 'WebSockets', 'PostgreSQL'] },
  // ── AI & Automation
  { title: 'Real Estate Prompt Library', category: 'AI & Automation', description: '50+ ready-to-use prompts for property listings, tenant communications, market analysis, and investor reports.', color: '#f59e0b', Icon: Wand2, tags: ['ChatGPT', 'Real Estate', '50+ Prompts'], storeLink: true },
  { title: 'Marketing & Sales Prompts', category: 'AI & Automation', description: 'Ad copy, email campaigns, cold outreach scripts, social media posts, and sales funnel content.', color: '#f43f5e', Icon: Megaphone, tags: ['ChatGPT', 'Marketing', '75+ Prompts'], storeLink: true },
  { title: 'Business Productivity Pack', category: 'AI & Automation', description: 'SOPs, meeting agendas, proposals, financial reports, and workflow automation prompts.', color: '#10b981', Icon: FileText, tags: ['ChatGPT', 'Business', '60+ Prompts'], storeLink: true },
  { title: 'Content Creator Toolkit', category: 'AI & Automation', description: 'Blog posts, video scripts, newsletters, SEO content, and social media captions.', color: '#8b5cf6', Icon: PenTool, tags: ['ChatGPT', 'Content', '80+ Prompts'], storeLink: true },
  { title: 'Real Estate Lead Funnel', category: 'AI & Automation', description: 'End-to-end lead generation funnel — landing page, lead magnet, email sequence, and CRM integration.', color: '#8b5cf6', Icon: Send, tags: ['Make.com', 'Mailchimp', 'CRM', 'Funnel'] },
  { title: 'AI-Powered Email Campaigns', category: 'AI & Automation', description: 'Automated email blast system with AI-generated copy, audience segmentation, and performance tracking.', color: '#6366f1', Icon: Mail, tags: ['OpenAI', 'Mailchimp', 'Zapier', 'Analytics'] },
  { title: 'SMS Marketing Automation', category: 'AI & Automation', description: 'Bulk SMS campaigns with personalized messages, scheduling, opt-in/out management, and delivery reports.', color: '#14b8a6', Icon: MessageSquare, tags: ['Twilio', 'Make.com', 'Automation'] },
  // ── Mobile Apps
  { title: 'Mobile Fitness Tracker', category: 'Mobile Apps', description: 'Cross-platform workout tracker with progress analytics and personalized plans.', color: '#ec4899', Icon: Dumbbell, tags: ['React Native', 'Node.js', 'Charts'] },
  { title: 'Property Finder App', category: 'Mobile Apps', description: 'Mobile app for browsing rental listings with map view, filters, and saved searches.', color: '#f59e0b', Icon: MapPin, tags: ['React Native', 'Maps', 'Push Notifications'] },
  // ── Logo & Branding
  { title: 'Full Vector Logo Suite', category: 'Logo & Branding', description: 'Custom vector logos with full brand guidelines — scalable from favicon to billboard.', color: '#a855f7', Icon: PenTool, tags: ['Illustrator', 'SVG', 'Vector', 'Brand Book'] },
  { title: 'Animated Logo Package', category: 'Logo & Branding', description: 'Motion logo animations for intros, socials, and loading screens — delivered in Lottie, GIF, and MP4.', color: '#f472b6', Icon: Video, tags: ['After Effects', 'Lottie', 'Motion Design'] },
  { title: 'Real Estate Brand Identity', category: 'Logo & Branding', description: 'Complete visual identity for luxury rental communities — logo, color palette, typography, and collateral.', color: '#c8a76b', Icon: Palette, tags: ['Figma', 'Illustrator', 'Print', 'Digital'] },
  // ── Digital Products (under their service category)
  { title: 'Monthly Finance Tracker', category: 'Web Development', description: 'Spreadsheet template for personal and business budgeting — income, expenses, goals, and visual dashboards.', color: '#10b981', Icon: BarChart3, tags: ['Google Sheets', 'Excel', 'Notion'], storeLink: true },
  { title: 'Social Media Kit', category: 'Logo & Branding', description: '50+ editable templates for Instagram, TikTok, and LinkedIn — stories, posts, reels covers, and carousels.', color: '#f43f5e', Icon: ShoppingBag, tags: ['Canva', 'Figma', 'Templates'], storeLink: true },
  { title: 'Website Templates Pack', category: 'Web Development', description: 'Ready-to-deploy landing page and portfolio templates built with React — clean, fast, responsive.', color: '#6366f1', Icon: Code2, tags: ['React', 'Tailwind', 'Vite'], storeLink: true },
]

function ProjectCard({ project, delay }) {
  const [ref, visible] = useScrollReveal(0.05)
  const { Icon } = project

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
        e.currentTarget.style.borderColor = `${project.color}40`
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = `0 16px 40px ${project.color}12`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ ...s.cardHeader, background: `linear-gradient(135deg, ${project.color}18, ${project.color}08)` }}>
        <div style={{ ...s.iconWrap, background: `${project.color}20`, border: `1px solid ${project.color}35` }}>
          <Icon size={26} color={project.color} strokeWidth={1.5} />
        </div>
      </div>
      <div style={s.cardBody}>
        <span style={{ ...s.category, color: project.color }}>{project.category}</span>
        <h3 style={s.title}>{project.title}</h3>
        <p style={s.description}>{project.description}</p>
        <div style={s.tags}>
          {project.tags.map((tag) => (
            <span key={tag} style={s.tag}>{tag}</span>
          ))}
        </div>
        <div style={s.links}>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ ...s.linkBtn, borderColor: `${project.color}40`, color: project.color }}>
              <ExternalLink size={13} /> Visit site
            </a>
          )}
          {project.storeLink && (
            <a href="/store" style={{ ...s.linkBtn, borderColor: 'rgba(16,185,129,0.4)', color: '#10b981' }}>
              <ShoppingBag size={13} /> View in store
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All'
    ? projects
    : projects.filter((p) => p.category === active)

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.header}>
          <span style={s.eyebrow}>Our Work</span>
          <h1 style={s.heading}>Portfolio</h1>
          <p style={s.sub}>Selected work across real estate, web, mobile, and design</p>
        </div>

        <div style={s.tabs}>
          {CATEGORIES.map((cat) => {
            const CatIcon = CATEGORY_ICONS[cat]
            const count = cat === 'All' ? projects.length : projects.filter((p) => p.category === cat).length
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{ ...s.tab, ...(active === cat ? s.tabActive : {}) }}
              >
                {CatIcon && <CatIcon size={14} />} {cat}
                {active !== cat && <span style={s.tabCount}>{count}</span>}
              </button>
            )
          })}
        </div>

        <div style={s.grid}>
          {filtered.map((p, i) => (
            <ProjectCard key={p.title} project={p} delay={(i % 3) * 0.1} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={s.empty}>No projects in this category yet. Stay tuned!</p>
        )}
      </div>
      <footer style={s.footer}><p>&copy; {new Date().getFullYear()} Claude.FO — All rights reserved</p></footer>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' },
  header: { marginBottom: '2rem', textAlign: 'center' },
  eyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  heading: { fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#777', fontSize: '1rem', margin: 0 },
  tabs: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', marginBottom: '2.5rem' },
  tab: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#888', fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.2s' },
  tabActive: { background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', border: '1px solid transparent' },
  tabCount: { fontSize: '0.7rem', background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.4rem', borderRadius: '999px', color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' },
  card: { borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', overflow: 'hidden', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
  cardHeader: { height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: '56px', height: '56px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardBody: { padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' },
  category: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.3rem', fontWeight: 600 },
  title: { fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' },
  description: { color: '#777', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' },
  tag: { fontSize: '0.72rem', padding: '0.2rem 0.55rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#999' },
  links: { marginTop: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' },
  linkBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid', fontSize: '0.78rem', fontWeight: 500, textDecoration: 'none', transition: 'all 0.2s' },
  empty: { textAlign: 'center', color: '#555', padding: '3rem', fontSize: '1rem' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
