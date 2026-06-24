import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatHeader } from '../components/chat/ChatHeader'
import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { WelcomeScreen } from '../components/chat/WelcomeScreen'
import { Sidebar } from '../components/sidebar/Sidebar'
import { AuthModal } from '../components/auth/AuthModal'
import { useAuth } from '../hooks/useAuth'
import { useConversations } from '../hooks/useConversations'
import { useChat } from '../hooks/useChat'

export function ChatPage() {
  const { user, session } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [activeConvId, setActiveConvId] = useState(null)
  const messagesEndRef = useRef(null)
  // Refs pour éviter les race conditions
  const activeConvIdRef = useRef(null)
  const isSendingRef = useRef(false)

  const {
    conversations, archivedConversations,
    createConversation, renameConversation,
    archiveConversation, deleteConversation,
    updateConversationTitle,
  } = useConversations()

  const handleTitleUpdate = useCallback((convId, title) => {
    updateConversationTitle(convId, title)
  }, [updateConversationTitle])

  const {
    messages, loading, streaming,
    streamingReasoning, streamingAnswer, isReasoning,
    loadMessages, sendMessage, editMessage,
    toggleReasoningVisible, stopStreaming, setMessages,
  } = useChat(activeConvId, handleTitleUpdate)

  // Sync ref avec state
  useEffect(() => {
    activeConvIdRef.current = activeConvId
  }, [activeConvId])

  // Charger les messages quand la conversation change
  useEffect(() => {
    if (activeConvId) {
      setMessages([])
      loadMessages()
    }
  }, [activeConvId])

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingAnswer, streamingReasoning])

  const activeConv = conversations.find(c => c.id === activeConvId)
    || archivedConversations.find(c => c.id === activeConvId)

  const handleSend = async (text) => {
    if (!user || !session) {
      setShowAuth(true)
      return
    }
    // Empêcher un double-envoi pendant qu'on traite déjà
    if (isSendingRef.current) return
    isSendingRef.current = true

    try {
      // Créer une conversation si aucune n'est active
      let convId = activeConvIdRef.current
      if (!convId) {
        const conv = await createConversation()
        if (!conv) return
        convId = conv.id
        activeConvIdRef.current = convId
        setActiveConvId(convId)
        // Laisser le temps au state de se propager avant d'envoyer
        await new Promise(r => setTimeout(r, 50))
      }

      await sendMessage(text)
    } finally {
      isSendingRef.current = false
    }
  }

  const handleNewChat = async () => {
    if (!user || !session) { setShowAuth(true); return }
    const conv = await createConversation()
    if (conv) {
      activeConvIdRef.current = conv.id
      setActiveConvId(conv.id)
      setMessages([])
      setSidebarOpen(false)
    }
  }

  const handleSelectConv = (id) => {
    activeConvIdRef.current = id
    setActiveConvId(id)
    setSidebarOpen(false)
  }

  const handleDeleteConv = async (id) => {
    await deleteConversation(id)
    if (activeConvIdRef.current === id) {
      activeConvIdRef.current = null
      setActiveConvId(null)
      setMessages([])
    }
  }

  return (
    <div style={{
      height: '100dvh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(145deg, #EEF2FF 0%, #F3E8FF 35%, #FCE7F3 70%, #EDE9FE 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Orbes de fond permanents */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div
          animate={{ y: [0, -18, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-12%', right: '-8%',
            width: 300, height: 300, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(240,147,251,0.30) 0%, transparent 70%)',
            filter: 'blur(10px)',
          }}
        />
        <motion.div
          animate={{ y: [0, 16, 0], scale: [1, 1.04, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{
            position: 'absolute', bottom: '15%', left: '-10%',
            width: 250, height: 250, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102,126,234,0.22) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{
            position: 'absolute', top: '50%', right: '8%',
            width: 160, height: 160, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(118,75,162,0.18) 0%, transparent 70%)',
            filter: 'blur(8px)',
          }}
        />
      </div>
      {/* Sidebar */}
      <div style={{ position: 'relative', zIndex: 50 }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        archivedConversations={archivedConversations}
        activeId={activeConvId}
        onSelect={handleSelectConv}
        onCreate={createConversation}
        onRename={renameConversation}
        onArchive={archiveConversation}
        onDelete={handleDeleteConv}
      />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10 }}>
      <ChatHeader
        onMenuOpen={() => setSidebarOpen(true)}
        onNewChat={handleNewChat}
        title={activeConv?.title}
      />
      </div>

      {/* Zone de chat */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        WebkitOverflowScrolling: 'touch',
        position: 'relative', zIndex: 1,
      }}>
        {/* Skeleton loading */}
        {loading && (
          <div style={{ padding: '20px 16px' }}>
            {[1, 2, 3].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                style={{
                  height: 52, borderRadius: 14,
                  background: '#F1F5F9', marginBottom: 12,
                  width: i === 2 ? '60%' : '100%',
                  marginLeft: i % 2 === 0 ? 'auto' : 0,
                }}
              />
            ))}
          </div>
        )}

        {/* Écran d'accueil */}
        {!loading && messages.length === 0 && !streaming && (
          <WelcomeScreen onSuggestion={handleSend} />
        )}

        {/* Messages */}
        {!loading && (messages.length > 0 || streaming) && (
          <div style={{ padding: '12px 16px 8px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
            <MessageList
              messages={messages}
              streaming={streaming}
              streamingReasoning={streamingReasoning}
              streamingAnswer={streamingAnswer}
              isReasoning={isReasoning}
              onEdit={editMessage}
              onToggleReasoning={toggleReasoningVisible}
            />
            <div ref={messagesEndRef} style={{ height: 8 }} />
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <ChatInput
          onSend={handleSend}
          disabled={streaming}
          streaming={streaming}
          onStop={stopStreaming}
        />
      </div>

      {/* Auth modal */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </div>
  )
}
