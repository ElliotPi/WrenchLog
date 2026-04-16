import type { PropsWithChildren, ReactNode } from 'react'
import { ui } from '../../utils/ui'

interface SectionCardProps extends PropsWithChildren {
  title: string
  description?: string
  actions?: ReactNode
}

export function SectionCard({ title, description, actions, children }: SectionCardProps) {
  return (
    <section className={`${ui.card} px-5 py-5 sm:px-6 sm:py-6`}>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight text-stone-900 sm:text-2xl">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-stone-600 sm:text-base">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
      {children}
    </section>
  )
}
