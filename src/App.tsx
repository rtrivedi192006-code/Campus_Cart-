import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import SiteHeader from './components/SiteHeader'
import RequireAuth from './components/RequireAuth'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import NotFoundPage from './pages/NotFoundPage'
import WishlistPage from './pages/WishlistPage'
import ChatPage from './pages/ChatPage'
import SellPage from './pages/SellPage'
import { useAuth } from './state/AuthContext'

export default function App() {
  const location = useLocation()
  const { user } = useAuth()

  return (
    <div className="appShell">
      <SiteHeader />
      <main className="appMain">
        <Routes location={location}>
          <Route
            path="/"
            element={user ? <HomePage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />}
          />
          <Route
            path="/chat"
            element={
              <RequireAuth>
                <ChatPage />
              </RequireAuth>
            }
          />
          <Route
            path="/sell"
            element={
              <RequireAuth>
                <SellPage />
              </RequireAuth>
            }
          />
          <Route
            path="/wishlist"
            element={
              <RequireAuth>
                <WishlistPage />
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route path="/buy/:productId" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}
