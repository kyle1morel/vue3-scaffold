<script setup lang="ts">
import {
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
  useToastManager
} from 'reka-ui';
import { defineComponent, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from './Button.vue';
import { toastManager } from './toastManager';

import type { ToastObject } from 'reka-ui';
import type { SlotsType } from 'vue';
import type { ToastSeverity } from './toastManager';

defineOptions({ inheritAttrs: false });

// Constants
const ICONS: Record<ToastSeverity, string> = {
  danger: 'fa-solid fa-circle-exclamation',
  info: 'fa-solid fa-circle-info',
  success: 'fa-solid fa-circle-check',
  warning: 'fa-solid fa-triangle-exclamation'
};

// Composables
const { t } = useI18n();

// useToastManager reads the provider, so the list has to render inside it
const ToastList = defineComponent({
  slots: Object as SlotsType<{ default: { toasts: ToastObject<{ severity: ToastSeverity }>[] } }>,
  setup(_, { slots }) {
    const { toasts } = useToastManager<{ severity: ToastSeverity }>();
    return () => slots.default({ toasts: toValue(toasts) });
  }
});
</script>

<template>
  <ToastProvider :toast-manager>
    <ToastList v-slot="{ toasts }">
      <ToastRoot
        v-for="toast in toasts"
        :key="toast.id"
        class="bcds-toast"
        :class="`bcds-toast-${toast.data?.severity ?? 'info'}`"
        :toast
      >
        <font-awesome-icon
          class="bcds-toast-icon"
          :icon="ICONS[toast.data?.severity ?? 'info']"
        />
        <div class="bcds-toast-text">
          <ToastTitle class="bcds-toast-title" />
          <ToastDescription
            v-if="toast.description"
            class="bcds-toast-description"
          />
        </div>
        <ToastClose as-child>
          <Button
            icon="fa-solid fa-xmark"
            icon-only
            size="small"
            :label="t('ui.actions.close')"
            variant="tertiary"
          />
        </ToastClose>
      </ToastRoot>
    </ToastList>
    <ToastViewport
      v-bind="$attrs"
      class="bcds-toast-viewport"
    />
  </ToastProvider>
</template>

<!-- Reka moves each toast into the viewport, out of reach of a scoped style -->
<style>
@layer components {
  .bcds-toast-viewport {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1100;
    display: flex;
    flex-direction: column;
    gap: var(--layout-margin-small);
    box-sizing: border-box;
    width: 25rem;
    max-width: 100vw;
    margin: 0;
    padding: var(--layout-padding-medium);
    list-style: none;
    outline: none;
  }

  .bcds-toast {
    display: flex;
    align-items: flex-start;
    gap: var(--layout-margin-small);
    padding: var(--layout-padding-small) var(--layout-padding-medium);
    border: var(--layout-border-width-small) solid;
    border-radius: var(--layout-border-radius-medium);
    box-shadow: var(--surface-shadow-medium);
    color: var(--typography-color-primary);
  }

  .bcds-toast[data-state='open'] {
    animation: bcds-toast-in 150ms ease-out;
  }

  .bcds-toast[data-state='closed'] {
    animation: bcds-toast-out 100ms ease-in;
  }

  @media (prefers-reduced-motion) {
    .bcds-toast[data-state='open'],
    .bcds-toast[data-state='closed'] {
      animation: none;
    }
  }

  .bcds-toast-icon {
    padding-top: var(--layout-padding-xsmall);
  }

  .bcds-toast-text {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: var(--layout-padding-xsmall) 0;
  }

  .bcds-toast-title {
    font: var(--typography-bold-body);
  }

  .bcds-toast-description {
    font: var(--typography-regular-small-body);
  }

  .bcds-toast.bcds-toast-info {
    border-color: var(--support-border-color-info);
    background: var(--support-surface-color-info);
  }

  .bcds-toast.bcds-toast-info .bcds-toast-icon {
    color: var(--icons-color-info);
  }

  .bcds-toast.bcds-toast-success {
    border-color: var(--support-border-color-success);
    background: var(--support-surface-color-success);
  }

  .bcds-toast.bcds-toast-success .bcds-toast-icon {
    color: var(--icons-color-success);
  }

  .bcds-toast.bcds-toast-warning {
    border-color: var(--support-border-color-warning);
    background: var(--support-surface-color-warning);
  }

  .bcds-toast.bcds-toast-warning .bcds-toast-icon {
    color: var(--icons-color-warning);
  }

  .bcds-toast.bcds-toast-danger {
    border-color: var(--support-border-color-danger);
    background: var(--support-surface-color-danger);
  }

  .bcds-toast.bcds-toast-danger .bcds-toast-icon {
    color: var(--icons-color-danger);
  }

  @keyframes bcds-toast-in {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }

  @keyframes bcds-toast-out {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
}
</style>
