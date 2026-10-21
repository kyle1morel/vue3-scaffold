<script setup lang="ts">
import { storeToRefs } from 'pinia';
import StyleClass from 'primevue/styleclass';
import { computed, ref } from 'vue';

import developer from '@/assets/images/developer.svg';
import help from '@/assets/images/help.svg';
import home from '@/assets/images/home.svg';
import { Button, Drawer } from '@/lib/primevue';
import { useAuthNStore } from '@/store';
import { SUPPORT_CONTACT } from '@/utils/constants/application';
import { RouteName } from '@/utils/enums/application';

import type { ComputedRef, Ref } from 'vue';

// Types
interface DrawerItem {
  icon?: string;
  label: string;
  route?: string;
  public?: boolean;
  items?: DrawerItem[];
  mailTo?: string;
}

// Constants
const ITEMS: DrawerItem[] = [
  {
    icon: home,
    label: 'Home',
    route: RouteName.HOME,
    public: true
  },
  {
    icon: developer,
    label: 'Developer',
    route: RouteName.DEVELOPER
  },
  {
    icon: help,
    label: 'Help',
    public: true,
    items: [
      {
        label: 'Report a problem',
        mailTo: `mailto:${SUPPORT_CONTACT.email}?subject=${SUPPORT_CONTACT.subject}`,
        public: true
      }
    ]
  }
];

// Composables
const vStyleclass = StyleClass;

// Store
const { getIsAuthenticated } = storeToRefs(useAuthNStore());

// State
const visible: Ref<boolean> = ref(false);

const permittedItems: ComputedRef<DrawerItem[]> = computed(() =>
  ITEMS.filter((item) => item.public || getIsAuthenticated.value).map((item) => ({
    ...item,
    items: item.items?.filter((subItem) => subItem.public || getIsAuthenticated.value)
  }))
);
</script>

<template>
  <Button
    label="Menu"
    outlined
    class="hover-color"
    @click="visible = true"
  >
    <span class="hidden md:inline">Menu</span>
    <font-awesome-icon icon="fa-solid fa-bars" />
  </Button>
  <Drawer
    v-model:visible="visible"
    position="right"
  >
    <template #container="{ closeCallback }">
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-between px-4 pt-4 shrink-0 mb-3">
          <span>
            <Button
              type="button"
              label="Close"
              icon="pi pi-times"
              rectangle
              variant="outlined"
              class="hover-color"
              @click="closeCallback"
            ></Button>
          </span>
        </div>
        <div class="overflow-y-auto">
          <ul class="list-none p-0 m-0">
            <li
              v-for="item in permittedItems"
              :key="item.label"
              class="overflow-hidden"
            >
              <router-link
                v-slot="{ navigate }"
                :to="{ name: item.route ?? RouteName.HOME }"
                custom
              >
                <Button
                  v-styleclass="{
                    selector: '@next',
                    enterFromClass: 'hidden',
                    enterActiveClass: 'animate-slidedown',
                    leaveToClass: 'hidden',
                    leaveActiveClass: 'animate-slideup'
                  }"
                  text
                  class="no-underline inline-flex items-center mt-2 cursor-pointer hover-color wide-button"
                  tabindex="0"
                  :aria-expanded="item.items ? 'false' : undefined"
                  @click="
                    () => {
                      if (item.route) navigate();
                      if (!item.items) closeCallback();
                    }
                  "
                  @keydown.enter="
                    () => {
                      if (item.route) navigate();
                      if (!item.items) closeCallback();
                    }
                  "
                >
                  <img
                    class="w-7 h-8"
                    :src="item.icon"
                    alt=""
                    aria-hidden="true"
                  />
                  <span class="font-medium">{{ item.label }}</span>
                  <i
                    v-if="item.items"
                    class="pi pi-chevron-down ml-auto"
                    aria-hidden="true"
                  ></i>
                </Button>
              </router-link>

              <ul
                v-if="item.items"
                class="list-none py-0 pl-4 hidden overflow-y-hidden transition-all duration-[400ms] ease-in-out"
              >
                <li
                  v-for="subItem in item.items"
                  :key="subItem.label"
                  class="my-3"
                >
                  <Button
                    v-if="subItem.mailTo"
                    class="no-underline hover-color wide-button"
                    :href="subItem.mailTo"
                    text
                    as="a"
                    @click="closeCallback"
                  >
                    <span class="font-medium">{{ subItem.label }}</span>
                  </Button>
                  <router-link
                    v-else
                    v-slot="{ href, navigate }"
                    :to="{ name: subItem.route ?? RouteName.HOME }"
                    custom
                  >
                    <Button
                      class="no-underline hover-color wide-button"
                      :href="href"
                      text
                      @click="
                        () => {
                          if (subItem.route) navigate();
                          closeCallback();
                        }
                      "
                    >
                      <span class="font-medium">{{ subItem.label }}</span>
                    </Button>
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Drawer>
</template>

<style lang="scss" scoped>
.hover-color.p-button:hover {
  background-color: var(--p-content-hover-background);
}
.wide-button.p-button {
  width: 100%;
  justify-content: flex-start;
}
</style>
