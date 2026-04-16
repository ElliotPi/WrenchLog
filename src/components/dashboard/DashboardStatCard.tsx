import { ui } from '../../utils/ui'

interface DashboardStatCardProps {
  label: string
  value: string
  helper: string
}

export function DashboardStatCard({ label, value, helper }: DashboardStatCardProps) {
  return (
    <article className={`${ui.card} bg-gradient-to-br from-white to-stone-50 px-5 py-5 sm:px-6`}>
      <p className={ui.eyebrow}>{label}</p>
      <p className="mt-2 text-4xl font-black tracking-tight text-stone-900 sm:text-[2.6rem]">{value}</p>
      <p className={`mt-2 text-sm leading-6 text-stone-600`}>{helper}</p>
    </article>
  )
}
