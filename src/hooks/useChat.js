import { useState, useCallback, useRef } from 'react'
import { supabase, SUPABASE_URL } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useChat(conversationId, onTitleUpdate) {
  const { session, user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [streamingReasoning, setStreamingReasoning] = useState('')
  const [streamingAnswer, setStreamingAnswer] = useState('')
  const [isReasoning, setIsReasoning] = useState(false)
  const [error, setError] = useState(null)

  const abortControllerRef = useRef(null)
  const messagesRef = useRef([])
  messagesRef.current = messages
  const titleUpdatedRef = useRef({})

  const loadMessages = useCallback(async () => {
    if (!conversationId || !session) return
    setLoading(true)
    const { data, error } = await supabase
      .from('messages')
      .select('id, role, content, reasoning, reasoning_visible, is_edited, created_at, model')
      .eq('conversation_id', conversationId)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true })
    if (!error) setMessages(data || [])
    setLoading(false)
  }, [conversationId, session])

  const sendMessage = useCallback(async (text) => {
    if (!session || !conversationId || !text.trim()) return
    setError(null)

    // Annuler tout stream précédent
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const tempId = 'temp-user-' + Date.now()
    const tempUserMsg = {
      id: tempId,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
      temp: true,
    }

    setMessages(prev => [...prev, tempUserMsg])
    setStreaming(true)
    setStreamingReasoning('')
    setStreamingAnswer('')
    setIsReasoning(true)

    // Titre auto dès le 1er message
    const isFirstMessage = messagesRef.current.filter(m => !m.temp).length === 0
    if (isFirstMessage && !titleUpdatedRef.current[conversationId]) {
      titleUpdatedRef.current[conversationId] = true
      const autoTitle = text.trim().slice(0, 60) + (text.trim().length > 60 ? '...' : '')
      onTitleUpdate?.(conversationId, autoTitle)
    }

    const history = messagesRef.current
      .filter(m => !m.temp)
      .slice(-20)
      .map(m => ({ role: m.role, content: m.content }))

    const userName = user?.user_metadata?.full_name?.split(' ')[0]
      || user?.user_metadata?.name?.split(' ')[0]
      || user?.email?.split('@')[0]
      || ''

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/chat-stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: text,
          history,
          user_name: userName,
        }),
        signal,
      })

      // Gérer les erreurs HTTP proprement (503, 502, etc.)
      if (!response.ok) {
        let errMsg = 'MadiOps est momentanément indisponible. Réessaie dans quelques secondes.'
        try {
          const errData = await response.json()
          if (errData.error) errMsg = errData.error
        } catch { /* ignore */ }

        // Retirer le message temp et afficher l'erreur
        setMessages(prev => prev.filter(m => m.id !== tempId))
        setError(errMsg)
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMsgId = null
      let userMsgId = null
      let fullReasoning = ''
      let fullAnswer = ''
      let reasoningDone = false
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw || raw === '[DONE]') continue

          try {
            const event = JSON.parse(raw)

            if (event.type === 'message_id') {
              assistantMsgId = event.id
              userMsgId = event.user_message_id
              if (userMsgId) {
                setMessages(prev => prev.map(m =>
                  m.id === tempId ? { ...m, id: userMsgId, temp: false } : m
                ))
              }
              setMessages(prev => [...prev, {
                id: assistantMsgId,
                role: 'assistant',
                content: '',
                reasoning: '',
                streaming: true,
                created_at: new Date().toISOString(),
              }])
            }

            if (event.type === 'token') {
              if (event.token_type === 'reasoning') {
                fullReasoning += event.delta
                setStreamingReasoning(s => s + event.delta)
                setIsReasoning(true)
              } else {
                if (!reasoningDone) { reasoningDone = true; setIsReasoning(false) }
                fullAnswer += event.delta
                setStreamingAnswer(s => s + event.delta)
                setMessages(prev => prev.map(m =>
                  m.id === assistantMsgId ? { ...m, content: fullAnswer, reasoning: fullReasoning } : m
                ))
              }
            }

            if (event.type === 'done') {
              setMessages(prev => prev.map(m =>
                m.id === assistantMsgId
                  ? { ...m, content: event.final_answer, reasoning: event.reasoning, streaming: false }
                  : m
              ))
            }
          } catch { /* ignorer chunks malformés */ }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setError('Connexion interrompue. Vérifie ta connexion internet et réessaie.')
      console.error('Chat error:', err)
    } finally {
      setStreaming(false)
      setStreamingReasoning('')
      setStreamingAnswer('')
      setIsReasoning(false)
    }
  }, [session, user, conversationId, onTitleUpdate])

  const editMessage = async (messageId, newContent) => {
    if (!session) return
    await supabase
      .from('messages')
      .update({ content: newContent, is_edited: true, edited_at: new Date().toISOString() })
      .eq('id', messageId)
      .eq('user_id', session.user.id)
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, content: newContent, is_edited: true } : m
    ))
  }

  const toggleReasoningVisible = (messageId) => {
    setMessages(prev => prev.map(m =>
      m.id === messageId ? { ...m, reasoning_visible: !m.reasoning_visible } : m
    ))
  }

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setStreaming(false)
    setStreamingReasoning('')
    setStreamingAnswer('')
    setIsReasoning(false)
  }

  const clearError = () => setError(null)

  return {
    messages, loading, streaming,
    streamingReasoning, streamingAnswer, isReasoning,
    error, clearError,
    loadMessages, sendMessage, editMessage,
    toggleReasoningVisible, stopStreaming, setMessages,
  }
}
