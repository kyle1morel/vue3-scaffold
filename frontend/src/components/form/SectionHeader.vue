<script setup lang="ts">
import Divider from '@/components/common/Divider.vue';

// Props
const { title } = defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="col-span-12 mb-4 flex items-center">
    <h3 class="flex-none m-0 pr-4">{{ title }}</h3>
    <Divider />
  </div>
</template>
