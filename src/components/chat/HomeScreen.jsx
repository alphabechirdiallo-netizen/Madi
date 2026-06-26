import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, MessageSquare, Clock, TrendingUp, ChevronRight, Sparkles } from 'lucide-react'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'
import { WorldBanner } from '../ui/WorldBanner'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 2) return "À l'instant"
  if (mins < 60) return `Il y a ${mins} min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const GRADIENTS = [
  'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
  'linear-gradient(135deg, #F093FB 0%, #764BA2 100%)',
  'linear-gradient(135deg, #667EEA 0%, #06B6D4 100%)',
  'linear-gradient(135deg, #10B981 0%, #667EEA 100%)',
  'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
  'linear-gradient(135deg, #764BA2 0%, #F093FB 100%)',
]

export function HomeScreen({ conversations, onSelect, onNewChat, profile, stats, onOpenGallery }) {
  const displayName = profile?.pseudo || profile?.full_name?.split(' ')[0] || 'toi'
  const totalMessages = stats?.total_messages || 0
  const totalTime = stats?.total_time_seconds || 0
  const score = stats?.improvement_score || 0
  const hours = Math.floor(totalTime / 3600)
  const mins = Math.floor((totalTime % 3600) / 60)

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 100px', position: 'relative' }}>

      {/* Header greeting */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <MadiOpsLogo size={44} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#1A1040', lineHeight: 1.1 }}>
              Bonjour, {displayName} 👋
            </div>
            <div style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, marginTop: 2 }}>
              MadiOps est prêt à t'accompagner
            </div>
          </div>
        </div>

        {/* Stats rapides */}
        {totalMessages > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: MessageSquare, label: `${totalMessages} messages`, color: '#667EEA' },
              { icon: Clock, label: hours > 0 ? `${hours}h ${mins}min` : `${mins} min`, color: '#764BA2' },
              { icon: TrendingUp, label: `Score ${score}%`, color: '#10B981' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.75)', borderRadius: 12, padding: '8px 10px',
                border: '1px solid rgba(102,126,234,0.12)',
                boxShadow: '0 2px 8px rgba(102,126,234,0.06)',
              }}>
                <Icon size={13} color={color} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', whiteSpace: 'nowrap' }}>{label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Bouton Nouvelle discussion */}
      <motion.button
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        whileTap={{ scale: 0.97 }}
        whileHover={{ boxShadow: '0 8px 30px rgba(102,126,234,0.50)' }}
        onClick={onNewChat}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          padding: '18px 24px', borderRadius: 20, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
          color: '#fff', fontSize: 17, fontWeight: 900,
          boxShadow: '0 6px 24px rgba(102,126,234,0.45)',
          marginBottom: 22, transition: 'box-shadow 0.2s',
        }}
      >
        <Plus size={22} strokeWidth={3} />
        Nouvelle discussion
      </motion.button>

      {/* Bandeau World */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <WorldBanner onOpenGallery={onOpenGallery} />
      </motion.div>

      {/* Conversations */}
      {conversations.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ textAlign: 'center', padding: '32px 20px' }}>
          <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 3, repeat: Infinity }}>
            <Sparkles size={48} color="#667EEA" style={{ marginBottom: 14 }} />
          </motion.div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#1A1040', marginBottom: 8 }}>
            Commence ta première conversation
          </div>
          <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6 }}>
            MadiOps est prêt à t'accompagner dans tous tes projets d'investissement et bien plus encore
          </div>
        </motion.div>
      ) : (
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            Tes conversations
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {conversations.slice(0, 20).map((conv, i) => (
              <ConvBubble key={conv.id} conv={conv} index={i} gradient={GRADIENTS[i % GRADIENTS.length]} onSelect={onSelect} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ConvBubble({ conv, index, gradient, onSelect }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 22 }}
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -3, boxShadow: '0 12px 32px rgba(102,126,234,0.22)' }}
      onClick={() => onSelect(conv.id)}
      style={{
        width: '100%', textAlign: 'left', cursor: 'pointer',
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255,255,255,0.9)',
        borderRadius: 20, padding: '16px 18px',
        boxShadow: '0 4px 16px rgba(102,126,234,0.10)',
        display: 'flex', alignItems: 'center', gap: 14,
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        width: 46, height: 46, borderRadius: 14, flexShrink: 0,
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 3px 12px rgba(102,126,234,0.25)',
      }}>
        <MessageSquare size={20} color="#fff" strokeWidth={2.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1A1040', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>
          {conv.title}
        </div>
        <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>
          {timeAgo(conv.last_message_at || conv.updated_at)}
        </div>
      </div>
      <ChevronRight size={18} color="#C4B5FD" strokeWidth={2.5} />
    </motion.button>
  )
}
