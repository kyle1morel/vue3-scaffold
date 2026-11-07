<script setup lang="ts">
import { useIsFormDirty } from 'vee-validate';
import { useI18n } from 'vue-i18n';

import { Button } from '@/components/bcds';

// Composables
const { t } = useI18n();

// State
const isDirty = useIsFormDirty();
</script>

<template>
  <!-- A clean form has nothing to cancel; @click and :disabled fall through to the Button -->
  <Button
    :disabled="!isDirty"
    icon="fa-solid fa-xmark"
    :label="t('ui.actions.cancel')"
    variant="secondary"
  />
</template>
