import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageSquare, Clock, TrendingUp, BarChart2, Zap } from 'lucide-react'

function formatTime(seconds) {
  if (!seconds) return '0 min'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}min`
  return `${m} min`
}

export function StatsPanel({ stats, onClose }) {
  const score = stats?.improvement_score || 0
  const totalMessages = stats?.total_messages || 0
  const totalTime = stats?.total_time_seconds || 0
  const sessions = stats?.total_sessions || 0

  const METRICS = [
    { icon: MessageSquare, label: 'Messages échangés', value: totalMessages, color: '#667EEA', bg: 'rgba(102,126,234,0.10)' },
    { icon: Clock, label: 'Temps total', value: formatTime(totalTime), color: '#764BA2', bg: 'rgba(118,75,162,0.10)' },
    { icon: Zap, label: 'Sessions', value: sessions, color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' },
    { icon: TrendingUp, label: 'Score d\'amélioration', value: `${score}%`, color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(26,16,64,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0 0 0 0' }}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 520,
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(24px)',
            borderRadius: '28px 28px 0 0',
            padding: '28px 20px 40px',
            boxShadow: '0 -8px 40px rgba(102,126,234,0.18)',
          }}
        >
          {/* Handle */}
          <div style={{ width: 40, height: 4, background: 'rgba(102,126,234,0.2)', borderRadius: 2, margin: '0 auto 20px' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#1A1040' }}>Mes Statistiques</div>
              <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>Ton activité sur MadiOps</div>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={onClose}
              style={{ width: 36, height: 36, borderRadius: 12, background: 'rgba(102,126,234,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} color="#667EEA" />
            </motion.button>
          </div>

          {/* Score principal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
            style={{
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              borderRadius: 20, padding: '20px 24px', marginBottom: 20,
              boxShadow: '0 6px 24px rgba(102,126,234,0.35)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <BarChart2 size={20} color="rgba(255,255,255,0.9)" />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Score d'amélioration global</span>
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: 10 }}>{score}<span style={{ fontSize: 24 }}>%</span></div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 4, height: 8 }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${score}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                style={{ height: '100%', borderRadius: 4, background: 'rgba(255,255,255,0.9)' }}
              />
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 8 }}>
              {score < 30 ? 'Continue à échanger avec MadiOps !' : score < 60 ? 'Tu progresses bien !' : score < 85 ? 'Excellent niveau !' : 'Tu es au top ! 🏆'}
            </div>
          </motion.div>

          {/* Métriques */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {METRICS.map(({ icon: Icon, label, value, color, bg }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.07 }}
                style={{ background: bg, borderRadius: 16, padding: '16px 16px', border: `1.5px solid ${color}18` }}
              >
                <Icon size={18} color={color} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1A1040', lineHeight: 1, marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
