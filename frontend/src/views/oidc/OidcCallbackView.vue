<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Spinner } from '@/components/layout';
import { useAuthNStore } from '@/store';
import { RouteName, StorageKey } from '@/utils/enums/application';

// Composables
const router = useRouter();
const { t } = useI18n();

// Actions
onMounted(async () => {
  const authnStore = useAuthNStore();

  await authnStore.loginCallback();

  // Return user back to original login entrypoint if specified
  const entrypoint = globalThis.sessionStorage.getItem(StorageKey.AUTH);
  if (entrypoint) globalThis.sessionStorage.removeItem(StorageKey.AUTH);
  router.replace(entrypoint || { name: RouteName.DEMO_FORM });
});
</script>

<template>
  <h2 class="mt-40 text-center">{{ t('views.oidcCallback.authorizing') }}</h2>
  <Spinner />
</template>
