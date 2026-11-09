<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import HeaderMenu from './HeaderMenu.vue';
import { Footer, Header } from '@/components/bcds';
import { AppDrawer } from '@/components/layout';
import { RouteName } from '@/utils/enums';

// Composables
const { t } = useI18n();
const route = useRoute();

// Actions

// A plain #main-content link would go through the router and leave focus where it was, so focus moves directly.
function skipToMain() {
  document.getElementById('main-content')?.focus();
}
</script>

<template>
  <div class="flex flex-col h-screen">
    <Header
      class="px-4 min-[576px]:px-8"
      full-width
      :title="t('app.name')"
    >
      <template #logo>
        <router-link :to="{ name: RouteName.HOME }">
          <img
            src="@/assets/images/BCID_H_rgb_pos.svg"
            class="block w-[129px] min-w-[129px]"
            :alt="t('app.logoAlt')"
          />
        </router-link>
      </template>
      <template #skipLinks>
        <a
          href="#main-content"
          @click.prevent="skipToMain"
        >
          {{ t('components.header.skipToMain') }}
        </a>
      </template>
      <HeaderMenu />
      <AppDrawer v-if="!route.meta.hideAppDrawer" />
    </Header>

    <!-- Main views; focusable so the header's skip link can move focus here -->
    <main
      id="main-content"
      class="m-4 min-[576px]:mx-8 flex-auto focus:outline-none"
      tabindex="-1"
    >
      <slot name="main" />
    </main>

    <Footer
      class="mt-8 shrink-0"
      full-width
    />
  </div>
</template>
