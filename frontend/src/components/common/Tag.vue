<script setup lang="ts">
// The colours and sizing follow the BC Design System Tag

// Props
const { color = 'blue' } = defineProps<{
  color?: 'bc-blue' | 'bc-gold' | 'blue' | 'dark' | 'gray' | 'green' | 'red' | 'yellow';
}>();
</script>

<template>
  <span
    class="tag"
    :class="color"
  >
    <slot />
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--layout-margin-small);
  min-height: var(--layout-padding-large);
  padding: var(--layout-padding-hair) var(--layout-padding-small);
  border: var(--layout-border-width-small) solid;
  border-radius: var(--layout-border-radius-small);
  color: var(--typography-color-primary);
  font-size: var(--typography-font-size-label);
  line-height: var(--typography-line-heights-xxxdense);
}

.bc-blue {
  background: var(--theme-primary-blue);
  border-color: var(--theme-blue-90);
  color: var(--typography-color-primary-invert);
}

.bc-gold {
  background: var(--theme-primary-gold);
  border-color: var(--theme-blue-90);
}

.blue {
  background: var(--support-surface-color-info);
  border-color: var(--support-border-color-info);
}

.dark {
  background: var(--theme-gray-110);
  border-color: var(--theme-blue-90);
  color: var(--typography-color-primary-invert);
}

.gray {
  background: var(--theme-gray-20);
  border-color: var(--surface-color-border-dark);
}

.green {
  background: var(--support-surface-color-success);
  border-color: var(--support-border-color-success);
}

.red {
  background: var(--support-surface-color-danger);
  border-color: var(--support-border-color-danger);
}

.yellow {
  background: var(--support-surface-color-warning);
  border-color: var(--support-border-color-warning);
}
</style>
