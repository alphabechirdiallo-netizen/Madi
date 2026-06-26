import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatHeader } from '../components/chat/ChatHeader'
import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { HomeScreen } from '../components/chat/HomeScreen'
import { Sidebar } from '../components/sidebar/Sidebar'
import { AuthModal } from '../components/auth/AuthModal'
import { OnboardingModal } from '../components/auth/OnboardingModal'
import { StatsPanel } from '../components/ui/StatsPanel'
import { SummaryPanel } from '../components/ui/SummaryPanel'
import { ProfilePanel } from '../components/ui/ProfilePanel'
import { SplashScreen } from '../components/ui/SplashScreen'
import { WorldGallery } from '../components/ui/WorldGallery'
import { getContextualBackground } from '../components/ui/WorldBanner'
import { useAuth } from '../hooks/useAuth'
import { useConversations } from '../hooks/useConversations'
import { useChat } from '../hooks/useChat'
import { useImageGen, detectImageRequest } from '../hooks/useImageGen'
import { useProfile } from '../hooks/useProfile'
import { useSummary } from '../hooks/useSummary'

// Splash vu une seule fois par session
const SPLASH_SHOWN = sessionStorage.getItem('madiops_splash')

export function ChatPage() {
  const { user, session } = useAuth()
  const [showSplash, setShowSplash] = useState(!SPLASH_SHOWN)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [activeConvId, setActiveConvId] = useState(null)
  const [view, setView] = useState('home')
  const [showStats, setShowStats] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [showWorld, setShowWorld] = useState(false)
  const [chatBg, setChatBg] = useState(null)
  const messagesEndRef = useRef(null)
  const activeConvIdRef = useRef(null)
  const isSendingRef = useRef(false)
  const sessionStartRef = useRef(Date.now())

  const { profile, stats, loading: profileLoading, updateProfile, completeOnboarding, updateSessionTime, needsOnboarding, refetch: refetchProfile } = useProfile()
  const { conversations, archivedConversations, createConversation, renameConversation, archiveConversation, deleteConversation, updateConversationTitle } = useConversations()
  const { loading: summaryLoading, summary, setSummary, summarize } = useSummary()

  const handleTitleUpdate = useCallback((convId, title) => {
    updateConversationTitle(convId, title)
  }, [updateConversationTitle])

  const { messages, loading, streaming, streamingReasoning, streamingAnswer, isReasoning, error, clearError, loadMessages, sendMessage, editMessage, toggleReasoningVisible, stopStreaming, setMessages } = useChat(activeConvId, handleTitleUpdate)

  const { generating: generatingImage, generateImage } = useImageGen(activeConvId, setMessages, handleTitleUpdate)

  useEffect(() => { activeConvIdRef.current = activeConvId }, [activeConvId])
  useEffect(() => { if (activeConvId) { setMessages([]); loadMessages() } }, [activeConvId])
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streamingAnswer, streamingReasoning])

  // Fond contextuel — déclenché par la dernière réponse de MadiOps
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant' && m.content?.length > 100)
    if (lastAssistant && !streaming) {
      // 1 chance sur 4 d'afficher un fond contextuel
      if (Math.random() < 0.25) {
        const bg = getContextualBackground(lastAssistant.content)
        if (bg) {
          setChatBg(bg)
          // Retirer après 8 secondes
          setTimeout(() => setChatBg(null), 8000)
        }
      }
    }
  }, [messages, streaming])

  useEffect(() => {
    return () => {
      if (user) {
        const secs = Math.floor((Date.now() - sessionStartRef.current) / 1000)
        if (secs > 10) updateSessionTime(secs)
      }
    }
  }, [user])

  const activeConv = conversations.find(c => c.id === activeConvId) || archivedConversations.find(c => c.id === activeConvId)

  const handleSend = async (text) => {
    if (!user || !session) { setShowAuth(true); return }
    if (isSendingRef.current) return
    isSendingRef.current = true
    try {
      let convId = activeConvIdRef.current
      if (!convId) {
        const conv = await createConversation()
        if (!conv) return
        convId = conv.id
        activeConvIdRef.current = convId
        setActiveConvId(convId)
        await new Promise(r => setTimeout(r, 50))
      }
      setView('chat')
      if (detectImageRequest(text)) {
        await generateImage(text)
      } else {
        await sendMessage(text)
      }
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
      setView('chat')
      setSidebarOpen(false)
    }
  }

  const handleSelectConv = (id) => {
    activeConvIdRef.current = id
    setActiveConvId(id)
    setView('chat')
  }

  const handleDeleteConv = async (id) => {
    await deleteConversation(id)
    if (activeConvIdRef.current === id) {
      activeConvIdRef.current = null
      setActiveConvId(null)
      setMessages([])
      setView('home')
    }
  }

  const handleGoHome = () => {
    setView('home')
    setActiveConvId(null)
    activeConvIdRef.current = null
    setMessages([])
  }

  const handleSummarize = async () => {
    if (!activeConvId) return
    setShowSummary(true)
    setSummary(null)
    await summarize(activeConvId)
  }

  const handleOnboardingComplete = async (data) => {
    await completeOnboarding(data)
    await refetchProfile()
  }

  const handleSplashDone = () => {
    sessionStorage.setItem('madiops_splash', '1')
    setShowSplash(false)
  }

  return (
    <div style={{
      height: '100dvh', width: '100%',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(145deg, #EEF2FF 0%, #F3E8FF 35%, #FCE7F3 70%, #EDE9FE 100%)',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onDone={handleSplashDone} />}

      {/* Orbes de fond */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-12%', right: '-8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,147,251,0.28) 0%, transparent 70%)', filter: 'blur(10px)' }} />
        <motion.div animate={{ y: [0, 16, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '15%', left: '-10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(102,126,234,0.20) 0%, transparent 70%)', filter: 'blur(12px)' }} />
        <motion.div animate={{ y: [0, -10, 0], x: [0, 10, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{ position: 'absolute', top: '50%', right: '8%', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(118,75,162,0.16) 0%, transparent 70%)', filter: 'blur(8px)' }} />
      </div>

      {/* Fond contextuel chat */}
      <AnimatePresence>
        {chatBg && view === 'chat' && (
          <motion.div
            key={chatBg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
              backgroundImage: `url(${chatBg})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
              filter: 'blur(2px) brightness(1.1)',
              opacity: 0.07,
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div style={{ position: 'relative', zIndex: 50 }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onGoHome={handleGoHome}
          onShowProfile={() => setShowProfile(true)}
          onShowStats={() => setShowStats(true)}
          onSummarize={handleSummarize}
          onShowMemory={() => setShowMemory(true)}
          onShowWorld={() => setShowWorld(true)}
          activeConvId={activeConvId}
          conversations={conversations}
          profile={profile}
          stats={stats}
        />
      </div>

      {/* Header */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        <ChatHeader
          onMenuOpen={() => setSidebarOpen(true)}
          onNewChat={handleNewChat}
          title={view === 'chat' ? activeConv?.title : null}
          showBack={view === 'chat'}
          onBack={handleGoHome}
        />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <HomeScreen
                conversations={conversations}
                onSelect={handleSelectConv}
                onNewChat={handleNewChat}
                profile={profile}
                stats={stats}
                onOpenGallery={() => setShowWorld(true)}
              />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.22 }} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
                {loading && (
                  <div style={{ padding: '20px 16px' }}>
                    {[1, 2, 3].map(i => (
                      <motion.div key={i} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
                        style={{ height: 52, borderRadius: 14, background: 'rgba(102,126,234,0.08)', marginBottom: 12, width: i === 2 ? '60%' : '100%', marginLeft: i % 2 === 0 ? 'auto' : 0 }} />
                    ))}
                  </div>
                )}
                {!loading && (messages.length > 0 || streaming) && (
                  <div style={{ padding: '12px 16px 8px', maxWidth: 720, margin: '0 auto', width: '100%' }}>
                    <MessageList
                      messages={messages} streaming={streaming}
                      streamingReasoning={streamingReasoning} streamingAnswer={streamingAnswer}
                      isReasoning={isReasoning} onEdit={editMessage} onToggleReasoning={toggleReasoningVisible}
                    />
                    <div ref={messagesEndRef} style={{ height: 8 }} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div style={{ maxWidth: 720, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <ChatInput
          onSend={handleSend}
          disabled={streaming || generatingImage}
          streaming={streaming}
          generatingImage={generatingImage}
          onStop={stopStreaming}
        />
      </div>

      {/* Onboarding */}
      <AnimatePresence>
        {user && !profileLoading && needsOnboarding && !showSplash && (
          <OnboardingModal onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>

      {/* Auth */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </AnimatePresence>

      {/* Panels */}
      {showStats && <StatsPanel stats={stats} onClose={() => setShowStats(false)} />}
      {showSummary && <SummaryPanel summary={summary} loading={summaryLoading} onClose={() => setShowSummary(false)} onRegenerate={() => summarize(activeConvId)} />}
      {showProfile && <ProfilePanel profile={profile} user={user} onClose={() => setShowProfile(false)} onUpdate={async (data) => { await updateProfile(data); await refetchProfile() }} />}

      {/* World Gallery */}
      {showWorld && <WorldGallery onClose={() => setShowWorld(false)} />}

      {/* Memory panel */}
      <AnimatePresence>
        {showMemory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowMemory(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(26,16,64,0.35)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 520, background: 'rgba(255,255,255,0.97)', borderRadius: '28px 28px 0 0', padding: '28px 20px 40px', boxShadow: '0 -8px 40px rgba(102,126,234,0.18)' }}>
              <div style={{ width: 40, height: 4, background: 'rgba(102,126,234,0.2)', borderRadius: 2, margin: '0 auto 20px' }} />
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1A1040', marginBottom: 8 }}>Mémoire de MadiOps</div>
              <div style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65 }}>
                MadiOps apprend de chaque conversation avec toi — tes expressions, tes sujets favoris, ton style de communication, tes ambitions. Cette mémoire s'enrichit automatiquement à chaque échange et lui permet de mieux t'accompagner au fil du temps.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast erreur */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={clearError}
            style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 999, maxWidth: 340, width: 'calc(100% - 32px)', background: 'rgba(239,68,68,0.95)', backdropFilter: 'blur(12px)', borderRadius: 16, padding: '12px 18px', boxShadow: '0 8px 24px rgba(239,68,68,0.30)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 2 }}>Erreur</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{error}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
