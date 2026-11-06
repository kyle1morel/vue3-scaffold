<script setup lang="ts">
import { useField } from 'vee-validate';

import { AutoComplete } from '@/lib/primevue';

import FormField from './FormField.vue';

import type { AutoCompleteChangeEvent, AutoCompleteCompleteEvent, AutoCompleteProps } from 'primevue/autocomplete';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  placeholder = undefined,
  disabled = false,
  readonly = false,
  suggestions,
  optionLabel = undefined,
  forceSelection = false,
  loading = false,
  delay = 300,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  suggestions: AutoCompleteProps['suggestions'];
  optionLabel?: AutoCompleteProps['optionLabel'];
  forceSelection?: boolean;
  loading?: boolean;
  delay?: number;
  required?: boolean;
}>();

// Emits
const emit = defineEmits<{
  change: [event: AutoCompleteChangeEvent];
  complete: [event: AutoCompleteCompleteEvent];
  select: [value: unknown];
}>();

// State
const { errorMessage, handleBlur, value } = useField<unknown>(() => name);
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, listeners }"
    :error="errorMessage"
    :help-text
    :label
    :required
  >
    <AutoComplete
      v-model="value"
      v-bind="listeners"
      class="w-full"
      :delay
      :disabled
      :force-selection
      input-class="w-full"
      :input-id="id"
      :invalid
      :loading
      :name
      :option-label
      :placeholder
      :pt="{ pcInputText: { root: { ...inputAttrs, readonly: readonly || undefined } } }"
      :suggestions
      @blur="handleBlur"
      @change="(e: AutoCompleteChangeEvent) => emit('change', e)"
      @complete="(e: AutoCompleteCompleteEvent) => emit('complete', e)"
      @option-select="(e) => emit('select', e.value)"
    />
  </FormField>
</template>
