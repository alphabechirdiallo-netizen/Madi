import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Archive, Trash2, Pencil, Check, X,
  ChevronDown, ChevronRight, LogOut, User,
  MessageSquare, ArchiveIcon
} from 'lucide-react'
import { MadiOpsLogo } from '../ui/MadiOpsLogo'
import { useAuth } from '../../hooks/useAuth'

export function Sidebar({
  open, onClose,
  conversations, archivedConversations,
  activeId, onSelect, onCreate,
  onRename, onArchive, onDelete,
}) {
  const { user, signOut } = useAuth()
  const [showArchived, setShowArchived] = useState(false)
  const [contextMenu, setContextMenu] = useState(null) // { id, x, y }
  const [renamingId, setRenamingId] = useState(null)
  const [renameValue, setRenameValue] = useState('')
  const renameRef = useRef(null)
  const menuRef = useRef(null)

  // Close context menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setContextMenu(null)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('touchstart', handler)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler) }
  }, [])

  useEffect(() => {
    if (renamingId && renameRef.current) renameRef.current.focus()
  }, [renamingId])

  const startRename = (conv) => {
    setContextMenu(null)
    setRenamingId(conv.id)
    setRenameValue(conv.title)
  }

  const commitRename = async (id) => {
    if (renameValue.trim()) await onRename(id, renameValue.trim())
    setRenamingId(null)
  }

  const handleLongPress = (e, conv) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    setContextMenu({ id: conv.id, conv, x: rect.left, y: rect.bottom + 4 })
  }

  const avatarLetter = user?.user_metadata?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              background: 'rgba(15,23,42,0.3)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50,
          width: 'var(--sidebar-width)',
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column',
          overflowX: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '16px 14px 12px', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <MadiOpsLogo size={32} showName nameSize="sm" />
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={onClose}
              style={{ ...iconBtn, background: 'var(--bg-hover)' }}
            >
              <X size={16} color="#64748B" />
            </motion.button>
          </div>

          {/* New discussion button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ background: '#1D4ED8' }}
            onClick={async () => { const c = await onCreate(); if (c) { onSelect(c.id); onClose() } }}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              background: '#2563EB', color: '#fff', border: 'none',
              borderRadius: 12, padding: '11px 16px', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, transition: 'background 0.15s',
            }}
          >
            <Plus size={17} strokeWidth={2.5} />
            Nouvelle discussion
          </motion.button>
        </div>

        {/* Conversations list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px' }}>
          {conversations.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}
            >
              <MessageSquare size={32} style={{ marginBottom: 10, opacity: 0.4 }} />
              <p style={{ fontSize: 13, fontWeight: 500 }}>Aucune discussion</p>
              <p style={{ fontSize: 12, marginTop: 4 }}>Commencez une nouvelle conversation</p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {conversations.map((conv, i) => (
              <ConvItem
                key={conv.id}
                conv={conv}
                active={conv.id === activeId}
                renaming={renamingId === conv.id}
                renameValue={renameValue}
                renameRef={renameRef}
                onRenameChange={setRenameValue}
                onRenameCommit={() => commitRename(conv.id)}
                onRenameCancel={() => setRenamingId(null)}
                onSelect={() => { onSelect(conv.id); onClose() }}
                onLongPress={(e) => handleLongPress(e, conv)}
                onContextMenu={(e) => { e.preventDefault(); handleLongPress(e, conv) }}
                index={i}
              />
            ))}
          </AnimatePresence>

          {/* Archived section */}
          {archivedConversations.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowArchived(!showArchived)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', background: 'none', border: 'none',
                  cursor: 'pointer', color: '#94A3B8', fontSize: 12, fontWeight: 600,
                  borderRadius: 8, letterSpacing: '0.05em', textTransform: 'uppercase',
                }}
              >
                <ArchiveIcon size={13} />
                Archives ({archivedConversations.length})
                <motion.div animate={{ rotate: showArchived ? 90 : 0 }} style={{ marginLeft: 'auto' }}>
                  <ChevronRight size={14} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {showArchived && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ overflow: 'hidden' }}
                  >
                    {archivedConversations.map((conv, i) => (
                      <ConvItem
                        key={conv.id}
                        conv={conv}
                        active={conv.id === activeId}
                        renaming={false}
                        onSelect={() => { onSelect(conv.id); onClose() }}
                        onLongPress={(e) => handleLongPress(e, conv)}
                        onContextMenu={(e) => { e.preventDefault(); handleLongPress(e, conv) }}
                        index={i}
                        archived
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* User footer */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 8px', borderRadius: 12 }}>
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: user?.user_metadata?.avatar_url ? 'transparent' : '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
            }}>
              {user?.user_metadata?.avatar_url
                ? <img src={user.user_metadata.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>{avatarLetter}</span>
              }
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              <div style={{ fontSize: 11, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={signOut}
              title="Se déconnecter"
              style={{ ...iconBtn, background: 'transparent', flexShrink: 0 }}
            >
              <LogOut size={15} color="#94A3B8" />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Context menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              top: Math.min(contextMenu.y, window.innerHeight - 160),
              left: Math.min(contextMenu.x, window.innerWidth - 180),
              zIndex: 200,
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              minWidth: 172,
            }}
          >
            {[
              { label: 'Renommer', Icon: Pencil, action: () => startRename(contextMenu.conv), color: '#0F172A' },
              { label: 'Archiver', Icon: Archive, action: () => { onArchive(contextMenu.id); setContextMenu(null) }, color: '#64748B' },
              { label: 'Supprimer', Icon: Trash2, action: () => { onDelete(contextMenu.id); setContextMenu(null) }, color: '#EF4444', danger: true },
            ].map(({ label, Icon, action, color, danger }) => (
              <motion.button
                key={label}
                whileTap={{ scale: 0.97 }}
                onClick={action}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 16px', background: 'none', border: 'none',
                  cursor: 'pointer', fontSize: 14, color,
                  borderBottom: label !== 'Supprimer' ? '1px solid #F1F5F9' : 'none',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = danger ? '#FEF2F2' : '#F8FAFC'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon size={15} />
                {label}
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

  const handleTouchStart = (e) => {
    longPressTimer.current = setTimeout(() => onLongPress?.(e), 500)
  }
  const handleTouchEnd = () => { clearTimeout(longPressTimer.current) }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.18, delay: index * 0.02 }}
      onContextMenu={onContextMenu}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
    >
      {renaming ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 6px', margin: '1px 0' }}>
          <input
            ref={renameRef}
            value={renameValue}
            onChange={e => onRenameChange(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') onRenameCommit(); if (e.key === 'Escape') onRenameCancel() }}
            style={{
              flex: 1, border: '1.5px solid #2563EB', borderRadius: 8,
              padding: '6px 10px', fontSize: 13, outline: 'none',
              background: '#EFF6FF', color: '#0F172A',
            }}
          />
          <motion.button whileTap={{ scale: 0.9 }} onClick={onRenameCommit} style={{ ...iconBtn, background: '#EFF6FF' }}>
            <Check size={14} color="#2563EB" />
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={onRenameCancel} style={{ ...iconBtn, background: '#F1F5F9' }}>
            <X size={14} color="#94A3B8" />
          </motion.button>
        </div>
      ) : (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onSelect}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 10px', borderRadius: 10, margin: '1px 0',
            background: active ? 'var(--bg-active)' : 'transparent',
            border: active ? '1px solid #BFDBFE' : '1px solid transparent',
            cursor: 'pointer', textAlign: 'left',
            transition: 'all 0.12s',
          }}
          onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)' }}
          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
        >
          <MessageSquare size={14} color={active ? '#2563EB' : archived ? '#94A3B8' : '#64748B'} style={{ flexShrink: 0 }} />
          <span style={{
            fontSize: 13, fontWeight: active ? 600 : 400,
            color: active ? '#1E40AF' : archived ? '#94A3B8' : '#374151',
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
  border: 'none', borderRadius: 8, width: 30, height: 30,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'all 0.12s', flexShrink: 0,
}
