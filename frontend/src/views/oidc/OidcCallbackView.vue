<script setup lang="ts">
import { isAxiosError } from 'axios';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Button, InlineAlert } from '@/components/bcds';
import { Spinner } from '@/components/layout';
import { getCurrentUser } from '@/services';
import { useAuthNStore } from '@/store';
import { RouteName, StorageKey } from '@/utils/enums';

// Composables
const router = useRouter();
const { t } = useI18n();

// State
const error = ref<string>();

// Actions
onMounted(async () => {
  const authnStore = useAuthNStore();

  try {
    await authnStore.loginCallback();
    // The API creates or updates the user's record on their first authenticated request.
    await getCurrentUser();
  } catch (e) {
    // Don't leave the app showing a user the API rejected.
    await authnStore.removeUser();
    error.value =
      isAxiosError(e) && e.response?.status === 403
        ? t('views.oidcCallback.errors.deactivated')
        : t('views.oidcCallback.errors.failed');
    return;
  }

  // Return user back to original login entrypoint if specified
  const entrypoint = globalThis.sessionStorage.getItem(StorageKey.AUTH);
  if (entrypoint) globalThis.sessionStorage.removeItem(StorageKey.AUTH);
  router.replace(entrypoint || { name: RouteName.HOME });
});
</script>

<template>
  <div
    v-if="error"
    class="mx-auto mt-40 flex max-w-xl flex-col items-center gap-4"
  >
    <InlineAlert
      :description="error"
      role="alert"
      variant="danger"
    />
    <Button
      :label="t('ui.actions.logIn')"
      @click="router.replace({ name: RouteName.LOGIN })"
    />
  </div>
  <template v-else>
    <h1 class="mt-40 text-center">{{ t('views.oidcCallback.authorizing') }}</h1>
    <Spinner />
  </template>
</template>
