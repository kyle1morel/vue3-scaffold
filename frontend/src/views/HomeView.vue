<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Button } from '@/lib/primevue';
import { useAuthNStore } from '@/store';
import { RouteName } from '@/utils/enums/application';

// Composables
const { t } = useI18n();
const router = useRouter();

// Store
const { getIsAuthenticated } = storeToRefs(useAuthNStore());
</script>

<template>
  <div class="h-screen">
    <div class="bg" />
    <div class="poly" />
    <div class="flex items-center justify-start h-full">
      <div class="text-left">
        <h3>{{ t('views.homeView.welcome') }}</h3>
        <h1 class="mt-0!">{{ t('views.homeView.title') }}</h1>
        <Button
          v-if="getIsAuthenticated"
          :label="t('views.homeView.developer')"
          @click="router.push({ name: RouteName.DEVELOPER })"
        />
        <Button
          v-else
          :label="t('views.homeView.login')"
          @click="router.push({ name: RouteName.OIDC_LOGIN })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h1,
h3 {
  color: rgba(255, 255, 255, 0.9) !important;
}

h3 {
  font-weight: 400;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1000;
  background: url('../assets/images/home-bg.avif') no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
}

.poly {
  clip-path: polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%);
  z-index: -500;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--p-primary-color);
  opacity: 0.9;
}

.p-button {
  border-width: 2px;
  width: 12.5rem;
  &:not(.p-button-secondary, .p-button-success, .p-button-info, .p-button-warning, .p-button-help, .p-button-danger) {
    color: var(--p-primary-color);
    &:not(.p-button-outlined, .p-button-text) {
      background-color: white;
      border-color: white;
      color: var(--p-primary-color);
    }
    &:hover {
      background-color: var(--p-greyscale-200);
    }
    &:focus,
    &:focus-visible {
      outline: 3px solid var(--p-primary-contrast-color);
      outline-offset: 2px;
      box-shadow: 0 0 0 3px rgba(252, 186, 25, 0.5);
    }
  }
}
</style>
