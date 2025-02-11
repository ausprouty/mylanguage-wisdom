import { createI18n } from 'vue-i18n';

// Dynamically import language files if necessary
import eng00 from '../locales/eng00.json';
import frn00 from '../locales/frn00.json';
import spn00 from '../locales/spn00.json';

// Create the i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'eng00', // Default locale
  fallbackLocale: {
    'frn00': 'eng00',  // French falls back to English
    'spn00': 'eng00'   // Spanish falls back to English
  },
  messages: {
    eng00: eng00,
    frn00: frn00,
    spn00: spn00
  }
});

export default i18n;
