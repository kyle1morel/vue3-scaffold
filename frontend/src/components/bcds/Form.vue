<script setup lang="ts">
// Props
const { validationBehavior = 'native' } = defineProps<{
  // native lets the browser block submit and show its own messages; aria leaves validation to the fields.
  validationBehavior?: 'aria' | 'native';
}>();

defineSlots<{ default(): unknown }>();
</script>

<template>
  <form :novalidate="validationBehavior === 'aria' || undefined">
    <slot />
  </form>
</template>
