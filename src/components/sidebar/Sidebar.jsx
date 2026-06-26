import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, LogOut, User, BarChart2, FileText, Brain,
  MessageSquare, Home, ChevronRight, TrendingUp, Globe
} from 'lucide-react'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar({
  open, onClose,
  onGoHome, onShowProfile, onShowStats,
  onSummarize, onShowMemory, onShowWorld,
  activeConvId,
  profile, stats,
}) {
  const { user, signOut } = useAuth()
  const avatarUrl = profile?.avatar_custom_url || user?.user_metadata?.avatar_url
  const displayName = profile?.pseudo || profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'
  const score = stats?.improvement_score || 0
  const totalMessages = stats?.total_messages || 0

  const FEATURES = [
    { id: 'home', icon: Home, label: 'Accueil', sub: 'Tes conversations', color: '#667EEA', bg: 'rgba(102,126,234,0.10)', action: () => { onGoHome(); onClose() } },
    { id: 'profile', icon: User, label: 'Mon Profil', sub: 'Photo, pseudo, ambition', color: '#764BA2', bg: 'rgba(118,75,162,0.10)', action: () => { onShowProfile(); onClose() } },
    { id: 'stats', icon: BarChart2, label: 'Mes Statistiques', sub: `${totalMessages} messages • Score ${score}%`, color: '#10B981', bg: 'rgba(16,185,129,0.10)', action: () => { onShowStats(); onClose() } },
    { id: 'summarize', icon: FileText, label: 'Résumer la conversation', sub: activeConvId ? 'Résumer la conversation actuelle' : 'Ouvre une conversation d\'abord', color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', action: () => { if (activeConvId) { onSummarize(); onClose() } }, disabled: !activeConvId },
    { id: 'memory', icon: Brain, label: 'Mémoire de MadiOps', sub: 'Ce que MadiOps sait de toi', color: '#F093FB', bg: 'rgba(240,147,251,0.10)', action: () => { onShowMemory(); onClose() } },
    { id: 'world', icon: Globe, label: 'MadiOps World', sub: 'Évasion, culture & beauté du monde', color: '#10B981', bg: 'rgba(16,185,129,0.10)', action: () => { onShowWorld(); onClose() } },
  ]

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(26,16,64,0.28)', backdropFilter: 'blur(4px)' }} />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          width: 'var(--sidebar-width)',
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderRight: '1px solid rgba(102,126,234,0.12)',
          boxShadow: '4px 0 40px rgba(102,126,234,0.14)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '18px 14px 14px', borderBottom: '1px solid rgba(102,126,234,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <MadiOpsLogo size={30} showName nameSize="sm" />
            <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
              style={{ border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(102,126,234,0.08)' }}>
              <X size={15} color="#667EEA" />
            </motion.button>
          </div>
        </div>

        {score > 0 && (
          <div style={{ padding: '12px 14px 0' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.10), rgba(240,147,251,0.10))', border: '1px solid rgba(102,126,234,0.15)', borderRadius: 14, padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <TrendingUp size={14} color="#667EEA" />
                <span style={{ fontSize: 11, color: '#667EEA', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score d'amélioration</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(102,126,234,0.12)', borderRadius: 3 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #667EEA, #764BA2)' }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#667EEA' }}>{score}%</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 10px' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#C4B5FD', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 8px 12px' }}>
            Fonctionnalités
          </div>
          {FEATURES.map((feat, i) => (
            <motion.button key={feat.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={feat.disabled ? undefined : feat.action}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 10px', borderRadius: 14, margin: '3px 0',
                background: 'transparent', border: 'none', cursor: feat.disabled ? 'not-allowed' : 'pointer',
                textAlign: 'left', opacity: feat.disabled ? 0.45 : 1, transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!feat.disabled) e.currentTarget.style.background = feat.bg }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ width: 42, height: 42, borderRadius: 13, flexShrink: 0, background: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <feat.icon size={19} color={feat.color} strokeWidth={2.2} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1040', marginBottom: 2 }}>{feat.label}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{feat.sub}</div>
              </div>
              <ChevronRight size={15} color="#C4B5FD" />
            </motion.button>
          ))}
        </div>

        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(102,126,234,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 14, background: 'rgba(102,126,234,0.06)' }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', background: avatarUrl ? 'transparent' : 'linear-gradient(135deg, #667EEA, #764BA2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(102,126,234,0.3)' }}>
              {avatarUrl ? <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontSize: 15, fontWeight: 800 }}>{displayName[0]?.toUpperCase()}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#1A1040', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
            <motion.button whileTap={{ scale: 0.88 }} onClick={signOut}
              style={{ border: 'none', borderRadius: 8, width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent' }}>
              <LogOut size={15} color="#9CA3AF" />
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
