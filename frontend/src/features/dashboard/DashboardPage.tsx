import { useTranslation } from 'react-i18next'

import { useAuth } from '../auth/AuthContext'

// Placeholder ชั่วคราวเพื่อให้ flow login → redirect ทดสอบได้ครบ
// ดีไซน์จริงของ dashboard shell (แยกตาม role) รอ wireframe ที่ต้องเสนอผู้ใช้ก่อน (ดู plan ขั้นตอนที่ 5)
export function DashboardPage() {
  const { t } = useTranslation('common')
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <p className="text-lg text-gray-800">
          {user?.first_name} {user?.last_name} — {user && t(`role.${user.role}`)}
        </p>
        <button
          onClick={() => void logout()}
          className="mt-4 rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
        >
          {t('nav.logout')}
        </button>
      </div>
    </div>
  )
}
