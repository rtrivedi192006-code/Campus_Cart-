import { AnimatePresence, motion } from 'framer-motion'
import { X, MapPin, User } from 'lucide-react'
import type { Product } from '../data/catalog'
import { formatINR } from '../data/catalog'
import WishlistButton from './WishlistButton'
import MagneticButton from './MagneticButton'

export default function ProductModal({
  product,
  open,
  onClose,
  onPrimaryAction,
}: {
  product: Product | null
  open: boolean
  onClose: () => void
  onPrimaryAction: (productId: string) => void
}) {
  return (
    <AnimatePresence>
      {open && product ? (
        <motion.div
          className="modalOverlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Product details"
        >
          <motion.div
            className="modalCard"
            layoutId={`product:${product.id}`}
            onClick={(e) => e.stopPropagation()}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            style={{ backgroundImage: product.gradient }}
          >
            <div className="modalTop">
              <div className="modalBadges">
                {product.tags?.urgentSale ? (
                  <motion.span
                    className="tag tag--urgent"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    Urgent Sale
                  </motion.span>
                ) : null}
                {product.tags?.newItem ? (
                  <motion.span
                    className="tag tag--new"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                  >
                    New Item
                  </motion.span>
                ) : null}
              </div>

              <div className="modalActions">
                <WishlistButton productId={product.id} />
                <button className="modalClose" type="button" onClick={onClose} aria-label="Close">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modalBody">
              <h2 className="modalTitle">{product.title}</h2>
              <p className="modalDesc">{product.description}</p>

              <div className="modalInfoGrid">
                <div className="modalInfo">
                  <div className="modalInfoLabel">Price</div>
                  <div className="modalInfoValue">{formatINR(product.price)}</div>
                </div>
                <div className="modalInfo">
                  <div className="modalInfoLabel">Condition</div>
                  <div className="modalInfoValue">{product.condition}</div>
                </div>
                <div className="modalInfo">
                  <div className="modalInfoLabel">
                    <User size={14} /> Seller
                  </div>
                  <div className="modalInfoValue">{product.seller}</div>
                </div>
                <div className="modalInfo">
                  <div className="modalInfoLabel">
                    <MapPin size={14} /> Pickup
                  </div>
                  <div className="modalInfoValue">{product.campusPickup}</div>
                </div>
              </div>

              <div className="modalCtas">
                <MagneticButton
                  className="primaryBtn primaryBtn--fill"
                  intensity={12}
                  type="button"
                  onClick={() => onPrimaryAction(product.id)}
                >
                  Buy / Exchange
                </MagneticButton>
                <MagneticButton className="ghostBtn" intensity={10} type="button" onClick={onClose}>
                  Back
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

