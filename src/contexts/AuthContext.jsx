import { createContext, useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getProfile } from '../services/profileService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null) // real row from `profiles`, includes .role
  const [loading, setLoading] = useState(true) // true until session AND profile are resolved

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null)
      return
    }
    try {
      const data = await getProfile(userId)
      setProfile(data)
    } catch (err) {
      // Most likely cause: the profiles row hasn't been created yet by the
      // handle_new_user trigger (rare race right after signup). Don't crash
      // the app over it — just leave profile null, ProtectedRoute handles it.
      console.warn('[Focus Nexus] Could not load profile:', err.message)
      setProfile(null)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return
      setSession(session)
      await loadProfile(session?.user?.id)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setLoading(true)
      await loadProfile(session?.user?.id)
      setLoading(false)
    })

    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [loadProfile])

  const refreshProfile = useCallback(() => {
    if (session?.user?.id) return loadProfile(session.user.id)
  }, [session, loadProfile])

  const value = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    refreshProfile,
    loading,
    signOut: () => supabase.auth.signOut(),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
