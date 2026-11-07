<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/bcds';
import { useToast } from '@/lib/primevue';

// Props
const { iconOnly = false, toCopy = undefined } = defineProps<{
  iconOnly?: boolean;
  toCopy?: string;
}>();

// Composables
const { t } = useI18n();

// Actions
const toast = useToast();

// Writing fails without clipboard permission or a secure context
async function copyToClipboard() {
  if (!toCopy) return;

  try {
    await navigator.clipboard.writeText(toCopy);
  } catch {
    toast.error(t('components.copyToClipboard.failed'));
    return;
  }

  toast.info(t('components.copyToClipboard.copied'));
}
</script>

<template>
  <Button
    icon="fa-solid fa-clipboard"
    :icon-only
    :label="t('components.copyToClipboard.button')"
    variant="secondary"
    @click="copyToClipboard"
  />
</template>
