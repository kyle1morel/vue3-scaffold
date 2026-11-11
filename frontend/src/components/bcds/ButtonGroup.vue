<script setup lang="ts">
// Props
const { alignment = 'start', orientation = 'horizontal' } = defineProps<{
  alignment?: 'center' | 'end' | 'start';
  orientation?: 'horizontal' | 'vertical';
}>();

defineSlots<{ default(): unknown }>();
</script>

<template>
  <!-- An aria-label passed in names the group. -->
  <div
    class="bcds-button-group"
    :class="[`bcds-button-group-${orientation}`, `bcds-button-group-${alignment}`]"
    role="group"
  >
    <slot />
  </div>
</template>

<style scoped>
@layer components {
  .bcds-button-group {
    display: flex;
    flex-grow: 1;
    gap: var(--layout-margin-small);
  }

  .bcds-button-group-horizontal {
    flex-direction: row;
  }

  .bcds-button-group-vertical {
    flex-direction: column;
  }

  .bcds-button-group-start {
    justify-content: flex-start;
  }

  .bcds-button-group-center {
    justify-content: center;
  }

  .bcds-button-group-end {
    justify-content: flex-end;
  }
}
</style>
