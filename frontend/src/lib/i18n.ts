import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import authEn from '../locales/en/auth.json'
import commonEn from '../locales/en/common.json'
import authTh from '../locales/th/auth.json'
import commonTh from '../locales/th/common.json'

// default = ไทย ตาม CLAUDE.md — ตรวจจับภาษาจาก localStorage ก่อน แล้วค่อย fallback เป็น th
void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      th: { common: commonTh, auth: authTh },
      en: { common: commonEn, auth: authEn },
    },
    fallbackLng: 'th',
    ns: ['common', 'auth'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: { escapeValue: false },
  })

export default i18n
