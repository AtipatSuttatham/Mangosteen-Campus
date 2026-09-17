import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import authEn from '../locales/en/auth.json'
import commonEn from '../locales/en/common.json'
import dashboardEn from '../locales/en/dashboard.json'
import authTh from '../locales/th/auth.json'
import commonTh from '../locales/th/common.json'
import dashboardTh from '../locales/th/dashboard.json'

// default = ไทย ตาม CLAUDE.md — ตรวจจับภาษาจาก localStorage ก่อน แล้วค่อย fallback เป็น th
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      th: { common: commonTh, auth: authTh, dashboard: dashboardTh },
      en: { common: commonEn, auth: authEn, dashboard: dashboardEn },
    },
    fallbackLng: 'th',
    ns: ['common', 'auth', 'dashboard'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

export default i18n
