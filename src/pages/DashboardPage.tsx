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
  const myListings = useMemo(() => products.filter((p) => p.seller === (user?.name ?? '')), [user?.name])
  const soldItems = useMemo(() => products.filter((_, i) => i % 5 === 0).slice(0, 3), [])

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
            <motion.div className="statCard statCard--glass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="statValue">{wishlistProducts.length}</div>
              <div className="statLabel">Wishlist items</div>
            </motion.div>
            <motion.div className="statCard statCard--glass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="statValue">{myListings.length || products.length}</div>
              <div className="statLabel">Total listings</div>
            </motion.div>
            <motion.div className="statCard statCard--glass" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <div className="statValue">{soldItems.length}</div>
              <div className="statLabel">Items sold</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle">My Listings</h2>
            <p className="sectionSub">Items you listed for sale/exchange.</p>
          </div>
        </div>
        {(myListings.length > 0 ? myListings : products.slice(0, 3)).length === 0 ? (
          <div className="emptyState">
            <div className="emptyTitle">No listings yet.</div>
            <div className="emptySub">Add your first item from the Sell page.</div>
            <button className="primaryBtn" type="button" onClick={() => navigate('/')}>
              Explore now
            </button>
          </div>
        ) : (
          <div className="wishlistGrid">
            {(myListings.length > 0 ? myListings : products.slice(0, 3)).map((p) => (
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

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle">Sold Items</h2>
            <p className="sectionSub">Completed campus deals.</p>
          </div>
        </div>
        <div className="wishlistGrid">
          {soldItems.map((p) => (
            <div key={p.id} className="wishlistCard">
              <div className="wishlistCardGlow" style={{ backgroundImage: p.gradient }} />
              <div className="wishlistCardTop">
                <div className="wishlistCardTitle">{p.title}</div>
                <div className="statusBadge statusBadge--accepted">Sold</div>
              </div>
              <div className="wishlistCardMeta">
                <span>{p.condition}</span>
                <span className="dotSep" aria-hidden="true">•</span>
                <span>{formatINR(p.price)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="sectionHeader">
          <div>
            <h2 className="sectionTitle">Wishlist</h2>
            <p className="sectionSub">Quick preview of your saved items.</p>
          </div>
        </div>
        <div className="wishlistGrid">
          {wishlistProducts.slice(0, 3).map((p) => (
            <div key={p.id} className="wishlistCard">
              <div className="wishlistCardGlow" style={{ backgroundImage: p.gradient }} />
              <div className="wishlistCardTop">
                <div className="wishlistCardTitle">{p.title}</div>
                <div className="wishlistCardPrice">{formatINR(p.price)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

