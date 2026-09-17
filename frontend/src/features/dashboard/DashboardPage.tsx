import { useTranslation } from 'react-i18next'

import { useAuth } from '../auth/AuthContext'
import { AdminDashboard } from './AdminDashboard'
import { DashboardLayout, type DashboardNavItem } from './DashboardLayout'
import { StudentDashboard } from './StudentDashboard'
import { TeacherDashboard } from './TeacherDashboard'
import { BookIcon, ClockIcon, GridIcon, MegaphoneIcon, SwapIcon, UsersIcon, WrenchIcon } from '../../components/icons'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')
  const { user } = useAuth()

  if (!user) return null

  const navItemsByRole: Record<typeof user.role, DashboardNavItem[]> = {
    admin: [
      { icon: GridIcon, label: t('nav.dashboard'), active: true },
      { icon: UsersIcon, label: t('nav.userManagement') },
      { icon: WrenchIcon, label: t('nav.systemSupport') },
      { icon: SwapIcon, label: t('nav.impersonation') },
      { icon: ClockIcon, label: t('nav.auditLog') },
    ],
    teacher: [
      { icon: GridIcon, label: t('nav.dashboard'), active: true },
      { icon: BookIcon, label: t('nav.myCourses') },
    ],
    student: [
      { icon: GridIcon, label: t('nav.dashboard'), active: true },
      { icon: BookIcon, label: t('nav.myCourses') },
      { icon: MegaphoneIcon, label: t('nav.announcements') },
    ],
  }

  const content = {
    admin: <AdminDashboard />,
    teacher: <TeacherDashboard />,
    student: <StudentDashboard />,
  }[user.role]

  return (
    <DashboardLayout navItems={navItemsByRole[user.role]} subtitle={t(`subtitle.${user.role}`)}>
      {content}
    </DashboardLayout>
  )
}
