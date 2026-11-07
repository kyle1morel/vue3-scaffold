<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import HeaderMenu from '@/components/common/HeaderMenu.vue';
import { AppDrawer } from '@/components/layout';
import { RouteName } from '@/utils/enums';

// Actions
const { t } = useI18n();
const route = useRoute();

// A plain #main-content link would go through the router and leave focus where it was, so focus moves directly
function skipToMain() {
  document.getElementById('main-content')?.focus();
}
</script>

<template>
  <header class="relative bg-surface-0 text-[var(--p-bcblue-950)] border-b-2 border-[var(--p-gold-950)]">
    <!-- Hidden until it takes focus, then shown over the logo as in the BC Design System header -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 lg:focus:left-12 focus:p-2 bg-surface-0"
      @click.prevent="skipToMain"
    >
      {{ t('components.header.skipToMain') }}
    </a>
    <div class="flex items-center gap-2 px-4 lg:px-12 py-2">
      <a
        href="https://www2.gov.bc.ca"
        class="flex-none"
      >
        <img
          src="@/assets/images/BCID_H_rgb_pos.png"
          class="h-10 sm:h-15"
          :alt="t('app.logoAlt')"
        />
      </a>
      <div class="hidden sm:block mx-2 bg-[var(--surface-color-border-default)] w-px h-8" />
      <!-- The app name repeats on every page, so it isn't a heading; each page's own title is its h1 -->
      <p class="grow min-w-0 my-0 truncate text-lg sm:text-[2rem] font-bold leading-normal">
        <router-link
          :to="{ name: RouteName.HOME }"
          class="text-[var(--p-primary-color)] no-underline"
        >
          {{ t('app.name') }}
        </router-link>
      </p>
      <div class="flex flex-none justify-end">
        <HeaderMenu />
        <AppDrawer v-if="!route.meta.hideAppDrawer" />
      </div>
    </div>
  </header>
</template>
