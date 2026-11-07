<script setup lang="ts">
import { Separator } from '@/components/bcds';

// Props
const { level = 2, title } = defineProps<{
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
    <!-- The separator stretches across its parent, so this box takes the row's space and the row centres it -->
    <div class="flex-1">
      <Separator />
    </div>
  </div>
</template>
