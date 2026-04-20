import { Home } from 'lucide-react'

/**
 * Fair Housing Act + Florida fair housing compliance notice.
 * Required anywhere the site advertises rentals or processes applications.
 *
 * FL license number is pulled from VITE_FL_LICENSE_NUMBER so we can set it
 * once in env and keep it out of source. Florida F.A.C. Rule 61J2-10.025
 * requires a licensee's registered name + license number in real estate
 * advertising. Leave the env unset → the license-number line is suppressed
 * rather than rendering a placeholder (we'd rather show nothing than a lie).
 */
const FL_LICENSE_NUMBER = import.meta.env?.VITE_FL_LICENSE_NUMBER || ''

export default function FairHousingNotice({ compact = false }) {
  if (compact) {
    return (
      <div style={s.compact}>
        <Home size={13} color="#c8a76b" />
        <span>
          Equal Housing Opportunity. We comply with the federal Fair Housing
          Act and Florida fair housing laws.
          {FL_LICENSE_NUMBER && ` FL RE License #${FL_LICENSE_NUMBER}.`}
        </span>
      </div>
    )
  }

  return (
    <aside style={s.card} role="note" aria-label="Fair Housing Notice">
      <div style={s.header}>
        <div style={s.icon}><Home size={14} color="#c8a76b" /></div>
        <span style={s.title}>Equal Housing Opportunity</span>
      </div>
      <p style={s.body}>
        Elias Karam is a licensed Florida real estate agent
        {FL_LICENSE_NUMBER && ` (FL RE License #${FL_LICENSE_NUMBER})`} and
        complies with the federal Fair Housing Act and Florida fair housing
        laws. We do not discriminate based on race, color, religion, sex,
        national origin, familial status, disability, sexual orientation,
        gender identity, or any other class protected by law. All advertised
        rentals are subject to landlord approval, availability, and credit /
        background screening.
      </p>
    </aside>
  )
}

const s = {
  card: {
    marginTop: '2rem',
    padding: '1.1rem 1.2rem',
    borderRadius: '12px',
    border: '1px solid rgba(200,167,107,0.2)',
    background: 'rgba(200,167,107,0.04)',
    maxWidth: '760px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    marginBottom: '0.5rem',
  },
  icon: {
    width: '24px',
    height: '24px',
    borderRadius: '6px',
    background: 'rgba(200,167,107,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#c8a76b',
    fontSize: '0.78rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  body: {
    color: '#9ca3af',
    fontSize: '0.85rem',
    lineHeight: 1.6,
    margin: 0,
  },
  compact: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    fontSize: '0.75rem',
    color: '#9ca3af',
    lineHeight: 1.5,
  },
}
