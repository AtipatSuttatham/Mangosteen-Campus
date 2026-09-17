import { useState, type ChangeEvent, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { extractErrorMessage } from '../../lib/errors'
import { useAuth } from './AuthContext'

export function RegisterPage() {
  const { t } = useTranslation('auth')
  const { register } = useAuth()

  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '' })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register(form)
      setSuccess(true)
    } catch (err) {
      setError(extractErrorMessage(err) ?? t('error.generic'))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-sm rounded-lg bg-white p-8 text-center shadow">
          <p className="text-gray-800">{t('register.success')}</p>
          <Link to="/login" className="mt-4 inline-block text-emerald-600 hover:underline">
            {t('verify.backToLogin')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">{t('register.title')}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first_name" className="mb-1 block text-sm font-medium text-gray-700">
                {t('register.firstName')}
              </label>
              <input
                id="first_name"
                required
                value={form.first_name}
                onChange={updateField('first_name')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="last_name" className="mb-1 block text-sm font-medium text-gray-700">
                {t('register.lastName')}
              </label>
              <input
                id="last_name"
                required
                value={form.last_name}
                onChange={updateField('last_name')}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              {t('register.email')}
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={updateField('email')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              {t('register.password')}
            </label>
            <input
              id="password"
              type="password"
              required
              value={form.password}
              onChange={updateField('password')}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-emerald-500 focus:outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-emerald-600 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {t('register.submit')}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          {t('register.hasAccount')}{' '}
          <Link to="/login" className="text-emerald-600 hover:underline">
            {t('register.loginLink')}
          </Link>
        </p>
      </div>
    </div>
  )
}
