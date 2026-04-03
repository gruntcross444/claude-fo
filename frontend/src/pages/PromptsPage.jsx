import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import useScrollReveal from '../hooks/useScrollReveal'
import { useLang } from '../i18n/LanguageContext'

const CATEGORIES = ['All', 'Slash Commands', 'AI Agents', 'Hooks & Automation', 'Code Review', 'Marketing', 'Business', 'Content Creation']

const PROMPTS = [
  // ── Free Samples (visible to all) ────────────────────────────
  { id: 1, title: 'Smart Commit Message', category: 'Slash Commands', description: 'Auto-generate context-aware git commit messages following conventional format.', free: true,
    content: `Analyze the current git diff and create a commit message following conventional commits:\n- feat: for new features\n- fix: for bug fixes\n- docs: for documentation\n- refactor: for refactoring\n- test: for adding tests\n\nInclude a brief body explaining WHY, not just what changed.` },
  { id: 2, title: 'Code Optimizer', category: 'Slash Commands', description: 'Review code for performance bottlenecks and suggest priority-ordered fixes.', free: true,
    content: `Review the provided code for issues in order of priority:\n1. Performance bottlenecks - identify O(n²) operations, inefficient loops\n2. Memory leaks - find unreleased resources, circular references\n3. Redundant operations - duplicate computations, unnecessary re-renders\n4. Type safety gaps - any/unknown types, missing null checks\n\nFor each issue found, provide:\n- Location and severity (critical/warning/info)\n- Current vs suggested implementation\n- Expected performance improvement` },
  { id: 3, title: 'PR Description Generator', category: 'Slash Commands', description: 'Create comprehensive pull request descriptions from your branch diff.', free: true,
    content: `Analyze the diff between current branch and main. Generate a PR description:\n\n## Summary\n[2-3 sentence overview of changes]\n\n## Changes Made\n- [Bullet list of specific changes]\n\n## Testing\n- [How to verify these changes]\n\n## Screenshots\n[If UI changes, note where screenshots should go]` },
  { id: 4, title: 'Unit Test Generator', category: 'Code Review', description: 'Generate comprehensive unit tests for any function or module.', free: true,
    content: `For the selected code, generate unit tests covering:\n1. Happy path - expected inputs and outputs\n2. Edge cases - empty inputs, max values, null/undefined\n3. Error cases - invalid inputs, network failures\n4. Boundary conditions - off-by-one, type coercion\n\nUse describe/it blocks. Mock external dependencies. Aim for >90% coverage.` },
  { id: 5, title: 'Security Audit Prompt', category: 'Code Review', description: 'Scan code for OWASP top 10 vulnerabilities and security issues.', free: true,
    content: `Perform a security audit checking for:\n- SQL injection vectors\n- XSS vulnerabilities\n- CSRF exposure\n- Authentication bypass\n- Sensitive data exposure\n- Missing input validation\n- Insecure dependencies\n\nFor each finding: severity, location, exploit scenario, and fix.` },
  { id: 6, title: 'Auto-Format Hook', category: 'Hooks & Automation', description: 'Pre-commit hook that auto-formats code before every commit.', free: true,
    content: `#!/bin/bash\n# Pre-commit format hook\n# Runs Prettier on staged files before commit\n\nSTAGED=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\\.(js|jsx|ts|tsx|css|json)$')\n\nif [ -n "$STAGED" ]; then\n  echo "$STAGED" | xargs npx prettier --write\n  echo "$STAGED" | xargs git add\nfi` },
  { id: 7, title: 'Documentation Writer Agent', category: 'AI Agents', description: 'AI agent that generates comprehensive docs for your codebase.', free: true,
    content: `You are a technical documentation specialist. For the given codebase:\n\n1. Identify all public APIs, components, and utilities\n2. Generate JSDoc/docstring for each\n3. Create a README with: overview, installation, usage examples, API reference\n4. Add inline comments only where logic is non-obvious\n5. Generate a CHANGELOG from recent git commits\n\nWrite for a developer who is new to this codebase.` },
  { id: 8, title: 'Cold Email Sequence', category: 'Marketing', description: 'Generate a 5-email cold outreach sequence for any product or service.', free: true,
    content: `Create a 5-email cold outreach sequence for [YOUR PRODUCT/SERVICE]:\n\nEmail 1 - The Hook: Subject line + 3 sentences. Reference their specific pain point.\nEmail 2 - The Value: Share a relevant case study or stat.\nEmail 3 - The Proof: Social proof, testimonial, or results.\nEmail 4 - The Offer: Clear CTA with urgency.\nEmail 5 - The Breakup: Last chance, no pressure.\n\nRules: Under 100 words each. No fluff. Personalization tokens: [NAME], [COMPANY], [PAIN POINT].` },
  { id: 9, title: 'Meeting Summary Bot', category: 'Business', description: 'Transform meeting notes into actionable summaries with owners and deadlines.', free: true,
    content: `Transform these meeting notes into:\n\n## Key Decisions\n- [Decision] — made by [who]\n\n## Action Items\n| Task | Owner | Deadline |\n|------|-------|----------|\n| ... | ... | ... |\n\n## Open Questions\n- [Question] — needs answer from [who] by [when]\n\n## Next Meeting\n- Date: [suggest]\n- Agenda: [based on open items]` },
  { id: 10, title: 'Blog Post Framework', category: 'Content Creation', description: 'Generate a full blog post outline with SEO-optimized structure.', free: true,
    content: `Create a blog post about [TOPIC]:\n\nTitle: [SEO-optimized, under 60 chars]\nMeta description: [Under 155 chars]\n\n## Outline\nH1: [Main title]\nH2: [Section 1 - Hook/Problem]\nH2: [Section 2 - Solution overview]\nH2: [Section 3 - Step-by-step]\nH2: [Section 4 - Examples/proof]\nH2: [Section 5 - CTA]\n\nKeywords: [primary], [secondary x3]\nInternal links: [suggest 2-3]\nWord count target: 1,500-2,000` },

  // ── Premium (locked) ─────────────────────────────────────────
  { id: 11, title: 'Full CI/CD Pipeline Setup', category: 'Slash Commands', description: 'Generate complete GitHub Actions workflow with testing, linting, and deploy stages.', free: false, content: '' },
  { id: 12, title: 'API Documentation Generator', category: 'Slash Commands', description: 'Auto-generate OpenAPI/Swagger docs from your codebase routes.', free: false, content: '' },
  { id: 13, title: 'Database Schema Designer', category: 'AI Agents', description: 'Design normalized database schemas from business requirements.', free: false, content: '' },
  { id: 14, title: 'Refactoring Agent', category: 'AI Agents', description: 'Identify code smells and refactor with SOLID principles.', free: false, content: '' },
  { id: 15, title: 'Bug Debugger Agent', category: 'AI Agents', description: 'Systematic debugging agent that traces errors to root cause.', free: false, content: '' },
  { id: 16, title: 'Data Analysis Agent', category: 'AI Agents', description: 'Analyze datasets, find patterns, generate visualizations and reports.', free: false, content: '' },
  { id: 17, title: 'Pre-Push Validation Hook', category: 'Hooks & Automation', description: 'Run tests, lint, and type-check before allowing git push.', free: false, content: '' },
  { id: 18, title: 'Auto Security Scanner', category: 'Hooks & Automation', description: 'Scan for secrets, vulnerabilities, and license issues on every commit.', free: false, content: '' },
  { id: 19, title: 'Dependency Audit Hook', category: 'Hooks & Automation', description: 'Check for outdated or vulnerable dependencies before deploy.', free: false, content: '' },
  { id: 20, title: 'Clean Code Reviewer', category: 'Code Review', description: 'Review code against clean code principles with actionable feedback.', free: false, content: '' },
  { id: 21, title: 'Performance Profiler', category: 'Code Review', description: 'Profile React components for unnecessary re-renders and memory leaks.', free: false, content: '' },
  { id: 22, title: 'Accessibility Audit', category: 'Code Review', description: 'Check components against WCAG 2.1 AA standards with fix suggestions.', free: false, content: '' },
  { id: 23, title: 'Facebook Ad Copy Generator', category: 'Marketing', description: '10 ad variations with headlines, body copy, and CTA for any product.', free: false, content: '' },
  { id: 24, title: 'SEO Content Optimizer', category: 'Marketing', description: 'Optimize existing content for target keywords with on-page SEO.', free: false, content: '' },
  { id: 25, title: 'Sales Script Builder', category: 'Marketing', description: 'Build objection-handling sales scripts for phone, email, or DM.', free: false, content: '' },
  { id: 26, title: 'Lead Magnet Creator', category: 'Marketing', description: 'Design a lead magnet strategy with landing page copy and email sequence.', free: false, content: '' },
  { id: 27, title: 'SMS Campaign Templates', category: 'Marketing', description: '20 SMS templates for promos, reminders, follow-ups, and re-engagement.', free: false, content: '' },
  { id: 28, title: 'Business Proposal Generator', category: 'Business', description: 'Professional proposals with scope, timeline, pricing, and terms.', free: false, content: '' },
  { id: 29, title: 'SOP Writer', category: 'Business', description: 'Create step-by-step standard operating procedures for any process.', free: false, content: '' },
  { id: 30, title: 'Financial Report Prompt', category: 'Business', description: 'Generate monthly/quarterly financial summaries with insights.', free: false, content: '' },
  { id: 31, title: 'Hiring Interview Kit', category: 'Business', description: 'Role-specific interview questions, scoring rubrics, and evaluation templates.', free: false, content: '' },
  { id: 32, title: 'YouTube Script Framework', category: 'Content Creation', description: 'Hook-story-offer video scripts optimized for retention.', free: false, content: '' },
  { id: 33, title: 'Newsletter Builder', category: 'Content Creation', description: 'Weekly newsletter templates with subject lines, sections, and CTAs.', free: false, content: '' },
  { id: 34, title: 'Social Media Carousel', category: 'Content Creation', description: 'Generate 10-slide carousel content for LinkedIn or Instagram.', free: false, content: '' },
  { id: 35, title: 'Podcast Show Notes', category: 'Content Creation', description: 'Transform podcast transcripts into show notes, highlights, and quotes.', free: false, content: '' },
]

function PromptCard({ prompt, onCopy, onUnlock, t }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    if (onCopy) onCopy()
  }

  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={styles.cardTop}>
        <span style={styles.cardCategory}>{prompt.category}</span>
        {prompt.free ? (
          <span style={styles.freeBadge}>{t('prompts.free')}</span>
        ) : (
          <span style={styles.proBadge}>{t('prompts.premium')}</span>
        )}
      </div>
      <h3 style={styles.cardTitle}>{prompt.title}</h3>
      <p style={styles.cardDesc}>{prompt.description}</p>

      {prompt.free ? (
        <>
          <pre style={styles.codeBlock}>{prompt.content}</pre>
          <button
            onClick={handleCopy}
            style={{ ...styles.copyBtn, background: copied ? '#10b981' : 'rgba(99,102,241,0.15)' }}
          >
            {copied ? t('prompts.copied') : t('prompts.copy')}
          </button>
        </>
      ) : (
        <>
          <div style={styles.lockedBlock}>
            <span style={styles.lockIcon}>🔒</span>
            <span>{t('prompts.unlock')}</span>
          </div>
          <button onClick={onUnlock} style={styles.unlockBtn}>
            {t('prompts.unlock')}
          </button>
        </>
      )}
    </div>
  )
}

export default function PromptsPage() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [ref, visible] = useScrollReveal(0.05)
  const { t } = useLang()

  const filtered = PROMPTS
    .filter((p) => active === 'All' || p.category === active)
    .filter((p) => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()))

  const freeCount = PROMPTS.filter((p) => p.free).length
  const totalCount = PROMPTS.length

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.content}>
        <div style={styles.header}>
          <span style={styles.eyebrow}>{t('prompts.eyebrow')}</span>
          <h1 style={styles.heading}>{t('prompts.heading')}</h1>
          <p style={styles.sub}>
            {totalCount} {t('promptsExtra.description')}
            {' '}<span style={{ color: '#6ee7b7' }}>{freeCount} {t('prompts.free')}</span> — copy & use instantly.
          </p>
        </div>

        <div style={styles.searchWrap}>
          <input
            type="text"
            placeholder={t('promptsExtra.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.tabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              style={{ ...styles.tab, ...(active === cat ? styles.tabActive : {}) }}
            >
              {cat}
              <span style={styles.tabCount}>
                {cat === 'All' ? totalCount : PROMPTS.filter((p) => p.category === cat).length}
              </span>
            </button>
          ))}
        </div>

        <div
          ref={ref}
          style={{
            ...styles.grid,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease',
          }}
        >
          {filtered.map((p) => (
            <PromptCard
              key={p.id}
              prompt={p}
              t={t}
              onUnlock={() => navigate(isAuthenticated ? '/store' : '/register')}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={styles.empty}>No prompts match your search.</p>
        )}

        <div style={styles.ctaSection}>
          <h2 style={styles.ctaHeading}>{t('prompts.ctaHeading')}</h2>
          <p style={styles.ctaSub}>{t('prompts.ctaSub')}</p>
          <button
            style={styles.ctaBtn}
            onClick={() => navigate(isAuthenticated ? '/store' : '/register')}
            onMouseEnter={(e) => { e.target.style.transform = 'scale(1.05)' }}
            onMouseLeave={(e) => { e.target.style.transform = 'scale(1)' }}
          >
            {t('prompts.ctaBtn')}
          </button>
        </div>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Claude.FO — {t('footer.rights')}</p>
      </footer>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '1100px', margin: '0 auto', padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)' },
  header: { textAlign: 'center', marginBottom: '2rem' },
  eyebrow: { display: 'inline-block', padding: '0.3rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' },
  heading: { fontSize: '2.4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' },
  sub: { color: '#888', fontSize: '1rem', margin: 0 },
  searchWrap: { maxWidth: '500px', margin: '0 auto 2rem' },
  searchInput: { width: '100%', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '1rem', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
  tabs: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.4rem', marginBottom: '2rem' },
  tab: { padding: '0.4rem 0.9rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: '#888', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  tabActive: { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: '1px solid transparent' },
  tabCount: { fontSize: '0.7rem', background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.4rem', borderRadius: '999px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', gap: '1.2rem' },
  card: { borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' },
  cardCategory: { fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666' },
  freeBadge: { fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '999px', background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontWeight: 600 },
  proBadge: { fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '999px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', fontWeight: 600 },
  cardTitle: { fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.4rem' },
  cardDesc: { fontSize: '0.85rem', color: '#777', lineHeight: 1.5, margin: '0 0 1rem' },
  codeBlock: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '1rem', fontSize: '0.78rem', color: '#ccc', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: '0 0 1rem', flex: 1, fontFamily: 'ui-monospace, Consolas, monospace', maxHeight: '200px', overflow: 'auto' },
  copyBtn: { padding: '0.6rem', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', width: '100%' },
  lockedBlock: { background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '10px', padding: '2rem', textAlign: 'center', color: '#555', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center', marginBottom: '1rem' },
  lockIcon: { fontSize: '1.5rem' },
  unlockBtn: { padding: '0.6rem', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', width: '100%' },
  empty: { textAlign: 'center', color: '#555', padding: '3rem', fontSize: '1rem' },
  ctaSection: { textAlign: 'center', padding: '4rem 0 2rem', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '3rem' },
  ctaHeading: { fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' },
  ctaSub: { color: '#777', marginBottom: '2rem' },
  ctaBtn: { padding: '0.9rem 2.5rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease' },
  footer: { textAlign: 'center', padding: '2rem', color: '#444', fontSize: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
}
