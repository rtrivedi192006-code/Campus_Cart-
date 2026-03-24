import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

type RecentlyViewedContextValue = {
  viewedIds: string[]
  addViewed: (productId: string) => void
  clear: () => void
}

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null)

function getKey(email: string | null) {
  return email ? `campuscart_recent_v1:${email}` : 'campuscart_recent_anonymous_v1'
}

function safeParse(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x) => typeof x === 'string')
  } catch {
    return []
  }
}

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const storageKey = useMemo(() => getKey(user?.email ?? null), [user?.email])
  const [viewedIds, setViewedIds] = useState<string[]>(() => safeParse(localStorage.getItem(storageKey)))

  useEffect(() => {
    setViewedIds(safeParse(localStorage.getItem(storageKey)))
  }, [storageKey])

  const value = useMemo<RecentlyViewedContextValue>(() => {
    return {
      viewedIds,
      addViewed: (productId: string) => {
        setViewedIds((prev) => {
          const next = [productId, ...prev.filter((x) => x !== productId)].slice(0, 8)
          localStorage.setItem(storageKey, JSON.stringify(next))
          return next
        })
      },
      clear: () => {
        setViewedIds([])
        localStorage.setItem(storageKey, JSON.stringify([]))
      },
    }
  }, [storageKey, viewedIds])

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
}

export function useRecentlyViewed() {
  const ctx = useContext(RecentlyViewedContext)
  if (!ctx) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider')
  return ctx
}

