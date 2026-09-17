import { useTranslation } from 'react-i18next'

import { ClockIcon, SwapIcon, UsersIcon, WrenchIcon } from '../../components/icons'
import { ComingSoonPanel, KeyFigure, KeyFigureRow, SectionHeader } from './dashboardUi'

export function AdminDashboard() {
  const { t } = useTranslation('dashboard')

  const shortcuts = [
    { icon: UsersIcon, label: t('nav.userManagement') },
    { icon: WrenchIcon, label: t('nav.systemSupport') },
    { icon: SwapIcon, label: t('nav.impersonation') },
    { icon: ClockIcon, label: t('nav.auditLog') },
  ]

  return (
    <>
      <KeyFigureRow>
        <KeyFigure value="–" label={t('figures.teachers')} />
        <KeyFigure value="–" label={t('figures.students')} />
        <KeyFigure value="–" label={t('figures.openCourses')} emphasize />
      </KeyFigureRow>

      <div className="mt-6 border-b border-line sm:mt-7" />

      <div className="mt-2 flex flex-1 flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex flex-[1.6] flex-col pt-5">
          <SectionHeader>{t('sections.recentActivity')}</SectionHeader>
          <ComingSoonPanel icon={ClockIcon} message={t('comingSoon.activity')} />
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <SectionHeader>{t('sections.shortcuts')}</SectionHeader>
          <div className="flex flex-col">
            {shortcuts.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 border-t border-line py-3 opacity-60 last:border-b"
              >
                <Icon size={17} className="text-wine" />
                <span className="text-sm font-medium text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
