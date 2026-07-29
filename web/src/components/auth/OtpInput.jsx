import { useCallback, useEffect, useRef } from 'react'

/**
 * Six single-digit OTP boxes with auto-focus, backspace, and paste support.
 */
export default function OtpInput({
  length = 6,
  value = '',
  onChange,
  disabled = false,
  autoFocus = true,
}) {
  const digits = Array.from({ length }, (_, i) => value[i] || '')
  const refs = useRef([])

  useEffect(() => {
    if (autoFocus && refs.current[0]) {
      refs.current[0].focus()
    }
  }, [autoFocus])

  const emit = useCallback(
    (chars) => {
      const cleaned = chars.replace(/\D/g, '').slice(0, length)
      onChange?.(cleaned)
    },
    [length, onChange]
  )

  const handleChange = (index, e) => {
    const raw = e.target.value.replace(/\D/g, '')
    if (!raw) {
      const next = digits.map((d, i) => (i === index ? '' : d))
      emit(next.join(''))
      return
    }

    if (raw.length > 1) {
      const next = digits.slice()
      for (let i = 0; i < raw.length && index + i < length; i += 1) {
        next[index + i] = raw[i]
      }
      emit(next.join(''))
      refs.current[Math.min(index + raw.length, length - 1)]?.focus()
      return
    }

    const next = digits.map((d, i) => (i === index ? raw : d))
    emit(next.join(''))
    if (index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? '' : d))
        emit(next.join(''))
      } else if (index > 0) {
        const next = digits.map((d, i) => (i === index - 1 ? '' : d))
        emit(next.join(''))
        refs.current[index - 1]?.focus()
      }
      return
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      refs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      refs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    emit(pasted)
    refs.current[Math.min(pasted.length, length) - 1]?.focus()
  }

  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${index + 1} of ${length}`}
          className="h-12 w-10 rounded-xl border border-border bg-white text-center text-lg font-bold text-ink outline-none transition focus:border-orange/50 focus:ring-4 focus:ring-orange/10 disabled:opacity-50 sm:h-14 sm:w-12 sm:text-xl"
        />
      ))}
    </div>
  )
}
