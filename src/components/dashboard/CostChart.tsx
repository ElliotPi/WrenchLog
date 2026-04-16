import { ui } from '../../utils/ui'
import { ResponsiveContainer, Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

interface CostDatum {
  month: string
  total: number
}

interface CostChartProps {
  data: CostDatum[]
}

export function CostChart({ data }: CostChartProps) {
  if (data.length === 0) {
    return <p className={ui.muted}>No service cost data yet. Add maintenance records to populate this chart.</p>
  }

  return (
    <div className="min-h-[240px] w-full">
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c65c29" stopOpacity={0.65} />
              <stop offset="95%" stopColor="#c65c29" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(120, 113, 108, 0.28)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={48} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#963e17"
            fill="url(#costGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
