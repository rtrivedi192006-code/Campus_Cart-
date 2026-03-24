import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from './AuthContext'

type WishlistContextValue = {
  likedIds: string[]
  isWishlisted: (productId: string) => boolean
  toggleWishlist: (productId: string) => void
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

function getWishlistKey(email: string | null) {
  return email ? `campuscart_wishlist_v1:${email}` : 'campuscart_wishlist_anonymous_v1'
}

function safeParseIds(raw: string | null): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x) => typeof x === 'string')
  } catch {
    return []
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const storageKey = useMemo(() => getWishlistKey(user?.email ?? null), [user?.email])

  const [likedIds, setLikedIds] = useState<string[]>(() =>
    safeParseIds(localStorage.getItem(storageKey)),
  )

  useEffect(() => {
    setLikedIds(safeParseIds(localStorage.getItem(storageKey)))
  }, [storageKey])

  const value = useMemo<WishlistContextValue>(() => {
    const likedSet = new Set(likedIds)
    return {
      likedIds,
      isWishlisted: (productId: string) => likedSet.has(productId),
      toggleWishlist: (productId: string) => {
        setLikedIds((prev) => {
          const next = new Set(prev)
          if (next.has(productId)) next.delete(productId)
          else next.add(productId)
          const nextIds = Array.from(next)
          localStorage.setItem(storageKey, JSON.stringify(nextIds))
          return nextIds
        })
      },
      clearWishlist: () => {
        setLikedIds([])
        localStorage.setItem(storageKey, JSON.stringify([]))
      },
    }
  }, [likedIds, storageKey])

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}

