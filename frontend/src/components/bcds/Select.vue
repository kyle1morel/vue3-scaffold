<script setup lang="ts">
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import FieldWrapper from './FieldWrapper.vue';
import ProgressCircle from './ProgressCircle.vue';
import Tag from './Tag.vue';

import type { TagProps } from './Tag.vue';
import type { AcceptableValue } from 'reka-ui';

type Key = string | number;

export interface SelectItemProps {
  // The item's tag color when several can be chosen
  color?: TagProps['color'];
  description?: string;
  // A FontAwesome icon, such as fa-solid fa-eye
  iconLeft?: string;
  // Hidden while the option is selected, when the check takes its place
  iconRight?: string;
  // The value the field takes; without it the label is used, so give one when labels repeat
  id?: Key;
  // Red text, for an option that deletes or can't be undone
  isDestructive?: boolean;
  isDisabled?: boolean;
  label: string;
  // The item's tag shape when several can be chosen
  tagStyle?: TagProps['tagStyle'];
}

export interface SelectSectionProps {
  header?: string;
  id: Key;
  items: SelectItemProps[];
}

defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  items = undefined,
  label = undefined,
  loading = false,
  name = undefined,
  overflow = 'wrap',
  placeholder = undefined,
  readonly = false,
  required = false,
  sections = undefined,
  selectionMode = 'single',
  size = 'medium'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  // A flat list of options; use sections instead for options under headers
  items?: SelectItemProps[];
  label?: string;
  loading?: boolean;
  name?: string;
  // Whether the chosen tags wrap onto more lines or scroll sideways on one
  overflow?: 'scroll' | 'wrap';
  placeholder?: string;
  // A select can't be read-only, so this shows the chosen labels in a read-only input
  readonly?: boolean;
  required?: boolean;
  sections?: SelectSectionProps[];
  // Multiple takes an array and shows each chosen option as a removable tag
  selectionMode?: 'multiple' | 'single';
  size?: 'medium' | 'small';
}>();

const value = defineModel<Key | Key[] | null>();

// Composables
const { t } = useI18n();

// State
// Reka focuses an option on open, which Chrome styles as keyboard focus; the highlight waits for a key press
const usingKeys = ref(false);

const multiple = computed(() => selectionMode === 'multiple');
// A flat list is one section without a header, so both render the same way
const sectionList = computed<SelectSectionProps[]>(() => sections ?? [{ id: 'items', items: items ?? [] }]);
const selectedKeys = computed<Key[]>(() => {
  if (Array.isArray(value.value)) return value.value;
  return value.value === null || value.value === undefined ? [] : [value.value];
});
const selectedItems = computed(() =>
  sectionList.value.flatMap((section) => section.items).filter((item) => selectedKeys.value.includes(keyOf(item)))
);
const selectedLabel = computed(() => selectedItems.value.map((item) => item.label).join(', '));
const placeholderText = computed(() => placeholder ?? t('components.select.placeholder'));

// Actions
function keyOf(item: SelectItemProps) {
  return item.id ?? item.label;
}

function deselect(item: SelectItemProps) {
  value.value = selectedKeys.value.filter((key) => key !== keyOf(item));
}
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    class="select-field"
    :description
    :error-message
    :label
    :required
  >
    <div
      v-if="readonly"
      class="app-input readonly"
      :class="size"
    >
      <input
        :id
        v-bind="inputAttrs"
        :name
        :placeholder
        readonly
        :value="selectedLabel"
      />
    </div>
    <SelectRoot
      v-else
      v-slot="{ open }"
      :disabled
      :model-value="(value ?? (multiple ? [] : null)) as AcceptableValue"
      :multiple
      :name
      :required
      @update:model-value="(selected) => (value = selected as Key | Key[])"
    >
      <div
        class="input-container"
        :class="overflow"
      >
        <SelectTrigger
          :id
          v-bind="inputAttrs"
          :aria-invalid="invalid || undefined"
          class="app-input"
          :class="[size, { invalid, multiple }]"
          @keydown="usingKeys = true"
          @pointerdown="usingKeys = false"
        >
          <SelectValue
            class="value"
            :placeholder="placeholderText"
          >
            <template
              v-if="multiple"
              #default
            >
              <!-- An empty slot falls back to Reka's joined labels, so this renders an empty text node instead -->
              {{ selectedItems.length ? '' : placeholderText }}
            </template>
          </SelectValue>
          <ProgressCircle
            v-if="loading"
            is-indeterminate
            size="small"
          />
          <font-awesome-icon
            v-if="invalid"
            class="text-[var(--icons-color-danger)]"
            icon="fa-solid fa-triangle-exclamation"
          />
          <font-awesome-icon :icon="open ? 'fa-solid fa-chevron-up' : 'fa-solid fa-chevron-down'" />
        </SelectTrigger>
        <!-- The tags hold buttons, which can't sit inside the trigger button, so they lie over it instead -->
        <div
          v-if="multiple && selectedItems.length"
          class="tag-overlay"
        >
          <div
            :aria-label="label ? t('components.select.selections', { label }) : t('components.select.selected')"
            class="tags"
            role="group"
          >
            <Tag
              v-for="item in selectedItems"
              :key="keyOf(item)"
              :color="item.color"
              :disabled
              :icon="item.iconLeft"
              :size="size === 'small' ? 'xsmall' : 'small'"
              :tag-style="item.tagStyle"
            >
              <span class="tag-label">{{ item.label }}</span>
              <button
                v-if="!disabled"
                :aria-label="t('components.select.remove', { item: item.label })"
                class="remove"
                type="button"
                @click="deselect(item)"
              >
                <font-awesome-icon icon="fa-solid fa-xmark" />
              </button>
            </Tag>
          </div>
        </div>
      </div>
      <SelectPortal>
        <SelectContent
          align="start"
          class="app-popover bcds-select-options"
          :class="[size, { 'using-keys': usingKeys }]"
          position="popper"
          :side-offset="4"
          @keydown="usingKeys = true"
        >
          <SelectViewport>
            <SelectGroup
              v-for="section in sectionList"
              :key="section.id"
              class="section"
            >
              <SelectLabel
                v-if="section.header"
                class="header"
              >
                {{ section.header }}
              </SelectLabel>
              <SelectItem
                v-for="item in section.items"
                :key="keyOf(item)"
                class="app-option"
                :class="{ destructive: item.isDestructive }"
                :disabled="item.isDisabled"
                :value="keyOf(item)"
              >
                <span
                  v-if="item.iconLeft"
                  class="item-icon"
                >
                  <font-awesome-icon :icon="item.iconLeft" />
                </span>
                <span class="item-text">
                  <SelectItemText class="item-label">{{ item.label }}</SelectItemText>
                  <span
                    v-if="item.description"
                    class="item-description"
                  >
                    {{ item.description }}
                  </span>
                </span>
                <SelectItemIndicator class="item-icon">
                  <font-awesome-icon
                    class="check"
                    icon="fa-solid fa-check"
                  />
                </SelectItemIndicator>
                <span
                  v-if="item.iconRight && !selectedKeys.includes(keyOf(item))"
                  class="item-icon"
                >
                  <font-awesome-icon :icon="item.iconRight" />
                </span>
              </SelectItem>
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </FieldWrapper>
</template>

<!-- Reka renders the list inside its own wrapper, which a scoped style can't reach -->
<style>
.bcds-select-options {
  width: var(--reka-select-trigger-width);
  max-height: var(--reka-select-content-available-height);
}

.bcds-select-options .section + .section {
  margin-top: 1px;
  padding-top: var(--layout-padding-hair);
  border-top: var(--layout-border-width-small) solid var(--surface-color-border-default);
}

.bcds-select-options .header {
  padding: var(--layout-padding-hair) var(--layout-padding-small);
  color: var(--typography-color-secondary);
  font: var(--typography-regular-small-body);
}

/* Reka highlights an option as soon as the list opens, so the highlight shows only under the pointer or after a key */
.bcds-select-options .app-option[data-highlighted] {
  background: none;
}

.bcds-select-options .app-option:hover,
.bcds-select-options.using-keys .app-option[data-highlighted] {
  background: var(--surface-color-secondary-button-hover);
}

.bcds-select-options.small .app-option {
  padding: var(--layout-padding-xsmall);
  font: var(--typography-regular-small-body);
}

.bcds-select-options .item-icon {
  display: flex;
  align-items: center;
  justify-content: space-around;
  min-width: 20px;
}

.bcds-select-options .check {
  font-size: var(--icons-size-xsmall);
}

.bcds-select-options .item-text {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  min-width: 0;
  color: var(--typography-color-primary);
}

.bcds-select-options .item-description {
  color: var(--typography-color-secondary);
  font: var(--typography-regular-small-body);
}

.bcds-select-options .destructive,
.bcds-select-options .destructive .item-label {
  color: var(--surface-color-primary-danger-button-default);
}
</style>

<style scoped>
.select-field :deep(.app-field-label) {
  color: var(--typography-color-secondary);
}

.value {
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
}

.scroll .value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* The trigger and the tags share one grid cell, so the trigger grows with the tags */
.input-container {
  display: grid;
  width: 100%;
  min-width: 0;
}

.input-container > * {
  grid-area: 1 / 1;
}

/* The tags set the height, and an empty field matches a single select */
.app-input.multiple {
  height: auto;
  min-height: var(--layout-margin-xxlarge);
  padding-block: 0;
}

.app-input.multiple.small {
  min-height: var(--layout-margin-xlarge);
}

/* Clicks around the tags fall through to the trigger; the right padding keeps the tags off its icons */
.tag-overlay {
  display: flex;
  align-items: center;
  min-width: 0;
  padding: calc(var(--layout-padding-small) - 0.5px);
  padding-right: 2.5rem;
  pointer-events: none;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--layout-padding-small);
  width: 100%;
  min-width: 0;
}

.tags > * {
  pointer-events: auto;
}

.tag-label {
  min-width: 0;
  overflow-wrap: break-word;
}

.remove {
  display: flex;
  flex: 0 0 auto;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
}

.remove:focus-visible {
  border-radius: var(--layout-border-radius-small);
  outline: var(--layout-border-width-medium) solid var(--surface-color-border-active);
  outline-offset: var(--layout-margin-hair);
}

/*
 * Scrolling clips both axes, which would cut off the remove buttons' focus rings, so the padding makes room for them
 * and the matching negative margin keeps the tags where they sit when they wrap
 */
.scroll .tags {
  --ring: calc(var(--layout-border-width-medium) + var(--layout-margin-hair) + 1px);

  flex-wrap: nowrap;
  overflow-x: auto;
  margin: calc(-1 * var(--ring));
  padding: var(--ring);
  pointer-events: auto;
  scrollbar-width: thin;
}

.scroll .tags > * {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
