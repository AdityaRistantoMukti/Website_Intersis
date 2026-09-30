import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ID translations
import idCommon from '../locales/id/common.json';
import idHome from '../locales/id/home.json';
import idAbout from '../locales/id/about.json';
import idProducts from '../locales/id/products.json';

// EN translations
import enCommon from '../locales/en/common.json';
import enHome from '../locales/en/home.json';
import enAbout from '../locales/en/about.json';
import enProducts from '../locales/en/products.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        common: idCommon,
        home: idHome,
        about: idAbout,
        products: idProducts,
      },
      en: {
        common: enCommon,
        home: enHome,
        about: enAbout,
        products: enProducts,
      },
    },
    // Use saved user preference if they've manually switched before; otherwise default to English
    lng: localStorage.getItem('gpt-lang') || 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'home', 'about', 'products'],
    interpolation: {
      escapeValue: false,
    },
    // No LanguageDetector — language stays English unless user switches manually via navbar
  });

export default i18n;
