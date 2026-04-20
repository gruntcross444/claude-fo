import { useState, useEffect, useRef } from 'react'

export default function useCounter(end, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let rafId = null
    let triggered = false // closure guard — avoids resetting if IO fires twice

    const observer = new IntersectionObserver(
      ([entry]) => {
        // threshold:0 fires on first pixel; Reveal's translateY previously
        // pushed items below the fold before the 0.3 threshold was ever met
        if (!entry.isIntersecting || triggered) return
        triggered = true
        observer.disconnect()

        const startTime = performance.now()
        const tick = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
          setCount(Math.round(eased * end))
          if (progress < 1) rafId = requestAnimationFrame(tick)
        }
        rafId = requestAnimationFrame(tick)
      },
      { threshold: 0 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [end, duration])

  return [ref, count]
}
