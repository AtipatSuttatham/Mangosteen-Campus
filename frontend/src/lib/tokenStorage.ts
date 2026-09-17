// เก็บ JWT ใน localStorage (ตัดสินใจแล้วว่ายอมรับความเสี่ยง XSS แลกกับความเรียบง่าย —
// ชดเชยด้วย access token อายุสั้น + refresh rotation/blacklist ฝั่ง backend)
const ACCESS_KEY = 'lms_access_token'
const REFRESH_KEY = 'lms_refresh_token'

export const tokenStorage = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  setAccess: (access: string) => localStorage.setItem(ACCESS_KEY, access),
  clear: () => {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}
