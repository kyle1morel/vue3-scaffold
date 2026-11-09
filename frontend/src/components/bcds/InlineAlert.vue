<script setup lang="ts">
import { useId } from 'vue';
import { useI18n } from 'vue-i18n';

import Button from './Button.vue';

// Props
const {
  description = undefined,
  isCloseable = false,
  isIconHidden = false,
  role = 'note',
  title = undefined,
  variant = 'info'
} = defineProps<{
  description?: string;
  isCloseable?: boolean;
  isIconHidden?: boolean;
  // How screen readers treat it: note is read only when the user reaches it, status is announced when the screen
  // reader is idle, and alert is announced at once, interrupting. status and alert only announce when the alert is
  // added or its text changes, so alert suits errors that appear after the page loads.
  role?: 'alert' | 'note' | 'status';
  title?: string;
  variant?: 'danger' | 'info' | 'success' | 'warning';
}>();

// Emits
const emit = defineEmits<{ close: [] }>();

defineSlots<{ buttons?(): unknown; default?(): unknown; icon?(): unknown }>();

// Constants
const ICONS = {
  danger: 'fa-solid fa-circle-exclamation',
  info: 'fa-solid fa-circle-info',
  success: 'fa-solid fa-circle-check',
  warning: 'fa-solid fa-triangle-exclamation'
};

// Composables
const { t } = useI18n();

// State
const titleId = useId();
</script>

<template>
  <div
    class="bcds-inline-alert"
    :class="[`bcds-inline-alert-${variant}`, { 'bcds-inline-alert-closeable': isCloseable }]"
  >
    <span
      v-if="!isIconHidden"
      class="bcds-inline-alert-icon"
    >
      <slot name="icon">
        <font-awesome-icon :icon="ICONS[variant]" />
      </slot>
    </span>
    <div
      class="bcds-inline-alert-body"
      :aria-labelledby="title && !$slots.default ? titleId : undefined"
      :role
    >
      <slot>
        <span
          v-if="title"
          :id="titleId"
          class="bcds-inline-alert-title"
        >
          {{ title }}
        </span>
        <span v-if="description">{{ description }}</span>
        <div
          v-if="$slots.buttons"
          class="bcds-inline-alert-buttons"
        >
          <slot name="buttons" />
        </div>
      </slot>
    </div>
    <Button
      v-if="isCloseable"
      class="bcds-inline-alert-close"
      icon="fa-solid fa-xmark"
      icon-only
      size="small"
      :label="t('ui.actions.close')"
      variant="tertiary"
      @click="emit('close')"
    />
  </div>
</template>

<style scoped>
@layer components {
  .bcds-inline-alert {
    display: flex;
    align-items: flex-start;
    gap: var(--layout-margin-small);
    padding: var(--layout-padding-medium) var(--layout-padding-large);
    border: var(--layout-border-width-small) solid;
    border-radius: var(--layout-border-radius-medium);
  }

  .bcds-inline-alert-body {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    color: var(--typography-color-primary);
    font: var(--typography-regular-body);
  }

  .bcds-inline-alert-title {
    font: var(--typography-bold-body);
  }

  .bcds-inline-alert-icon {
    display: inline-flex;
    align-self: flex-start;
    padding-top: var(--layout-padding-xsmall);
  }

  .bcds-inline-alert-icon > svg {
    width: var(--icons-size-medium);
    height: var(--icons-size-medium);
  }

  .bcds-inline-alert-buttons {
    display: flex;
    justify-content: flex-end;
    gap: var(--layout-margin-small);
    padding-top: var(--layout-padding-small);
  }

  /* The close button sits outside the row, so it doesn't make the alert taller; the padding makes room for it */
  .bcds-inline-alert-closeable {
    position: relative;
    padding-right: 52px;
  }

  .bcds-inline-alert-close {
    position: absolute;
    top: calc(var(--layout-padding-medium) + var(--typography-line-heights-xdense) / 2);
    right: 20px;
    color: var(--icons-color-primary);
    transform: translateY(-50%);
  }

  .bcds-inline-alert-info {
    border-color: var(--support-border-color-info);
    background: var(--support-surface-color-info);
  }

  .bcds-inline-alert-info .bcds-inline-alert-icon {
    color: var(--icons-color-info);
  }

  .bcds-inline-alert-success {
    border-color: var(--support-border-color-success);
    background: var(--support-surface-color-success);
  }

  .bcds-inline-alert-success .bcds-inline-alert-icon {
    color: var(--icons-color-success);
  }

  .bcds-inline-alert-warning {
    border-color: var(--support-border-color-warning);
    background: var(--support-surface-color-warning);
  }

  .bcds-inline-alert-warning .bcds-inline-alert-icon {
    color: var(--icons-color-warning);
  }

  .bcds-inline-alert-danger {
    border-color: var(--support-border-color-danger);
    background: var(--support-surface-color-danger);
  }

  .bcds-inline-alert-danger .bcds-inline-alert-icon {
    color: var(--icons-color-danger);
  }
}
</style>
