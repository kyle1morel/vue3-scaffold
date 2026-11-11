<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

// Props
const {
  danger = false,
  disabled = false,
  href = undefined,
  iconLeft = undefined,
  iconRight = undefined,
  size = 'medium',
  to = undefined
} = defineProps<{
  // Red, for links in error or destructive messages
  danger?: boolean;
  disabled?: boolean;
  href?: string;
  // FontAwesome icons, such as fa-solid fa-arrow-up-right-from-square
  iconLeft?: string;
  iconRight?: string;
  size?: 'large' | 'medium' | 'small';
  // A page in the app, linked through the router
  to?: RouteLocationRaw;
}>();

defineSlots<{ default(): unknown }>();
</script>

<template>
  <!-- A disabled link has no destination, so it can't be followed or focused. -->
  <component
    :is="to && !disabled ? 'RouterLink' : 'a'"
    :aria-disabled="disabled || undefined"
    class="bcds-link"
    :class="[`bcds-link-${size}`, { 'bcds-link-danger': danger, 'bcds-link-disabled': disabled }]"
    v-bind="disabled ? {} : to ? { to } : { href }"
  >
    <span
      v-if="iconLeft"
      class="bcds-link-icon"
    >
      <font-awesome-icon :icon="iconLeft" />
    </span>
    <slot />
    <span
      v-if="iconRight"
      class="bcds-link-icon"
    >
      <font-awesome-icon :icon="iconRight" />
    </span>
  </component>
</template>

<style scoped>
@layer components {
  .bcds-link {
    color: var(--typography-color-link);
    text-decoration: underline;
    text-underline-offset: var(--layout-padding-hair);
    cursor: pointer;
  }

  .bcds-link-icon {
    display: inline-flex;
    flex-direction: row;
    margin: var(--layout-margin-none) var(--layout-margin-xsmall);
    vertical-align: text-bottom;
  }

  .bcds-link-small {
    font: var(--typography-regular-small-body);
  }

  .bcds-link-medium {
    font: var(--typography-regular-body);
  }

  .bcds-link-large {
    font: var(--typography-regular-large-body);
  }

  .bcds-link:not(.bcds-link-disabled):hover,
  .bcds-link[aria-current='page'] {
    color: var(--surface-color-border-active);
  }

  .bcds-link:focus-visible {
    border-radius: var(--layout-border-radius-small);
    outline: solid var(--layout-border-width-medium) var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }

  .bcds-link.bcds-link-danger {
    color: var(--typography-color-danger);
  }

  .bcds-link.bcds-link-danger:not(.bcds-link-disabled):hover {
    color: var(--surface-color-primary-danger-button-hover);
  }

  .bcds-link.bcds-link-disabled {
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }
}
</style>
