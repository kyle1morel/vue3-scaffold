<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthNStore } from '@/store';
import { RouteName } from '@/utils/enums/application';

// Store
const { getIsAuthenticated } = storeToRefs(useAuthNStore());

// State
const ready = ref(false);

// Actions
const router = useRouter();

onBeforeMount(async () => {
  if (!getIsAuthenticated.value) {
    router.push({ name: RouteName.OIDC_LOGIN });
  } else {
    ready.value = true;
  }
});
</script>

<template>
  <slot v-if="ready" />
</template>
