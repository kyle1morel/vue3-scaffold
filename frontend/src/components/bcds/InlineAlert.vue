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
  // added or its text changes, so alert suits errors that appear after the page loads
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
    class="inline-alert"
    :class="[variant, { closeable: isCloseable }]"
  >
    <span
      v-if="!isIconHidden"
      class="icon"
    >
      <slot name="icon">
        <font-awesome-icon :icon="ICONS[variant]" />
      </slot>
    </span>
    <div
      class="body"
      :aria-labelledby="title && !$slots.default ? titleId : undefined"
      :role
    >
      <slot>
        <span
          v-if="title"
          :id="titleId"
          class="title"
        >
          {{ title }}
        </span>
        <span
          v-if="description"
          class="description"
        >
          {{ description }}
        </span>
        <div
          v-if="$slots.buttons"
          class="buttons"
        >
          <slot name="buttons" />
        </div>
      </slot>
    </div>
    <Button
      v-if="isCloseable"
      class="close"
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
.inline-alert {
  display: flex;
  align-items: flex-start;
  gap: var(--layout-margin-small);
  padding: var(--layout-padding-medium) var(--layout-padding-large);
  border: var(--layout-border-width-small) solid;
  border-radius: var(--layout-border-radius-medium);
}

.body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  color: var(--typography-color-primary);
  font: var(--typography-regular-body);
}

.title {
  font: var(--typography-bold-body);
}

.icon {
  display: inline-flex;
  align-self: flex-start;
  padding-top: var(--layout-padding-xsmall);
}

.icon > svg {
  width: var(--icons-size-medium);
  height: var(--icons-size-medium);
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: var(--layout-margin-small);
  padding-top: var(--layout-padding-small);
}

/* The close button sits outside the row, so it doesn't make the alert taller; the padding makes room for it */
.closeable {
  position: relative;
  padding-right: 52px;
}

.close {
  position: absolute;
  top: calc(var(--layout-padding-medium) + var(--typography-line-heights-xdense) / 2);
  right: 20px;
  color: var(--icons-color-primary);
  transform: translateY(-50%);
}

.info {
  border-color: var(--support-border-color-info);
  background: var(--support-surface-color-info);
}

.info .icon {
  color: var(--icons-color-info);
}

.success {
  border-color: var(--support-border-color-success);
  background: var(--support-surface-color-success);
}

.success .icon {
  color: var(--icons-color-success);
}

.warning {
  border-color: var(--support-border-color-warning);
  background: var(--support-surface-color-warning);
}

.warning .icon {
  color: var(--icons-color-warning);
}

.danger {
  border-color: var(--support-border-color-danger);
  background: var(--support-surface-color-danger);
}

.danger .icon {
  color: var(--icons-color-danger);
}
</style>
