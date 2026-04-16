import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { SectionCard } from '../components/common/SectionCard'
import { useAppState } from '../hooks/useAppState'
import { formatCurrency, formatDate } from '../utils/formatters'
import { ui } from '../utils/ui'
import { getVehicleById, getVehicleDisplayName, sortRecordsByDateDesc } from '../utils/vehicle'

export function VehicleDetailPage() {
  const { vehicleId } = useParams()
  const { state } = useAppState()
  const vehicle = vehicleId ? getVehicleById(state.vehicles, vehicleId) : undefined
  const records = sortRecordsByDateDesc(state.serviceRecords.filter((record) => record.vehicleId === vehicleId)).slice(0, 3)

  if (!vehicle) {
    return (
      <EmptyState
        eyebrow="Vehicle detail"
        title="Vehicle not found"
        description="The requested vehicle does not exist in saved local state."
        action={
          <Link className={ui.buttonPrimary} to="/vehicles">
            Back to garage
          </Link>
        }
      />
    )
  }

  const title = getVehicleDisplayName(vehicle)
  const primaryPhoto = vehicle.photos.find((photo) => photo.isPrimary) ?? vehicle.photos[0]

  return (
    <div className={ui.page}>
      <section className={`${ui.panel} grid gap-5 px-5 py-5 sm:px-7 sm:py-7 lg:grid-cols-[1.1fr_0.9fr]`}>
        <div className="grid content-start gap-4">
          <p className={ui.eyebrow}>{vehicle.nickname || 'Vehicle profile'}</p>
          <h1 className={ui.title}>{title}</h1>
          <p className={ui.muted}>VIN: {vehicle.vin}</p>
          <div className="flex flex-wrap gap-3">
            <Link className={ui.buttonPrimary} to={`/vehicles/${vehicle.id}/service/new`}>
              Add service record
            </Link>
            <Link className={ui.buttonSecondary} to={`/vehicles/${vehicle.id}/edit`}>
              Edit vehicle
            </Link>
            <Link className={ui.buttonSecondary} to={`/vehicles/${vehicle.id}/history`}>
              View full history
            </Link>
          </div>
        </div>
        <div className="min-h-[220px] overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-700 to-stone-500 sm:min-h-[260px]">
          {primaryPhoto ? (
            <img className="h-full w-full object-cover" src={primaryPhoto.dataUrl} alt={title} />
          ) : (
            <div className="grid h-full w-full place-items-center text-3xl font-black text-white">No photo</div>
          )}
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Vehicle overview" description="Core metadata and ownership notes for this vehicle.">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="mb-1 text-sm text-stone-500">Year</dt>
              <dd className="text-lg font-bold text-stone-900">{vehicle.year || '-'}</dd>
            </div>
            <div>
              <dt className="mb-1 text-sm text-stone-500">Make</dt>
              <dd className="text-lg font-bold text-stone-900">{vehicle.make || '-'}</dd>
            </div>
            <div>
              <dt className="mb-1 text-sm text-stone-500">Model</dt>
              <dd className="text-lg font-bold text-stone-900">{vehicle.model || '-'}</dd>
            </div>
            <div>
              <dt className="mb-1 text-sm text-stone-500">Trim</dt>
              <dd className="text-lg font-bold text-stone-900">{vehicle.trim || '-'}</dd>
            </div>
          </dl>
          {vehicle.description ? <p className={`mt-4 max-w-2xl ${ui.muted}`}>{vehicle.description}</p> : null}
        </SectionCard>

        <SectionCard title="Recent service" description="Last three maintenance records for this vehicle.">
          {records.length === 0 ? (
            <p className={ui.muted}>No service history yet.</p>
          ) : (
            <ul className="grid gap-3">
              {records.map((record) => (
                <li key={record.id} className="flex flex-col gap-3 border-b border-stone-200 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-stone-900">{record.serviceType}</p>
                    <p className="text-sm leading-6 text-stone-600">
                      {formatDate(record.date)} - {record.mileage.toLocaleString()} mi
                    </p>
                  </div>
                  <div className="grid gap-1 sm:justify-items-end">
                    <span>{record.cost ? formatCurrency(record.cost, state.settings.currency) : '-'}</span>
                    <Link className="text-sm font-medium text-orange-800 hover:text-orange-900" to={`/vehicles/${vehicle.id}/service/${record.id}/edit`}>
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  )
}
