import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Archive, Trash2, Pencil, Check, X, ChevronRight, LogOut, MessageSquare, ArchiveIcon } from 'lucide-react'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar({ open, onClose, conversations, archivedConversations, activeId, onSelect, onCreate, onRename, onArchive, onDelete }) {
  const { user, signOut } = useAuth()
  const [showArchived, setShowArchived] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const renameRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setContextMenu(null) }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler) }
  }, [])

  useEffect(() => { if (renamingId && renameRef.current) renameRef.current.focus() }, [renamingId])

  const startRename = (conv) => { setContextMenu(null); setRenamingId(conv.id); setRenameValue(conv.title) }
  const commitRename = async (id) => { if (renameValue.trim()) await onRename(id, renameValue.trim()); setRenamingId(null) }

  const handleLongPress = (e, conv) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setContextMenu({ id: conv.id, conv, x: rect.left + 8, y: rect.bottom + 4 })
  }

  const avatarLetter = user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(26,16,64,0.25)', backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          width: 'var(--sidebar-width)',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(102,126,234,0.12)',
          boxShadow: '4px 0 32px rgba(102,126,234,0.12)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid rgba(102,126,234,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <MadiOpsLogo size={32} showName nameSize="sm" />
            <motion.button whileTap={{ scale: 0.88 }} onClick={onClose}
              style={{ ...iconBtn, background: 'rgba(102,126,234,0.08)' }}>
              <X size={15} color="#667EEA" />
            </motion.button>
          </div>

          {/* Nouvelle discussion — gradient pill */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ boxShadow: '0 6px 20px rgba(102,126,234,0.45)' }}
            onClick={async () => { const c = await onCreate(); if (c) { onSelect(c.id); onClose() } }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
              color: '#fff', border: 'none', borderRadius: 14,
              padding: '12px 18px', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
              transition: 'box-shadow 0.2s',
            }}
          >
            <Plus size={17} strokeWidth={2.5} />
            Nouvelle discussion
          </motion.button>
        </div>

        {/* Liste */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {conversations.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
              <MessageSquare size={30} style={{ marginBottom: 10, opacity: 0.4, color: '#667EEA' }} />
              <p style={{ fontSize: 13, fontWeight: 500 }}>Aucune discussion</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Commencez une nouvelle conversation</p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {conversations.map((conv, i) => (
              <ConvItem key={conv.id} conv={conv} active={conv.id === activeId}
                renaming={renamingId === conv.id} renameValue={renameValue}
                renameRef={renameRef} onRenameChange={setRenameValue}
                onRenameCommit={() => commitRename(conv.id)} onRenameCancel={() => setRenamingId(null)}
                onSelect={() => { onSelect(conv.id); onClose() }}
                onLongPress={(e) => handleLongPress(e, conv)}
                onContextMenu={(e) => { e.preventDefault(); handleLongPress(e, conv) }}
                index={i} />
            ))}
          </AnimatePresence>

          {/* Archives */}
          {archivedConversations.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowArchived(!showArchived)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer',
                  color: '#9CA3AF', fontSize: 11, fontWeight: 700,
                  borderRadius: 8, letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                <ArchiveIcon size={12} />
                Archives ({archivedConversations.length})
                <motion.div animate={{ rotate: showArchived ? 90 : 0 }} style={{ marginLeft: 'auto' }}>
                  <ChevronRight size={13} />
                </motion.div>
              </motion.button>
              <AnimatePresence>
                {showArchived && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
                    {archivedConversations.map((conv, i) => (
                      <ConvItem key={conv.id} conv={conv} active={conv.id === activeId} renaming={false}
                        onSelect={() => { onSelect(conv.id); onClose() }}
                        onLongPress={(e) => handleLongPress(e, conv)}
                        onContextMenu={(e) => { e.preventDefault(); handleLongPress(e, conv) }}
                        index={i} archived />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* User footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(102,126,234,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', borderRadius: 14,
            background: 'rgba(102,126,234,0.06)' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
              background: user?.user_metadata?.avatar_url ? 'transparent'
                : 'linear-gradient(135deg, #667EEA, #764BA2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(102,126,234,0.3)',
            }}>
              {user?.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{avatarLetter}</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1040', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
            <motion.button whileTap={{ scale: 0.88 }} onClick={signOut} title="Se déconnecter"
              style={{ ...iconBtn, background: 'transparent', flexShrink: 0 }}>
              <LogOut size={15} color="#9CA3AF" />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div ref={menuRef}
            initial={{ opacity: 0, scale: 0.90, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.90, y: -6 }} transition={{ duration: 0.14 }}
            style={{
              position: 'fixed',
              top: Math.min(contextMenu.y, window.innerHeight - 170),
              left: Math.min(contextMenu.x, window.innerWidth - 190),
              zIndex: 200,
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(102,126,234,0.18), 0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(102,126,234,0.12)',
              minWidth: 175,
            }}>
            {[
              { label: 'Renommer', Icon: Pencil, action: () => startRename(contextMenu.conv), color: '#1A1040' },
              { label: 'Archiver', Icon: Archive, action: () => { onArchive(contextMenu.id); setContextMenu(null) }, color: '#6B7280' },
              { label: 'Supprimer', Icon: Trash2, action: () => { onDelete(contextMenu.id); setContextMenu(null) }, color: '#EF4444', danger: true },
            ].map(({ label, Icon, action, color, danger }) => (
              <motion.button key={label} whileTap={{ scale: 0.97 }} onClick={action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 14, color, borderBottom: label !== 'Supprimer' ? '1px solid rgba(102,126,234,0.06)' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = danger ? '#FEF2F2' : 'rgba(102,126,234,0.06)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <Icon size={15} /> {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function ConvItem({ conv, active, renaming, renameValue, renameRef, onRenameChange, onRenameCommit, onRenameCancel, onSelect, onLongPress, onContextMenu, index, archived }) {
  const longPressTimer = useRef(null)
  const handleTouchStart = (e) => { longPressTimer.current = setTimeout(() => onLongPress?.(e), 500) }
  const handleTouchEnd = () => clearTimeout(longPressTimer.current)

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.18, delay: index * 0.02 }}
      onContextMenu={onContextMenu} onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd} onTouchMove={handleTouchEnd}
    >
      {renaming ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', margin: '1px 0' }}>
          <input ref={renameRef} value={renameValue} onChange={e => onRenameChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onRenameCommit(); if (e.key === 'Escape') onRenameCancel() }}
            style={{
              flex: 1, border: '1.5px solid #667EEA', borderRadius: 8,
              padding: '6px 10px', fontSize: 13, outline: 'none',
              background: 'rgba(102,126,234,0.06)', color: '#1A1040',
            }} />
          <motion.button whileTap={{ scale: 0.9 }} onClick={onRenameCommit} style={{ ...iconBtn, background: 'rgba(102,126,234,0.10)' }}>
            <Check size={14} color="#667EEA" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onRenameCancel} style={{ ...iconBtn, background: 'rgba(0,0,0,0.04)' }}>
            <X size={14} color="#9CA3AF" />
          </motion.button>
        </div>
      ) : (
        <motion.button whileTap={{ scale: 0.98 }} onClick={onSelect}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 10px', borderRadius: 12, margin: '2px 0',
            background: active ? 'rgba(102,126,234,0.10)' : 'transparent',
            border: active ? '1px solid rgba(102,126,234,0.20)' : '1px solid transparent',
            cursor: 'pointer', textAlign: 'left', transition: 'all 0.12s',
          }}
          onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(102,126,234,0.06)' }}
          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
          <MessageSquare size={14} color={active ? '#667EEA' : archived ? '#9CA3AF' : '#6B7280'} style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: 13, fontWeight: active ? 600 : 400,
            color: active ? '#667EEA' : archived ? '#9CA3AF' : '#374151',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
          }}>
            {conv.title}
          </span>
        </motion.button>
      )}
    </motion.div>
  )
}

const iconBtn = {
  border: 'none', borderRadius: 8, width: 28, height: 28,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
}
