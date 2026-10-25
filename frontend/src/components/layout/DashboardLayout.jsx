import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Icon({ d, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.7}
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  )
}

const icons = {
  dashboard:    'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  doctors:      'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z',
  patients:     'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
  appointments: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
  profile:      'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
  availability: 'M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  book:         'M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  history:      'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z',
  logout:       'M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9',
}

function NavItem({ to, icon, label, onClick }) {
  const base = 'group relative flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200'
  if (onClick) {
    return (
      <button onClick={onClick}
        className={`${base} text-slate-300 hover:bg-white/5 hover:text-white`}>
        <Icon d={icon} className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
        <span>{label}</span>
      </button>
    )
  }
  return (
    <NavLink to={to}
      className={({ isActive }) =>
        `${base} ${isActive
          ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,.08)]'
          : 'text-slate-300 hover:bg-white/[0.07] hover:text-white hover:translate-x-0.5'}`
      }>
      {({ isActive }) => (
        <>
          <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-primary-400 transition-all duration-200 ${isActive ? 'h-5 opacity-100' : 'h-0 opacity-0'}`} />
          <Icon d={icon} className={`w-5 h-5 transition-colors ${isActive ? 'text-primary-300' : 'text-slate-400 group-hover:text-white'}`} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

const adminNav = [
  { to: '/admin/dashboard',    icon: icons.dashboard,    label: 'Dashboard'    },
  { to: '/admin/doctors',      icon: icons.doctors,      label: 'Doctors'      },
  { to: '/admin/patients',     icon: icons.patients,     label: 'Patients'     },
  { to: '/admin/appointments', icon: icons.appointments, label: 'Appointments' },
]

const doctorNav = [
  { to: '/doctor/dashboard',    icon: icons.dashboard,    label: 'Dashboard'    },
  { to: '/doctor/appointments', icon: icons.appointments, label: 'Appointments' },
  { to: '/doctor/availability', icon: icons.availability, label: 'Availability' },
  { to: '/doctor/profile',      icon: icons.profile,      label: 'My Profile'   },
]

const patientNav = [
  { to: '/patient/dashboard',    icon: icons.dashboard,    label: 'Dashboard'        },
  { to: '/patient/book',         icon: icons.book,         label: 'Book Appointment' },
  { to: '/patient/appointments', icon: icons.appointments, label: 'My Appointments'  },
  { to: '/patient/history',      icon: icons.history,      label: 'Medical History'  },
  { to: '/patient/profile',      icon: icons.profile,      label: 'My Profile'       },
]

export default function DashboardLayout({ children }) {
  const { user, logout, isAdmin, isDoctor } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = isAdmin() ? adminNav : isDoctor() ? doctorNav : patientNav
  const roleLabel = isAdmin() ? 'Administrator' : isDoctor() ? 'Doctor' : 'Patient'
  const roleColor = isAdmin()
    ? 'bg-violet-400/15 text-violet-200'
    : isDoctor()
      ? 'bg-primary-400/15 text-primary-200'
      : 'bg-emerald-400/15 text-emerald-200'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-300 via-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/40 ring-1 ring-white/20">
          <Icon d={icons.doctors} className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-lg font-extrabold tracking-tight text-white">MediCare</span>
          <span className="block text-[10px] font-bold uppercase tracking-[.2em] text-primary-200/70">Care, connected</span>
        </div>
      </div>

      {/* User info */}
      <div className="mx-3 mb-4 p-3.5 rounded-2xl bg-gradient-to-br from-white/[0.1] to-white/[0.04] border border-white/10 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-300 to-primary-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <span className={`inline-block mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium ${roleColor}`}>
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div className="px-5 pb-2 text-[10px] font-bold uppercase tracking-[.2em] text-slate-500">Workspace</div>
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <NavItem icon={icons.logout} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-transparent">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-ink-900 via-[#0d2932] to-[#092027] flex-shrink-0 shadow-[8px_0_30px_-20px_rgba(15,42,51,.65)]">
        {sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 h-full bg-gradient-to-b from-ink-900 via-[#0d2932] to-[#092027] shadow-2xl z-50 animate-pop">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/75 backdrop-blur-xl border-b border-white/80 px-4 lg:px-8 py-3.5 flex items-center justify-between lg:justify-end shadow-[0_1px_0_rgba(255,255,255,.7)]">
          <button
            className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-500">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-primary-700"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,.15)]" />System operational</span>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Page content */}
        <main className="page-enter flex-1 overflow-y-auto p-4 sm:p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
