import { Comment, Fragment } from 'vue';

import type { VNode } from 'vue';

/**
 * Flattens slot content into the elements a caller passed, so a component can wrap each one.
 * @param vnodes - The slot's rendered nodes.
 * @returns The nodes with fragments, such as a v-for, expanded and comments left out.
 */
export function slotItems(vnodes: VNode[] = []): VNode[] {
  return vnodes.flatMap((vnode) => {
    if (vnode.type === Comment) return [];
    if (vnode.type === Fragment) return slotItems(vnode.children as VNode[]);
    return [vnode];
  });
}
