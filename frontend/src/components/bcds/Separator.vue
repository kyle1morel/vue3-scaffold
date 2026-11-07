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
    class="separator"
    :class="[orientation, size]"
    :orientation
  />
</template>

<style scoped>
.separator {
  border-radius: var(--layout-border-radius-circular);
  background-color: var(--surface-color-border-default);
}

.horizontal {
  align-self: stretch;
  margin: var(--layout-margin-small) var(--layout-margin-none);
}

.vertical {
  align-self: stretch;
  margin: var(--layout-margin-none) var(--layout-margin-small);
}

.horizontal.small {
  height: var(--layout-border-width-small);
}

.horizontal.medium {
  height: var(--layout-border-width-medium);
}

.horizontal.large {
  height: var(--layout-border-width-large);
}

.vertical.small {
  width: var(--layout-border-width-small);
}

.vertical.medium {
  width: var(--layout-border-width-medium);
}

.vertical.large {
  width: var(--layout-border-width-large);
}
</style>
