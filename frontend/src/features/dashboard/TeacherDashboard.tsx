import { useTranslation } from 'react-i18next'

import { BookIcon, ClockIcon } from '../../components/icons'
import { ComingSoonPanel, KeyFigure, KeyFigureRow, SectionHeader } from './dashboardUi'

export function TeacherDashboard() {
  const { t } = useTranslation('dashboard')

  return (
    <>
      <KeyFigureRow>
        <KeyFigure value="–" label={t('figures.myCourses')} />
        <KeyFigure value="–" label={t('figures.totalStudents')} />
        <KeyFigure value="–" label={t('figures.pendingGrading')} emphasize />
      </KeyFigureRow>

      <div className="mt-6 border-b border-line sm:mt-7" />

      <div className="mt-2 flex flex-1 flex-col gap-8 lg:flex-row lg:gap-12">
        <div className="flex flex-[1.6] flex-col pt-5">
          <SectionHeader>{t('sections.pendingGrading')}</SectionHeader>
          <ComingSoonPanel icon={ClockIcon} message={t('comingSoon.grading')} />
        </div>

        <div className="flex flex-1 flex-col pt-5">
          <SectionHeader>{t('sections.myCourses')}</SectionHeader>
          <ComingSoonPanel icon={BookIcon} message={t('comingSoon.courses')} />
        </div>
      </div>
    </>
  )
}
