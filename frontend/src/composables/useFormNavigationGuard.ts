import { onBeforeUnmount, onMounted, toValue } from 'vue';
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';

import { i18n } from '@/i18n';
import { useConfirm } from '@/lib/primevue';

import type { MaybeRefOrGetter } from 'vue';

/**
 * Asks before leaving a form with unsaved changes, whether by navigating away or closing or reloading the tab.
 * @param isDirty - Whether the form has unsaved changes.
 */
export function useFormNavigationGuard(isDirty: MaybeRefOrGetter<boolean>) {
  const confirm = useConfirm();

  // Closing or reloading the tab skips the router, so the browser shows its own prompt instead
  function onBeforeUnload(event: BeforeUnloadEvent) {
    if (toValue(isDirty)) event.preventDefault();
  }

  // Waiting on the answer lets the router finish or cancel the original navigation, whatever its type
  function guard() {
    if (!toValue(isDirty)) return true;

    return new Promise<boolean>((resolve) =>
      confirm.require({
        message: i18n.t('ui.unsavedChanges.message'),
        header: i18n.t('ui.unsavedChanges.title'),
        acceptLabel: i18n.t('ui.actions.leave'),
        acceptProps: { severity: 'danger' },
        rejectLabel: i18n.t('ui.actions.cancel'),
        rejectProps: { outlined: true },
        accept: () => resolve(true),
        reject: () => resolve(false),
        // Esc, the close button and the mask call only onHide
        onHide: () => resolve(false)
      })
    );
  }

  onMounted(() => window.addEventListener('beforeunload', onBeforeUnload));
  onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload));
  onBeforeRouteLeave(guard);
  // Param and query changes reuse the component, so they never leave; a hash-only change is just an in-page link
  onBeforeRouteUpdate((to, from) => to.fullPath.split('#')[0] === from.fullPath.split('#')[0] || guard());
}
