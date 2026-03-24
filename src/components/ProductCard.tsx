import { motion } from 'framer-motion'
import type { Product } from '../data/catalog'
import { formatINR } from '../data/catalog'
import WishlistButton from './WishlistButton'
import MagneticButton from './MagneticButton'

const cardVariants = {
  hidden: (_index: number) => ({
    y: -260,
    rotate: -7,
    opacity: 0,
  }),
  show: (index: number) => ({
    y: 0,
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 140,
      damping: 11,
      mass: 0.7,
      delay: index * 0.05,
    },
  }),
}

export default function ProductCard({
  product,
  index,
  animateOnMount,
  onPrimaryAction,
  onOpen,
}: {
  product: Product
  index: number
  animateOnMount: boolean
  onPrimaryAction: (productId: string) => void
  onOpen?: (productId: string) => void
}) {
  return (
    <motion.article
      layout
      layoutId={`product:${product.id}`}
      className="productCard"
      custom={index}
      variants={cardVariants}
      initial={animateOnMount ? 'hidden' : false}
      animate={animateOnMount ? 'show' : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      whileHover={{
        y: -18,
        rotate: -0.8,
        boxShadow:
          'rgba(0, 0, 0, 0.18) 0 18px 40px -12px, rgba(0,0,0,0.10) 0 8px 18px -8px',
      }}
      style={{ backgroundImage: product.gradient }}
      onClick={() => onOpen?.(product.id)}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onOpen) return
        if (e.key === 'Enter' || e.key === ' ') onOpen(product.id)
      }}
    >
      <div className="productCardTop">
        <div className="productBadge">
          <span className="productBadgeDot" aria-hidden="true" />
          <span className="productBadgeText">{product.condition}</span>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          <WishlistButton productId={product.id} />
        </div>
      </div>

      <div className="productTagsRow" aria-label="Product tags">
        {product.tags?.urgentSale ? <span className="tag tag--urgent">Urgent Sale</span> : null}
        {product.tags?.newItem ? <span className="tag tag--new">New Item</span> : null}
      </div>

      <h3 className="productTitle">{product.title}</h3>
      <p className="productDesc">{product.description}</p>

      <div className="productMetaRow">
        <div className="productPrice">
          <span className="productPriceLabel">Price</span>
          <span className="productPriceValue">{formatINR(product.price)}</span>
        </div>
        <div className="productSeller">
          <span className="productSellerLabel">Seller</span>
          <span className="productSellerValue">{product.seller}</span>
        </div>
      </div>

      <div className="productActions">
        <MagneticButton
          intensity={12}
          className="primaryBtn primaryBtn--fill"
          onClick={(e) => {
            e.stopPropagation()
            onPrimaryAction(product.id)
          }}
          type="button"
        >
          Buy / Exchange
        </MagneticButton>
        <MagneticButton
          intensity={10}
          className="ghostBtn ghostBtn--soft"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onPrimaryAction(product.id)
          }}
          aria-label={`Message ${product.title}`}
        >
          Message
        </MagneticButton>
      </div>
    </motion.article>
  )
}

