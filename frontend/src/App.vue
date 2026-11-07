<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';

import { AppLayout, Breadcrumb, ProgressLoader } from '@/components/layout';
import { ConfirmDialog, Message, Toast } from '@/lib/primevue';
import { useAppStore, useConfigStore } from '@/store';

// Store
const appStore = useAppStore();
const { getIsLoading } = storeToRefs(appStore);
const { getConfig } = storeToRefs(useConfigStore());
</script>

<template>
  <ConfirmDialog />
  <ProgressLoader v-if="getIsLoading" />
  <Toast />

  <AppLayout>
    <template #main>
      <!-- A status rather than PrimeVue's assertive alert, so it doesn't interrupt on every page load -->
      <Message
        v-if="getConfig?.notificationBanner"
        severity="warn"
        class="text-center"
        :pt="{ root: { role: 'status', 'aria-live': 'polite' } }"
      >
        {{ getConfig?.notificationBanner }}
      </Message>
      <Breadcrumb />
      <RouterView />
    </template>
  </AppLayout>
</template>
