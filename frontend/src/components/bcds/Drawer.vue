<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';

// Props
const { position = 'right', title } = defineProps<{
  position?: 'left' | 'right';
  // Names the panel for screen readers; it isn't shown
  title: string;
}>();

const open = defineModel<boolean>('open', { default: false });

defineSlots<{ default(): unknown }>();
</script>

<template>
  <!-- A modal panel from the side of the screen: Esc and a click outside close it -->
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="bcds-drawer-overlay" />
      <DialogContent
        :aria-describedby="undefined"
        class="bcds-drawer"
        :class="position"
      >
        <DialogTitle class="sr-only">{{ title }}</DialogTitle>
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<!-- Reka renders the overlay and panel itself, out of reach of a scoped style -->
<style>
.bcds-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--surface-color-overlay-default);
}

.bcds-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 20rem;
  max-width: 100%;
  overflow-y: auto;
  background: var(--surface-color-forms-default);
  box-shadow: var(--surface-shadow-large);
  color: var(--typography-color-primary);
}

.bcds-drawer.right {
  right: 0;
  --from: 100%;
}

.bcds-drawer.left {
  left: 0;
  --from: -100%;
}

.bcds-drawer[data-state='open'] {
  animation: bcds-drawer-slide 200ms ease-out;
}

.bcds-drawer[data-state='closed'] {
  animation: bcds-drawer-slide 150ms ease-in reverse;
}

@media (prefers-reduced-motion) {
  .bcds-drawer[data-state='open'],
  .bcds-drawer[data-state='closed'] {
    animation: none;
  }
}

@keyframes bcds-drawer-slide {
  from {
    transform: translateX(var(--from));
  }

  to {
    transform: translateX(0);
  }
}
</style>
