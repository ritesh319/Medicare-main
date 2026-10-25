export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }
  return (
    <div className={`flex justify-center items-center py-8 ${className}`} role="status" aria-label="Loading">
      <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
    </div>
  )
}

const statusMap = {
  PENDING: 'badge-pending',
  CONFIRMED: 'badge-confirmed',
  COMPLETED: 'badge-completed',
  CANCELLED: 'badge-cancelled',
  NO_SHOW: 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200',
}

export function StatusBadge({ status }) {
  return <span className={statusMap[status] ?? 'badge-pending'}>{status}</span>
}

export function StatCard({ title, value, icon, color = 'blue', sub }) {
  const colors = {
    blue: 'bg-primary-50 text-primary-600 ring-primary-100',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    purple: 'bg-violet-50 text-violet-600 ring-violet-100',
    yellow: 'bg-amber-50 text-amber-600 ring-amber-100',
    red: 'bg-rose-50 text-rose-600 ring-rose-100',
    teal: 'bg-primary-50 text-primary-600 ring-primary-100',
  }
  return (
    <div className="card group flex items-start gap-3 p-4 sm:gap-4 sm:p-6 hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgba(31,127,121,0.34)]">
      <div className={`w-10 h-10 rounded-xl ring-1 flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-300 sm:w-12 sm:h-12 sm:rounded-2xl sm:text-2xl group-hover:scale-110 group-hover:rotate-3 ${colors[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-500 font-semibold leading-tight sm:text-sm">{title}</p>
        <p className="text-2xl font-extrabold tracking-tight text-slate-900 mt-0.5 sm:text-3xl">{value ?? '—'}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-ink-900/60 backdrop-blur-sm animate-pop" onClick={onClose} />
      <div className="relative animate-pop bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-white/70">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
          <button onClick={onClose} className="w-9 h-9 inline-flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close dialog">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 rounded-b-3xl">{footer}</div>}
      </div>
    </div>
  )
}

export function EmptyState({ icon = '📭', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="w-16 h-16 mb-4 rounded-2xl bg-primary-50 ring-1 ring-primary-100 flex items-center justify-center text-3xl">{icon}</span>
      <h3 className="text-lg font-extrabold text-slate-900 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  )
}

export function Alert({ type = 'error', message, onDismiss }) {
  if (!message) return null
  const styles = {
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
  }
  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm animate-pop ${styles[type]}`} role="alert">
      <span className="flex-1">{message}</span>
      {onDismiss && <button onClick={onDismiss} className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity" aria-label="Dismiss">✕</button>}
    </div>
  )
}

export function FormField({ label, error, required, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-bold text-slate-700 mb-1.5">{label}{required && <span className="text-rose-500 ml-0.5">*</span>}</label>}
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  )
}

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-7">
      <div>
        <p className="section-eyebrow mb-2">MediCare workspace</p>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
