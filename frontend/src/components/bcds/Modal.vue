<script lang="ts">
import type { InjectionKey } from 'vue';

// The Dialog inside handles Esc and outside clicks, so it reads these from its Modal.
export const MODAL: InjectionKey<{ closeOnEscape: boolean; dismissable: boolean }> = Symbol('Modal');
</script>

<script setup lang="ts">
import { DialogOverlay, DialogPortal, DialogRoot } from 'reka-ui';
import { provide } from 'vue';

defineOptions({ inheritAttrs: false });

// Props
const { closeOnEscape = true, dismissable = false } = defineProps<{
  closeOnEscape?: boolean;
  // Lets a click outside close it
  dismissable?: boolean;
}>();

const open = defineModel<boolean>('open', { default: false });

defineSlots<{ default(): unknown }>();

// Provide
provide(MODAL, {
  get closeOnEscape() {
    return closeOnEscape;
  },
  get dismissable() {
    return dismissable;
  }
});
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="bcds-modal-overlay" />
      <!-- The portal is always rendered, so the box is only there while open. -->
      <div
        v-if="open"
        v-bind="$attrs"
        class="bcds-modal"
      >
        <slot />
      </div>
    </DialogPortal>
  </DialogRoot>
</template>

<!-- Teleported out of the component, out of reach of a scoped style -->
<style>
@layer components {
  .bcds-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--surface-color-overlay-default);
  }

  .bcds-modal-overlay[data-state='open'] {
    animation: bcds-modal-fade 200ms;
  }

  .bcds-modal-overlay[data-state='closed'] {
    animation: bcds-modal-fade 150ms reverse ease-in;
  }

  @media (prefers-reduced-motion) {
    .bcds-modal-overlay[data-state='open'],
    .bcds-modal-overlay[data-state='closed'] {
      animation: unset;
    }
  }

  @keyframes bcds-modal-fade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  .bcds-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    box-sizing: border-box;
    width: 600px;
    max-width: calc(100% - 2 * var(--layout-margin-large));
    max-height: calc(100% - 2 * var(--layout-margin-large));
    min-height: var(--layout-margin-xxxlarge);
    overflow-y: auto;
    border: var(--layout-border-width-small) solid var(--surface-color-border-default);
    border-radius: var(--layout-border-radius-medium);
    background: var(--surface-color-forms-default);
    box-shadow: var(--surface-shadow-large);
    color: var(--typography-color-primary);
    transform: translate(-50%, -50%);
  }
}
</style>
