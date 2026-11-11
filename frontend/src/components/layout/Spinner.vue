<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { ProgressCircle } from '@/components/bcds';

// Composables
const { t } = useI18n();
</script>

<template>
  <div class="flex justify-center">
    <ProgressCircle
      :aria-label="t('ui.loading')"
      indeterminate
      size="large"
    />
  </div>
</template>
