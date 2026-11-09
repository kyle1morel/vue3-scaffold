<script setup lang="ts">
import { DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';
import { useI18n } from 'vue-i18n';

import Button from './Button.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  isCloseable = true,
  isDismissable = false,
  isIconHidden = false,
  isKeyboardDismissDisabled = false,
  role = 'dialog',
  title = undefined,
  variant = 'info'
} = defineProps<{
  isCloseable?: boolean;
  // Lets a click outside close it; off by default, as one could dismiss it by accident
  isDismissable?: boolean;
  isIconHidden?: boolean;
  // Stops Esc closing it, leaving only the buttons
  isKeyboardDismissDisabled?: boolean;
  // alertdialog tells screen readers the dialog interrupts to ask for a response, such as a confirmation
  role?: 'alertdialog' | 'dialog';
  title?: string;
  variant?: 'confirmation' | 'destructive' | 'error' | 'info' | 'warning';
}>();

const open = defineModel<boolean>('open', { default: false });

defineSlots<{ buttons?(): unknown; default?(): unknown }>();

// Constants
const ICONS = {
  confirmation: 'fa-solid fa-circle-check',
  destructive: 'fa-solid fa-circle-exclamation',
  error: 'fa-solid fa-circle-exclamation',
  info: 'fa-solid fa-circle-info',
  warning: 'fa-solid fa-triangle-exclamation'
};

// Composables
const { t } = useI18n();
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="bcds-dialog-overlay" />
      <DialogContent
        v-bind="$attrs"
        class="bcds-alert-dialog"
        :class="`bcds-alert-dialog-${variant}`"
        :role
        @escape-key-down="(event) => isKeyboardDismissDisabled && event.preventDefault()"
        @interact-outside="(event) => !isDismissable && event.preventDefault()"
      >
        <div class="bcds-alert-dialog-header">
          <font-awesome-icon
            v-if="!isIconHidden"
            class="bcds-alert-dialog-icon"
            :icon="ICONS[variant]"
          />
          <DialogTitle
            v-if="title"
            as="div"
            class="bcds-alert-dialog-title"
          >
            {{ title }}
          </DialogTitle>
          <Button
            v-if="isCloseable"
            class="bcds-alert-dialog-close"
            icon="fa-solid fa-xmark"
            icon-only
            size="small"
            :label="t('ui.actions.close')"
            variant="tertiary"
            @click="open = false"
          />
        </div>
        <DialogDescription
          v-if="$slots.default"
          as="div"
          class="bcds-alert-dialog-content"
        >
          <slot />
        </DialogDescription>
        <div
          v-if="$slots.buttons"
          class="bcds-alert-dialog-buttons"
        >
          <slot name="buttons" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<!-- Reka renders the overlay and panel itself, out of reach of a scoped style -->
<style>
@layer components {
  .bcds-dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: var(--surface-color-overlay-default);
  }

  .bcds-alert-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1000;
    display: flex;
    flex-direction: column;
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

<style scoped>
@layer components {
  .bcds-alert-dialog-header {
    display: flex;
    gap: var(--layout-padding-small);
    padding: var(--layout-padding-medium) var(--layout-padding-large);
    border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
  }

  .bcds-alert-dialog-icon {
    align-self: center;
    box-sizing: content-box;
    width: var(--icons-size-medium);
    height: var(--icons-size-medium);
    padding-top: var(--layout-padding-xsmall);
    color: var(--icons-color-primary);
  }

  .bcds-alert-dialog-close {
    align-self: flex-start;
  }

  .bcds-alert-dialog-title {
    flex-grow: 1;
    font: var(--typography-bold-h5);
  }

  .bcds-alert-dialog-content {
    padding: var(--layout-padding-medium) var(--layout-padding-large);
    border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
    font: var(--typography-regular-body);
  }

  .bcds-alert-dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: var(--layout-margin-small);
    padding: var(--layout-padding-medium) var(--layout-padding-large);
  }

  .bcds-alert-dialog-confirmation .bcds-alert-dialog-icon {
    color: var(--icons-color-success);
  }

  .bcds-alert-dialog-warning .bcds-alert-dialog-icon {
    color: var(--icons-color-warning);
  }

  .bcds-alert-dialog-error .bcds-alert-dialog-icon,
  .bcds-alert-dialog-destructive .bcds-alert-dialog-icon {
    color: var(--icons-color-danger);
  }
}
</style>
