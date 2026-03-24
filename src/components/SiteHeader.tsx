import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../state/AuthContext'
import { useWishlist } from '../state/WishlistContext'

export default function SiteHeader() {
  const { user, logout } = useAuth()
  const { likedIds } = useWishlist()
  const navigate = useNavigate()

  return (
    <motion.header 
      className="siteHeader"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    >
      <div className="siteHeaderInner">
        <Link to="/" className="brand">
          <span className="brandMark" aria-hidden="true">
            A
          </span>
          <span className="brandText">CampusCart</span>
          <span className="brandSub">College Marketplace</span>
        </Link>

        <nav className="topNav" aria-label="Primary">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Marketplace
          </NavLink>
          <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : '')}>
            Chat
          </NavLink>
          <NavLink to="/sell" className={({ isActive }) => (isActive ? 'active' : '')}>
            Sell
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => (isActive ? 'active' : '')}>
            Wishlist
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
            Dashboard
          </NavLink>
        </nav>

        <div className="headerActions">
          <div className="wishCount" role="status" aria-label="Wishlist count">
            <Heart size={18} />
            <span>{likedIds.length}</span>
          </div>

          {user ? (
            <button
              className="ghostBtn"
              type="button"
              onClick={() => {
                logout()
                navigate('/')
              }}
              aria-label="Log out"
            >
              <LogOut size={18} />
              <span className="hideSm">Logout</span>
            </button>
          ) : (
            <div className="authLinks">
              <Link className="ghostBtn" to="/login">
                Login
              </Link>
              <Link className="primaryBtn" to="/signup">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  )
}

