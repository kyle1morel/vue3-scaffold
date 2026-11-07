<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import Button from './Button.vue';

// Props
const {
  isCloseable = true,
  isIconHidden = false,
  layout = 'fixed',
  role = 'status',
  size = 'medium',
  variant = 'info'
} = defineProps<{
  isCloseable?: boolean;
  isIconHidden?: boolean;
  layout?: 'fixed' | 'fluid';
  // How screen readers treat it: note is read only when the user reaches it, status is announced when the screen
  // reader is idle, and alert is announced at once, interrupting. status and alert only announce when the banner is
  // added or its text changes, so alert suits errors that appear after the page loads
  role?: 'alert' | 'note' | 'status';
  size?: 'medium' | 'small';
  variant?: 'black' | 'danger' | 'info' | 'success' | 'warning';
}>();

// Emits
const emit = defineEmits<{ close: [] }>();

defineSlots<{ default?(): unknown; icon?(): unknown }>();

// Constants
const ICONS = {
  black: 'fa-solid fa-circle-info',
  danger: 'fa-solid fa-circle-exclamation',
  info: 'fa-solid fa-circle-info',
  success: 'fa-solid fa-circle-check',
  warning: 'fa-solid fa-triangle-exclamation'
};

// Composables
const { t } = useI18n();
</script>

<template>
  <div
    class="alert-banner"
    :class="[variant, size, `layout-${layout}`]"
  >
    <div class="body">
      <span
        v-if="!isIconHidden"
        class="icon"
      >
        <slot name="icon">
          <font-awesome-icon :icon="ICONS[variant]" />
        </slot>
      </span>
      <div
        class="content"
        :role
      >
        <slot />
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
  </div>
</template>

<style scoped>
.alert-banner {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  --banner-color: var(--typography-color-primary-invert);
}

.body {
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: var(--layout-padding-medium);
}

.icon {
  place-self: first baseline flex-start;
  padding-top: var(--layout-padding-xsmall);
  color: var(--banner-color);
}

.icon > svg {
  width: var(--icons-size-medium);
  height: var(--icons-size-medium);
}

.content {
  display: inline-flex;
  flex-grow: 1;
  flex-wrap: wrap;
  align-items: first baseline;
  gap: var(--layout-margin-medium);
  color: var(--banner-color);
}

.close {
  align-self: first baseline;
  color: var(--banner-color);
}

.close:hover {
  color: var(--icons-color-primary);
}

.layout-fixed {
  padding: var(--layout-padding-none) var(--layout-padding-medium);
}

.layout-fixed > .body {
  max-width: 1100px;
}

.layout-fluid {
  padding: var(--layout-padding-none) var(--layout-padding-large);
}

.small > .body {
  padding: var(--layout-padding-hair) var(--layout-padding-none);
}

.small .content {
  font: var(--typography-regular-small-body);
}

.medium > .body {
  padding: var(--layout-padding-small) var(--layout-padding-none);
}

.medium .content {
  font: var(--typography-regular-body);
}

.info {
  background: var(--surface-color-background-dark-blue);
}

.success {
  background: var(--support-border-color-success);
}

.warning {
  background: var(--support-border-color-warning);
  --banner-color: var(--typography-color-primary);
}

.danger {
  background: var(--support-border-color-danger);
}

.black {
  background: var(--theme-gray-110);
}
</style>
