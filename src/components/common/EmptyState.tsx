import type { ReactNode } from 'react'
import { ui } from '../../utils/ui'

interface EmptyStateProps {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ eyebrow, title, description, action }: EmptyStateProps) {
  return (
    <section className={`${ui.card} px-6 py-8 text-center`}>
      {eyebrow ? <p className={ui.eyebrow}>{eyebrow}</p> : null}
      <h2 className="mt-1 text-3xl font-black tracking-tight text-stone-900 sm:text-4xl">{title}</h2>
      <p className={`mx-auto mt-3 max-w-2xl ${ui.muted}`}>{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  )
}
