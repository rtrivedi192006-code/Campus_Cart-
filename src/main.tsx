import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './state/AuthContext'
import { WishlistProvider } from './state/WishlistContext'
import { RecentlyViewedProvider } from './state/RecentlyViewedContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <WishlistProvider>
          <RecentlyViewedProvider>
            <App />
          </RecentlyViewedProvider>
        </WishlistProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
