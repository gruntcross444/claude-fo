import { useState, useRef } from 'react'
import { Gift, X, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const PRIZES = [
  { label: '50% OFF', color: '#c8a76b', weight: 1 },
  { label: '5% OFF', color: '#6366f1', weight: 15 },
  { label: 'Free Tool', color: '#10b981', weight: 10 },
  { label: '15% OFF', color: '#a855f7', weight: 8 },
  { label: '10% OFF', color: '#f59e0b', weight: 12 },
  { label: 'Try Again', color: '#444', weight: 20 },
  { label: '25% OFF', color: '#ec4899', weight: 3 },
  { label: '5% OFF', color: '#6366f1', weight: 15 },
  { label: 'Free Guide', color: '#14b8a6', weight: 8 },
  { label: '20% OFF', color: '#8b5cf6', weight: 5 },
  { label: '10% OFF', color: '#f59e0b', weight: 12 },
  { label: 'Free Prompt Pack', color: '#f43f5e', weight: 6 },
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

  if (!show || isAuthenticated) return null

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/leads', { email, source: 'spin_wheel' })
    } catch { /* already captured */ }
    setLoading(false)
    setPhase('spinning')

    const winIndex = getWeightedIndex()
    const segmentAngle = 360 / PRIZES.length
    const targetAngle = 360 - (winIndex * segmentAngle + segmentAngle / 2)
    const fullSpins = 360 * 5
    const finalRotation = fullSpins + targetAngle

    setRotation(finalRotation)
    setPrize(PRIZES[winIndex])

    setTimeout(() => {
      setPhase('result')
    }, 4500)
  }

  const segAngle = 360 / PRIZES.length

  return (
    <div style={s.backdrop}>
      <div style={s.modal} onClick={(e) => e.stopPropagation()}>
        <button onClick={() => setShow(false)} style={s.closeBtn}><X size={18} /></button>

        {phase === 'email' && (
          <div style={s.emailPhase}>
            <div style={s.giftIcon}><Gift size={36} color="#c8a76b" strokeWidth={1.5} /></div>
            <h2 style={s.heading}>Spin to Win!</h2>
            <p style={s.sub}>Enter your email for a chance to win up to <strong>50% off</strong> or free products.</p>
            <form onSubmit={handleEmailSubmit} style={s.form}>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={s.input} />
              <button type="submit" disabled={loading} style={s.spinStartBtn}>
                {loading ? 'Loading...' : 'Spin the Wheel'} {!loading && <ArrowRight size={14} />}
              </button>
            </form>
          </div>
        )}

        {(phase === 'spinning' || phase === 'result') && (
          <div style={s.wheelPhase}>
            <div style={s.wheelContainer}>
              {/* Pointer */}
              <div style={s.pointer}>&#9660;</div>
              {/* Wheel */}
              <svg
                ref={wheelRef}
                width="300"
                height="300"
                viewBox="0 0 300 300"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: phase === 'spinning' ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
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
                  {prize.label === 'Try Again' ? 'So close!' : 'You won!'}
                </h2>
                <div style={{ ...s.prizeDisplay, borderColor: prize.color }}>
                  <span style={{ ...s.prizeText, color: prize.color }}>{prize.label}</span>
                </div>
                <p style={s.resultSub}>
                  {prize.label === 'Try Again'
                    ? 'No worries — sign up now and get 5% off automatically.'
                    : 'Your discount code has been sent to your email!'
                  }
                </p>
                <button onClick={() => setShow(false)} style={s.doneBtn}>
                  {prize.label === 'Try Again' ? 'Sign Up Anyway' : 'Continue Shopping'}
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
  modal: { background: '#13141a', border: '1px solid rgba(200,167,107,0.2)', borderRadius: '24px', padding: '2rem', maxWidth: '440px', width: '100%', textAlign: 'center', position: 'relative', overflow: 'hidden' },
  closeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#666', cursor: 'pointer', zIndex: 10 },

  emailPhase: { padding: '1rem 0' },
  giftIcon: { width: '72px', height: '72px', borderRadius: '20px', background: 'rgba(200,167,107,0.1)', border: '1px solid rgba(200,167,107,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' },
  heading: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' },
  sub: { color: '#888', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 },
  form: { display: 'flex', flexDirection: 'column', gap: '0.7rem' },
  input: { padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '1rem', outline: 'none', textAlign: 'center' },
  spinStartBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.8rem', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #c8a76b, #a88a4e)', color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' },

  wheelPhase: { padding: '0.5rem 0' },
  wheelContainer: { position: 'relative', width: '300px', height: '300px', margin: '0 auto 1.5rem' },
  pointer: { position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', fontSize: '24px', color: '#c8a76b', zIndex: 5, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' },

  resultSection: { padding: '0.5rem 0' },
  resultHeading: { fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.8rem' },
  prizeDisplay: { display: 'inline-block', padding: '0.6rem 2rem', borderRadius: '12px', border: '2px solid', background: 'rgba(255,255,255,0.03)', marginBottom: '1rem' },
  prizeText: { fontSize: '1.5rem', fontWeight: 800 },
  resultSub: { color: '#888', fontSize: '0.9rem', marginBottom: '1.2rem' },
  doneBtn: { padding: '0.7rem 2rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
}
