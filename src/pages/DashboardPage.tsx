import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../state/AuthContext'
import { useWishlist } from '../state/WishlistContext'
import { formatINR, products } from '../data/catalog'
import MagneticButton from '../components/MagneticButton'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { likedIds } = useWishlist()

  const wishlistProducts = useMemo(() => {
    if (likedIds.length === 0) return []
    const likedSet = new Set(likedIds)
    return products.filter((p) => likedSet.has(p.id))
  }, [likedIds])

  return (
    <div className="page">
      <section className="dashHero">
        <motion.div
          className="dashHeroInner"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
        >
          <div className="dashTitleRow">
            <div>
              <p className="heroKicker heroKicker--tight">Welcome</p>
              <h1 className="heroTitle heroTitle--tight">
                {user ? user.name : 'Student'}’s dashboard
              </h1>
            </div>
            <MagneticButton
              className="primaryBtn"
              intensity={12}
              type="button"
              onClick={() => navigate('/')}
            >
              Browse listings
            </MagneticButton>
          </div>

          <div className="dashStats">
            <div className="statCard statCard--glass">
              <div className="statValue">{wishlistProducts.length}</div>
              <div className="statLabel">Wishlist items</div>
            </div>
            <div className="statCard statCard--glass">
              <div className="statValue">{products.length}</div>
              <div className="statLabel">Marketplace listings</div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle">Wishlist</h2>
            <p className="sectionSub">Your saved items (demo state).</p>
          </div>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="emptyState">
            <div className="emptyTitle">No wishlist items yet.</div>
            <div className="emptySub">Tap the heart on any listing to save it.</div>
            <button className="primaryBtn" type="button" onClick={() => navigate('/')}>
              Explore now
            </button>
          </div>
        ) : (
          <div className="wishlistGrid">
            {wishlistProducts.map((p) => (
              <div key={p.id} className="wishlistCard">
                <div className="wishlistCardGlow" style={{ backgroundImage: p.gradient }} />
                <div className="wishlistCardTop">
                  <div className="wishlistCardTitle">{p.title}</div>
                  <div className="wishlistCardPrice">{formatINR(p.price)}</div>
                </div>
                <div className="wishlistCardMeta">
                  <span>{p.condition}</span>
                  <span className="dotSep" aria-hidden="true">
                    •
                  </span>
                  <span>Seller: {p.seller}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

