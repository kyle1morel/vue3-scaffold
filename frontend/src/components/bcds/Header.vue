<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { slotItems } from './slotItems';

import type { VNode } from 'vue';

// Props
const {
  fullWidth = false,
  title = '',
  titleElement = 'span'
} = defineProps<{
  // Drops the 1100px cap and lets the title shrink, so the header lines up with full-width content
  fullWidth?: boolean;
  title?: string;
  titleElement?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
}>();

const slots = defineSlots<{
  default?(): unknown;
  // Replaces the logo and the link around it
  logo?(): unknown;
  logoImage?(): unknown;
  // Links hidden until focused, each rendered in its own list item
  skipLinks?(): VNode[];
}>();

// Composables
const { t } = useI18n();
</script>

<template>
  <header :class="['bcds-header', { 'bcds-header-full-width': fullWidth }]">
    <div class="bcds-header-container">
      <slot name="logo">
        <a
          href="/"
          :title="t('components.header.government')"
        >
          <slot name="logoImage">
            <img
              src="@/assets/images/BCID_H_rgb_pos.svg"
              class="bcds-header-logo"
              :alt="t('components.header.government')"
            />
          </slot>
        </a>
      </slot>
      <ul
        v-if="slots.skipLinks"
        class="bcds-header-skiplinks"
      >
        <li
          v-for="(link, index) in slotItems(slots.skipLinks())"
          :key="index"
        >
          <component :is="link" />
        </li>
      </ul>
      <template v-if="title">
        <div class="bcds-header-line" />
        <component
          :is="titleElement"
          class="bcds-header-title"
        >
          {{ title }}
        </component>
      </template>
      <slot />
    </div>
  </header>
</template>

<style scoped>
@layer components {
  .bcds-header {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background-color: var(--surface-color-forms-default);
    border-bottom: var(--layout-border-width-small) solid var(--surface-color-border-default);
    min-height: 65px;
    padding: var(--layout-padding-none) var(--layout-padding-medium);
    width: 100%;
  }

  .bcds-header-container {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--layout-padding-medium);
    max-width: 1100px;
  }

  .bcds-header-title {
    flex-grow: 1;
    font: var(--typography-bold-h4);
    color: var(--typography-color-primary);
  }

  .bcds-header-full-width .bcds-header-container {
    max-width: none;
    min-width: 0;
  }

  .bcds-header-full-width .bcds-header-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .bcds-header-skiplinks {
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
  }

  .bcds-header-skiplinks :deep(li a),
  .bcds-header-skiplinks :deep(li button) {
    background-color: var(--surface-color-forms-default);
    box-sizing: border-box;
    color: var(--typography-color-link);
    font: var(--typography-regular-body);
    /* Centres the link in a single line-height header */
    margin-top: -17.5px;
    padding: var(--layout-padding-xsmall) var(--layout-padding-medium);
    position: absolute;
    margin-left: -100000px;
  }

  .bcds-header-skiplinks :deep(li a:focus),
  .bcds-header-skiplinks :deep(li button:focus) {
    /* Lines up with the logo's left edge */
    margin-left: 0;
    text-wrap: nowrap;
  }

  .bcds-header-line {
    background-color: var(--surface-color-border-default);
    width: 1px;
    height: 32px;
  }

  .bcds-header-logo {
    display: block;
    min-width: 129px;
    width: 129px;
  }
}
</style>
