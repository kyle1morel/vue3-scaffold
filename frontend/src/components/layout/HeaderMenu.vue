<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Button, Menu } from '@/components/bcds';
import { useAuthNStore } from '@/store';
import { RouteName } from '@/utils/enums';

import type { MenuItemProps } from '@/components/bcds';

// Composables
const router = useRouter();
const { t } = useI18n();

// Store
const { getIsAuthenticated, getProfile } = storeToRefs(useAuthNStore());

// State
const items: MenuItemProps[] = [
  {
    icon: 'fa-solid fa-right-from-bracket',
    label: t('ui.actions.logOut'),
    onAction: () => router.push({ name: RouteName.OIDC_LOGOUT })
  }
];
const displayName = computed(() => getProfile.value?.name ?? String(getProfile.value?.display_name ?? ''));
</script>

<template>
  <div
    v-if="getIsAuthenticated"
    class="flex justify-center"
  >
    <Menu :items>
      <Button
        variant="tertiary"
        class="font-bold text-lg"
        :aria-label="displayName"
      >
        <font-awesome-icon
          icon="fa-solid fa-user"
          class="ml-2 text-primary pointer-events-none"
        />
        <span class="hidden sm:inline">{{ displayName }}</span>
      </Button>
    </Menu>
  </div>
</template>
