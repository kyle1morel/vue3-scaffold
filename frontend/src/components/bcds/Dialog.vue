<script setup lang="ts">
import { DialogClose, DialogContent, DialogDescription, DialogTitle } from 'reka-ui';
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from './Button.vue';
import { MODAL } from './Modal.vue';

defineOptions({ inheritAttrs: false });

// Props
const {
  closeable = true,
  role = 'dialog',
  title
} = defineProps<{
  closeable?: boolean;
  // alertdialog tells screen readers the dialog interrupts to ask for a response, such as a confirmation.
  role?: 'alertdialog' | 'dialog';
  // Required, as it names the dialog for screen readers
  title: string;
}>();

defineSlots<{
  buttons?(): unknown;
  default?(): unknown;
  // Text that screen readers read out with the title, such as an alert's message
  description?(): unknown;
  icon?(): unknown;
}>();

// Composables
const { t } = useI18n();

// State
const modal = inject(MODAL, { closeOnEscape: true, dismissable: false });
</script>

<template>
  <!-- Without a description, aria-describedby is turned off, or Reka warns that it points at nothing. -->
  <DialogContent
    v-bind="$slots.description ? $attrs : { 'aria-describedby': undefined, ...$attrs }"
    class="bcds-dialog"
    :role
    @escape-key-down="(event) => !modal.closeOnEscape && event.preventDefault()"
    @interact-outside="(event) => !modal.dismissable && event.preventDefault()"
  >
    <div class="bcds-dialog-header">
      <slot name="icon" />
      <DialogTitle class="bcds-dialog-title">{{ title }}</DialogTitle>
      <DialogClose
        v-if="closeable"
        as-child
      >
        <Button
          icon="fa-solid fa-xmark"
          icon-only
          :label="t('ui.actions.close')"
          size="small"
          variant="tertiary"
        />
      </DialogClose>
    </div>
    <div
      v-if="$slots.description || $slots.default"
      class="bcds-dialog-content"
    >
      <DialogDescription
        v-if="$slots.description"
        as="div"
      >
        <slot name="description" />
      </DialogDescription>
      <slot />
    </div>
    <div
      v-if="$slots.buttons"
      class="bcds-dialog-buttons"
    >
      <slot name="buttons" />
    </div>
  </DialogContent>
</template>

<style scoped>
@layer components {
  .bcds-dialog {
    display: flex;
    flex-direction: column;
    min-height: var(--layout-margin-xxxlarge);
    outline: none;
  }

  .bcds-dialog-header {
    display: flex;
    align-items: flex-start;
    gap: var(--layout-padding-small);
    padding: var(--layout-padding-medium) var(--layout-padding-large);
    border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
  }

  .bcds-dialog-title {
    flex-grow: 1;
    margin: 0;
    font: var(--typography-bold-h5);
  }

  .bcds-dialog-content {
    padding: var(--layout-padding-medium) var(--layout-padding-large);
    font: var(--typography-regular-body);
  }

  .bcds-dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: var(--layout-margin-small);
    padding: var(--layout-padding-medium) var(--layout-padding-large);
    border-top: var(--layout-border-width-small) solid var(--surface-color-border-default);
  }
}
</style>
