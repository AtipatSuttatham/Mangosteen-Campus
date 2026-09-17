import type { ComponentType, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { CalyxMark, CalyxOutlineMark, LogoutIcon, type IconProps } from '../../components/icons'
import { useAuth } from '../auth/AuthContext'

export interface DashboardNavItem {
  icon: ComponentType<IconProps>
  label: string
  active?: boolean
}

function LanguageSwitch() {
  const { i18n } = useTranslation()
  const isThaiActive = i18n.resolvedLanguage === 'th'

  return (
    <div className="flex items-baseline gap-1.5 pt-1">
      <button
        type="button"
        onClick={() => void i18n.changeLanguage('th')}
        className={`text-[13px] pb-0.5 ${
          isThaiActive
            ? 'border-b-[1.5px] border-wine font-bold text-wine'
            : 'font-medium text-muted-light'
        }`}
      >
        TH
      </button>
      <span className="text-[13px] text-line">/</span>
      <button
        type="button"
        onClick={() => void i18n.changeLanguage('en')}
        className={`text-[13px] pb-0.5 ${
          !isThaiActive
            ? 'border-b-[1.5px] border-wine font-bold text-wine'
            : 'font-medium text-muted-light'
        }`}
      >
        EN
      </button>
    </div>
  )
}

function NavList({ items }: { items: DashboardNavItem[] }) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5">
      {items.map(({ icon: Icon, label, active }) => (
        <div
          key={label}
          className={`-ml-[3px] flex items-center gap-3 border-l-[3px] px-3.5 py-2.5 ${
            active ? 'border-sage-light' : 'border-transparent opacity-60'
          }`}
        >
          <Icon size={18} className={active ? 'text-sage-light' : 'text-dusty'} />
          <span className={`text-sm ${active ? 'font-semibold text-cream' : 'font-medium text-dusty'}`}>
            {label}
          </span>
        </div>
      ))}
    </nav>
  )
}

export function DashboardLayout({
  navItems,
  subtitle,
  children,
}: {
  navItems: DashboardNavItem[]
  subtitle: string
  children: ReactNode
}) {
  const { t } = useTranslation('dashboard')
  const { user, logout } = useAuth()

  const initial = user?.first_name?.charAt(0) ?? '?'
  const roleLabel = user ? t(`role.${user.role}`, { ns: 'common' }) : ''

  return (
    <div className="flex min-h-screen flex-col bg-surface lg:flex-row">
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col gap-6 bg-wine px-5 py-6 lg:w-[264px] lg:gap-0 lg:py-7">
        <div className="flex items-center gap-2.5 px-0.5">
          <CalyxMark size={26} className="text-sage-light" />
          <span className="font-serif text-[16px] font-semibold text-cream">Mangosteen Campus</span>
        </div>

        <div className="lg:mb-9 lg:mt-9">
          <NavList items={navItems} />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 pt-4 lg:mt-auto lg:pt-[18px]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/12 font-serif text-sm font-semibold text-cream">
              {initial}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-cream">
                {user ? `${user.first_name} ${user.last_name}` : ''}
              </div>
              <div className="text-xs text-dusty">{roleLabel}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex items-center gap-2 text-[13px] font-medium text-dusty"
          >
            <LogoutIcon size={15} />
            {t('nav.logout', { ns: 'common' })}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="relative flex flex-1 flex-col overflow-hidden px-6 py-8 sm:px-10 lg:px-14 lg:py-10">
        <CalyxOutlineMark
          size={280}
          className="pointer-events-none absolute -right-12 -top-16 text-wine opacity-[0.06] sm:size-[360px]"
        />

        <div className="relative flex items-start justify-between">
          <h1 className="font-serif text-2xl font-semibold text-ink sm:text-[28px]">
            {t('greeting', { name: user?.first_name ?? '' })}
          </h1>
          <LanguageSwitch />
        </div>
        <p className="relative mt-1 text-sm text-muted">{subtitle}</p>

        {children}
      </main>
    </div>
  )
}
