import Navbar from '../components/Navbar'

const EFFECTIVE = 'April 15, 2026'
const OWNER_EMAIL = 'elias@claudefo.com'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main style={s.page}>
        <div style={s.inner}>
          <span style={s.eyebrow}>Legal</span>
          <h1 style={s.h1}>Privacy Policy</h1>
          <p style={s.meta}>Effective {EFFECTIVE}</p>

          <Section title="1. Who we are">
            This site (“Claude.FO”, “we”, “us”) is operated by Elias Karam,
            a licensed Florida real estate agent and independent consultant
            based in Miami-Dade County, Florida. Questions about this policy
            can be sent to <a href={`mailto:${OWNER_EMAIL}`} style={s.link}>{OWNER_EMAIL}</a>.
          </Section>

          <Section title="2. What we collect">
            <ul style={s.list}>
              <li><b>Account data</b> — name, email, hashed password, and
              OAuth identifiers when you sign in with Google or Discord.</li>
              <li><b>Contact &amp; lead data</b> — anything you submit through
              forms on this site (contact form, tool email gates, exit-intent,
              lead magnets).</li>
              <li><b>Rental application data</b> — full legal name, date of
              birth, Social Security Number (SSN), employment information,
              rental history, and government-ID references. This data is
              required by landlords and screening partners to process a
              rental application.</li>
              <li><b>Payment data</b> — handled entirely by our payment
              processors (Stripe and NOWPayments). We never see or store
              your full card number, CVV, or crypto private keys.</li>
              <li><b>Usage data</b> — pages visited, approximate location
              (from IP), device/browser info, and referrer. Used to improve
              the site and detect abuse.</li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <ul style={s.list}>
              <li>Deliver products, tools, and services you request.</li>
              <li>Process rental applications and transmit required data to
              landlords, property managers, or third-party screening
              services you authorize.</li>
              <li>Send transactional email (receipts, application status,
              account activity) and — only if you opt in — marketing email.</li>
              <li>Comply with Florida real estate, tax, and anti-fraud law.</li>
            </ul>
          </Section>

          <Section title="4. How we protect sensitive data">
            Your Social Security Number is redacted to the last four digits
            (e.g. <code style={s.code}>***-**-1234</code>) in every
            notification email we send. Full SSN is only retained where
            legally required to process the application and is transmitted
            over encrypted (TLS) connections. Access is limited to the
            site operator and authorized screening partners.
          </Section>

          <Section title="5. Sharing with third parties">
            We share limited data only with vendors who help run the
            business:
            <ul style={s.list}>
              <li><b>Stripe, Inc.</b> — card payments.</li>
              <li><b>NOWPayments</b> — cryptocurrency payments.</li>
              <li><b>Resend</b> — transactional &amp; marketing email delivery.</li>
              <li><b>Calendly</b> — consultation scheduling.</li>
              <li><b>Render / Vercel</b> — hosting infrastructure.</li>
              <li>Landlords, property managers, or screening services you
              explicitly authorize via a rental application.</li>
            </ul>
            We do not sell personal data.
          </Section>

          <Section title="6. Your rights">
            You may request access, correction, or deletion of your personal
            data at any time by emailing{' '}
            <a href={`mailto:${OWNER_EMAIL}`} style={s.link}>{OWNER_EMAIL}</a>.
            We will respond within 30 days. Deletion may be restricted where
            we have a legal obligation to retain records (e.g. tax law,
            Florida real estate recordkeeping).
          </Section>

          <Section title="7. Cookies &amp; tracking">
            We use a minimal set of cookies: a session token for logged-in
            users and a dismiss flag for marketing banners. We do not use
            cross-site advertising cookies.
          </Section>

          <Section title="8. Children">
            This site is not directed at anyone under 18. We do not knowingly
            collect personal data from minors.
          </Section>

          <Section title="9. Changes">
            If we make material changes to this policy, we'll update the
            “Effective” date above and, for significant changes, notify
            active account holders by email.
          </Section>

          <Section title="10. Contact">
            Elias Karam — <a href={`mailto:${OWNER_EMAIL}`} style={s.link}>{OWNER_EMAIL}</a>
            <br />Miami, Florida, USA
          </Section>
        </div>
      </main>
    </>
  )
}

function Section({ title, children }) {
  return (
    <section style={s.section}>
      <h2 style={s.h2}>{title}</h2>
      <div style={s.body}>{children}</div>
    </section>
  )
}

const s = {
  page: { padding: '4rem 2rem 6rem', minHeight: 'calc(100vh - 80px)' },
  inner: { maxWidth: '760px', margin: '0 auto' },
  eyebrow: {
    display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '999px',
    border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.06)',
    color: '#a5b4fc', fontSize: '0.7rem', letterSpacing: '0.14em',
    fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem',
  },
  h1: {
    fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800,
    letterSpacing: '-0.02em', marginBottom: '0.4rem', color: '#f3f4f6',
  },
  meta: { color: '#6b7280', fontSize: '0.85rem', marginBottom: '3rem' },
  section: { marginBottom: '2.5rem' },
  h2: {
    fontSize: '1.1rem', fontWeight: 700, color: '#f3f4f6',
    marginBottom: '0.8rem', letterSpacing: '-0.01em',
  },
  body: { color: '#9ca3af', fontSize: '0.95rem', lineHeight: 1.7 },
  list: { paddingLeft: '1.2rem', margin: '0.5rem 0', display: 'grid', gap: '0.4rem' },
  link: { color: '#a5b4fc', textDecoration: 'none', borderBottom: '1px solid rgba(165,180,252,0.3)' },
  code: {
    padding: '0.1rem 0.4rem', borderRadius: '4px',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "ui-monospace, 'Cascadia Code', Consolas, monospace", fontSize: '0.85rem',
  },
}
