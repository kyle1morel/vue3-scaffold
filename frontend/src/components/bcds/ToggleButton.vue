<script setup lang="ts">
import { injectToggleGroupRootContext, Toggle, ToggleGroupItem } from 'reka-ui';

// Props
const {
  disabled = false,
  icon = undefined,
  iconOnly = false,
  label = undefined,
  size = 'medium',
  value = undefined
} = defineProps<{
  disabled?: boolean;
  // A FontAwesome icon, such as fa-solid fa-bold
  icon?: string;
  // Shows only the icon, with the label as its accessible name
  iconOnly?: boolean;
  label?: string;
  size?: 'medium' | 'small';
  // Identifies the button in a ToggleButtonGroup's selection
  value?: string;
}>();

const pressed = defineModel<boolean>({ default: false });

defineSlots<{ default?(): unknown }>();

// State
// In a group, the group keeps the selection and moves focus between its buttons with the arrow keys.
const group = injectToggleGroupRootContext(null);
</script>

<template>
  <ToggleGroupItem
    v-if="group"
    :aria-label="iconOnly ? label : undefined"
    class="bcds-toggle-button"
    :class="[`bcds-toggle-button-${size}`, { 'bcds-toggle-button-icon-only': iconOnly }]"
    :disabled
    :value="value ?? ''"
  >
    <slot>
      <font-awesome-icon
        v-if="icon"
        :icon
      />
      <span v-if="label && !iconOnly">{{ label }}</span>
    </slot>
  </ToggleGroupItem>
  <Toggle
    v-else
    v-model="pressed"
    :aria-label="iconOnly ? label : undefined"
    class="bcds-toggle-button"
    :class="[`bcds-toggle-button-${size}`, { 'bcds-toggle-button-icon-only': iconOnly }]"
    :disabled
  >
    <slot>
      <font-awesome-icon
        v-if="icon"
        :icon
      />
      <span v-if="label && !iconOnly">{{ label }}</span>
    </slot>
  </Toggle>
</template>

<style scoped>
@layer components {
  .bcds-toggle-button {
    display: inline-flex;
    flex: 0 1 auto;
    flex-flow: row wrap;
    align-items: center;
    justify-content: center;
    gap: var(--layout-margin-xsmall);
    box-sizing: border-box;
    padding: var(--layout-padding-hair) var(--layout-padding-small);
    border: var(--layout-border-width-small) solid transparent;
    border-radius: var(--layout-border-radius-medium);
    background-color: var(--surface-color-secondary-button-disabled);
    color: var(--typography-color-secondary);
    white-space: normal;
    cursor: pointer;
    transition-property: background-color, border-color, box-shadow, color;
    transition-duration: 200ms;
    transition-timing-function: ease;
  }

  .bcds-toggle-button-small {
    font: var(--typography-regular-small-body);
  }

  .bcds-toggle-button-medium {
    font: var(--typography-regular-body);
  }

  .bcds-toggle-button-icon-only {
    flex: 0 0 auto;
    padding: unset;
  }

  .bcds-toggle-button-icon-only.bcds-toggle-button-small {
    width: var(--icons-size-large);
    min-width: var(--icons-size-large);
    height: var(--icons-size-large);
  }

  .bcds-toggle-button-icon-only.bcds-toggle-button-medium {
    width: var(--icons-size-xlarge);
    min-width: var(--icons-size-xlarge);
    height: var(--icons-size-xlarge);
  }

  .bcds-toggle-button[data-state='on'] {
    border-color: var(--surface-color-secondary-button-default);
    background-color: var(--surface-color-secondary-button-default);
    box-shadow: var(--surface-shadow-small);
    color: var(--typography-color-primary);
  }

  /* A selected button keeps its look on hover, so it still reads as selected. */
  .bcds-toggle-button:not([data-disabled], [data-state='on']):hover {
    border-color: var(--surface-color-border-medium);
    background-color: var(--surface-color-secondary-pressed);
    color: var(--typography-color-primary);
  }

  .bcds-toggle-button[data-state='on']:not([data-disabled]):hover {
    border-color: var(--surface-color-border-medium);
  }

  .bcds-toggle-button:focus-visible {
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    background-color: var(--theme-blue-10);
  }

  .bcds-toggle-button:not([data-disabled]):hover:active {
    border-color: var(--theme-gray-20);
    background-color: var(--theme-gray-20);
  }

  .bcds-toggle-button[data-disabled] {
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    .bcds-toggle-button {
      transition: none;
    }
  }
}
</style>
