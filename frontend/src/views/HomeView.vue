<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Button } from '@/components/bcds';
import { useAuthNStore } from '@/store';
import { RouteName } from '@/utils/enums';

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
        <p>{{ t('views.home.welcome') }}</p>
        <h1 class="mt-0!">{{ t('app.name') }}</h1>
        <Button
          v-if="getIsAuthenticated"
          class="home-action"
          :label="t('views.demoForm.title')"
          @click="router.push({ name: RouteName.DEMO_FORM })"
        />
        <Button
          v-else
          class="home-action"
          :label="t('ui.actions.logIn')"
          @click="router.push({ name: RouteName.OIDC_LOGIN })"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
h1,
h3 {
  color: rgba(255, 255, 255, 0.9);
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

// The angled panel needs room beside it; on phones it covers the full width
.poly {
  z-index: -500;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--p-primary-color);
  opacity: 0.9;

  @media (min-width: 768px) {
    clip-path: polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%);
  }
}

// A white button stands out on the blue panel
.home-action {
  width: 12.5rem;
  background-color: var(--theme-gray-white);
  color: var(--theme-primary-blue);

  &:hover {
    background-color: var(--surface-color-tertiary-button-hover);
  }

  &:focus-visible {
    outline: 3px solid var(--typography-color-primary-invert);
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(252, 186, 25, 0.5);
  }
}
</style>
