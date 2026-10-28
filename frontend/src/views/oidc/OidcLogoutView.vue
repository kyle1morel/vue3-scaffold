<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Spinner } from '@/components/layout';
import { useAuthNStore } from '@/store';

const authnStore = useAuthNStore();
const router = useRouter();
const { t } = useI18n();

onMounted(async () => {
  if (authnStore.getIsAuthenticated) await authnStore.logout();

  // Return user back to home page
  router.replace('/');
});
</script>

<template>
  <h2 class="mt-40 text-center">{{ t('views.oidcLogout.loggingOut') }}</h2>
  <Spinner />
</template>
