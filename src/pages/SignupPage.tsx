import { Link, useNavigate } from 'react-router-dom'
import MagneticButton from '../components/MagneticButton'
import { useAuth } from '../state/AuthContext'
import { useState, type FormEvent } from 'react'

export default function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const [name, setName] = useState('')
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
      await signup(email, password, name)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Could not create account. Please try again.')
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <h1 className="authTitle">Create your CampusCart</h1>
        <p className="authSub">Set up your account to wishlist and list items.</p>

        <form className="authForm" onSubmit={onSubmit}>
          <label className="field">
            <span className="fieldLabel">Name</span>
            <input
              className="fieldInput"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>

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
              placeholder="Create a password"
              type="password"
              autoComplete="new-password"
            />
          </label>

          {error ? <div className="formError">{error}</div> : null}

          <MagneticButton className="primaryBtn authSubmit" type="submit" intensity={12}>
            Sign up
          </MagneticButton>

          <p className="authHint">
            Already have an account?{' '}
            <Link to="/login" className="link">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

