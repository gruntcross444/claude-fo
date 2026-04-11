import { useState, useEffect, useRef } from 'react'

export default function useTypingEffect(texts, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2000) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Stable ref so the array reference doesn't restart the effect on every render
  const textsRef = useRef(texts)
  useEffect(() => { textsRef.current = texts }, [texts])

  // Separate ref for the pause timeout so it can be cleaned up independently
  const pauseTimeoutRef = useRef(null)

  useEffect(() => {
    const current = textsRef.current[textIndex]
    if (!current) return

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)

        if (charIndex + 1 === current.length) {
          pauseTimeoutRef.current = setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)

        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setTextIndex((textIndex + 1) % textsRef.current.length)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => {
      clearTimeout(timeout)
      clearTimeout(pauseTimeoutRef.current)
    }
  }, [charIndex, isDeleting, textIndex, typingSpeed, deletingSpeed, pauseTime])
  // NOTE: `texts` intentionally excluded — we use textsRef to avoid restarting the animation

  return displayText
}
