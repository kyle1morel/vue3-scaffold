<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import developer from '@/assets/images/developer.svg';
import form from '@/assets/images/form.svg';
import home from '@/assets/images/home.svg';
import { Button, Drawer } from '@/components/bcds';
import { useAuthNStore } from '@/store';
import { RouteName } from '@/utils/enums';

// Types
interface DrawerItem {
  icon?: string;
  label: string;
  route?: string;
  public?: boolean;
  items?: DrawerItem[];
}

// Composables
const { t } = useI18n();

// Store
const { getIsAuthenticated } = storeToRefs(useAuthNStore());

// State
const expanded = ref<string[]>([]);
const visible = ref(false);

const items = computed<DrawerItem[]>(() => [
  {
    icon: home,
    label: t('components.appDrawer.home'),
    route: RouteName.HOME,
    public: true
  },
  {
    icon: form,
    label: t('components.appDrawer.demo'),
    items: [
      { label: t('components.appDrawer.demoForm'), route: RouteName.DEMO_FORM },
      { label: t('components.appDrawer.submissions'), route: RouteName.SUBMISSIONS },
      { label: t('components.appDrawer.components'), route: RouteName.COMPONENTS }
    ]
  },
  {
    icon: developer,
    label: t('components.appDrawer.developer'),
    route: RouteName.DEVELOPER
  }
]);

const permittedItems = computed(() =>
  items.value
    .filter((item) => item.public || getIsAuthenticated.value)
    .map((item) => ({
      ...item,
      items: item.items?.filter((subItem) => subItem.public || getIsAuthenticated.value)
    }))
);

// Actions
function toggle(item: DrawerItem) {
  expanded.value = expanded.value.includes(item.label)
    ? expanded.value.filter((label) => label !== item.label)
    : [...expanded.value, item.label];
}
</script>

<template>
  <Button
    :label="t('components.appDrawer.menu')"
    variant="secondary"
    @click="visible = true"
  >
    <span class="hidden md:inline">{{ t('components.appDrawer.menu') }}</span>
    <font-awesome-icon icon="fa-solid fa-bars" />
  </Button>
  <Drawer
    v-model:open="visible"
    :title="t('components.appDrawer.menu')"
  >
    <div class="flex items-center justify-between px-4 pt-4 shrink-0 mb-3">
      <Button
        icon="fa-solid fa-xmark"
        :label="t('ui.actions.close')"
        variant="secondary"
        @click="visible = false"
      />
    </div>
    <nav class="overflow-y-auto px-2">
      <ul class="list-none p-0 m-0">
        <li
          v-for="item in permittedItems"
          :key="item.label"
        >
          <Button
            v-if="item.items"
            :aria-expanded="expanded.includes(item.label)"
            class="no-underline inline-flex items-center mt-2 w-full justify-start"
            variant="tertiary"
            @click="toggle(item)"
          >
            <img
              class="w-7 h-8"
              :src="item.icon"
              alt=""
            />
            <span class="font-medium">{{ item.label }}</span>
            <font-awesome-icon
              class="ml-auto"
              :class="{ 'rotate-180': expanded.includes(item.label) }"
              icon="fa-solid fa-chevron-down"
            />
          </Button>
          <Button
            v-else
            class="no-underline inline-flex items-center mt-2 w-full justify-start"
            :to="{ name: item.route ?? RouteName.HOME }"
            variant="tertiary"
            @click="visible = false"
          >
            <img
              class="w-7 h-8"
              :src="item.icon"
              alt=""
            />
            <span class="font-medium">{{ item.label }}</span>
          </Button>

          <ul
            v-if="item.items"
            v-show="expanded.includes(item.label)"
            class="list-none py-0 pl-4"
          >
            <li
              v-for="subItem in item.items"
              :key="subItem.label"
              class="my-3"
            >
              <Button
                class="no-underline w-full justify-start"
                :to="{ name: subItem.route ?? RouteName.HOME }"
                variant="tertiary"
                @click="visible = false"
              >
                <span class="font-medium">{{ subItem.label }}</span>
              </Button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </Drawer>
</template>
