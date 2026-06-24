import { useState, useEffect, useCallback } from 'react'
import { supabase, SUPABASE_URL } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useConversations() {
  const { session } = useAuth()
  const [conversations, setConversations] = useState([])
  const [archivedConversations, setArchivedConversations] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchConversations = useCallback(async () => {
    if (!session) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('id, title, status, created_at, updated_at, last_message_at')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .order('last_message_at', { ascending: false })
      if (!error) setConversations(data || [])

      const { data: archived } = await supabase
        .from('conversations')
        .select('id, title, status, created_at, last_message_at')
        .eq('user_id', session.user.id)
        .eq('status', 'archived')
        .order('last_message_at', { ascending: false })
      setArchivedConversations(archived || [])
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const createConversation = async () => {
    if (!session) return null
    const { data, error } = await supabase
      .from('conversations')
      .insert({ user_id: session.user.id, title: 'Nouvelle discussion', status: 'active' })
      .select()
      .single()
    if (error) return null
    setConversations(prev => [data, ...prev])
    return data
  }

  const renameConversation = async (id, title) => {
    await supabase.rpc('rename_conversation', { conv_id: id, new_title: title })
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c))
  }

  const archiveConversation = async (id) => {
    await supabase.rpc('archive_conversation', { conv_id: id })
    const conv = conversations.find(c => c.id === id)
    setConversations(prev => prev.filter(c => c.id !== id))
    if (conv) setArchivedConversations(prev => [{ ...conv, status: 'archived' }, ...prev])
  }

  const deleteConversation = async (id) => {
    await supabase.rpc('soft_delete_conversation', { conv_id: id })
    setConversations(prev => prev.filter(c => c.id !== id))
    setArchivedConversations(prev => prev.filter(c => c.id !== id))
  }

  const updateConversationTitle = (id, title) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title } : c))
  }

  return {
    conversations,
    archivedConversations,
    loading,
    createConversation,
    renameConversation,
    archiveConversation,
    deleteConversation,
    updateConversationTitle,
    refetch: fetchConversations,
  }
}
