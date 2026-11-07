import ToastEventBus from 'primevue/toasteventbus';

import { i18n } from '@/i18n';
import { ToastTimeout } from '@/utils/enums';

import type { ToastMessageOptions } from 'primevue/toast';

/**
 * Wraps PrimeVue's toast service with one helper per severity, each with a prefixed summary and its default lifetime.
 * Unlike PrimeVue's own useToast, it works outside setup(), such as after an await or in a store.
 * @returns The `error`, `info`, `success` and `warn` toast helpers.
 */
export const useToast = () => {
  // PrimeVue's useToast injects its service, which only works during setup(); the service just posts to this bus
  const toast = { add: (message: ToastMessageOptions) => ToastEventBus.emit('add', message) };

  const error = (title: string, msg = '', options: ToastMessageOptions = {}) => {
    const {
      severity = 'error',
      summary = i18n.t('ui.toast.error', { title }),
      detail = msg,
      life = ToastTimeout.ERROR
    } = options;
    toast.add({ severity: severity, summary: summary, detail: detail, life: life });
  };

  const info = (title: string, msg = '', options: ToastMessageOptions = {}) => {
    const {
      severity = 'info',
      summary = i18n.t('ui.toast.info', { title }),
      detail = msg,
      life = ToastTimeout.INFO
    } = options;
    toast.add({ severity: severity, summary: summary, detail: detail, life: life });
  };

  const success = (title: string, msg = '', options: ToastMessageOptions = {}) => {
    const {
      severity = 'success',
      summary = i18n.t('ui.toast.success', { title }),
      detail = msg,
      life = ToastTimeout.SUCCESS
    } = options;
    toast.add({ severity: severity, summary: summary, detail: detail, life: life });
  };

  const warn = (title: string, msg = '', options: ToastMessageOptions = {}) => {
    const {
      severity = 'warn',
      summary = i18n.t('ui.toast.warning', { title }),
      detail = msg,
      life = ToastTimeout.WARNING
    } = options;
    toast.add({ severity: severity, summary: summary, detail: detail, life: life });
  };

  return { error, info, success, warn };
};
