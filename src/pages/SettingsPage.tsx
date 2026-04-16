import { SectionCard } from '../components/common/SectionCard'
import { useAppState } from '../hooks/useAppState'
import { ui } from '../utils/ui'

export function SettingsPage() {
  const { state } = useAppState()

  return (
    <div className={ui.pageNarrow}>
      <section className={`${ui.card} px-5 py-5 sm:px-6 sm:py-6`}>
        <p className={ui.eyebrow}>Settings</p>
        <h1 className={ui.title}>Local preferences and project controls.</h1>
        <p className={`mt-3 ${ui.muted}`}>
          This page is prepared for date formatting, export/import, and reset tools.
        </p>
      </section>

      <SectionCard title="Current defaults" description="Values currently persisted in local storage.">
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="mb-1 text-sm text-stone-500">Distance unit</dt>
            <dd className="text-lg font-bold text-stone-900">{state.settings.preferredMileageUnit}</dd>
          </div>
          <div>
            <dt className="mb-1 text-sm text-stone-500">Currency</dt>
            <dd className="text-lg font-bold text-stone-900">{state.settings.currency}</dd>
          </div>
          <div>
            <dt className="mb-1 text-sm text-stone-500">Date format</dt>
            <dd className="text-lg font-bold text-stone-900">{state.settings.dateFormat}</dd>
          </div>
        </dl>
      </SectionCard>
    </div>
  )
}
