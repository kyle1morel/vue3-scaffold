<script setup lang="ts">
import { useId } from 'vue';

import ButtonGroup from './ButtonGroup.vue';

// Props
const {
  description = undefined,
  hideBorder = false,
  role = 'note',
  title = undefined,
  variant = 'light-grey'
} = defineProps<{
  description?: string;
  hideBorder?: boolean;
  role?: 'alert' | 'note' | 'region' | 'status';
  title?: string;
  variant?: 'black' | 'blue' | 'grey' | 'light-blue' | 'light-gold' | 'light-grey';
}>();

// Content in the default slot replaces the title, description and buttons.
defineSlots<{ buttons?(): unknown; default?(): unknown }>();

// State
const titleId = useId();
</script>

<template>
  <div
    :aria-labelledby="title && !$slots.default ? titleId : undefined"
    class="bcds-callout"
    :class="[`bcds-callout-${variant}`, { 'bcds-callout-no-border': hideBorder }]"
    :role
  >
    <slot>
      <div class="bcds-callout-container">
        <span
          v-if="title"
          :id="titleId"
          class="bcds-callout-title"
        >
          {{ title }}
        </span>
        <span
          v-if="description"
          class="bcds-callout-description"
        >
          {{ description }}
        </span>
        <ButtonGroup v-if="$slots.buttons">
          <slot name="buttons" />
        </ButtonGroup>
      </div>
    </slot>
  </div>
</template>

<style scoped>
@layer components {
  .bcds-callout {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: var(--layout-padding-medium) var(--layout-padding-large);
    border-radius: var(--layout-border-radius-medium) var(--layout-border-radius-none) var(--layout-border-radius-none)
      var(--layout-border-radius-medium);
  }

  .bcds-callout-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: var(--layout-margin-small);
  }

  .bcds-callout-title {
    color: var(--typography-color-primary);
    font: var(--typography-bold-large-body);
  }

  .bcds-callout-description {
    color: var(--typography-color-secondary);
    font: var(--typography-regular-body);
  }

  .bcds-callout-light-grey {
    border-left: var(--layout-border-width-large) solid var(--theme-primary-blue);
    background-color: var(--surface-color-background-light-gray);
  }

  .bcds-callout-light-blue {
    border-left: var(--layout-border-width-large) solid var(--theme-primary-blue);
    background-color: var(--theme-blue-10);
  }

  .bcds-callout-light-gold {
    border-left: var(--layout-border-width-large) solid var(--theme-primary-blue);
    background-color: var(--theme-gold-10);
  }

  .bcds-callout-blue {
    border-left: var(--layout-border-width-large) solid var(--theme-primary-gold);
    background-color: var(--surface-color-background-dark-blue);
  }

  .bcds-callout-grey {
    border-left: var(--layout-border-width-large) solid var(--theme-primary-gold);
    background-color: var(--theme-gray-80);
  }

  .bcds-callout-black {
    border-left: var(--layout-border-width-large) solid var(--theme-primary-gold);
    background-color: var(--theme-gray-100);
  }

  :is(.bcds-callout-blue, .bcds-callout-grey, .bcds-callout-black) .bcds-callout-title {
    color: var(--typography-color-primary-invert);
  }

  :is(.bcds-callout-blue, .bcds-callout-grey, .bcds-callout-black) .bcds-callout-description {
    color: var(--typography-color-secondary-invert);
  }

  .bcds-callout.bcds-callout-no-border {
    border-left: none;
    border-radius: var(--layout-border-radius-none);
  }
}
</style>
