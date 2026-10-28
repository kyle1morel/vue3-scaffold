<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();
</script>

<template>
  <h3 class="font-bold">{{ t('views.forbidden.message') }}</h3>
</template>
