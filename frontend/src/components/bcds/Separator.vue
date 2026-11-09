<script setup lang="ts">
import { Separator as RekaSeparator } from 'reka-ui';

// Props
const { orientation = 'horizontal', size = 'medium' } = defineProps<{
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}>();
</script>

<template>
  <RekaSeparator
    class="bcds-separator"
    :class="[`bcds-separator-${orientation}`, `bcds-separator-${size}`]"
    :orientation
  />
</template>

<style scoped>
@layer components {
  .bcds-separator {
    border-radius: var(--layout-border-radius-circular);
    background-color: var(--surface-color-border-default);
  }

  .bcds-separator-horizontal {
    align-self: stretch;
    margin: var(--layout-margin-small) var(--layout-margin-none);
  }

  .bcds-separator-vertical {
    align-self: stretch;
    margin: var(--layout-margin-none) var(--layout-margin-small);
  }

  .bcds-separator-horizontal.bcds-separator-small {
    height: var(--layout-border-width-small);
  }

  .bcds-separator-horizontal.bcds-separator-medium {
    height: var(--layout-border-width-medium);
  }

  .bcds-separator-horizontal.bcds-separator-large {
    height: var(--layout-border-width-large);
  }

  .bcds-separator-vertical.bcds-separator-small {
    width: var(--layout-border-width-small);
  }

  .bcds-separator-vertical.bcds-separator-medium {
    width: var(--layout-border-width-medium);
  }

  .bcds-separator-vertical.bcds-separator-large {
    width: var(--layout-border-width-large);
  }
}
</style>
