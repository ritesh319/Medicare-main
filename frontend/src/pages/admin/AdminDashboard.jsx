import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { StatCard, LoadingSpinner, PageHeader } from '../../components/common'
import { adminApi, appointmentsApi } from '../../api'

export default function AdminDashboard() {
  const [stats, setStats]             = useState(null)
  const [appointments, setAppointments] = useState([])
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [s, appts] = await Promise.all([
          adminApi.getDashboardStats(),
          appointmentsApi.getAll(),
        ])
        const applications = await adminApi.getPendingDoctors()
        setStats(s)
        setAppointments(appts.slice(0, 8))
        setPendingDoctors(applications)
      } catch (_) {}
      finally { setLoading(false) }
    }
    load()
  }, [])

  async function decideDoctor(id, approved) {
    if (approved) await adminApi.approveDoctor(id)
    else await adminApi.rejectDoctor(id)
    setPendingDoctors(current => current.filter(doctor => doctor.id !== id))
  }

  return (
    <DashboardLayout>
      <PageHeader title="Dashboard" subtitle="Overview of hospital activity" />

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard title="Total Patients"  value={stats?.totalPatients}     icon="🧑‍🤝‍🧑" color="blue"   />
            <StatCard title="Total Doctors"   value={stats?.totalDoctors}      icon="👨‍⚕️" color="green"  />
            <StatCard title="Appointments"    value={stats?.totalAppointments} icon="📅" color="purple" />
            <StatCard title="Today"           value={stats?.todaysAppointments} icon="🗓" color="yellow" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard title="Pending"   value={stats?.pendingAppointments}   icon="⏳" color="yellow" />
            <StatCard title="Confirmed" value={stats?.confirmedAppointments} icon="✅" color="blue"   />
            <StatCard title="Completed" value={stats?.completedAppointments} icon="🎯" color="green"  />
            <StatCard title="Cancelled" value={stats?.cancelledAppointments} icon="❌" color="red"    />
          </div>

          {/* Pending doctor applications and uploaded proof documents */}
          {pendingDoctors.length > 0 && (
            <div className="card mb-6 border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-amber-900">Pending doctor applications</h2>
                  <p className="text-sm text-amber-700">Review the uploaded proof document before approving.</p>
                </div>
                <span className="text-xs text-amber-700">{pendingDoctors.length} awaiting review</span>
              </div>
              <div className="space-y-3">
                {pendingDoctors.map(doctor => (
                  <div key={doctor.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3">
                    <div>
                      <p className="font-medium text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</p>
                      <p className="text-xs text-gray-500">{doctor.specialization} · {doctor.qualification} · {doctor.licenseNumber}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      {doctor.proofDocumentUrl ? (
                        <a href={doctor.proofDocumentUrl} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:text-blue-800">
                          View proof PDF
                        </a>
                      ) : (
                        <span className="text-gray-400">No proof document</span>
                      )}
                      <button onClick={() => decideDoctor(doctor.id, true)} className="font-medium text-green-700">Approve</button>
                      <button onClick={() => decideDoctor(doctor.id, false)} className="font-medium text-red-700">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent appointments table */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No appointments yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Patient','Doctor','Date','Time Slot','Status'].map(h => (
                        <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {appointments.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2 font-medium text-gray-900">{a.patientName}</td>
                        <td className="py-3 px-2 text-gray-600">Dr. {a.doctorName}</td>
                        <td className="py-3 px-2 text-gray-600">{a.appointmentDate}</td>
                        <td className="py-3 px-2 text-gray-600">{a.timeSlot}</td>
                        <td className="py-3 px-2">
                          <span className={`badge-${a.status?.toLowerCase()}`}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
