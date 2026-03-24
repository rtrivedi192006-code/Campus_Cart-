import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { products } from '../data/catalog'
import { useWishlist } from '../state/WishlistContext'
import { formatINR } from '../data/catalog'

export default function WishlistPage() {
  const { likedIds } = useWishlist()

  const wishlistProducts = useMemo(() => {
    const set = new Set(likedIds)
    return products.filter((p) => set.has(p.id))
  }, [likedIds])

  return (
    <div className="page">
      <section className="section">
        <div className="sectionHeader">
          <div>
            <h1 className="heroTitle heroTitle--tight">My Wishlist</h1>
            <p className="sectionSub">Saved items for later.</p>
          </div>
        </div>
        {wishlistProducts.length === 0 ? (
          <div className="emptyState">
            <div className="emptyTitle">No saved items yet.</div>
            <div className="emptySub">Tap the heart icon on a product card to save it.</div>
            <Link className="primaryBtn" to="/">
              Go to Marketplace
            </Link>
          </div>
        ) : (
          <div className="wishlistGrid">
            {wishlistProducts.map((p, i) => (
              <motion.div
                key={p.id}
                className="wishlistCard"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24, delay: i * 0.05 }}
              >
                <img className="wishlistImage" src={p.image} alt={p.title} />
                <div className="wishlistCardTop">
                  <div className="wishlistCardTitle">{p.title}</div>
                  <div className="wishlistCardPrice">{formatINR(p.price)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

