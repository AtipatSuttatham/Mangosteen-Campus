import axios from 'axios'

import { tokenStorage } from './tokenStorage'

// ใช้ 127.0.0.1 แทน localhost โดยตั้งใจ — บางเครื่อง "localhost" resolve เป็น IPv6 (::1) ก่อน
// ถ้ามีอย่างอื่นจับพอร์ตเดียวกันฝั่ง IPv6 ไว้ (เช่นโปรเจกต์อื่นใน Docker) จะหลุดไปเรียกผิดเซิร์ฟเวอร์เงียบๆ
const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

export const api = axios.create({ baseURL })

api.interceptors.request.use((config) => {
  const access = tokenStorage.getAccess()
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  return config
})

// กัน race condition เวลามีหลาย request โดน 401 พร้อมกัน — refresh แค่ครั้งเดียวแล้วให้ทุกคนรอ
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refresh = tokenStorage.getRefresh()
  if (!refresh) throw new Error('no refresh token')

  const response = await axios.post(`${baseURL}/auth/refresh`, { refresh })
  const { access } = response.data as { access: string }
  tokenStorage.setAccess(access)
  return access
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/')

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null
        })
        const access = await refreshPromise
        originalRequest.headers.Authorization = `Bearer ${access}`
        return api(originalRequest)
      } catch {
        tokenStorage.clear()
        window.dispatchEvent(new Event('auth:logout'))
      }
    }

    return Promise.reject(error)
  },
)
