<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'reka-ui';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { RouteLocationRaw } from 'vue-router';

export interface MenuItemProps {
  description?: string;
  // Makes the item a link to another site; use to for a page in the app
  href?: string;
  // A FontAwesome icon, such as fa-solid fa-check
  icon?: string;
  id?: string;
  isDisabled?: boolean;
  label: string;
  onAction?: () => void;
  to?: RouteLocationRaw;
}

export interface MenuSectionProps {
  header?: string;
  id: string;
  items: MenuItemProps[];
}

// Props
const {
  itemSize = 'medium',
  items = undefined,
  placement = 'bottom',
  sections = undefined
} = defineProps<{
  itemSize?: 'medium' | 'small';
  // A plain list; use sections instead to group items under headers
  items?: MenuItemProps[];
  placement?: 'bottom' | 'left' | 'right' | 'top';
  sections?: MenuSectionProps[];
}>();

// The slot is the button that opens the menu
defineSlots<{ default(): unknown }>();

// State
const menuSections = computed<MenuSectionProps[]>(() =>
  sections?.length ? sections : [{ id: 'items', items: items ?? [] }]
);

// Actions
function linkOf(item: MenuItemProps) {
  if (item.to) return { as: RouterLink, to: item.to };
  return item.href ? { as: 'a', href: item.href } : {};
}
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>
    <DropdownMenuPortal>
      <DropdownMenuContent
        align="start"
        class="bcds-menu"
        :side="placement"
        :side-offset="4"
      >
        <template
          v-for="(section, index) in menuSections"
          :key="section.id"
        >
          <DropdownMenuSeparator
            v-if="index > 0"
            class="separator"
          />
          <DropdownMenuGroup class="section">
            <DropdownMenuLabel
              v-if="section.header"
              class="header"
            >
              {{ section.header }}
            </DropdownMenuLabel>
            <DropdownMenuItem
              v-for="item in section.items"
              :key="item.id ?? item.label"
              v-bind="linkOf(item)"
              class="item"
              :class="itemSize"
              :disabled="item.isDisabled"
              :text-value="item.label"
              @select="item.onAction?.()"
            >
              <font-awesome-icon
                v-if="item.icon"
                class="icon"
                :icon="item.icon"
              />
              <div class="content">
                <span class="label">{{ item.label }}</span>
                <span
                  v-if="item.description"
                  class="description"
                >
                  {{ item.description }}
                </span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<!-- Reka renders the menu inside its own wrapper, which a scoped style can't reach -->
<style>
.bcds-menu {
  z-index: 1000;
  box-sizing: border-box;
  min-width: var(--reka-dropdown-menu-trigger-width);
  max-height: var(--reka-dropdown-menu-content-available-height);
  overflow-y: auto;
  padding: var(--layout-padding-xsmall);
  border: var(--layout-border-width-small) solid var(--surface-color-border-default);
  border-radius: var(--layout-border-radius-medium);
  background: var(--surface-color-forms-default);
  box-shadow: var(--surface-shadow-medium);
}
</style>

<style scoped>
.section {
  display: flex;
  flex-direction: column;
  gap: var(--layout-margin-small);
}

.header {
  padding: var(--layout-padding-small);
  font: var(--typography-bold-small-body);
}

.separator {
  height: var(--layout-border-width-small);
  margin: var(--layout-margin-small) 0;
  background: var(--surface-color-border-default);
}

a.item {
  text-decoration: none;
}

a.item .label {
  color: var(--typography-color-link);
  text-decoration: underline var(--typography-color-link);
  text-underline-offset: var(--layout-margin-hair);
}

a.item[data-disabled] .label {
  color: var(--typography-color-disabled);
  text-decoration: none;
}

.item {
  display: flex;
  gap: var(--layout-margin-xsmall);
  padding: var(--layout-padding-small);
  border-radius: var(--layout-border-radius-small);
  color: var(--typography-color-secondary);
  cursor: pointer;
  outline: none;
}

.item[data-highlighted] {
  background: var(--surface-color-menus-hover);
}

.item[data-disabled] {
  color: var(--typography-color-disabled);
  cursor: not-allowed;
}

.icon {
  padding-top: var(--layout-padding-xsmall);
}

.content {
  display: flex;
  flex-direction: column;
  gap: var(--layout-padding-hair);
}

.item.small {
  font: var(--typography-regular-small-body);
}

.item.small .description {
  font: var(--typography-regular-label);
}

.item.medium {
  font: var(--typography-regular-body);
}

.item.medium .description {
  font: var(--typography-regular-small-body);
}
</style>
