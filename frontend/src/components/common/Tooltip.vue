<script setup lang="ts">
// Props
const { icon = 'fa-solid fa-circle-info', text } = defineProps<{
  icon?: string;
  text: string;
}>();
</script>

<template>
  <!-- PrimeVue's popup is visual only, so the text is also here for screen readers and aria-describedby -->
  <span
    v-tooltip.right="text"
    class="text-primary"
  >
    <span
      v-tooltip.focus.right="text"
      tabindex="0"
    >
      <font-awesome-icon :icon />
      <span class="sr-only">{{ text }}</span>
    </span>
  </span>
</template>
