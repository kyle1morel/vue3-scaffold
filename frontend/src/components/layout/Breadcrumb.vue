<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { breadcrumbLabel } from '@/composables/useBreadcrumb';

import type { RouteLocationRaw, RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router';

// Composables
const { t } = useI18n();
const route = useRoute();

// State
// One crumb per matched route with a breadcrumb, so nesting routes builds the trail.
const crumbs = computed(() => {
  if (route.meta.hideBreadcrumb) return [];
  const page = route.matched.at(-1);

  return route.matched
    .filter((record) => record.meta.breadcrumb)
    .map((record) => {
      // An empty-path child shares its parent's path, so the parent's crumb is the current page too.
      const current = record.path === page?.path;
      return {
        current,
        key: record.path,
        label: (current && breadcrumbLabel.value) || record.meta.breadcrumb!(),
        to: current ? undefined : linkTo(record)
      };
    });
});

// Actions
// A nameless route's page is its empty-path child, which carries the name; the current params fill any it needs.
function linkTo(record: { children?: RouteRecordRaw[]; name?: RouteRecordNameGeneric }): RouteLocationRaw | undefined {
  if (record.name) return { name: record.name };
  const child = record.children?.find(({ path }) => path === '');
  return child && linkTo(child);
}
</script>

<template>
  <nav
    v-if="crumbs.length > 1 && breadcrumbLabel !== null"
    :aria-label="t('components.breadcrumb.label')"
    class="p-0.5"
  >
    <ol class="flex flex-wrap gap-2">
      <li
        v-for="(crumb, index) in crumbs"
        :key="crumb.key"
        class="flex gap-2"
      >
        <span
          v-if="index > 0"
          aria-hidden="true"
        >
          /
        </span>
        <router-link
          v-if="crumb.to"
          :to="crumb.to"
        >
          {{ crumb.label }}
        </router-link>
        <span
          v-else
          :aria-current="crumb.current ? 'page' : undefined"
        >
          {{ crumb.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
