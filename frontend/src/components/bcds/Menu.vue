<script setup lang="ts">
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from 'reka-ui';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { RouteLocationRaw } from 'vue-router';

export interface MenuItemProps {
  description?: string;
  // Makes the item a link to another site; use to for a page in the app.
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

defineOptions({ inheritAttrs: false });

// Props
const {
  disabledKeys = [],
  disallowEmptySelection = false,
  itemSize = 'medium',
  items = undefined,
  placement = 'bottom',
  sections = undefined,
  selectionMode = 'none'
} = defineProps<{
  // Items that can't be chosen, by id, or label when there's no id
  disabledKeys?: string[];
  // Keeps at least one item selected
  disallowEmptySelection?: boolean;
  itemSize?: 'medium' | 'small';
  // A plain list; use sections instead to group items under headers.
  items?: MenuItemProps[];
  placement?: 'bottom' | 'left' | 'right' | 'top';
  sections?: MenuSectionProps[];
  // Lets items be selected, each shown with a check
  selectionMode?: 'multiple' | 'none' | 'single';
}>();

// Ids, or labels when there's no id, of the selected items
const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] });

// The slot is the button that opens the menu.
defineSlots<{ default(): unknown }>();

// State
const menuSections = computed<MenuSectionProps[]>(() =>
  sections?.length ? sections : [{ id: 'items', items: items ?? [] }]
);

// Reka gives each mode its own item, so screen readers hear a radio or checkbox.
const itemComponent = computed(
  () => ({ multiple: DropdownMenuCheckboxItem, none: DropdownMenuItem, single: DropdownMenuRadioItem })[selectionMode]
);

// Actions
function keyOf(item: MenuItemProps) {
  return item.id ?? item.label;
}

// Reka's checked state follows these, and onSelect makes the change.
function selectionProps(item: MenuItemProps) {
  if (selectionMode === 'single') return { value: keyOf(item) };
  return selectionMode === 'multiple' ? { modelValue: selectedKeys.value.includes(keyOf(item)) } : {};
}

function onSelect(item: MenuItemProps, event: Event) {
  item.onAction?.();
  if (selectionMode === 'none') return;
  const key = keyOf(item);
  const selected = selectedKeys.value.includes(key);
  if (selectionMode === 'single') {
    if (!selected) selectedKeys.value = [key];
    else if (!disallowEmptySelection) selectedKeys.value = [];
    return;
  }
  // Several can be chosen, so the menu stays open, as in React Aria.
  event.preventDefault();
  if (selected && disallowEmptySelection && selectedKeys.value.length === 1) return;
  selectedKeys.value = selected ? selectedKeys.value.filter((k) => k !== key) : [...selectedKeys.value, key];
}

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
        v-bind="$attrs"
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
            class="bcds-menu-separator"
          />
          <!-- An empty string rather than undefined, so Reka doesn't keep its own selection. -->
          <component
            :is="selectionMode === 'single' ? DropdownMenuRadioGroup : DropdownMenuGroup"
            class="bcds-menu-section"
            v-bind="selectionMode === 'single' ? { modelValue: selectedKeys[0] ?? '' } : {}"
          >
            <DropdownMenuLabel
              v-if="section.header"
              class="bcds-menu-header"
            >
              {{ section.header }}
            </DropdownMenuLabel>
            <component
              :is="itemComponent"
              v-for="item in section.items"
              :key="keyOf(item)"
              v-bind="{ ...linkOf(item), ...selectionProps(item) }"
              class="bcds-menu-item"
              :class="`bcds-menu-${itemSize}`"
              :disabled="item.isDisabled || disabledKeys.includes(keyOf(item))"
              :text-value="item.label"
              @select="onSelect(item, $event)"
            >
              <font-awesome-icon
                v-if="item.icon"
                class="bcds-menu-icon"
                :icon="item.icon"
              />
              <div class="bcds-menu-content">
                <span class="bcds-menu-label">{{ item.label }}</span>
                <span
                  v-if="item.description"
                  class="bcds-menu-description"
                >
                  {{ item.description }}
                </span>
              </div>
              <font-awesome-icon
                v-if="selectionMode !== 'none' && selectedKeys.includes(keyOf(item))"
                class="bcds-menu-icon"
                icon="fa-solid fa-check"
              />
            </component>
          </component>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<!-- Reka renders the menu inside its own wrapper, which a scoped style can't reach. -->
<style>
@layer components {
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
}
</style>

<style scoped>
@layer components {
  .bcds-menu-section {
    display: flex;
    flex-direction: column;
    gap: var(--layout-margin-small);
  }

  .bcds-menu-header {
    padding: var(--layout-padding-small);
    font: var(--typography-bold-small-body);
  }

  .bcds-menu-separator {
    height: var(--layout-border-width-small);
    margin: var(--layout-margin-small) 0;
    background: var(--surface-color-border-default);
  }

  a.bcds-menu-item {
    text-decoration: none;
  }

  a.bcds-menu-item .bcds-menu-label {
    color: var(--typography-color-link);
    text-decoration: underline var(--typography-color-link);
    text-underline-offset: var(--layout-margin-hair);
  }

  a.bcds-menu-item[data-disabled] .bcds-menu-label {
    color: var(--typography-color-disabled);
    text-decoration: none;
  }

  .bcds-menu-item {
    display: flex;
    gap: var(--layout-margin-xsmall);
    padding: var(--layout-padding-small);
    border-radius: var(--layout-border-radius-small);
    color: var(--typography-color-secondary);
    cursor: pointer;
    outline: none;
  }

  .bcds-menu-item[data-highlighted] {
    background: var(--surface-color-menus-hover);
  }

  .bcds-menu-item[data-disabled] {
    color: var(--typography-color-disabled);
    cursor: not-allowed;
  }

  .bcds-menu-icon {
    padding-top: var(--layout-padding-xsmall);
  }

  .bcds-menu-content {
    display: flex;
    flex-direction: column;
    gap: var(--layout-padding-hair);
  }

  .bcds-menu-item.bcds-menu-small {
    font: var(--typography-regular-small-body);
  }

  .bcds-menu-item.bcds-menu-small .bcds-menu-description {
    font: var(--typography-regular-label);
  }

  .bcds-menu-item.bcds-menu-medium {
    font: var(--typography-regular-body);
  }

  .bcds-menu-item.bcds-menu-medium .bcds-menu-description {
    font: var(--typography-regular-small-body);
  }
}
</style>
