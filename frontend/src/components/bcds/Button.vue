<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

// Props
const {
  danger = false,
  disabled = false,
  icon = undefined,
  iconOnly = false,
  label = undefined,
  size = 'medium',
  to = undefined,
  type = 'button',
  variant = 'primary'
} = defineProps<{
  // For destructive actions, on any variant
  danger?: boolean;
  disabled?: boolean;
  // A FontAwesome icon, such as fa-solid fa-check
  icon?: string;
  // Shows only the icon, with the label as its accessible name
  iconOnly?: boolean;
  label?: string;
  // The button's height, from 24px for xsmall to 48px for large; an icon-only button is a square of it.
  size?: 'large' | 'medium' | 'small' | 'xsmall';
  // Renders a router link styled as a button
  to?: RouteLocationRaw;
  type?: 'button' | 'reset' | 'submit';
  variant?: 'link' | 'primary' | 'secondary' | 'tertiary';
}>();

defineSlots<{ default?(): unknown }>();
</script>

<template>
  <!-- The label names the button when it isn't shown; attributes from the caller win over these. -->
  <component
    :is="to ? 'RouterLink' : 'button'"
    :aria-label="(iconOnly || $slots.default) && label ? label : undefined"
    class="bcds-button"
    :class="[
      `bcds-button-${variant}`,
      `bcds-button-${size}`,
      { 'bcds-button-danger': danger, 'bcds-button-icon-only': iconOnly }
    ]"
    v-bind="to ? { to } : { disabled, type }"
  >
    <slot>
      <font-awesome-icon
        v-if="icon"
        :icon
      />
      <span v-if="label && !iconOnly">{{ label }}</span>
    </slot>
  </component>
</template>

<style scoped>
@layer components {
  .bcds-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--layout-padding-small);
    box-sizing: border-box;
    min-width: 24px;
    min-height: 24px;
    border: none;
    border-radius: var(--layout-border-radius-medium);
    font: var(--typography-regular-body);
    text-decoration: none;
    cursor: pointer;
  }

  .bcds-button:disabled {
    cursor: not-allowed;
  }

  .bcds-button:focus-visible {
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-button-xsmall {
    padding: var(--layout-padding-hair) var(--layout-padding-small);
    font: var(--typography-regular-label);
  }

  .bcds-button-small {
    min-height: 32px;
    padding: var(--layout-padding-none) 0.75rem;
    font: var(--typography-regular-small-body);
  }

  .bcds-button-medium {
    min-height: 40px;
    padding: var(--layout-padding-none) var(--layout-padding-medium);
  }

  .bcds-button-large {
    min-height: 48px;
    padding: var(--layout-padding-none) var(--layout-padding-large);
  }

  .bcds-button-icon-only {
    padding: 0;
  }

  .bcds-button-icon-only.bcds-button-xsmall {
    width: 24px;
    height: 24px;
  }

  .bcds-button-icon-only.bcds-button-small {
    width: 32px;
    min-width: 32px;
    height: 32px;
  }

  .bcds-button-icon-only.bcds-button-medium {
    width: 40px;
    min-width: 40px;
    height: 40px;
  }

  .bcds-button-icon-only.bcds-button-large {
    width: 48px;
    min-width: 48px;
    height: 48px;
  }

  .bcds-button-primary {
    background: var(--surface-color-primary-button-default);
    color: var(--typography-color-primary-invert);
  }

  .bcds-button-primary:hover {
    background: var(--surface-color-primary-button-hover);
  }

  .bcds-button-primary:active {
    background: var(--surface-color-primary-pressed);
  }

  .bcds-button-primary.bcds-button-danger {
    background: var(--surface-color-primary-danger-button-default);
  }

  .bcds-button-primary.bcds-button-danger:hover {
    background: var(--surface-color-primary-danger-button-hover);
  }

  .bcds-button-primary.bcds-button-danger:active {
    background: var(--support-surface-color-danger);
    color: var(--surface-color-primary-danger-button-default);
  }

  .bcds-button-primary:disabled {
    background: var(--surface-color-primary-danger-button-disabled);
    color: var(--typography-color-disabled);
  }

  .bcds-button-secondary {
    border: var(--layout-border-width-small) solid var(--surface-color-border-dark);
    background: var(--surface-color-secondary-button-default);
    color: var(--typography-color-primary);
  }

  .bcds-button-secondary:hover {
    background: var(--surface-color-secondary-button-hover);
  }

  .bcds-button-secondary:active {
    background: var(--surface-color-secondary-pressed);
  }

  .bcds-button-secondary.bcds-button-danger {
    border-color: var(--support-border-color-danger);
    color: var(--surface-color-primary-danger-button-default);
  }

  .bcds-button-secondary.bcds-button-danger:hover {
    background: var(--support-surface-color-danger);
  }

  .bcds-button-secondary.bcds-button-danger:active {
    background: var(--surface-color-primary-danger-button-default);
    color: var(--typography-color-primary-invert);
  }

  .bcds-button-secondary:disabled {
    border-color: var(--surface-color-border-default);
    background: var(--surface-color-secondary-button-disabled);
    color: var(--typography-color-disabled);
  }

  .bcds-button-tertiary {
    background: var(--surface-color-tertiary-button-default);
    color: var(--typography-color-primary);
  }

  .bcds-button-tertiary:hover {
    background: var(--surface-color-tertiary-button-hover);
  }

  .bcds-button-tertiary:active {
    background: var(--surface-color-tertiary-pressed);
  }

  .bcds-button-tertiary.bcds-button-danger {
    color: var(--surface-color-primary-danger-button-default);
  }

  .bcds-button-tertiary.bcds-button-danger:hover {
    background: var(--support-surface-color-danger);
  }

  .bcds-button-tertiary:disabled {
    background: var(--surface-color-tertiary-button-default);
    color: var(--typography-color-disabled);
  }

  .bcds-button-link {
    background: var(--surface-color-tertiary-button-default);
    color: var(--typography-color-link);
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }

  .bcds-button-link.bcds-button-danger {
    color: var(--surface-color-primary-danger-button-default);
  }

  .bcds-button-link:disabled {
    color: var(--typography-color-disabled);
  }
}
</style>
