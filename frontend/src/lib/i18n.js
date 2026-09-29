import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ID translations
import idCommon from '../locales/id/common.json';
import idHome from '../locales/id/home.json';

// EN translations
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        common: idCommon,
        home: idHome,
      },
      en: {
        common: enCommon,
        home: enHome,
      },
    },
    lng: 'id',               // default language: Indonesian
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
