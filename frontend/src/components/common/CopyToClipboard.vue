<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/bcds';
import { useToast } from '@/composables/useToast';
import { rethrowAs } from '@/utils/utils';

// Props
const { iconOnly = false, toCopy = undefined } = defineProps<{
  iconOnly?: boolean;
  toCopy?: string;
}>();

// Composables
const { t } = useI18n();

// Actions
const toast = useToast();

// Writing fails without clipboard permission or a secure context.
async function copyToClipboard() {
  if (!toCopy) return;

  await navigator.clipboard.writeText(toCopy).catch(rethrowAs(t('components.copyToClipboard.failed')));
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
