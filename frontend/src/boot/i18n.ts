import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import messages from 'src/i18n';

const i18n = createI18n({
  globalInjection: true,
  locale: 'ro',
  fallbackLocale: 'en',
  messages,
});

export default boot(({ app }) => {
  // Set i18n instance on app
  app.use(i18n);
});

// for use outside of components
export { i18n };
