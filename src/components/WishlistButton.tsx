import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useWishlist } from '../state/WishlistContext'

export default function WishlistButton({ productId }: { productId: string }) {
  const { isWishlisted, toggleWishlist } = useWishlist()
  const liked = isWishlisted(productId)

  return (
    <motion.button
      type="button"
      className={liked ? 'wishBtn wishBtn--liked' : 'wishBtn'}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      whileTap={{ scale: 0.92 }}
      onClick={() => toggleWishlist(productId)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {liked ? (
          <motion.span
            key="filled"
            initial={{ scale: 0.4, rotate: -15, opacity: 0 }}
            animate={{ scale: 1.08, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.6, rotate: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 550, damping: 20 }}
            className="wishIconWrap"
          >
            <Heart size={18} fill="currentColor" />
          </motion.span>
        ) : (
          <motion.span
            key="outline"
            initial={{ scale: 0.9, opacity: 0.65 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            className="wishIconWrap"
          >
            <Heart size={18} fill="transparent" />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

