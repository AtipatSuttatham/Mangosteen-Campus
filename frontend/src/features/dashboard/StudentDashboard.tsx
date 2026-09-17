import { useTranslation } from 'react-i18next'

import { ClockIcon, MegaphoneIcon } from '../../components/icons'
import { ComingSoonPanel, KeyFigure, KeyFigureRow, SectionHeader } from './dashboardUi'

export function StudentDashboard() {
  const { t } = useTranslation('dashboard')

  return (
    <>
      <KeyFigureRow>
        <KeyFigure value="–" label={t('figures.enrolledCourses')} />
        <KeyFigure value="–" label={t('figures.dueThisWeek')} emphasize />
        <KeyFigure value="–" label={t('figures.unreadAnnouncements')} />
      </KeyFigureRow>

      <div className="mt-6 border-b border-line sm:mt-7" />

      <div className="mt-2 flex flex-1 flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex flex-[1.6] flex-col pt-5">
          <SectionHeader>{t('sections.upcomingWork')}</SectionHeader>
          <ComingSoonPanel icon={ClockIcon} message={t('comingSoon.work')} />
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <SectionHeader>{t('sections.recentAnnouncements')}</SectionHeader>
          <ComingSoonPanel icon={MegaphoneIcon} message={t('comingSoon.announcements')} />
        </div>
      </div>
    </>
  )
}
