import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ThemeToggle } from '../../components/common'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', phone: '', role: 'PATIENT',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      const { confirmPassword, ...payload } = form
      await register(payload)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20"><ThemeToggle compact /></div>
      <div className="absolute -top-32 -right-24 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 w-[28rem] h-[28rem] rounded-full bg-sky-200/25 blur-3xl" />
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8 relative">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/20">
            <span className="text-white font-extrabold text-lg">+</span>
          </div>
          <div>
            <span className="block font-extrabold tracking-tight text-slate-900 text-xl">MediCare</span>
            <span className="block text-[10px] font-bold uppercase tracking-[.2em] text-primary-600">Care, connected</span>
          </div>
        </div>

        <div className="relative bg-white/90 rounded-3xl shadow-[0_24px_70px_-30px_rgba(15,42,51,.34)] border border-white/80 p-6 sm:p-8 backdrop-blur-xl animate-rise">
          <p className="section-eyebrow mb-2">Patient portal</p>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Create an account</h2>
          <p className="text-slate-500 text-sm mb-6">Join a calmer, more connected care experience.</p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                <input name="firstName" value={form.firstName} onChange={handleChange}
                  required className="input-field" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                <input name="lastName" value={form.lastName} onChange={handleChange}
                  required className="input-field" placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                required className="input-field" placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                className="input-field" placeholder="+1234567890" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Register as</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="input-field">
                <option value="PATIENT">Patient</option>
                <option value="DOCTOR">Doctor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                required className="input-field" placeholder="Min. 8 characters" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword}
                onChange={handleChange} required className="input-field" placeholder="Repeat password" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base mt-2">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
