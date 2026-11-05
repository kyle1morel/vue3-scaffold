<script setup lang="ts">
import Divider from '@/components/common/Divider.vue';

// Props
const { level = 3, title } = defineProps<{
  level?: 2 | 3 | 4 | 5 | 6;
  title: string;
}>();
</script>

<template>
  <div class="mb-4 flex items-center">
    <component
      :is="`h${level}`"
      class="flex-none m-0 pr-4"
    >
      {{ title }}
    </component>
    <Divider />
  </div>
</template>
