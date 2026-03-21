import React from 'react'

export function Skeleton({ width = '100%', height = 16, radius = 8, className = '' }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="sea-card p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} radius={10} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={14} />
          <Skeleton width="40%" height={11} />
        </div>
      </div>
      <div className="space-y-2 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
        <Skeleton height={12} />
        <Skeleton width="80%" height={12} />
        <Skeleton width="60%" height={12} />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: 'var(--bg-card)' }}>
          <Skeleton width={32} height={32} radius={8} />
          <Skeleton width="25%" height={13} />
          <Skeleton width="20%" height={13} />
          <Skeleton width="15%" height={13} />
          <div className="flex-1" />
          <Skeleton width={70} height={26} radius={8} />
        </div>
      ))}
    </div>
  )
}
