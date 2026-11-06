<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// Composables
const { t } = useI18n();
</script>

<template>
  <h1>{{ t('views.notFound.message') }}</h1>
</template>
