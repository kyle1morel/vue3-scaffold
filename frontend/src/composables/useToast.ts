import { toastManager } from '@/components/bcds/toastManager';
import { i18n } from '@/i18n';
import { ToastTimeout } from '@/utils/enums';

import type { ToastSeverity } from '@/components/bcds/toastManager';

export interface ToastOptions {
  // Milliseconds before it closes; ToastTimeout.STICKY keeps it open.
  life?: number;
}

/**
 * Shows toasts, one helper per severity, each with a prefixed title and its default lifetime.
 * It works outside setup(), such as after an await or in a store.
 * @returns The `error`, `info`, `success` and `warn` toast helpers.
 */
export const useToast = () => {
  const show = (severity: ToastSeverity, title: string, msg: string, life: number) =>
    toastManager.add({ data: { severity }, description: msg || undefined, duration: life, title });

  const error = (title: string, msg = '', { life = ToastTimeout.ERROR }: ToastOptions = {}) =>
    show('danger', i18n.t('ui.toast.error', { title }), msg, life);

  const info = (title: string, msg = '', { life = ToastTimeout.INFO }: ToastOptions = {}) =>
    show('info', i18n.t('ui.toast.info', { title }), msg, life);

  const success = (title: string, msg = '', { life = ToastTimeout.SUCCESS }: ToastOptions = {}) =>
    show('success', i18n.t('ui.toast.success', { title }), msg, life);

  const warn = (title: string, msg = '', { life = ToastTimeout.WARNING }: ToastOptions = {}) =>
    show('warning', i18n.t('ui.toast.warning', { title }), msg, life);

  return { error, info, success, warn };
};
