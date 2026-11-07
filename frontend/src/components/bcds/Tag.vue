<script setup lang="ts">
// Props
const {
  color = 'blue',
  icon = undefined,
  size = 'small',
  tagStyle = 'rectangular'
} = defineProps<{
  color?: 'bc-blue' | 'bc-gold' | 'blue' | 'dark' | 'gray' | 'green' | 'grey' | 'red' | 'yellow';
  // A FontAwesome icon, such as fa-solid fa-check
  icon?: string;
  size?: 'medium' | 'small' | 'xsmall';
  tagStyle?: 'circular' | 'rectangular';
}>();

defineSlots<{ default?(): unknown }>();
</script>

<template>
  <span
    class="tag"
    :class="[color === 'grey' ? 'gray' : color, `size-${size}`, tagStyle]"
  >
    <font-awesome-icon
      v-if="icon"
      :icon
    />
    <slot />
  </span>
</template>

<style scoped>
.tag {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  border: var(--layout-border-width-small) solid;
  color: var(--typography-color-primary);
  font: var(--typography-regular-label);
  text-align: left;
}

.rectangular {
  border-radius: var(--layout-border-radius-small);
}

.circular {
  border-radius: var(--layout-border-radius-circular);
}

.size-xsmall {
  gap: var(--layout-margin-xsmall);
  min-height: var(--layout-padding-medium);
  padding: var(--layout-padding-hair) var(--layout-padding-small);
}

.size-small {
  gap: var(--layout-margin-small);
  min-height: var(--layout-padding-large);
  padding: var(--layout-padding-hair) var(--layout-padding-small);
}

.size-medium {
  gap: var(--layout-margin-medium);
  min-height: var(--layout-padding-xlarge);
  padding: var(--layout-padding-hair) var(--layout-padding-medium);
}

.bc-blue {
  border-color: var(--theme-blue-90);
  background: var(--theme-primary-blue);
  color: var(--typography-color-primary-invert);
}

.bc-gold {
  border-color: var(--theme-blue-90);
  background: var(--theme-primary-gold);
}

.blue {
  border-color: var(--support-border-color-info);
  background: var(--support-surface-color-info);
}

.dark {
  border-color: var(--theme-blue-90);
  background: var(--theme-gray-110);
  color: var(--typography-color-primary-invert);
}

.gray {
  border-color: var(--surface-color-border-dark);
  background: var(--theme-gray-20);
}

.green {
  border-color: var(--support-border-color-success);
  background: var(--support-surface-color-success);
}

.red {
  border-color: var(--support-border-color-danger);
  background: var(--support-surface-color-danger);
}

.yellow {
  border-color: var(--support-border-color-warning);
  background: var(--support-surface-color-warning);
}
</style>
