import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square } from 'lucide-react'

export function ChatInput({ onSend, disabled, streaming, onStop }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 180) + 'px'
  }, [value])

  const handleSend = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div style={{
      padding: '10px 14px 14px',
      background: 'rgba(255,255,255,0.60)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(102,126,234,0.10)',
    }}>
      <motion.div
        animate={{
          boxShadow: value
            ? '0 4px 24px rgba(102,126,234,0.18), 0 0 0 1.5px rgba(102,126,234,0.35)'
            : '0 2px 12px rgba(102,126,234,0.08), 0 0 0 1px rgba(102,126,234,0.12)',
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'flex', alignItems: 'flex-end', gap: 8,
          background: 'rgba(255,255,255,0.88)',
          borderRadius: 24,
          padding: '8px 8px 8px 18px',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Posez votre question à MadiOps..."
          rows={1}
          disabled={disabled && !streaming}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            resize: 'none', fontSize: 15, fontFamily: 'Inter, sans-serif',
            lineHeight: 1.55, color: '#1A1040', padding: '6px 0',
            maxHeight: 180, overflowY: 'auto',
            caretColor: '#667EEA',
          }}
        />

        <AnimatePresence mode="wait">
          {streaming ? (
            <motion.button
              key="stop"
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
              whileTap={{ scale: 0.88 }}
              onClick={onStop}
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #FF6800, #FF9A3C)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(255,104,0,0.4)',
              }}
            >
              <Square size={14} fill="#fff" color="#fff" />
            </motion.button>
          ) : (
            <motion.button
              key="send"
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
              whileTap={{ scale: canSend ? 0.88 : 1 }}
              onClick={handleSend}
              disabled={!canSend}
              style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: canSend
                  ? 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)'
                  : 'rgba(203,213,225,0.6)',
                border: 'none', cursor: canSend ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: canSend ? '0 4px 14px rgba(102,126,234,0.45)' : 'none',
              }}
            >
              <ArrowUp size={18} color={canSend ? '#fff' : '#94A3B8'} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <p style={{
        textAlign: 'center', fontSize: 11,
        color: 'rgba(102,126,234,0.5)',
        marginTop: 8, lineHeight: 1.4,
      }}>
        MadiOps peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  )
}
