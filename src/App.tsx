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

export default function App() {
  const location = useLocation()

  return (
    <div className="appShell">
      <SiteHeader />
      <main className="appMain">
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
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
