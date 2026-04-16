import { Link } from 'react-router-dom'
import { EmptyState } from '../components/common/EmptyState'
import { VehicleCard } from '../components/vehicles/VehicleCard'
import { useAppState } from '../hooks/useAppState'
import { ui } from '../utils/ui'

export function VehiclesPage() {
  const { state } = useAppState()

  return (
    <div className={ui.page}>
      <section className={`${ui.card} flex flex-col gap-4 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-end lg:justify-between`}>
        <div>
          <p className={ui.eyebrow}>Garage</p>
          <h1 className={ui.title}>Track vehicles, photos, and service history.</h1>
          <p className={`mt-3 ${ui.muted}`}>Open a vehicle card to edit details, review records, or log the next service event.</p>
        </div>
        <Link className={ui.buttonPrimary} to="/vehicles/new">
          Add vehicle
        </Link>
      </section>

      {state.vehicles.length === 0 ? (
        <EmptyState
          eyebrow="No vehicles yet"
          title="Your garage is empty."
          description="Use the VIN decoder to start a vehicle profile and then build out service history from there."
          action={
            <Link className={ui.buttonPrimary} to="/vehicles/new">
              Create first vehicle
            </Link>
          }
        />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {state.vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </section>
      )}
    </div>
  )
}
