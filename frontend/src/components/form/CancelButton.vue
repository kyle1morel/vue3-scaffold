<script setup lang="ts">
import { useIsFormDirty } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import { Button } from '@/lib/primevue';

// Composables
const { t } = useI18n();

// State
const isDirty = useIsFormDirty();
</script>

<template>
  <!-- A clean form has nothing to cancel; @click and :disabled fall through to the Button -->
  <Button
    outlined
    severity="danger"
    :disabled="!isDirty"
    :label="t('ui.actions.cancel')"
  >
    <template #icon="{ class: iconClass }">
      <font-awesome-icon
        :class="iconClass"
        icon="fa-solid fa-xmark"
      />
    </template>
  </Button>
</template>
