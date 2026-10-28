<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';

import { Button, useToast } from '@/lib/primevue';
import { ButtonMode } from '@/utils/enums/application';

// Props
const { mode = ButtonMode.BUTTON, toCopy = undefined } = defineProps<{
  mode?: ButtonMode;
  toCopy?: string;
}>();

// Composables
const { t } = useI18n();

// Actions
const toast = useToast();

const copyToClipboard = () => {
  if (toCopy) {
    navigator.clipboard.writeText(toCopy);
    toast.info(t('components.copyToClipboard.copied'));
  }
};
</script>

<template>
  <Button
    v-if="mode === ButtonMode.ICON"
    rounded
    class="p-button-secondary p-button-outlined"
    @click="copyToClipboard"
  >
    <font-awesome-icon icon="fa fa-clipboard" />
  </Button>
  <Button
    v-if="mode === ButtonMode.BUTTON"
    class="p-button-outlined p-button-secondary"
    @click="copyToClipboard"
  >
    <font-awesome-icon
      icon="fa fa-clipboard"
      class="mr-2"
    />
    {{ t('components.copyToClipboard.button') }}
  </Button>
</template>
