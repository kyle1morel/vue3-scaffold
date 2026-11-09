import { shallowRef } from 'vue';

export interface ConfirmOptions {
  acceptLabel: string;
  // Styles the dialog and its accept button for a destructive action
  danger?: boolean;
  message: string;
  rejectLabel: string;
  title: string;
}

// layout/ConfirmDialog shows the open request; the app has one dialog, so a new request answers the last with false.
export const confirmRequest = shallowRef<ConfirmOptions & { resolve: (accepted: boolean) => void }>();

/**
 * Asks the user to confirm an action. Like useToast, it works outside setup().
 * @returns `confirm`, which resolves true when the user accepts, and false when they cancel or close the dialog.
 */
export const useConfirm = () => {
  const confirm = (options: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      confirmRequest.value?.resolve(false);
      confirmRequest.value = { ...options, resolve };
    });

  return { confirm };
};
