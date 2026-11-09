import { onBeforeUnmount, readonly, ref, toValue, watchEffect } from 'vue';

import type { MaybeRefOrGetter } from 'vue';

const label = ref<string | null>();

// What the breadcrumb shows for the current page in place of its route's label; null hides the trail.
export const breadcrumbLabel = readonly(label);

/**
 * Names the current page's crumb from the view's own data, such as a loaded record's name.
 * @param pageLabel - The label; null while it loads, which hides the trail, or undefined for the route's own label.
 */
export function useBreadcrumb(pageLabel: MaybeRefOrGetter<string | null | undefined>) {
  watchEffect(() => (label.value = toValue(pageLabel)));
  onBeforeUnmount(() => (label.value = undefined));
}
