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
    class="bcds-alert-banner"
    :class="[`bcds-alert-banner-${variant}`, `bcds-alert-banner-${size}`, `bcds-alert-banner-layout-${layout}`]"
  >
    <div class="bcds-alert-banner-body">
      <span
        v-if="!isIconHidden"
        class="bcds-alert-banner-icon"
      >
        <slot name="icon">
          <font-awesome-icon :icon="ICONS[variant]" />
        </slot>
      </span>
      <div
        class="bcds-alert-banner-content"
        :role
      >
        <slot />
      </div>
      <Button
        v-if="isCloseable"
        class="bcds-alert-banner-close"
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
@layer components {
  .bcds-alert-banner {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    --banner-color: var(--typography-color-primary-invert);
  }

  .bcds-alert-banner-body {
    display: flex;
    flex-grow: 1;
    align-items: center;
    gap: var(--layout-padding-medium);
  }

  .bcds-alert-banner-icon {
    place-self: first baseline flex-start;
    padding-top: var(--layout-padding-xsmall);
    color: var(--banner-color);
  }

  .bcds-alert-banner-icon > svg {
    width: var(--icons-size-medium);
    height: var(--icons-size-medium);
  }

  .bcds-alert-banner-content {
    display: inline-flex;
    flex-grow: 1;
    flex-wrap: wrap;
    align-items: first baseline;
    gap: var(--layout-margin-medium);
    color: var(--banner-color);
  }

  .bcds-alert-banner-close {
    align-self: first baseline;
    color: var(--banner-color);
  }

  .bcds-alert-banner-close:hover {
    color: var(--icons-color-primary);
  }

  .bcds-alert-banner-layout-fixed {
    padding: var(--layout-padding-none) var(--layout-padding-medium);
  }

  .bcds-alert-banner-layout-fixed > .bcds-alert-banner-body {
    max-width: 1100px;
  }

  .bcds-alert-banner-layout-fluid {
    padding: var(--layout-padding-none) var(--layout-padding-large);
  }

  .bcds-alert-banner-small > .bcds-alert-banner-body {
    padding: var(--layout-padding-hair) var(--layout-padding-none);
  }

  .bcds-alert-banner-small .bcds-alert-banner-content {
    font: var(--typography-regular-small-body);
  }

  .bcds-alert-banner-medium > .bcds-alert-banner-body {
    padding: var(--layout-padding-small) var(--layout-padding-none);
  }

  .bcds-alert-banner-medium .bcds-alert-banner-content {
    font: var(--typography-regular-body);
  }

  .bcds-alert-banner-info {
    background: var(--surface-color-background-dark-blue);
  }

  .bcds-alert-banner-success {
    background: var(--support-border-color-success);
  }

  .bcds-alert-banner-warning {
    background: var(--support-border-color-warning);
    --banner-color: var(--typography-color-primary);
  }

  .bcds-alert-banner-danger {
    background: var(--support-border-color-danger);
  }

  .bcds-alert-banner-black {
    background: var(--theme-gray-110);
  }
}
</style>
