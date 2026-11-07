<script setup lang="ts">
import { computed } from 'vue';

import { AlertDialog, Button } from '@/components/bcds';
import { confirmRequest } from '@/composables/useConfirm';

// State
// Esc and the close button answer no
const open = computed({
  get: () => !!confirmRequest.value,
  set: (value) => {
    if (!value) answer(false);
  }
});

// Actions
function answer(accepted: boolean) {
  confirmRequest.value?.resolve(accepted);
  confirmRequest.value = undefined;
}
</script>

<template>
  <AlertDialog
    v-model:open="open"
    role="alertdialog"
    :title="confirmRequest?.title"
    :variant="confirmRequest?.danger ? 'destructive' : 'info'"
  >
    {{ confirmRequest?.message }}
    <template #buttons>
      <Button
        :label="confirmRequest?.rejectLabel"
        variant="secondary"
        @click="answer(false)"
      />
      <Button
        :danger="confirmRequest?.danger"
        :label="confirmRequest?.acceptLabel"
        @click="answer(true)"
      />
    </template>
  </AlertDialog>
</template>
