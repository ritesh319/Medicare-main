import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const HEART = 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z'

function Logo({ dark = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-900/30">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8}
          strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
          <path d={HEART} />
        </svg>
      </div>
      <span className={`text-xl font-extrabold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>MediCare</span>
    </div>
  )
}

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between w-1/2 bg-ink-900 p-12 text-white">
        {/* Soft glowing shapes */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-primary-500/30 blur-3xl animate-float" />
        <div className="absolute -bottom-32 -right-16 w-[28rem] h-[28rem] rounded-full bg-primary-700/40 blur-3xl animate-float [animation-delay:-7s]" />

        <div className="relative"><Logo dark /></div>

        <div className="relative">
          <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
            Your health,<br />our priority.
          </h1>
          <p className="text-slate-300 text-lg max-w-md leading-relaxed">
            Streamlined hospital management — appointments, records, and care, all in one place.
          </p>
        </div>

        {/* Heartbeat line */}
        <div className="relative">
          <svg viewBox="0 0 640 120" className="w-full h-24" fill="none" aria-hidden="true">
            <path
              d="M0 60 H120 L140 60 L155 20 L175 100 L190 40 L205 60 H400 L420 60 L435 20 L455 100 L470 40 L485 60 H640"
              pathLength="1000"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1000"
              className="text-primary-300 animate-ecg drop-shadow-[0_0_8px_rgba(127,210,200,0.7)]"
            />
          </svg>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white/60">
        <div className="w-full max-w-md animate-rise">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden"><Logo /></div>

          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm animate-pop">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
