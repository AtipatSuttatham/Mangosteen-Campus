// ตรงกับ UserSerializer ฝั่ง backend (accounts/serializers.py)
export type Role = 'admin' | 'teacher' | 'student'

export interface User {
  id: number
  email: string
  student_or_staff_id: string | null
  role: Role
  first_name: string
  last_name: string
  first_name_en: string | null
  last_name_en: string | null
  is_email_verified: boolean
  avatar_url: string | null
}
