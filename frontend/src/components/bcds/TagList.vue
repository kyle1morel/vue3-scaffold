<script setup lang="ts">
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';

import Tag from './Tag.vue';
import { TAG_GROUP } from './TagGroup.vue';

import type { TagProps } from './Tag.vue';

// Props
const { items, orientation = 'horizontal' } = defineProps<{
  items: (TagProps & { id: string; label: string })[];
  orientation?: 'horizontal' | 'vertical';
}>();

// Shown in place of the tags when there are none
defineSlots<{ empty?(): unknown }>();

// Composables
const { t } = useI18n();

// State
const group = inject(TAG_GROUP, { disabled: false, remove: () => undefined, removable: false });
</script>

<template>
  <ul
    v-if="items.length"
    class="bcds-tag-list"
    :class="`bcds-tag-list-${orientation}`"
  >
    <li
      v-for="item in items"
      :key="item.id"
    >
      <Tag
        :color="item.color"
        :disabled="item.disabled || group.disabled"
        :icon="item.icon"
        :size="item.size"
        :tag-style="item.tagStyle"
      >
        <span class="bcds-tag-list-label">{{ item.label }}</span>
        <button
          v-if="group.removable && !item.disabled && !group.disabled"
          :aria-label="t('components.tagList.remove', { item: item.label })"
          class="bcds-tag-list-remove"
          type="button"
          @click="group.remove(item.id)"
        >
          <font-awesome-icon icon="fa-solid fa-xmark" />
        </button>
      </Tag>
    </li>
  </ul>
  <slot
    v-else
    name="empty"
  />
</template>

<style scoped>
@layer components {
  .bcds-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--layout-padding-small);
    width: fit-content;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .bcds-tag-list-horizontal {
    flex-direction: row;
  }

  .bcds-tag-list-vertical {
    flex-direction: column;
  }

  .bcds-tag-list-label {
    min-width: 0;
    overflow-wrap: break-word;
  }

  .bcds-tag-list-remove {
    display: flex;
    flex: 0 0 auto;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
  }

  .bcds-tag-list-remove:focus-visible {
    border-radius: var(--layout-border-radius-small);
    outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
    outline-offset: var(--layout-margin-hair);
  }
}
</style>
