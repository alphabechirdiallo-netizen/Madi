import { motion } from 'framer-motion'
import { Menu, Plus } from 'lucide-react'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'

export function ChatHeader({ onMenuOpen, onNewChat, title }) {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(102,126,234,0.12)',
        zIndex: 10,
        minHeight: 58,
      }}
    >
      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ background: 'rgba(102,126,234,0.10)' }}
        onClick={onMenuOpen}
        style={iconBtn}
      >
        <Menu size={20} color="#667EEA" />
      </motion.button>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <MadiOpsLogo size={28} />
        {title && (
          <span style={{
            fontSize: 14, fontWeight: 600, color: '#1A1040',
            maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.88 }}
        whileHover={{ background: 'rgba(102,126,234,0.10)' }}
        onClick={onNewChat}
        style={iconBtn}
        title="Nouvelle discussion"
      >
        <Plus size={20} color="#667EEA" strokeWidth={2.5} />
      </motion.button>
    </motion.header>
  )
}

const iconBtn = {
  width: 38, height: 38, borderRadius: 12,
  background: 'rgba(255,255,255,0.7)',
  border: '1px solid rgba(102,126,234,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
  transition: 'all 0.15s',
}
