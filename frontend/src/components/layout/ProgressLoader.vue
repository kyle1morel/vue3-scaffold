<script setup lang="ts">
import { storeToRefs } from 'pinia';

import { ProgressBar } from '@/lib/primevue';
import { useAppStore } from '@/store';

// Store
const appStore = useAppStore();
const { getLoadingMode, getLoadingValue } = storeToRefs(appStore);
</script>

<template>
  <div class="fixed top-0 w-full z-999">
    <ProgressBar
      class="h-[0.15rem] pointer-events-none"
      :mode="getLoadingMode"
      :show-value="false"
      :value="getLoadingValue"
    />
  </div>
</template>
