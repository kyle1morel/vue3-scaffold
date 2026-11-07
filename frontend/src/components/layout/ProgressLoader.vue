<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { ProgressBar } from '@/components/bcds';
import { useAppStore } from '@/store';

// Composables
const { t } = useI18n();

// Store
const appStore = useAppStore();
const { getLoadingMode, getLoadingValue } = storeToRefs(appStore);
</script>

<template>
  <div class="fixed top-0 w-full z-999 pointer-events-none">
    <ProgressBar
      :aria-label="t('ui.loading')"
      :is-indeterminate="getLoadingMode === 'indeterminate'"
      size="small"
      :value="getLoadingValue"
    />
  </div>
</template>
