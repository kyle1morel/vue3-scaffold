<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router';

import { AlertBanner, Toaster, TooltipProvider } from '@/components/bcds';
import { AppLayout, Breadcrumb, ConfirmDialog, ProgressLoader } from '@/components/layout';
import { useAppStore, useConfigStore } from '@/store';

// Store
const appStore = useAppStore();
const { getIsLoading } = storeToRefs(appStore);
const { getConfig } = storeToRefs(useConfigStore());
</script>

<template>
  <!-- One provider for every tooltip, so moving between neighbouring tooltips skips the open delay. -->
  <TooltipProvider>
    <ConfirmDialog />
    <ProgressLoader v-if="getIsLoading" />
    <Toaster />

    <AppLayout>
      <template #main>
        <AlertBanner
          v-if="getConfig?.notificationBanner"
          :closeable="false"
          layout="fluid"
          variant="warning"
        >
          {{ getConfig?.notificationBanner }}
        </AlertBanner>
        <Breadcrumb />
        <RouterView />
      </template>
    </AppLayout>
  </TooltipProvider>
</template>
