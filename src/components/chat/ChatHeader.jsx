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
        background: '#fff',
        borderBottom: '1px solid #F1F5F9',
        zIndex: 10,
        minHeight: 58,
      }}
    >
      {/* Menu hamburger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onMenuOpen}
        style={iconBtn}
      >
        <Menu size={20} color="#374151" />
      </motion.button>

      {/* Center: Logo + Title */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <MadiOpsLogo size={28} />
        {title && (
          <span style={{
            fontSize: 14, fontWeight: 600, color: '#374151',
            maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {title}
          </span>
        )}
      </div>

      {/* New chat */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onNewChat}
        style={iconBtn}
        title="Nouvelle discussion"
      >
        <Plus size={20} color="#374151" strokeWidth={2.5} />
      </motion.button>
    </motion.header>
  )
}

const iconBtn = {
  width: 38, height: 38, borderRadius: 12,
  background: '#F8FAFC', border: '1px solid #F1F5F9',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0,
}
