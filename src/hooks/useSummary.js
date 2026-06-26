import { useState, useCallback } from 'react'
import { supabase, SUPABASE_URL } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useSummary() {
  const { session } = useAuth()
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  const summarize = useCallback(async (conversationId) => {
    if (!session || !conversationId) return null
    setLoading(true)
    setSummary(null)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/summarize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation_id: conversationId }),
      })
      const data = await res.json()
      if (data.success) {
        setSummary(data)
        return data
      }
      return null
    } catch (err) {
      console.error('Summary error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [session])

  const loadExistingSummary = useCallback(async (conversationId) => {
    if (!conversationId) return
    const { data } = await supabase
      .from('conversation_summaries')
      .select('*')
      .eq('conversation_id', conversationId)
      .single()
    if (data) setSummary(data)
  }, [])

  return { loading, summary, setSummary, summarize, loadExistingSummary }
}
