<script setup lang="ts">
export interface TagProps {
  color?: 'bc-blue' | 'bc-gold' | 'blue' | 'dark' | 'gray' | 'green' | 'grey' | 'red' | 'yellow';
  disabled?: boolean;
  // A FontAwesome icon, such as fa-solid fa-check
  icon?: string;
  size?: 'medium' | 'small' | 'xsmall';
  tagStyle?: 'circular' | 'rectangular';
}

// Props
const {
  color = 'blue',
  disabled = false,
  icon = undefined,
  size = 'small',
  tagStyle = 'rectangular'
} = defineProps<TagProps>();

defineSlots<{ default?(): unknown }>();
</script>

<template>
  <span
    class="bcds-tag"
    :class="[
      `bcds-tag-${color === 'grey' ? 'gray' : color}`,
      `bcds-tag-${size}`,
      `bcds-tag-${tagStyle}`,
      { 'bcds-tag-disabled': disabled }
    ]"
  >
    <font-awesome-icon
      v-if="icon"
      :icon
    />
    <slot />
  </span>
</template>

<style scoped>
@layer components {
  .bcds-tag {
    display: inline-flex;
    align-items: center;
    max-width: 100%;
    border: var(--layout-border-width-small) solid;
    color: var(--typography-color-primary);
    font: var(--typography-regular-label);
    text-align: left;
  }

  .bcds-tag-rectangular {
    border-radius: var(--layout-border-radius-small);
  }

  .bcds-tag-circular {
    border-radius: var(--layout-border-radius-circular);
  }

  .bcds-tag-xsmall {
    gap: var(--layout-margin-xsmall);
    min-height: var(--layout-padding-medium);
    padding: var(--layout-padding-hair) var(--layout-padding-small);
  }

  .bcds-tag-small {
    gap: var(--layout-margin-small);
    min-height: var(--layout-padding-large);
    padding: var(--layout-padding-hair) var(--layout-padding-small);
  }

  .bcds-tag-medium {
    gap: var(--layout-margin-medium);
    min-height: var(--layout-padding-xlarge);
    padding: var(--layout-padding-hair) var(--layout-padding-medium);
  }

  .bcds-tag-bc-blue {
    border-color: var(--theme-blue-90);
    background: var(--theme-primary-blue);
    color: var(--typography-color-primary-invert);
  }

  .bcds-tag-bc-gold {
    border-color: var(--theme-blue-90);
    background: var(--theme-primary-gold);
  }

  .bcds-tag-blue {
    border-color: var(--support-border-color-info);
    background: var(--support-surface-color-info);
  }

  .bcds-tag-dark {
    border-color: var(--theme-blue-90);
    background: var(--theme-gray-110);
    color: var(--typography-color-primary-invert);
  }

  .bcds-tag-gray {
    border-color: var(--surface-color-border-dark);
    background: var(--theme-gray-20);
  }

  .bcds-tag-green {
    border-color: var(--support-border-color-success);
    background: var(--support-surface-color-success);
  }

  .bcds-tag-red {
    border-color: var(--support-border-color-danger);
    background: var(--support-surface-color-danger);
  }

  .bcds-tag-yellow {
    border-color: var(--support-border-color-warning);
    background: var(--support-surface-color-warning);
  }

  .bcds-tag-disabled {
    border-color: var(--surface-color-border-default);
    background: var(--surface-color-primary-button-disabled);
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }
}
</style>
