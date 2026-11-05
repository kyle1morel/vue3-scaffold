<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Button, useToast } from '@/lib/primevue';

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
    :aria-label="iconOnly ? t('components.copyToClipboard.button') : undefined"
    :label="iconOnly ? undefined : t('components.copyToClipboard.button')"
    outlined
    :rounded="iconOnly"
    severity="secondary"
    @click="copyToClipboard"
  >
    <template #icon="{ class: iconClass }">
      <font-awesome-icon
        :class="iconClass"
        icon="fa-solid fa-clipboard"
      />
    </template>
  </Button>
</template>
