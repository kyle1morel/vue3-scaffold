<script setup lang="ts">
import { storeToRefs } from 'pinia';
import StyleClass from 'primevue/styleclass';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import developer from '@/assets/images/developer.svg';
import form from '@/assets/images/form.svg';
import help from '@/assets/images/help.svg';
import home from '@/assets/images/home.svg';
import list from '@/assets/images/list.svg';
import { Button, Drawer } from '@/lib/primevue';
import { useAuthNStore } from '@/store';
import { SUPPORT_CONTACT } from '@/utils/constants/application';
import { RouteName } from '@/utils/enums/application';

// Types
interface DrawerItem {
  icon?: string;
  label: string;
  route?: string;
  public?: boolean;
  items?: DrawerItem[];
  mailTo?: string;
}

// Composables
const { t } = useI18n();
const vStyleclass = StyleClass;

// Store
const { getIsAuthenticated } = storeToRefs(useAuthNStore());

// State
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
    label: t('components.appDrawer.demoForm'),
    route: RouteName.DEMO_FORM
  },
  {
    icon: list,
    label: t('components.appDrawer.submissions'),
    route: RouteName.SUBMISSIONS
  },
  {
    icon: developer,
    label: t('components.appDrawer.developer'),
    route: RouteName.DEVELOPER
  },
  {
    icon: help,
    label: t('components.appDrawer.help'),
    public: true,
    items: [
      {
        label: t('components.appDrawer.reportProblem'),
        mailTo: `mailto:${SUPPORT_CONTACT.email}?subject=${SUPPORT_CONTACT.subject}`,
        public: true
      }
    ]
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
</script>

<template>
  <Button
    :label="t('components.appDrawer.menu')"
    outlined
    @click="visible = true"
  >
    <span class="hidden md:inline">{{ t('components.appDrawer.menu') }}</span>
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
              :label="t('ui.actions.close')"
              icon="pi pi-times"
              rectangle
              variant="outlined"
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
                  class="no-underline inline-flex items-center mt-2 cursor-pointer w-full justify-start"
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
                    class="no-underline w-full justify-start"
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
                      class="no-underline w-full justify-start"
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
