<script setup lang="ts">
import AutoComplete from 'primevue/autocomplete';

import FieldWrapper from './FieldWrapper.vue';

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
  // Text that matches no suggestion is kept as entered; otherwise it's cleared
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
    <AutoComplete
      v-model="value"
      class="w-full"
      :delay
      :disabled
      :force-selection="!allowsCustomValue"
      input-class="w-full"
      :input-id="id"
      :invalid
      :loading
      :name
      :option-label
      :placeholder
      :pt="{ pcInputText: { root: { ...inputAttrs, readonly: readonly || undefined } } }"
      :suggestions
      @complete="(e) => emit('complete', e.query)"
      @option-select="(e) => emit('select', e.value)"
    />
  </FieldWrapper>
</template>
