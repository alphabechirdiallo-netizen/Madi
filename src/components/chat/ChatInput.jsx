import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp, Square, Paperclip, Mic } from 'lucide-react'

export function ChatInput({ onSend, disabled, streaming, onStop }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  // Auto-resize textarea
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim().length > 0 && !disabled

  return (
    <div style={{
      padding: '8px 12px 12px',
      background: '#fff',
      borderTop: '1px solid #F1F5F9',
    }}>
      <motion.div
        animate={{
          boxShadow: value
            ? '0 2px 16px rgba(37,99,235,0.10), 0 0 0 1.5px #BFDBFE'
            : '0 1px 6px rgba(0,0,0,0.06), 0 0 0 1px #E2E8F0',
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          background: '#F8FAFC',
          borderRadius: 22,
          padding: '8px 8px 8px 16px',
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
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 15,
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1.55,
            color: '#0F172A',
            padding: '4px 0',
            maxHeight: 180,
            overflowY: 'auto',
            caretColor: '#2563EB',
          }}
        />

        {/* Send / Stop button */}
        <AnimatePresence mode="wait">
          {streaming ? (
            <motion.button
              key="stop"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              whileTap={{ scale: 0.9 }}
              onClick={onStop}
              style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: '#FF6800', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(255,104,0,0.35)',
              }}
            >
              <Square size={14} fill="#fff" color="#fff" />
            </motion.button>
          ) : (
            <motion.button
              key="send"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              whileTap={{ scale: canSend ? 0.9 : 1 }}
              onClick={handleSend}
              disabled={!canSend}
              style={{
                width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                background: canSend ? '#2563EB' : '#E2E8F0',
                border: 'none', cursor: canSend ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s, box-shadow 0.2s',
                boxShadow: canSend ? '0 2px 8px rgba(37,99,235,0.35)' : 'none',
              }}
            >
              <ArrowUp size={18} color={canSend ? '#fff' : '#94A3B8'} strokeWidth={2.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <p style={{
        textAlign: 'center', fontSize: 11, color: '#CBD5E1',
        marginTop: 8, lineHeight: 1.4,
      }}>
        MadiOps peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  )
}
