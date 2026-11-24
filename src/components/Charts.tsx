import { useId, useState } from 'react'
import { cn } from '../lib/utils'

function path(points: [number, number][]) {
  // smooth curve (Catmull-Rom → Bezier)
  if (points.length < 2) return ''
  let d = `M ${points[0][0]} ${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C ${c1[0]} ${c1[1]}, ${c2[0]} ${c2[1]}, ${p2[0]} ${p2[1]}`
  }
  return d
}

export function Sparkline({ data, className, stroke = 'currentColor' }: { data: number[]; className?: string; stroke?: string }) {
  const w = 120
  const h = 40
  const max = Math.max(...data, 1)
  const min = Math.min(...data, 0)
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 4 - ((v - min) / (max - min || 1)) * (h - 8)] as [number, number])
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none" aria-hidden>
      <path d={path(pts)} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function AreaChart({
  data,
  labels,
  secondary,
  height = 240,
  format = (v: number) => v.toLocaleString(),
}: {
  data: number[]
  labels: string[]
  secondary?: number[]
  height?: number
  format?: (v: number) => string
}) {
  const id = useId()
  const [hover, setHover] = useState<number | null>(null)
  const w = 800
  const h = height
  const padB = 28
  const padT = 12
  const max = Math.max(...data, ...(secondary ?? []), 1) * 1.1
  const x = (i: number) => (i / Math.max(1, data.length - 1)) * w
  const y = (v: number) => padT + (1 - v / max) * (h - padB - padT)
  const pts = data.map((v, i) => [x(i), y(v)] as [number, number])
  const pts2 = secondary?.map((v, i) => [x(i), y(v)] as [number, number])
  const line = path(pts)
  const step = Math.ceil(labels.length / 7)

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect()
          const i = Math.round(((e.clientX - r.left) / r.width) * (data.length - 1))
          setHover(Math.max(0, Math.min(data.length - 1, i)))
        }}
      >
        <defs>
          <linearGradient id={`g${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#6a4be0" stopOpacity="0.28" />
            <stop offset="1" stopColor="#6a4be0" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1="0" x2={w} y1={y(max * t)} y2={y(max * t)} stroke="#ece8f8" strokeDasharray="4 6" vectorEffect="non-scaling-stroke" />
        ))}
        <path d={`${line} L ${w} ${h - padB} L 0 ${h - padB} Z`} fill={`url(#g${id})`} />
        {pts2 && <path d={path(pts2)} fill="none" stroke="#c3b5fb" strokeWidth="2" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />}
        <path d={line} fill="none" stroke="#5638c4" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1={padT} y2={h - padB} stroke="#c3b5fb" vectorEffect="non-scaling-stroke" />}
      </svg>
      {hover !== null && (
        <>
          <span
            className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-700 shadow"
            style={{ left: `${(x(hover) / w) * 100}%`, top: y(data[hover]) * (height / h) }}
          />
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-ink px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-lg"
            style={{ left: `${Math.min(92, Math.max(8, (x(hover) / w) * 100))}%`, top: y(data[hover]) - 10 }}
          >
            <div className="font-semibold">{format(data[hover])} views</div>
            {secondary && <div className="text-white/70">{format(secondary[hover])} scans</div>}
            <div className="text-white/60">{labels[hover]}</div>
          </div>
        </>
      )}
      <div className="mt-1 flex justify-between px-1 text-[11px] text-muted">
        {labels.map((l, i) => (i % step === 0 ? <span key={i}>{l}</span> : null))}
      </div>
    </div>
  )
}

export function BarChart({ data, labelFor, className }: { data: { label: string; value: number }[]; labelFor?: (v: number) => string; className?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  const peak = data.reduce((a, b) => (b.value > a.value ? b : a), data[0])
  return (
    <div className={cn('flex h-48 items-end gap-1.5', className)}>
      {data.map((d) => (
        <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-1.5">
          <span className="text-[10px] font-semibold text-brand-700 opacity-0 transition group-hover:opacity-100">
            {labelFor ? labelFor(d.value) : d.value}
          </span>
          <div
            className={cn('w-full rounded-t-md transition-all', d === peak ? 'bg-brand-700' : 'bg-brand-200 group-hover:bg-brand-400')}
            style={{ height: `${(d.value / max) * 100}%` }}
          />
          <span className="text-[10px] text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
