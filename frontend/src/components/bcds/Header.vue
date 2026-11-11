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
      <!-- First, so keyboard users reach the skip links before anything else -->
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
      <slot name="logo">
        <a href="/">
          <slot name="logoImage">
            <img
              src="@/assets/images/BCID_H_rgb_pos.svg"
              class="bcds-header-logo"
              :alt="t('components.header.government')"
            />
          </slot>
        </a>
      </slot>
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

  /* Hidden but still read and focusable, until focus shows it over the logo */
  .bcds-header-skiplinks :deep(li a),
  .bcds-header-skiplinks :deep(li button) {
    position: absolute;
    overflow: hidden;
    box-sizing: border-box;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    background-color: var(--surface-color-forms-default);
    color: var(--typography-color-link);
    font: var(--typography-regular-body);
    white-space: nowrap;
    clip-path: inset(50%);
  }

  .bcds-header-skiplinks :deep(li a:focus),
  .bcds-header-skiplinks :deep(li button:focus) {
    overflow: visible;
    width: auto;
    height: auto;
    margin: 0;
    /* Centres the link in a single line-height header */
    margin-top: -17.5px;
    padding: var(--layout-padding-xsmall) var(--layout-padding-medium);
    clip-path: none;
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
