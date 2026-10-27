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
  <header class="bg-surface-0 text-[var(--p-bcblue-950)] whitespace-nowrap border-b-2 border-[var(--p-gold-950)]">
    <div class="flex flex-wrap items-center lg:pl-12 py-2">
      <a
        href="https://www2.gov.bc.ca"
        class="flex-none"
      >
        <img
          src="@/assets/images/BCID_H_rgb_pos.png"
          class="h-15"
          alt="B.C. Government Logo"
        />
      </a>
      <div class="mx-2 bg-[#d8d8d8] w-px h-8" />
      <h2 class="grow ml-2 my-0">
        <router-link
          :to="{ name: RouteName.HOME }"
          class="no-underline"
        >
          {{ t('common.header.name') }}
        </router-link>
      </h2>
      <div class="flex justify-end lg:mr-12">
        <HeaderMenu />
        <AppDrawer v-if="!route.meta.hideAppDrawer" />
      </div>
    </div>
  </header>
</template>
