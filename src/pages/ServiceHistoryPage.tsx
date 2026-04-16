import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { SectionCard } from '../components/common/SectionCard'
import { useAppState } from '../hooks/useAppState'
import { formatCurrency, formatDate } from '../utils/formatters'
import { ui } from '../utils/ui'
import { getVehicleById, getVehicleDisplayName, sortRecordsByDateDesc } from '../utils/vehicle'

export function ServiceHistoryPage() {
  const { vehicleId } = useParams()
  const { state } = useAppState()
  const vehicle = vehicleId ? getVehicleById(state.vehicles, vehicleId) : undefined
  const records = sortRecordsByDateDesc(state.serviceRecords.filter((record) => record.vehicleId === vehicleId))

  if (!vehicle) {
    return (
      <EmptyState
        eyebrow="Missing vehicle"
        title="Vehicle not found"
        description="Select a valid vehicle to review its maintenance history."
        action={
          <Link className={ui.buttonPrimary} to="/vehicles">
            Back to vehicles
          </Link>
        }
      />
    )
  }

  return (
    <div className={ui.page}>
      <section className={`${ui.card} px-5 py-5 sm:px-6 sm:py-6`}>
        <p className={ui.eyebrow}>Maintenance history</p>
        <h1 className={ui.title}>{getVehicleDisplayName(vehicle)}</h1>
        <p className={`mt-3 ${ui.muted}`}>Full maintenance timeline with edit access for every saved service record.</p>
      </section>

      <SectionCard
        title="Service records"
        description="Chronological maintenance log for the selected vehicle."
        actions={
          <Link className={ui.buttonPrimary} to={`/vehicles/${vehicle.id}/service/new`}>
            Add record
          </Link>
        }
      >
        {records.length === 0 ? (
          <p className={ui.muted}>No records logged yet.</p>
        ) : (
          <div className="-mx-2 overflow-x-auto sm:mx-0">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-stone-200 px-3 py-3 text-left text-sm font-semibold text-stone-700">Date</th>
                  <th className="border-b border-stone-200 px-3 py-3 text-left text-sm font-semibold text-stone-700">Service</th>
                  <th className="border-b border-stone-200 px-3 py-3 text-left text-sm font-semibold text-stone-700">Mileage</th>
                  <th className="border-b border-stone-200 px-3 py-3 text-left text-sm font-semibold text-stone-700">Cost</th>
                  <th className="border-b border-stone-200 px-3 py-3 text-left text-sm font-semibold text-stone-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="border-b border-stone-200 px-3 py-3 text-sm text-stone-700">{formatDate(record.date)}</td>
                    <td className="border-b border-stone-200 px-3 py-3 text-sm font-medium text-stone-900">{record.serviceType}</td>
                    <td className="border-b border-stone-200 px-3 py-3 text-sm text-stone-700">{record.mileage.toLocaleString()}</td>
                    <td className="border-b border-stone-200 px-3 py-3 text-sm text-stone-700">{record.cost ? formatCurrency(record.cost, state.settings.currency) : '-'}</td>
                    <td className="border-b border-stone-200 px-3 py-3 text-sm">
                      <Link className="font-medium text-orange-800 hover:text-orange-900" to={`/vehicles/${vehicle.id}/service/${record.id}/edit`}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
