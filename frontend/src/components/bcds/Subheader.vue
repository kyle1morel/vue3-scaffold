<script setup lang="ts">
import Separator from './Separator.vue';
import { slotItems } from './slotItems';

import type { VNode } from 'vue';

// The nav landmark takes the attributes, such as the aria-label that names it.
defineOptions({ inheritAttrs: false });

// Props
const { size = 'medium' } = defineProps<{
  // The bar's height and the space around each item
  size?: 'medium' | 'small';
}>();

const slots = defineSlots<{
  // Links or buttons, each rendered in its own list item with a separator between them
  default(): VNode[];
}>();
</script>

<template>
  <div class="bcds-subheader">
    <nav
      v-bind="$attrs"
      class="bcds-subheader-container"
      :class="`bcds-subheader-${size}`"
    >
      <ul class="bcds-subheader-list">
        <template
          v-for="(item, index) in slotItems(slots.default())"
          :key="index"
        >
          <li
            v-if="index > 0"
            aria-hidden="true"
            class="bcds-subheader-separator"
            role="presentation"
          >
            <Separator
              orientation="vertical"
              size="small"
            />
          </li>
          <li class="bcds-subheader-item">
            <component :is="item" />
          </li>
        </template>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
@layer components {
  .bcds-subheader {
    display: flex;
    align-items: center;
    justify-content: space-around;
    box-sizing: border-box;
    width: 100%;
    padding: var(--layout-padding-none) var(--layout-padding-medium);
    border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
    background-color: var(--surface-color-background-white);
  }

  .bcds-subheader-container {
    display: flex;
    flex-grow: 1;
    box-sizing: border-box;
    max-width: 1100px;
  }

  .bcds-subheader-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--layout-margin-small);
    box-sizing: border-box;
    margin: unset;
    padding: unset;
    list-style: none;
  }

  .bcds-subheader-item {
    display: flex;
    align-items: center;
  }

  .bcds-subheader-separator {
    display: flex;
    align-self: stretch;
    margin: var(--layout-margin-hair) var(--layout-margin-none);
  }

  .bcds-subheader-separator > :deep(.bcds-separator) {
    height: 100%;
  }

  .bcds-subheader-small > .bcds-subheader-list {
    min-height: 32px;
    padding: var(--layout-padding-hair) var(--layout-padding-none);
  }

  .bcds-subheader-small .bcds-subheader-item {
    padding: var(--layout-padding-none);
  }

  .bcds-subheader-medium > .bcds-subheader-list {
    min-height: 40px;
    padding: var(--layout-padding-xsmall) var(--layout-padding-none);
  }

  .bcds-subheader-medium .bcds-subheader-item {
    padding: var(--layout-padding-none) var(--layout-padding-small);
  }
}
</style>
