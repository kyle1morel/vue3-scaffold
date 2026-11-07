<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Button } from '@/components/bcds';
import { useAuthNStore } from '@/store';
import { RouteName } from '@/utils/enums/application';

// Store
const authnStore = useAuthNStore();
const { getIsAuthenticated } = storeToRefs(authnStore);

// Actions
const { t } = useI18n();
const router = useRouter();

function isLoginEnabled() {
  return (
    !getIsAuthenticated.value &&
    router.currentRoute.value.name &&
    !([RouteName.HOME, RouteName.OIDC_LOGIN, RouteName.OIDC_CALLBACK, RouteName.OIDC_LOGOUT] as RouteName[]).includes(
      router.currentRoute.value.name as RouteName
    )
  );
}

function login() {
  router.push({ name: RouteName.OIDC_LOGIN });
}

function logout() {
  router.push({ name: RouteName.OIDC_LOGOUT });
}
</script>

<template>
  <Button
    v-if="isLoginEnabled()"
    :label="t('ui.actions.logIn')"
    variant="secondary"
    @click="login()"
  />
  <Button
    v-else-if="getIsAuthenticated"
    :label="t('ui.actions.logOut')"
    variant="secondary"
    @click="logout()"
  />
</template>
