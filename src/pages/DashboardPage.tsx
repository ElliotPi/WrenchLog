import { Link } from 'react-router-dom'
import { CostChart } from '../components/dashboard/CostChart'
import { DashboardStatCard } from '../components/dashboard/DashboardStatCard'
import { RecentActivityList } from '../components/dashboard/RecentActivityList'
import { SectionCard } from '../components/common/SectionCard'
import { useAppState } from '../hooks/useAppState'
import { formatCurrency } from '../utils/formatters'
import { ui } from '../utils/ui'
import {
  buildMonthlyCostSeries,
  getRecentActivity,
  getTotalMaintenanceCost,
  getVehicleDisplayName,
} from '../utils/vehicle'

export function DashboardPage() {
  const { state } = useAppState()
  const totalCost = getTotalMaintenanceCost(state.serviceRecords)
  const recentActivity = getRecentActivity(state.vehicles, state.serviceRecords)
  const monthlyCosts = buildMonthlyCostSeries(state.serviceRecords)
  const latestVehicle = state.vehicles[0]

  return (
    <div className={ui.page}>
      <section className={`${ui.panel} grid gap-5 overflow-hidden px-5 py-5 sm:px-7 sm:py-7 lg:grid-cols-[1.2fr_0.8fr]`}>
        <div>
          <p className={ui.eyebrow}>WrenchLog dashboard</p>
          <h1 className={ui.heroTitle}>
            Keep every oil change, brake job, and inspection in one garage log.
          </h1>
          <p className={`mt-4 max-w-2xl ${ui.muted}`}>
            Track vehicle profiles, decode VIN details from NHTSA, and build a maintenance history
            that survives refreshes through local storage.
          </p>
          <div className="mt-5 flex flex-wrap gap-5 text-sm font-medium text-stone-700">
            <span className="rounded-full bg-white/80 px-3 py-2 ring-1 ring-stone-200">VIN decoding via NHTSA vPIC</span>
            <span className="rounded-full bg-white/80 px-3 py-2 ring-1 ring-stone-200">Persistent local garage data</span>
          </div>
        </div>
        <div className="flex flex-wrap content-start gap-3 lg:justify-end lg:pt-2">
          <Link className={ui.buttonPrimary} to="/vehicles/new">
            Add vehicle
          </Link>
          <Link className={ui.buttonSecondary} to="/vehicles">
            Browse garage
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <DashboardStatCard
          label="Tracked vehicles"
          value={String(state.vehicles.length)}
          helper={latestVehicle ? `Latest: ${getVehicleDisplayName(latestVehicle)}` : 'Start by adding your first vehicle.'}
        />
        <DashboardStatCard
          label="Service records"
          value={String(state.serviceRecords.length)}
          helper="Oil changes, brakes, filters, and custom service history."
        />
        <DashboardStatCard
          label="Logged spend"
          value={formatCurrency(totalCost, state.settings.currency)}
          helper="Computed from your locally stored maintenance records."
        />
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard
          title="Maintenance cost trend"
          description="Monthly spend gives the garage dashboard a quick maintenance health signal."
        >
          <CostChart data={monthlyCosts} />
        </SectionCard>

        <SectionCard
          title="Recent activity"
          description="Most recent maintenance events across the entire garage."
          actions={
            <Link className={ui.buttonGhost} to={latestVehicle ? `/vehicles/${latestVehicle.id}` : '/vehicles/new'}>
              {latestVehicle ? 'Open latest vehicle' : 'Add first vehicle'}
            </Link>
          }
        >
          <RecentActivityList items={recentActivity} />
        </SectionCard>
      </div>
    </div>
  )
}
