import { i18n } from '@/i18n';
import { useConfirm } from '@/lib/primevue';

/**
 * Builds an OK-only alert dialog on top of PrimeVue's confirm service.
 * @param header - The dialog header.
 * @param message - The dialog message.
 * @returns A `show` function that opens the dialog.
 */
export function useAlert(header: string, message: string) {
  const confirm = useConfirm();

  const show = () => {
    confirm.require({
      header: header,
      message: message,
      acceptLabel: i18n.t('ui.actions.ok'),
      rejectClass: 'hidden'
    });
  };

  return { show };
}
