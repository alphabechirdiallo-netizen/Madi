import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useProfile() {
  const { user, session } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [{ data: prof }, { data: st }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
    ])
    setProfile(prof)
    setStats(st)
    setLoading(false)
  }, [user])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  const updateProfile = async (updates) => {
    if (!user) return
    const { data, error } = await supabase.from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select().single()
    if (!error) setProfile(data)
    return { data, error }
  }

  const completeOnboarding = async (profileData) => {
    if (!user) return
    const { data, error } = await supabase.from('profiles')
      .update({
        ...profileData,
        onboarding_done: true,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select().single()
    if (!error) setProfile(data)
    return { data, error }
  }

  const updateSessionTime = useCallback(async (seconds) => {
    if (!user) return
    await supabase.from('user_stats').upsert({
      user_id: user.id,
      total_time_seconds: (stats?.total_time_seconds || 0) + seconds,
      total_sessions: (stats?.total_sessions || 0) + 1,
      last_session_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
  }, [user, stats])

  const needsOnboarding = user && profile && !profile.onboarding_done

  return { profile, stats, loading, updateProfile, completeOnboarding, updateSessionTime, refetch: fetchProfile, needsOnboarding }
}
