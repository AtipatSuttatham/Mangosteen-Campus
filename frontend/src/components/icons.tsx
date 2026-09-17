export interface IconProps {
  size?: number
  className?: string
}

// สัญลักษณ์กลีบเลี้ยงมังคุด — โลโก้และลายน้ำของแบรนด์ (ดู wireframe artifact)
export function CalyxMark({ size = 24, className }: IconProps) {
  const petal = 'M24 6 C29 13 29 20 24 25 C19 20 19 13 24 6 Z'
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className}>
      <g fill="currentColor">
        <path d={petal} />
        <path d={petal} transform="rotate(60 24 24)" />
        <path d={petal} transform="rotate(120 24 24)" />
        <path d={petal} transform="rotate(180 24 24)" />
        <path d={petal} transform="rotate(240 24 24)" />
        <path d={petal} transform="rotate(300 24 24)" />
        <circle cx="24" cy="24" r="3.4" />
      </g>
    </svg>
  )
}

export function CalyxOutlineMark({ size = 24, className }: IconProps) {
  const petal = 'M24 6 C29 13 29 20 24 25 C19 20 19 13 24 6 Z'
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth={0.9} className={className}>
      <path d={petal} />
      <path d={petal} transform="rotate(60 24 24)" />
      <path d={petal} transform="rotate(120 24 24)" />
      <path d={petal} transform="rotate(180 24 24)" />
      <path d={petal} transform="rotate(240 24 24)" />
      <path d={petal} transform="rotate(300 24 24)" />
      <circle cx="24" cy="24" r="3.4" />
    </svg>
  )
}

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function GridIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

export function UsersIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5" />
      <circle cx="17.5" cy="8.5" r="2.4" />
      <path d="M15.8 14.8c2.6.3 4.5 2.3 4.7 5.2" />
    </svg>
  )
}

export function WrenchIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 4.6L4 16.2V20h3.8l5.3-5.3a4 4 0 0 0 4.6-5.4l-2.6 2.6-2-2z" />
    </svg>
  )
}

export function SwapIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M4 7h13l-3-3" />
      <path d="M20 17H7l3 3" />
    </svg>
  )
}

export function ClockIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  )
}

export function BookIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M4 5.5A2 2 0 0 1 6 4h5v16H6a2 2 0 0 1-2-2z" />
      <path d="M20 5.5A2 2 0 0 0 18 4h-5v16h5a2 2 0 0 0 2-2z" />
    </svg>
  )
}

export function MegaphoneIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5l-5 4H4a1 1 0 0 0-1 1z" />
      <path d="M17 8.5a4.5 4.5 0 0 1 0 7" />
    </svg>
  )
}

export function LogoutIcon({ size = 15, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...strokeProps}>
      <path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9" />
      <path d="M15 16l4-4-4-4" />
      <path d="M19 12H9" />
    </svg>
  )
}
