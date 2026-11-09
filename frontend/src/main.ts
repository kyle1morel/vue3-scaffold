import { config, library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowLeft,
  faBars,
  faCalendar,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
  faClipboard,
  faEye,
  faEyeSlash,
  faMagnifyingGlass,
  faMinus,
  faPlus,
  faRightFromBracket,
  faTrash,
  faTriangleExclamation,
  faUser,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import PrimeVue from '@primevue/core/config';
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { createApp } from 'vue';

import App from '@/App.vue';
import i18n from '@/i18n';
import getRouter from '@/router';
import { ThemeOverride } from '@/lib/primevue/theme';
import { AuthService, refreshConfig } from '@/services';
import { StorageKey } from '@/utils/enums';
import { showError } from '@/utils/utils';

import '@bcgov/bc-sans/css/BC_Sans.css';
import '@bcgov/design-tokens/css/variables.css';
import '@/assets/main.css';

// main.css loads FontAwesome's styles in the base layer; added unlayered, they'd beat every component's icon sizes.
config.autoAddCss = false;

/**
 * Initializes and mounts the Vue instance.
 */
function initializeApp(): void {
  // Only the icons in use are bundled, so a new icon renders nothing until it's added here
  library.add(
    faArrowLeft,
    faBars,
    faCalendar,
    faCheck,
    faChevronDown,
    faChevronLeft,
    faChevronRight,
    faChevronUp,
    faCircleCheck,
    faCircleExclamation,
    faCircleInfo,
    faClipboard,
    faEye,
    faEyeSlash,
    faMagnifyingGlass,
    faMinus,
    faPlus,
    faRightFromBracket,
    faTrash,
    faTriangleExclamation,
    faUser,
    faXmark
  );

  const app = createApp(App);
  const pinia = createPinia();
  pinia.use(
    createPersistedState({
      key: (id) => `vue3-scaffold.${id}`
    })
  );

  app.use(pinia);
  app.use(getRouter());
  app.use(i18n);
  app.use(PrimeVue, {
    theme: {
      preset: ThemeOverride,
      options: {
        prefix: 'p',
        darkModeSelector: 'dark',
        // PrimeVue prepends this order to <head>, so it's declared before main.css; utilities sit above PrimeVue so
        // Tailwind classes can restyle its components
        cssLayer: {
          name: 'primeui',
          order: 'properties, theme, base, components, primeui, utilities, keyframes'
        }
      }
    }
  });
  app.component('FontAwesomeIcon', FontAwesomeIcon);

  // Errors nothing else handled end up as a toast: Vue sends component errors here, and the listener catches
  // promises Vue never sees, such as library callbacks; showError logs them in place of the browser
  app.config.errorHandler = (error) => showError(error);
  window.addEventListener('unhandledrejection', (event) => {
    event.preventDefault();
    showError(event.reason);
  });

  app.mount('#app');
}

/**
 * Initializes and mounts the service singletons
 * Services must load in the following order: config, auth, then app.
 * @param next - Optional callback function.
 */
async function initializeServices(next?: () => void): Promise<void> {
  await refreshConfig();
  await AuthService.init();
  if (next) next();
}

// After a deploy, an open tab can request chunks the new build no longer has; reload once to pick up the new build
window.addEventListener('vite:preloadError', (event) => {
  const last = Number(sessionStorage.getItem(StorageKey.CHUNK_RELOAD));
  if (Date.now() - last < 10000) return; // Already reloaded; let the error surface rather than loop
  sessionStorage.setItem(StorageKey.CHUNK_RELOAD, String(Date.now()));
  event.preventDefault();
  window.location.reload();
});

// The app can't mount without config, so show a plain message instead of a blank page; rethrow to keep the error logged
initializeServices(initializeApp).catch((error: unknown) => {
  const root = document.getElementById('app');
  if (root) root.textContent = i18n.global.t('ui.errors.startup');
  throw error;
});
