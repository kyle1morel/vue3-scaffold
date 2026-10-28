import { useToast as useToastPrimevue } from 'primevue/usetoast';

import { i18n } from '@/i18n';
import { ToastTimeout } from '@/utils/enums/application';

import type { ToastMessageOptions } from 'primevue/toast';

/**
 * Wraps PrimeVue's toast service with one helper per severity, each with a prefixed summary and its default lifetime.
 * @returns The `error`, `info`, `success` and `warn` toast helpers.
 */
export const useToast = () => {
  const toast = useToastPrimevue();

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
