import Navbar from '../components/Navbar'

const EFFECTIVE = 'April 15, 2026'
const OWNER_EMAIL = 'elias@claudefo.com'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={s.page}>
        <div style={s.inner}>
          <span style={s.eyebrow}>Legal</span>
          <h1 style={s.h1}>Terms of Service</h1>
          <p style={s.meta}>Effective {EFFECTIVE}</p>

          <Section title="1. Agreement">
            By using Claude.FO (“the site”) you agree to these terms. If you
            don't agree, don't use the site. The site is operated by Elias
            Karam, a licensed Florida real estate agent, based in Miami-Dade
            County. Contact: <a href={`mailto:${OWNER_EMAIL}`} style={s.link}>{OWNER_EMAIL}</a>.
          </Section>

          <Section title="2. What we offer">
            <ul style={s.list}>
              <li><b>Free tools</b> — calculators and checklists provided
              for convenience. They are not financial, tax, or legal advice.</li>
              <li><b>Digital products</b> — prompt packs and downloads sold
              through the store. License granted is non-transferable and
              for personal or single-business use unless otherwise stated.</li>
              <li><b>Real estate services</b> — rental applications, buyer /
              seller representation, and property showings in Miami-Dade,
              performed under Elias Karam's active Florida real estate license.</li>
              <li><b>AI consulting</b> — advisory and implementation
              services scoped in a separate written engagement.</li>
            </ul>
          </Section>

          <Section title="3. Payments">
            Card payments are processed by Stripe; crypto payments by
            NOWPayments. You authorize us to charge the payment method
            you provide. All prices are in USD unless labeled otherwise.
            Taxes are calculated where applicable.
          </Section>

          <Section title="4. Refunds">
            <ul style={s.list}>
              <li><b>Digital products</b> — all sales are final once the
              download link has been issued, due to the digital nature of
              the product. If you never received access, email us within 7
              days and we'll refund in full.</li>
              <li><b>Rental application fee ($200)</b> — non-refundable
              once the application has been transmitted to a landlord or
              screening partner. If we fail to submit your application, a
              full refund is issued.</li>
              <li><b>Strategy call ($97)</b> — refundable up to 24 hours
              before the scheduled time. The fee is credited toward any
              service engagement booked within 30 days of the call.</li>
              <li><b>Custom consulting</b> — governed by the written
              engagement agreement.</li>
            </ul>
          </Section>

          <Section title="5. No guarantee of outcomes">
            Real estate outcomes (lease approval, offer acceptance, sale
            price) depend on landlords, lenders, market conditions, and
            other parties outside our control. AI consulting results depend
            on your team, data, and execution. We make no guarantees of
            specific financial or business outcomes.
          </Section>

          <Section title="6. Fair Housing &amp; Equal Opportunity">
            We comply with the federal Fair Housing Act and all Florida fair
            housing laws. We do not discriminate based on race, color,
            religion, sex, national origin, familial status, disability,
            sexual orientation, gender identity, or any other protected
            class. See the Fair Housing notice on rental pages for details.
          </Section>

          <Section title="7. Acceptable use">
            Don't scrape, reverse-engineer, or abuse the site. Don't upload
            malicious content. Don't impersonate others. Don't submit
            fraudulent rental applications — we verify and report fraud to
            landlords and, where applicable, law enforcement.
          </Section>

          <Section title="8. Intellectual property">
            Content, design, and code on this site are owned by Elias Karam
            unless otherwise noted. Purchase of a digital product grants a
            limited license — it does not transfer ownership.
          </Section>

          <Section title="9. Liability">
            To the maximum extent allowed by Florida law, our liability for
            any claim arising from your use of the site is limited to the
            amount you paid us in the 12 months preceding the claim. We are
            not liable for indirect or consequential damages.
          </Section>

          <Section title="10. Governing law">
            These terms are governed by the laws of the State of Florida.
            Disputes will be resolved in the state or federal courts
            located in Miami-Dade County, Florida.
          </Section>

          <Section title="11. Changes">
            We may update these terms. Continued use of the site after
            changes are posted constitutes acceptance.
          </Section>

          <Section title="12. Contact">
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
}
