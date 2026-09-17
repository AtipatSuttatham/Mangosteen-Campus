import type { ComponentType } from 'react'

import type { IconProps } from '../../components/icons'

export function KeyFigure({
  value,
  label,
  emphasize,
}: {
  value: string
  label: string
  emphasize?: boolean
}) {
  return (
    <div className="px-8 first:pl-0 last:pr-0 sm:px-10">
      <div
        className={`font-serif text-3xl font-semibold leading-none sm:text-4xl ${
          emphasize ? 'text-wine' : 'text-ink'
        }`}
      >
        {value}
      </div>
      <div className="mt-2 text-[13px] text-muted">{label}</div>
    </div>
  )
}

export function KeyFigureRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-wrap items-stretch divide-x divide-line sm:mt-7">{children}</div>
  )
}

export function SectionHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-3.5 font-serif text-[17px] font-semibold text-ink">{children}</div>
}

// เนื้อหาส่วนนี้ยังไม่มีข้อมูลจริงเพราะ backend ยังไม่มีฟีเจอร์ที่เกี่ยวข้อง (Course/Assignment/Announcement)
// แสดงสถานะตรงไปตรงมาแทนการใส่ตัวเลข/รายการสมมติ — ค่อยเปลี่ยนเป็นข้อมูลจริงตอน implement ฟีเจอร์นั้นๆ
export function ComingSoonPanel({
  icon: Icon,
  message,
}: {
  icon: ComponentType<IconProps>
  message: string
}) {
  return (
    <div className="flex flex-grow flex-col items-center justify-center gap-3 rounded-lg border border-line bg-surface-alt p-8 text-center">
      <Icon size={26} className="text-wine/70" />
      <p className="max-w-[280px] text-[13px] leading-relaxed text-muted">{message}</p>
    </div>
  )
}
