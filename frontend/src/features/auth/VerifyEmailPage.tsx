import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'

import { api } from '../../lib/api'

type Status = 'verifying' | 'success' | 'failure'

export function VerifyEmailPage() {
  const { t } = useTranslation('auth')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<Status>(token ? 'verifying' : 'failure')

  useEffect(() => {
    if (!token) return
    api
      .get('/auth/verify', { params: { token } })
      .then(() => setStatus('success'))
      .catch(() => setStatus('failure'))
  }, [token])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow">
        <p className={status === 'failure' ? 'text-red-600' : 'text-gray-800'}>
          {t(`verify.${status === 'verifying' ? 'verifying' : status}`)}
        </p>
        {status !== 'verifying' && (
          <Link to="/login" className="mt-4 inline-block text-emerald-600 hover:underline">
            {t('verify.backToLogin')}
          </Link>
        )}
      </div>
    </div>
  )
}
