import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import enTranslation from "./locales/en/translation.json";
import hiTranslation from "./locales/hi/translation.json";
import arTranslation from "./locales/ar/translation.json";
import frTranslation from "./locales/fr/translation.json";
import deTranslation from "./locales/de/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  hi: {
    translation: hiTranslation,
  },
  ar: {
    translation: arTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  de: {
    translation: deTranslation,
  },
};

// Fallback function to handle missing keys
const fallbackLng = "en";
const defaultNS = "translation";

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng,
    defaultNS,
    ns: ["translation"],
    debug: import.meta.env.DEV,

    interpolation: {
      escapeValue: false, // React already safes from XSS
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },

    react: {
      useSuspense: false,
    },

    // Add fallback handling
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      console.warn(`Missing translation key: ${key}`);
      return fallbackValue || key;
    },
  });

export default i18n;
