import { ImageMessage, ImageGeneratingBubble, parseMessageContent } from './ImageMessage'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Pencil, Check, X, MoreHorizontal } from 'lucide-react'
import { ReasoningPanel } from '../reasoning/ReasoningPanel'

export function MessageList({ messages, streaming, streamingReasoning, streamingAnswer, isReasoning, onEdit, onToggleReasoning }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {messages.map((msg, i) => (
        <MessageBubble
          key={msg.id || i}
          message={msg}
          onEdit={onEdit}
          onToggleReasoning={onToggleReasoning}
        />
      ))}

      {/* Streaming assistant message */}
      {streaming && (
        <AssistantStreaming
          reasoning={streamingReasoning}
          answer={streamingAnswer}
          isReasoning={isReasoning}
        />
      )}
    </div>
  )
}

function MessageBubble({ message, onEdit, onToggleReasoning }) {
  if (message.role === 'user') return <UserBubble message={message} onEdit={onEdit} />

  // Image en cours de génération
  if (message.isGeneratingImage || message.content === '__GENERATING_IMAGE__') {
    return <ImageGeneratingBubble />
  }

  // Message avec image générée
  const parsed = parseMessageContent(message.content)
  if (parsed.type === 'image') {
    return <ImageMessage imageUrl={parsed.imageUrl} imagePrompt={parsed.imagePrompt} caption={parsed.caption} />
  }

  return <AssistantBubble message={message} onToggleReasoning={onToggleReasoning} />
}

// ─── User Bubble ──────────────────────────────────────────
function UserBubble({ message, onEdit }) {
  const [showActions, setShowActions] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(message.content)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const commitEdit = async () => {
    if (editValue.trim() && editValue !== message.content) {
      await onEdit?.(message.id, editValue.trim())
    }
    setEditing(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      style={{ display: 'flex', justifyContent: 'flex-end', padding: '2px 0' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        {/* Action row */}
        <AnimatePresence>
          {showActions && !editing && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              style={{ display: 'flex', gap: 4 }}
            >
              <ActionBtn icon={copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />} onClick={copy} title="Copier" />
              <ActionBtn icon={<Pencil size={12} />} onClick={() => { setEditing(true); setEditValue(message.content) }} title="Modifier" />
            </motion.div>
          )}
        </AnimatePresence>

        {editing ? (
          <motion.div
            initial={{ scale: 0.97 }} animate={{ scale: 1 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <textarea
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              autoFocus
              rows={Math.min(8, editValue.split('\n').length + 1)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit() } if (e.key === 'Escape') setEditing(false) }}
              style={{
                width: '100%', border: '1.5px solid #667EEA', borderRadius: 14,
                padding: '10px 14px', fontSize: 14, fontFamily: 'Inter, sans-serif',
                lineHeight: 1.55, resize: 'none', outline: 'none',
                background: 'rgba(102,126,234,0.06)', color: '#1A1040',
              }}
            />
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setEditing(false)}
                style={{ ...editBtn, background: 'rgba(0,0,0,0.05)', color: '#6B7280' }}>
                <X size={13} /> Annuler
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={commitEdit}
                style={{ ...editBtn, background: 'linear-gradient(135deg, #667EEA, #764BA2)', color: '#fff' }}>
                <Check size={13} /> Envoyer
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)',
            border: 'none',
            borderRadius: '18px 18px 4px 18px',
            padding: '11px 17px',
            fontSize: 14, lineHeight: 1.6,
            color: '#ffffff',
            fontWeight: 450,
            boxShadow: '0 4px 16px rgba(102,126,234,0.35)',
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {message.content}
            {message.is_edited && (
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginLeft: 6 }}>(modifié)</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// ─── Assistant Bubble ──────────────────────────────────────
function AssistantBubble({ message, onToggleReasoning }) {
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      style={{ padding: '6px 0' }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Reasoning panel (if has reasoning) */}
      {message.reasoning && (
        <ReasoningPanel
          reasoning={message.reasoning}
          isStreaming={false}
          defaultOpen={message.reasoning_visible}
        />
      )}

      {/* Answer content */}
      <AssistantContent content={message.content} />

      {/* Action row */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
            style={{ display: 'flex', gap: 4, marginTop: 6 }}
          >
            <ActionBtn icon={copied ? <Check size={12} color="#10B981" /> : <Copy size={12} />} onClick={copy} title="Copier la réponse" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Streaming Assistant ───────────────────────────────────
function AssistantStreaming({ reasoning, answer, isReasoning }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: '6px 0' }}
    >
      {/* Live reasoning panel */}
      {(reasoning || isReasoning) && (
        <ReasoningPanel
          reasoning={reasoning}
          isStreaming={true}
          defaultOpen={true}
        />
      )}

      {/* Live answer */}
      {answer && (
        <div>
          <AssistantContent content={answer} streaming />
        </div>
      )}

      {/* If only reasoning, no answer yet */}
      {!answer && !isReasoning && (
        <div style={{ display: 'flex', gap: 5, alignItems: 'center', padding: '4px 0', color: '#94A3B8' }}>
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.13 }}
              style={{ width: 5, height: 5, borderRadius: '50%', background: '#CBD5E1' }}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}

// ─── Assistant Content Renderer ────────────────────────────
function AssistantContent({ content, streaming }) {
  // Simple markdown-like rendering
  const lines = content.split('\n')
  const rendered = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Headers
    if (line.startsWith('### ')) {
      rendered.push(<h4 key={i} style={h4Style}>{line.slice(4)}</h4>)
    } else if (line.startsWith('## ')) {
      rendered.push(<h3 key={i} style={h3Style}>{line.slice(3)}</h3>)
    } else if (line.startsWith('# ')) {
      rendered.push(<h2 key={i} style={h2Style}>{line.slice(2)}</h2>)
    }
    // Bold bullets
    else if (line.startsWith('- **') || line.startsWith('* **')) {
      rendered.push(
        <div key={i} style={bulletStyle}>
          <span style={bulletDot} />
          <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
        </div>
      )
    }
    // Regular bullets
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      rendered.push(
        <div key={i} style={bulletStyle}>
          <span style={bulletDot} />
          <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
        </div>
      )
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      const num = line.match(/^(\d+)\./)[1]
      rendered.push(
        <div key={i} style={{ ...bulletStyle, paddingLeft: 0 }}>
          <span style={{ ...bulletDot, background: '#2563EB', borderRadius: 4, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{num}</span>
          <span dangerouslySetInnerHTML={{ __html: formatInline(line.replace(/^\d+\.\s/, '')) }} />
        </div>
      )
    }
    // Horizontal rule
    else if (line === '---' || line === '***') {
      rendered.push(<hr key={i} style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '10px 0' }} />)
    }
    // Empty line
    else if (line.trim() === '') {
      rendered.push(<div key={i} style={{ height: 6 }} />)
    }
    // Regular paragraph
    else {
      rendered.push(
        <p key={i} style={pStyle} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
      )
    }
    i++
  }

  return (
    <div style={{
      fontSize: 14.5, lineHeight: 1.7, color: '#0F172A',
      fontFamily: 'Inter, sans-serif',
      wordBreak: 'break-word',
    }}>
      {rendered}
      {streaming && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
          style={{
            display: 'inline-block', width: 2, height: '1em',
            background: '#2563EB', borderRadius: 1,
            verticalAlign: 'text-bottom', marginLeft: 1,
          }}
        />
      )}
    </div>
  )
}

function formatInline(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#F1F5F9;padding:1px 5px;border-radius:4px;font-size:13px;color:#2563EB;font-family:monospace">$1</code>')
}

function ActionBtn({ icon, onClick, title }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ background: '#F1F5F9' }}
      onClick={onClick}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        padding: '4px 8px', borderRadius: 7,
        background: 'transparent', border: '1px solid #E2E8F0',
        cursor: 'pointer', fontSize: 12, color: '#64748B',
        transition: 'all 0.12s',
      }}
    >
      {icon}
      {title && <span style={{ fontSize: 11 }}>{title}</span>}
    </motion.button>
  )
}

const h2Style = { fontSize: 18, fontWeight: 700, color: '#0F172A', margin: '14px 0 6px', lineHeight: 1.3 }
const h3Style = { fontSize: 16, fontWeight: 700, color: '#0F172A', margin: '12px 0 5px', lineHeight: 1.3 }
const h4Style = { fontSize: 14, fontWeight: 700, color: '#1E40AF', margin: '10px 0 4px', lineHeight: 1.3 }
const pStyle = { margin: '2px 0', lineHeight: 1.7 }
const bulletStyle = { display: 'flex', gap: 10, alignItems: 'flex-start', margin: '4px 0', paddingLeft: 4 }
const bulletDot = { width: 6, height: 6, borderRadius: '50%', background: '#2563EB', flexShrink: 0, marginTop: 8 }
const editBtn = { display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }
