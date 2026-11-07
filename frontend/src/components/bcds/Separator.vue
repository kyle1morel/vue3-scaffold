<script setup lang="ts">
// Props
const { orientation = 'horizontal', size = 'medium' } = defineProps<{
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
}>();
</script>

<template>
  <hr
    v-if="orientation === 'horizontal'"
    class="separator horizontal"
    :class="size"
  />
  <!-- An hr can't be vertical, so a vertical separator states its role -->
  <div
    v-else
    aria-orientation="vertical"
    class="separator vertical"
    :class="size"
    role="separator"
  />
</template>

<style scoped>
.separator {
  border: none;
  border-radius: var(--layout-border-radius-circular);
  background-color: var(--surface-color-border-default);
}

.horizontal {
  align-self: stretch;
  width: auto;
  margin: var(--layout-margin-small) var(--layout-margin-none);
}

.vertical {
  align-self: stretch;
  height: auto;
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
