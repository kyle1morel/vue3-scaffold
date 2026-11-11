<script setup lang="ts">
import Dialog from './Dialog.vue';
import Modal from './Modal.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  closeable = true,
  closeOnEscape = true,
  dismissable = false,
  hideIcon = false,
  role = 'dialog',
  title,
  variant = 'info'
} = defineProps<{
  closeable?: boolean;
  // Off leaves only the buttons to close it
  closeOnEscape?: boolean;
  // Lets a click outside close it; off by default, as one could dismiss it by accident
  dismissable?: boolean;
  hideIcon?: boolean;
  // alertdialog tells screen readers the dialog interrupts to ask for a response, such as a confirmation.
  role?: 'alertdialog' | 'dialog';
  title: string;
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
</script>

<template>
  <Modal
    v-model:open="open"
    :close-on-escape
    :dismissable
  >
    <Dialog
      v-bind="$attrs"
      class="bcds-alert-dialog"
      :class="`bcds-alert-dialog-${variant}`"
      :closeable
      :role
      :title
    >
      <template
        v-if="!hideIcon"
        #icon
      >
        <font-awesome-icon
          class="bcds-alert-dialog-icon"
          :icon="ICONS[variant]"
        />
      </template>
      <template
        v-if="$slots.default"
        #description
      >
        <slot />
      </template>
      <template
        v-if="$slots.buttons"
        #buttons
      >
        <slot name="buttons" />
      </template>
    </Dialog>
  </Modal>
</template>

<style scoped>
@layer components {
  .bcds-alert-dialog-icon {
    align-self: center;
    box-sizing: content-box;
    width: var(--icons-size-medium);
    height: var(--icons-size-medium);
    padding-top: var(--layout-padding-xsmall);
    color: var(--icons-color-primary);
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
