<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { Breadcrumb } from '@/lib/primevue';
import { RouteName } from '@/utils/enums/application';

import type { MenuItem } from 'primevue/menuitem';
import type { RouteLocationMatched, RouteRecordNameGeneric, RouteRecordRaw } from 'vue-router';

// Composables
const route = useRoute();

// State
const breadcrumbItems = computed<MenuItem[]>(() => {
  if (route.meta.hideBreadcrumb) return [];
  const matchedCrumbs = route.matched.filter((m) => m.meta?.breadcrumb !== undefined);

  return matchedCrumbs.map((record, index) => ({
    label: record.meta.breadcrumb as string,
    to: index < matchedCrumbs.length - 1 ? generateToObject(record) : null
  }));
});

// Actions
function generateToObject(record: RouteLocationMatched) {
  let toName: RouteRecordNameGeneric;

  // If record has no name then the empty nested child/grandchild will define the route name
  if (!record.name && record.children[0]) {
    toName = getRouteNameFromFirstChild(record.children[0]);
  } else {
    toName = record.name;
  }

  const toObject = {
    name: toName
    // Note: Params, query & hash not needed
    // Breacrumb always navigates backwards so required params are present in router
    // If navigation leads to different part of router tree without needed params
    // The breadcrumbs will reflect that and not show link back to previous view/route
  };
  return toObject;
}

// Recursively find a empty nested child path
function getRouteNameFromFirstChild(record: RouteRecordRaw) {
  if (record.name) {
    return record.name;
  } else if (record.children?.[0]) {
    return getRouteNameFromFirstChild(record.children[0]);
  } else {
    // Route name not found case
    return RouteName.HOME;
  }
}
</script>

<template>
  <Breadcrumb
    v-if="breadcrumbItems.length > 1"
    :model="breadcrumbItems"
    class="p-0.5"
  >
    <template #separator>/</template>
    <template #item="{ item }">
      <!-- eslint-disable max-len -->
      <router-link
        v-if="item.to"
        class="text-[var(--p-textlink)] font-[family-name:'BC_Sans',sans-serif] font-normal no-underline hover:underline"
        :to="item.to"
      >
        <!-- eslint-enable max-len -->
        {{ item.label }}
      </router-link>
      <span
        v-else
        class="text-[var(--p-text-color)] font-[family-name:'BC_Sans',sans-serif] font-bold"
      >
        {{ item.label }}
      </span>
    </template>
  </Breadcrumb>
</template>
