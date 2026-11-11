<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxViewport
} from 'reka-ui';
import { onBeforeUnmount, ref, watch } from 'vue';

import FieldWrapper from './FieldWrapper.vue';
import ProgressCircle from './ProgressCircle.vue';

import type { AcceptableValue } from 'reka-ui';

defineOptions({ inheritAttrs: false });

// Props
const {
  allowsCustomValue = false,
  delay = 300,
  description = undefined,
  disabled = false,
  errorMessage = undefined,
  label = undefined,
  loading = false,
  name = undefined,
  optionLabel = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  suggestions
} = defineProps<{
  // Text that matches no suggestion is kept as entered; otherwise it's cleared.
  allowsCustomValue?: boolean;
  // Milliseconds after typing stops before complete is emitted
  delay?: number;
  description?: string;
  disabled?: boolean;
  errorMessage?: string;
  label?: string;
  loading?: boolean;
  name?: string;
  // The property shown for object suggestions
  optionLabel?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  suggestions: unknown[];
}>();

// Emits
const emit = defineEmits<{
  // Asks for suggestions matching the typed text
  complete: [query: string];
  select: [value: unknown];
}>();

const value = defineModel<unknown>();

// State
const open = ref(false);
const searchTerm = ref(labelOf(value.value));
let completeTimer: ReturnType<typeof setTimeout> | undefined;

watch(value, (current) => (searchTerm.value = labelOf(current)));

// Actions
function labelOf(option: unknown) {
  if (option === undefined || option === null) return '';
  return String(optionLabel ? (option as Record<string, unknown>)[optionLabel] : option);
}

function onOpenChange(isOpen: boolean) {
  open.value = isOpen && !readonly;
}

// Reka also writes the chosen label back into the input, which is no new search.
function onSearch(term: string) {
  searchTerm.value = term;
  if (readonly || term === labelOf(value.value)) return;

  if (allowsCustomValue) value.value = term;
  clearTimeout(completeTimer);
  completeTimer = setTimeout(() => emit('complete', term), delay);
}

function onSelect(selected: AcceptableValue) {
  value.value = selected;
  emit('select', selected);
}

onBeforeUnmount(() => clearTimeout(completeTimer));
</script>

<template>
  <FieldWrapper
    v-slot="{ id, inputAttrs, invalid }"
    v-bind="$attrs"
    :description
    :error-message
    :label
    :required
  >
    <ComboboxRoot
      :disabled
      ignore-filter
      :model-value="(value ?? null) as AcceptableValue"
      :open
      :reset-search-term-on-blur="!allowsCustomValue"
      @update:model-value="onSelect"
      @update:open="onOpenChange"
    >
      <ComboboxAnchor
        class="app-input"
        :class="{ 'app-input-invalid': invalid, 'app-input-readonly': readonly }"
        :data-disabled="disabled || undefined"
      >
        <ComboboxInput
          :id
          v-bind="inputAttrs"
          :aria-invalid="invalid || undefined"
          :display-value="labelOf"
          :model-value="searchTerm"
          :name
          :placeholder
          :readonly
          @update:model-value="onSearch"
        />
        <ProgressCircle
          v-if="loading"
          indeterminate
          size="small"
        />
        <font-awesome-icon
          v-if="invalid"
          class="text-[var(--icons-color-danger)]"
          icon="fa-solid fa-triangle-exclamation"
        />
      </ComboboxAnchor>
      <ComboboxPortal>
        <ComboboxContent
          v-if="suggestions.length"
          align="start"
          class="app-popover bcds-combobox-options"
          position="popper"
          :side-offset="4"
        >
          <ComboboxViewport>
            <ComboboxItem
              v-for="(suggestion, index) in suggestions"
              :key="index"
              class="app-option"
              :value="suggestion as AcceptableValue"
            >
              {{ labelOf(suggestion) }}
            </ComboboxItem>
          </ComboboxViewport>
        </ComboboxContent>
      </ComboboxPortal>
    </ComboboxRoot>
  </FieldWrapper>
</template>

<!-- Reka renders the list inside its own wrapper, which a scoped style can't reach. -->
<style>
@layer components {
  .bcds-combobox-options {
    width: var(--reka-combobox-trigger-width);
    max-height: var(--reka-combobox-content-available-height);
  }
}
</style>
