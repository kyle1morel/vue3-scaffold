<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { ProgressSpinner } from '@/lib/primevue';

// Composables
const { t } = useI18n();
</script>

<template>
  <div class="flex justify-center">
    <ProgressSpinner
      style="width: 50px; height: 50px"
      stroke-width="4"
      :aria-label="t('ui.loading')"
    />
  </div>
</template>
