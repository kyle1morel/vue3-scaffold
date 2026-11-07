<script setup lang="ts">
import {
  SelectContent,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport
} from 'reka-ui';
import { computed } from 'vue';

import FieldWrapper from './FieldWrapper.vue';
import ProgressCircle from './ProgressCircle.vue';

import type { AcceptableValue } from 'reka-ui';

// TODO: Move to BC's Select API: items or sections with headers, item descriptions, icons, isDestructive and tag
// colours, multiple selection and overflow, in place of options, optionLabel and optionValue
defineOptions({ inheritAttrs: false });

// Props
const {
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  loading = false,
  name = undefined,
  optionLabel = undefined,
  options,
  optionValue = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  size = 'medium'
} = defineProps<{
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  loading?: boolean;
  name?: string;
  // The property shown for object options; without it the option itself is shown
  optionLabel?: string;
  options: unknown[];
  // The property saved for object options; without it the option itself is saved
  optionValue?: string;
  placeholder?: string;
  // A select can't be read-only, so this shows the chosen label in a read-only input
  readonly?: boolean;
  required?: boolean;
  size?: 'medium' | 'small';
}>();

const value = defineModel<unknown>();

// State
const items = computed(() =>
  options.map((option) => ({
    label: String(resolve(option, optionLabel) ?? ''),
    value: resolve(option, optionValue) as AcceptableValue
  }))
);
const selectedLabel = computed(() => items.value.find((item) => item.value === value.value)?.label);

// Actions
function resolve(option: unknown, field?: string) {
  return field ? (option as Record<string, unknown>)?.[field] : option;
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
      :disabled
      :model-value="(value ?? null) as AcceptableValue"
      :name
      :required
      @update:model-value="(selected) => (value = selected)"
    >
      <SelectTrigger
        :id
        v-bind="inputAttrs"
        :aria-invalid="invalid || undefined"
        class="app-input trigger"
        :class="[size, { invalid }]"
      >
        <SelectValue
          class="grow"
          :placeholder
        />
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
        <font-awesome-icon icon="fa-solid fa-chevron-down" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          align="start"
          class="app-popover bcds-select-options"
          :class="size"
          position="popper"
          :side-offset="4"
        >
          <SelectViewport>
            <SelectItem
              v-for="(item, index) in items"
              :key="index"
              class="app-option"
              :value="item.value"
            >
              <SelectItemText class="grow">{{ item.label }}</SelectItemText>
              <SelectItemIndicator>
                <font-awesome-icon icon="fa-solid fa-check" />
              </SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </FieldWrapper>
</template>

<!-- Reka renders the list inside its own wrapper, which a scoped style can't reach -->
<style>
.bcds-select-options {
  min-width: var(--reka-select-trigger-width);
  max-height: var(--reka-select-content-available-height);
}

.bcds-select-options.small .app-option {
  padding: var(--layout-padding-xsmall);
  font: var(--typography-regular-small-body);
}
</style>

<style scoped>
.select-field :deep(.app-field-label) {
  color: var(--typography-color-secondary);
}

.trigger {
  height: auto;
  min-height: var(--layout-margin-xxlarge);
  padding: var(--layout-padding-small);
}

.trigger.small {
  min-height: var(--layout-margin-xlarge);
}
</style>
