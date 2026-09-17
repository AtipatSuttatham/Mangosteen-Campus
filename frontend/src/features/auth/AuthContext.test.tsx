import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { api } from '../../lib/api'
import { tokenStorage } from '../../lib/tokenStorage'
import { AuthProvider, useAuth } from './AuthContext'
import type { User } from './types'

vi.mock('../../lib/api', () => ({
  api: { get: vi.fn(), post: vi.fn() },
}))

const mockUser: User = {
  id: 1,
  email: 'student@example.com',
  student_or_staff_id: null,
  role: 'student',
  first_name: 'สมชาย',
  last_name: 'ใจดี',
  first_name_en: null,
  last_name_en: null,
  is_email_verified: true,
  avatar_url: null,
}

function Probe() {
  const { user, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="user">{user ? user.email : 'none'}</span>
      <button onClick={() => void login({ identifier: 'a', password: 'b' })}>login</button>
      <button onClick={() => void logout()}>logout</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    tokenStorage.clear()
    vi.mocked(api.get).mockReset()
    vi.mocked(api.post).mockReset()
  })

  it('stores tokens and user on successful login', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { access: 'access-token', refresh: 'refresh-token', user: mockUser },
    })

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByText('login').click()
    })

    expect(screen.getByTestId('user').textContent).toBe('student@example.com')
    expect(tokenStorage.getAccess()).toBe('access-token')
    expect(tokenStorage.getRefresh()).toBe('refresh-token')
  })

  it('clears tokens and user on logout', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { access: 'access-token', refresh: 'refresh-token', user: mockUser },
    })
    vi.mocked(api.post).mockResolvedValueOnce({ data: {} })

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>,
    )

    await act(async () => {
      screen.getByText('login').click()
    })
    await act(async () => {
      screen.getByText('logout').click()
    })

    expect(screen.getByTestId('user').textContent).toBe('none')
    expect(tokenStorage.getAccess()).toBeNull()
  })
})
