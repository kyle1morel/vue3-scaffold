<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
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

// State

// TODO: Shares its pages with the app drawer's menu; derive both from one list if they drift.
const tour = computed(() => [
  {
    description: t('views.home.tour.demoForm'),
    label: t('views.demoForm.title'),
    route: RouteName.DEMO_FORM
  },
  {
    description: t('views.home.tour.submissions'),
    label: t('views.submissions.title'),
    route: RouteName.SUBMISSIONS
  },
  {
    description: t('views.home.tour.components'),
    label: t('views.components.title'),
    route: RouteName.COMPONENTS
  },
  {
    description: t('views.home.tour.developer'),
    label: t('views.developer.title'),
    route: RouteName.DEVELOPER
  }
]);
</script>

<template>
  <div class="h-screen">
    <div class="bg" />
    <div class="poly" />
    <div class="flex items-center justify-start h-full">
      <div class="text-left">
        <p>{{ t('views.home.welcome') }}</p>
        <h1 class="mt-0!">{{ t('app.name') }}</h1>
        <ul
          v-if="getIsAuthenticated"
          class="home-tour"
        >
          <li
            v-for="page in tour"
            :key="page.route"
          >
            <router-link :to="{ name: page.route }">{{ page.label }}</router-link>
            <p>{{ page.description }}</p>
          </li>
        </ul>
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
p {
  color: rgba(255, 255, 255, 0.9);
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

// The angled panel needs room beside it; on phones it covers the full width.
.poly {
  z-index: -500;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--theme-blue-100);
  opacity: 0.9;

  @media (min-width: 768px) {
    clip-path: polygon(0% 0%, 55% 0%, 45% 100%, 0% 100%);
  }
}

// White on the blue panel, like the headings.
.home-tour {
  max-width: 28rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li + li {
    margin-top: var(--layout-margin-medium);
  }

  a {
    color: var(--typography-color-primary-invert);
    font: var(--typography-bold-large-body);
  }

  p {
    margin: 0;
  }
}

// A white button stands out on the blue panel.
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
