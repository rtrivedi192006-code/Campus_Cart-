import { Link, useLocation, useNavigate } from 'react-router-dom'
import MagneticButton from '../components/MagneticButton'
import { useAuth } from '../state/AuthContext'
import { useState, type FormEvent } from 'react'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError('Please enter your campus email.')
      return
    }
    if (!password.trim()) {
      setError('Password is required.')
      return
    }

    try {
      await login(email, password)
      const from = (location.state as { from?: string } | null)?.from
      if (from) navigate(from, { replace: true })
    } catch {
      setError('Could not log in. Please try again.')
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <h1 className="authTitle">Welcome back</h1>
        <p className="authSub">
          Log in to save wishlist items and manage your campus listings.
        </p>

        <form className="authForm" onSubmit={onSubmit}>
          <label className="field">
            <span className="fieldLabel">Email</span>
            <input
              className="fieldInput"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span className="fieldLabel">Password</span>
            <input
              className="fieldInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
            />
          </label>

          {error ? <div className="formError">{error}</div> : null}

          <MagneticButton className="primaryBtn authSubmit" type="submit" intensity={12}>
            Log in
          </MagneticButton>

          <p className="authHint">
            New on CampusCart?{' '}
            <Link to="/signup" className="link">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

