<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import HeaderMenu from '@/components/common/HeaderMenu.vue';
import { AppDrawer } from '@/components/layout';
import { RouteName } from '@/utils/enums/application';

// Actions
const { t } = useI18n();
const route = useRoute();
</script>

<template>
  <header class="bg-surface-0 text-[var(--p-bcblue-950)] border-b-2 border-[var(--p-gold-950)]">
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
      <div class="hidden sm:block mx-2 bg-[#d8d8d8] w-px h-8" />
      <h2 class="grow min-w-0 my-0 truncate text-lg sm:text-[2rem]">
        <router-link
          :to="{ name: RouteName.HOME }"
          class="text-[var(--p-primary-color)] no-underline"
        >
          {{ t('app.name') }}
        </router-link>
      </h2>
      <div class="flex flex-none justify-end">
        <HeaderMenu />
        <AppDrawer v-if="!route.meta.hideAppDrawer" />
      </div>
    </div>
  </header>
</template>
