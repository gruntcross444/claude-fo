import { useState, useRef } from 'react'
import { Gift, X, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'
import { useLang } from '../i18n/LanguageContext'

const PRIZES = [
  { label: '50% OFF', color: '#c8a76b', weight: 1, code: 'SPIN50' },
  { label: '5% OFF', color: '#6366f1', weight: 15, code: 'SPIN5' },
  { label: 'Free Tool', color: '#10b981', weight: 10, code: 'FREETOOL' },
  { label: '15% OFF', color: '#a855f7', weight: 8, code: 'SPIN15' },
  { label: '10% OFF', color: '#f59e0b', weight: 12, code: 'SPIN10' },
  { label: 'Try Again', color: '#444', weight: 20, code: '' },
  { label: '25% OFF', color: '#ec4899', weight: 3, code: 'SPIN25' },
  { label: '5% OFF', color: '#6366f1', weight: 15, code: 'SPIN5' },
  { label: 'Free Guide', color: '#14b8a6', weight: 8, code: 'FREEGUIDE' },
  { label: '20% OFF', color: '#8b5cf6', weight: 5, code: 'SPIN20' },
  { label: '10% OFF', color: '#f59e0b', weight: 12, code: 'SPIN10' },
  { label: 'Free Prompt Pack', color: '#f43f5e', weight: 6, code: 'FREEPROMPTS' },
]

function getWeightedIndex() {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.weight, 0)
  let random = Math.random() * totalWeight
  for (let i = 0; i < PRIZES.length; i++) {
    random -= PRIZES[i].weight
    if (random <= 0) return i
  }
  return 0
}

export default function SpinWheel() {
  const [show, setShow] = useState(() => {
    if (sessionStorage.getItem('wheel_shown')) return false
    sessionStorage.setItem('wheel_shown', 'true')
    return true
  })
  const [email, setEmail] = useState('')
  const [phase, setPhase] = useState('email') // email → spinning → result
  const [rotation, setRotation] = useState(0)
  const [prize, setPrize] = useState(null)
  const [loading, setLoading] = useState(false)
  const wheelRef = useRef(null)
  const { isAuthenticated } = useAuth()
  const { t } = useLang()

  if (!show || isAuthenticated) return null

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const winIndex = getWeightedIndex()
    const wonPrize = PRIZES[winIndex]

    try {
      await api.post('/leads', {
        email,
        source: 'spin_wheel',
        prize: wonPrize.label,
        prize_code: wonPrize.code,
      })
    } catch { /* already captured */ }
    setLoading(false)

    const segmentAngle = 360 / PRIZES.length
    // Pointer is at top (270°). Segments start at 0° (3 o'clock).
    // To land segment winIndex under the pointer:
    // The center of segment winIndex is at (winIndex + 0.5) * segmentAngle degrees.
    // We need to rotate so that angle ends up at 270° (top).
    const segmentCenter = (winIndex + 0.5) * segmentAngle
    const targetAngle = 270 - segmentCenter
    const fullSpins = 360 * 8
    const finalRotation = fullSpins + targetAngle

    setPrize(wonPrize)
    setRotation(0)
    setPhase('spinning')

    // Delay rotation by 1 frame so the browser registers the transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRotation(finalRotation)
      })
    })

    setTimeout(() => {
      setPhase('result')
    }, 5500)
  }

  const segAngle = 360 / PRIZES.length

  return (
    <div style={s.backdrop}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} style={s.closeBtn}><X size={18} /></button>

        {phase === 'email' && (
          <div style={s.emailPhase}>
            <div style={s.giftIcon}><Gift size={36} color="#c8a76b" strokeWidth={1.5} /></div>
            <h2 style={s.heading}>{t('spinWheel.heading')}</h2>
            <p style={s.sub} dangerouslySetInnerHTML={{ __html: t('spinWheel.sub') }} />
            <form onSubmit={handleEmailSubmit} style={s.form}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={s.input} />
              <button type="submit" disabled={loading} style={s.spinStartBtn}>
                {loading ? t('spinWheel.loading') : t('spinWheel.btn')} {!loading && <ArrowRight size={14} />}
              </button>
            </form>
          </div>
        )}

        {(phase === 'spinning' || phase === 'result') && (
          <div style={s.wheelPhase}>
            <div style={s.wheelContainer}>
              {/* Pointer */}
              <div style={{ ...s.pointer, animation: phase === 'spinning' && rotation > 0 ? 'pointerPulse 0.15s infinite alternate' : 'none' }}>&#9660;</div>
              {/* Wheel */}
              <svg
                ref={wheelRef}
                viewBox="0 0 300 300"
                style={{
                  width: '100%',
                  height: '100%',
                  maxWidth: '300px',
                  maxHeight: '300px',
                  transform: `rotate(${rotation}deg)`,
                  transition: phase === 'spinning' && rotation > 0 ? 'transform 5s cubic-bezier(0.15, 0.60, 0.08, 1.00)' : 'none',
                  filter: phase === 'spinning' && rotation > 0 ? 'drop-shadow(0 0 20px rgba(200,167,107,0.3))' : 'none',
                }}
              >
                {PRIZES.map((p, i) => {
                  const startAngle = (i * segAngle * Math.PI) / 180
                  const endAngle = ((i + 1) * segAngle * Math.PI) / 180
                  const x1 = 150 + 140 * Math.cos(startAngle)
                  const y1 = 150 + 140 * Math.sin(startAngle)
                  const x2 = 150 + 140 * Math.cos(endAngle)
                  const y2 = 150 + 140 * Math.sin(endAngle)
                  const midAngle = ((i + 0.5) * segAngle * Math.PI) / 180
                  const tx = 150 + 90 * Math.cos(midAngle)
                  const ty = 150 + 90 * Math.sin(midAngle)
                  const textRotation = (i + 0.5) * segAngle

                  return (
                    <g key={i}>
                      <path
                        d={`M150,150 L${x1},${y1} A140,140 0 0,1 ${x2},${y2} Z`}
                        fill={p.color}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="1"
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="white"
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                      >
                        {p.label}
                      </text>
                    </g>
                  )
                })}
                <circle cx="150" cy="150" r="20" fill="#13141a" stroke="rgba(200,167,107,0.5)" strokeWidth="2" />
              </svg>
            </div>

            {phase === 'result' && prize && (
              <div style={s.resultSection}>
                <h2 style={s.resultHeading}>
                  {prize.label === 'Try Again' ? t('spinWheel.lostHeading') : t('spinWheel.wonHeading')}
                </h2>
                <div style={{ ...s.prizeDisplay, borderColor: prize.color }}>
                  <span style={{ ...s.prizeText, color: prize.color }}>{prize.label}</span>
                </div>
                <p style={s.resultSub}>
                  {prize.label === 'Try Again'
                    ? t('spinWheel.lostSub')
                    : t('spinWheel.wonSub')
                  }
                </p>
                <button onClick={() => setShow(false)} style={s.doneBtn}>
                  {prize.label === 'Try Again' ? t('spinWheel.lostBtn') : t('spinWheel.wonBtn')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' },
  modal: { background: '#13141a', border: '1px solid rgba(200,167,107,0.2)', borderRadius: '24px', padding: 'clamp(1rem, 4vw, 2rem)', maxWidth: 'min(440px, calc(100vw - 2rem))', width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', zIndex: 10 },

  emailPhase: { padding: '1rem 0' },
  giftIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
  heading: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center' },
  spinStartBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },

  wheelPhase: { padding: '0.5rem 0' },
  wheelContainer: { position: 'relative', width: 'min(300px, 100%)', aspectRatio: '1', margin: '0 auto 1.5rem' },
  pointer: { position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '24px', color: '#c8a76b', zIndex: 5, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' },

  resultSection: { padding: '0.5rem 0', animation: 'fadeInUp 0.5s ease' },
  resultHeading: { fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem' },
  prizeDisplay: { display: 'inline-block', padding: '0.6rem 2rem', borderRadius: '12px', border: '2px solid', background: 'rgba(255,255,255,0.03)', marginBottom: '1rem' },
  prizeText: { fontSize: '1.5rem', fontWeight: 800 },
  resultSub: { color: '#888', fontSize: '0.9rem', marginBottom: '1.2rem' },
  doneBtn: { padding: '0.7rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
}
