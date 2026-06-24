import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

export function ReasoningPanel({ reasoning, isStreaming = false, defaultOpen = false }) {
  const [open, setOpen] = useState(isStreaming || defaultOpen)

  if (!reasoning && !isStreaming) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        marginBottom: 10,
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid #FED7AA',
        background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFBF5 100%)',
      }}
    >
      {/* Header */}
      <motion.button
        whileTap={{ scale: 0.99 }}
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        {/* Animated brain icon with glow */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <motion.div
            animate={isStreaming ? {
              boxShadow: ['0 0 0px rgba(255,104,0,0)', '0 0 12px rgba(255,104,0,0.4)', '0 0 0px rgba(255,104,0,0)']
            } : {}}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 26, height: 26, borderRadius: 8,
              background: isStreaming ? 'linear-gradient(135deg, #FF6800, #FB923C)' : '#FED7AA',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Brain size={14} color={isStreaming ? '#fff' : '#C2410C'} />
          </motion.div>
          {isStreaming && (
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{
                position: 'absolute', inset: 0, borderRadius: 8,
                background: 'rgba(255, 104, 0, 0.3)',
              }}
            />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {isStreaming ? (
              <ShimmerText text="MadiOps réfléchit..." />
            ) : (
              <span style={{ fontSize: 13, fontWeight: 600, color: '#C2410C' }}>
                Raisonnement de MadiOps
              </span>
            )}
            {isStreaming && <ThinkingDots />}
          </div>
          {!isStreaming && reasoning && (
            <div style={{ fontSize: 11, color: '#F97316', marginTop: 1 }}>
              {open ? 'Cliquer pour masquer' : 'Cliquer pour afficher'}
            </div>
          )}
        </div>

        <motion.div animate={{ rotate: open ? 0 : 180 }}>
          <ChevronUp size={16} color="#F97316" />
        </motion.div>
      </motion.button>

      {/* Content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 14px 14px',
              borderTop: '1px solid #FED7AA',
              marginTop: 0,
            }}>
              {/* Shimmer line separator */}
              <div style={{
                height: 1,
                background: 'linear-gradient(90deg, transparent, #FED7AA, transparent)',
                marginBottom: 12,
              }} />

              <div style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: '#92400E',
                fontFamily: 'Inter, sans-serif',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                position: 'relative',
              }}>
                {isStreaming ? (
                  <StreamingReasoningText text={reasoning} />
                ) : (
                  <span>{reasoning}</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function ShimmerText({ text }) {
  return (
    <span style={{
      fontSize: 13, fontWeight: 600,
      background: 'linear-gradient(90deg, #C2410C 0%, #FF6800 40%, #FB923C 60%, #C2410C 100%)',
      backgroundSize: '200% auto',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      animation: 'shimmer 2s linear infinite',
    }}>
      {text}
    </span>
  )
}

function StreamingReasoningText({ text }) {
  return (
    <span>
      {text}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        style={{
          display: 'inline-block', width: 2, height: '1em',
          background: '#FF6800', borderRadius: 1,
          verticalAlign: 'text-bottom', marginLeft: 1,
        }}
      />
    </span>
  )
}

function ThinkingDots() {
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          style={{
            width: 4, height: 4, borderRadius: '50%',
            background: '#FB923C',
          }}
        />
      ))}
    </div>
  )
}
