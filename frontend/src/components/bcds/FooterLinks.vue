<script setup lang="ts">
import { slotItems } from './slotItems';

import type { VNode } from 'vue';

// Props
const { title } = defineProps<{
  title: string;
}>();

const slots = defineSlots<{
  // Links, each rendered in its own list item
  default?(): VNode[];
}>();
</script>

<template>
  <figure class="bcds-footer-links">
    <figcaption
      v-if="title"
      class="bcds-footer-links-title"
    >
      {{ title }}
    </figcaption>
    <ul v-if="slots.default">
      <li
        v-for="(link, index) in slotItems(slots.default())"
        :key="index"
      >
        <component :is="link" />
      </li>
    </ul>
  </figure>
</template>

<style scoped>
@layer components {
  .bcds-footer-links {
    margin: var(--layout-margin-none);
  }

  .bcds-footer-links-title {
    display: block;
    font: var(--typography-bold-small-body);
    margin-bottom: var(--layout-padding-medium);
    text-transform: uppercase;
  }

  .bcds-footer-links > ul {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: var(--layout-padding-small) var(--layout-padding-xlarge);
    list-style: none;
    margin: var(--layout-margin-none);
    padding: var(--layout-padding-none);
  }

  .bcds-footer-links > ul > li {
    font: var(--typography-regular-small-body);
  }

  .bcds-footer-links > ul > li > :deep(a) {
    color: var(--typography-color-primary);
    text-decoration: none;
  }

  .bcds-footer-links > ul > li > :deep(a:hover) {
    text-decoration: underline;
  }
}
</style>
