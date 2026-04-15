import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Loader2, Shield, CheckCircle2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import FairHousingNotice from '../components/FairHousingNotice'
import { useLang } from '../i18n/LanguageContext'
import api from '../api'

// All buildings for the dropdown
const ALL_BUILDINGS = [
  { id: 'flaglerRiver', name: 'Flagler on the River' },
  { id: 'downtown5th', name: 'Downtown 5th' },
  { id: 'downtown1st', name: 'Downtown 1st' },
  { id: 'brickellHeights', name: 'Brickell Heights' },
  { id: 'riseBrickell', name: 'Rise Brickell' },
  { id: 'slsLux', name: 'SLS Lux Brickell' },
  { id: 'echoBrickell', name: 'Echo Brickell' },
  { id: 'reachBcc', name: 'Reach at Brickell City Centre' },
  { id: 'flatiron', name: 'Flatiron Brickell' },
  { id: 'ninaMiami', name: 'Nina at Miami Worldcenter' },
  { id: 'thePlaza', name: 'The Plaza on Brickell' },
  { id: 'miamiRiverWalk', name: 'Miami River Walk' },
  { id: 'brickellTen', name: 'Brickell Ten' },
]

const INITIAL_DATA = {
  // Step 1
  name: '', dob: '', ssn: '', phone: '', email: '', emergencyName: '', emergencyPhone: '',
  // Step 2
  address: '', city: '', state: 'FL', zip: '', currentRent: '', duration: '', landlordName: '', landlordPhone: '', moveReason: '',
  // Step 3
  employmentStatus: '', employer: '', jobTitle: '', monthlyIncome: '', supervisorName: '', supervisorPhone: '', jobDuration: '',
  // Step 4
  buildingId: '', buildingName: '', unitType: '', moveInDate: '', maxBudget: '', specialRequirements: '',
  // Step 5
  authCredit: false, authAccurate: false, authFee: false, authId: false,
}

export default function RentalApplicationPage() {
  const { t } = useLang()
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(() => {
    const buildingId = searchParams.get('building') || ''
    const buildingName = searchParams.get('name') || ''
    return { ...INITIAL_DATA, buildingId, buildingName }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(field, value) {
    setData((prev) => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  function canAdvance() {
    if (step === 1) return data.name && data.dob && data.ssn && data.phone && data.email
    if (step === 2) return data.address && data.city && data.state && data.zip
    if (step === 3) return data.employmentStatus && data.monthlyIncome
    if (step === 4) return data.buildingId && data.unitType && data.moveInDate
    if (step === 5) return data.authCredit && data.authAccurate && data.authFee && data.authId
    return true
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    // Build wizard data JSON (SSN included for email, redacted in DB)
    const wizardData = JSON.stringify({
      ...data,
      authCredit: undefined, authAccurate: undefined, authFee: undefined, authId: undefined,
    })

    try {
      // Step 1: Save application
      const appRes = await api.post('/rental-applications', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        building_id: data.buildingId,
        building_name: data.buildingName,
        wizard_data: wizardData,
      })

      // Step 2: Create Stripe checkout
      const checkoutRes = await api.post('/checkout', {
        product_id: 'rental-application',
        application_id: appRes.data.id,
      })

      // Step 3: Redirect to Stripe
      window.location.href = checkoutRes.data.url
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const progress = (step / 6) * 100

  return (
    <div style={s.page}>
      <Navbar />
      <div style={s.content}>
        <div style={s.glow} />

        {/* Progress */}
        <div style={s.progressWrap}>
          <div style={s.progressInfo}>
            <span style={s.stepLabel}>{t('application.step')} {step} {t('application.of')} 6</span>
            <span style={s.stepTitle}>
              {t(`application.step${step}Title`)}
            </span>
          </div>
          <div style={s.progressBar}>
            <div style={{ ...s.progressFill, width: `${progress}%` }} />
          </div>
        </div>

        {/* Card */}
        <div style={s.card}>
          <p style={s.stepSub}>{t(`application.step${step}Sub`)}</p>

          {error && <div style={s.errorBanner}>{error}</div>}

          {/* Step 1: Personal */}
          {step === 1 && (
            <div style={s.form}>
              <Field label={t('application.fullName')} value={data.name} onChange={(v) => update('name', v)} required />
              <div style={s.row}>
                <Field label={t('application.dob')} type="date" value={data.dob} onChange={(v) => update('dob', v)} required />
                <Field label={t('application.ssn')} value={data.ssn} onChange={(v) => update('ssn', v)} placeholder="XXX-XX-XXXX" required />
              </div>
              <p style={s.ssnNote}><Shield size={12} /> {t('application.ssnNote')}</p>
              <div style={s.row}>
                <Field label={t('application.phone')} type="tel" value={data.phone} onChange={(v) => update('phone', v)} required />
                <Field label={t('application.email')} type="email" value={data.email} onChange={(v) => update('email', v)} required />
              </div>
              <div style={s.row}>
                <Field label={t('application.emergencyName')} value={data.emergencyName} onChange={(v) => update('emergencyName', v)} />
                <Field label={t('application.emergencyPhone')} type="tel" value={data.emergencyPhone} onChange={(v) => update('emergencyPhone', v)} />
              </div>
            </div>
          )}

          {/* Step 2: Residence */}
          {step === 2 && (
            <div style={s.form}>
              <Field label={t('application.address')} value={data.address} onChange={(v) => update('address', v)} required />
              <div style={s.row}>
                <Field label={t('application.city')} value={data.city} onChange={(v) => update('city', v)} required />
                <Field label={t('application.state')} value={data.state} onChange={(v) => update('state', v)} required />
                <Field label={t('application.zip')} value={data.zip} onChange={(v) => update('zip', v)} required />
              </div>
              <div style={s.row}>
                <Field label={t('application.currentRent')} type="number" value={data.currentRent} onChange={(v) => update('currentRent', v)} />
                <Select label={t('application.duration')} value={data.duration} onChange={(v) => update('duration', v)} options={[
                  { value: '', label: '...' },
                  { value: 'under1', label: t('application.durationOptions.under1') },
                  { value: '1-2', label: t('application.durationOptions.one2') },
                  { value: '2-5', label: t('application.durationOptions.two5') },
                  { value: '5+', label: t('application.durationOptions.five') },
                ]} />
              </div>
              <div style={s.row}>
                <Field label={t('application.landlordName')} value={data.landlordName} onChange={(v) => update('landlordName', v)} />
                <Field label={t('application.landlordPhone')} type="tel" value={data.landlordPhone} onChange={(v) => update('landlordPhone', v)} />
              </div>
              <Field label={t('application.moveReason')} value={data.moveReason} onChange={(v) => update('moveReason', v)} textarea />
            </div>
          )}

          {/* Step 3: Employment */}
          {step === 3 && (
            <div style={s.form}>
              <Select label={t('application.employmentStatus')} value={data.employmentStatus} onChange={(v) => update('employmentStatus', v)} required options={[
                { value: '', label: '...' },
                { value: 'employed', label: t('application.employmentOptions.employed') },
                { value: 'self-employed', label: t('application.employmentOptions.selfEmployed') },
                { value: 'student', label: t('application.employmentOptions.student') },
                { value: 'retired', label: t('application.employmentOptions.retired') },
                { value: 'other', label: t('application.employmentOptions.other') },
              ]} />
              <div style={s.row}>
                <Field label={t('application.employer')} value={data.employer} onChange={(v) => update('employer', v)} />
                <Field label={t('application.jobTitle')} value={data.jobTitle} onChange={(v) => update('jobTitle', v)} />
              </div>
              <div style={s.row}>
                <Field label={t('application.monthlyIncome')} type="number" value={data.monthlyIncome} onChange={(v) => update('monthlyIncome', v)} required />
                <Select label={t('application.jobDuration')} value={data.jobDuration} onChange={(v) => update('jobDuration', v)} options={[
                  { value: '', label: '...' },
                  { value: 'under1', label: t('application.durationOptions.under1') },
                  { value: '1-2', label: t('application.durationOptions.one2') },
                  { value: '2-5', label: t('application.durationOptions.two5') },
                  { value: '5+', label: t('application.durationOptions.five') },
                ]} />
              </div>
              <div style={s.row}>
                <Field label={t('application.supervisorName')} value={data.supervisorName} onChange={(v) => update('supervisorName', v)} />
                <Field label={t('application.supervisorPhone')} type="tel" value={data.supervisorPhone} onChange={(v) => update('supervisorPhone', v)} />
              </div>
            </div>
          )}

          {/* Step 4: Building */}
          {step === 4 && (
            <div style={s.form}>
              <Select label={t('application.building')} value={data.buildingId} onChange={(v) => {
                const b = ALL_BUILDINGS.find((x) => x.id === v)
                update('buildingId', v)
                if (b) update('buildingName', b.name)
              }} required options={[
                { value: '', label: t('application.selectBuilding') },
                ...ALL_BUILDINGS.map((b) => ({ value: b.id, label: b.name })),
              ]} />
              <div style={s.row}>
                <Select label={t('application.unitType')} value={data.unitType} onChange={(v) => update('unitType', v)} required options={[
                  { value: '', label: '...' },
                  { value: 'studio', label: t('application.unitOptions.studio') },
                  { value: '1br', label: t('application.unitOptions.one') },
                  { value: '2br', label: t('application.unitOptions.two') },
                  { value: '3br', label: t('application.unitOptions.three') },
                ]} />
                <Field label={t('application.moveInDate')} type="date" value={data.moveInDate} onChange={(v) => update('moveInDate', v)} required />
              </div>
              <Field label={t('application.maxBudget')} type="number" value={data.maxBudget} onChange={(v) => update('maxBudget', v)} />
              <Field label={t('application.specialRequirements')} value={data.specialRequirements} onChange={(v) => update('specialRequirements', v)} textarea />
            </div>
          )}

          {/* Step 5: Authorization */}
          {step === 5 && (
            <div style={s.form}>
              <Checkbox label={t('application.authCredit')} checked={data.authCredit} onChange={(v) => update('authCredit', v)} />
              <Checkbox label={t('application.authAccurate')} checked={data.authAccurate} onChange={(v) => update('authAccurate', v)} />
              <Checkbox label={t('application.authFee')} checked={data.authFee} onChange={(v) => update('authFee', v)} />
              <Checkbox label={t('application.authId')} checked={data.authId} onChange={(v) => update('authId', v)} />
            </div>
          )}

          {/* Step 6: Review & Pay */}
          {step === 6 && (
            <div style={s.form}>
              <ReviewSection title={t('application.reviewPersonal')} items={[
                [t('application.fullName'), data.name],
                [t('application.dob'), data.dob],
                [t('application.phone'), data.phone],
                [t('application.email'), data.email],
              ]} />
              <ReviewSection title={t('application.reviewResidence')} items={[
                [t('application.address'), `${data.address}, ${data.city}, ${data.state} ${data.zip}`],
                [t('application.currentRent'), data.currentRent ? `$${data.currentRent}` : '—'],
              ]} />
              <ReviewSection title={t('application.reviewEmployment')} items={[
                [t('application.employmentStatus'), data.employmentStatus],
                [t('application.employer'), data.employer || '—'],
                [t('application.monthlyIncome'), data.monthlyIncome ? `$${data.monthlyIncome}` : '—'],
              ]} />
              <ReviewSection title={t('application.reviewBuilding')} items={[
                [t('application.building'), data.buildingName],
                [t('application.unitType'), data.unitType],
                [t('application.moveInDate'), data.moveInDate],
              ]} />
              <div style={s.feeCard}>
                <h4 style={s.feeTitle}>{t('application.feeBreakdown')}</h4>
                <div style={s.feeRow}><span>{t('application.appFee')}</span><span>$150.00</span></div>
                <div style={s.feeRow}><span>{t('application.processingFee')}</span><span>$50.00</span></div>
                <div style={s.feeDivider} />
                <div style={{ ...s.feeRow, fontWeight: 700, color: '#f3f4f6' }}><span>{t('application.total')}</span><span>$200.00</span></div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={s.nav}>
            {step > 1 && (
              <button style={s.backBtn} onClick={() => setStep(step - 1)}>
                <ArrowLeft size={16} /> {t('application.back')}
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 6 ? (
              <button style={{ ...s.nextBtn, opacity: canAdvance() ? 1 : 0.4 }} disabled={!canAdvance()} onClick={() => setStep(step + 1)}>
                {t('application.next')} <ArrowRight size={16} />
              </button>
            ) : (
              <button style={{ ...s.payBtn, opacity: loading ? 0.6 : 1 }} disabled={loading} onClick={handleSubmit}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> {t('application.submitting')}</> : <>{t('application.paySubmit')} <ArrowRight size={16} /></>}
              </button>
            )}
          </div>
        </div>

        {/* Fair Housing notice — required on rental applications */}
        <div style={{ marginTop: '1.5rem' }}>
          <FairHousingNotice />
        </div>
      </div>
    </div>
  )
}

// ── Reusable form components ────────────────────────────────────

function Field({ label, value, onChange, type = 'text', required, placeholder, textarea }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <label style={s.label}>
      {label} {required && <span style={{ color: '#c8a76b' }}>*</span>}
      <Tag
        type={textarea ? undefined : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        style={{ ...s.input, ...(textarea ? { minHeight: '80px', resize: 'vertical' } : {}) }}
      />
    </label>
  )
}

function Select({ label, value, onChange, options, required }) {
  return (
    <label style={s.label}>
      {label} {required && <span style={{ color: '#c8a76b' }}>*</span>}
      <select value={value} onChange={(e) => onChange(e.target.value)} required={required} style={s.select}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  )
}

function Checkbox({ label, checked, onChange }) {
  return (
    <div style={s.checkRow} onClick={() => onChange(!checked)}>
      <div style={{ ...s.checkbox, ...(checked ? s.checkboxChecked : {}) }}>
        {checked && <CheckCircle2 size={16} color="#fff" />}
      </div>
      <span style={s.checkLabel}>{label}</span>
    </div>
  )
}

function ReviewSection({ title, items }) {
  return (
    <div style={s.reviewSection}>
      <h4 style={s.reviewTitle}>{title}</h4>
      {items.map(([label, value], i) => (
        <div key={i} style={s.reviewRow}>
          <span style={s.reviewLabel}>{label}</span>
          <span style={s.reviewValue}>{value || '—'}</span>
        </div>
      ))}
    </div>
  )
}

// ── Styles ───────────────────────────────────────────────────────

const s = {
  page: { minHeight: '100vh' },
  content: { maxWidth: '680px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) 1.5rem', position: 'relative' },
  glow: { position: 'absolute', top: '-50px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(200,167,107,0.08) 0%, transparent 70%)', pointerEvents: 'none' },

  // Progress
  progressWrap: { marginBottom: '2rem', position: 'relative' },
  progressInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.8rem' },
  stepLabel: { fontSize: '0.78rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.1em' },
  stepTitle: { fontSize: '1.2rem', fontWeight: 800, color: '#f3f4f6' },
  progressBar: { height: '4px', borderRadius: '999px', background: 'rgba(255,255,255,0.06)' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #c8a76b, #f0d89c)', transition: 'width 0.4s ease' },

  // Card
  card: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', backdropFilter: 'blur(8px)', position: 'relative' },
  stepSub: { color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem' },
  errorBanner: { padding: '0.8rem 1rem', borderRadius: '12px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', fontSize: '0.9rem', marginBottom: '1rem' },

  // Form
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  row: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))', gap: '1rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: '#ccc' },
  input: { padding: '0.7rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  select: { padding: '0.7rem 1rem', paddingRight: '2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: "rgba(255,255,255,0.04) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\") no-repeat right 0.75rem center / 1em 1em", color: '#fff', fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit', appearance: 'none', cursor: 'pointer' },
  ssnNote: { display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#666', marginTop: '-0.5rem' },

  // Checkboxes
  checkRow: { display: 'flex', alignItems: 'flex-start', gap: '0.8rem', padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer', transition: 'border-color 0.2s' },
  checkbox: { width: '24px', height: '24px', borderRadius: '8px', border: '2px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' },
  checkboxChecked: { background: '#10b981', borderColor: '#10b981' },
  checkLabel: { fontSize: '0.9rem', color: '#ccc', lineHeight: 1.5 },

  // Review
  reviewSection: { marginBottom: '0.5rem' },
  reviewTitle: { fontSize: '0.82rem', fontWeight: 700, color: '#c8a76b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' },
  reviewRow: { display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  reviewLabel: { fontSize: '0.85rem', color: '#888' },
  reviewValue: { fontSize: '0.85rem', color: '#f3f4f6', fontWeight: 500 },

  // Fee breakdown
  feeCard: { background: 'rgba(200,167,107,0.05)', border: '1px solid rgba(200,167,107,0.15)', borderRadius: '14px', padding: '1.2rem' },
  feeTitle: { fontSize: '0.85rem', fontWeight: 700, color: '#c8a76b', margin: '0 0 0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' },
  feeRow: { display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', fontSize: '0.9rem', color: '#aaa' },
  feeDivider: { height: '1px', background: 'rgba(200,167,107,0.2)', margin: '0.5rem 0' },

  // Navigation
  nav: { display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#aaa', fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' },
  nextBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.75rem 2rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.25)', transition: 'all 0.3s' },
  payBtn: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 2.5rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(200,167,107,0.3)', transition: 'all 0.3s' },
}
