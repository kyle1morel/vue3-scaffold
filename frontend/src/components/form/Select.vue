<script setup lang="ts">
import { useField } from 'vee-validate';
import { computed } from 'vue';

import { InputText, Select } from '@/lib/primevue';

import FormField from './FormField.vue';

import type { SelectChangeEvent, SelectProps } from 'primevue/select';

// Props
const {
  helpText = undefined,
  label = undefined,
  name,
  placeholder = undefined,
  disabled = false,
  editable = false,
  options,
  optionLabel = undefined,
  optionValue = undefined,
  loading = false,
  readonly = false,
  required = false
} = defineProps<{
  helpText?: string;
  label?: string;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  // Typed text that matches no option is saved as entered
  editable?: boolean;
  options: SelectProps['options'];
  optionLabel?: SelectProps['optionLabel'];
  optionValue?: SelectProps['optionValue'];
  loading?: boolean;
  // PrimeVue's Select has no read-only state, so this shows the chosen label in a read-only input
  readonly?: boolean;
  required?: boolean;
}>();

// Emits
const emit = defineEmits<{ change: [event: SelectChangeEvent] }>();

// State
const { errorMessage, handleBlur, value } = useField<unknown>(() => name);

// Typed text from an editable select matches no option, so it shows as entered
const selectedLabel = computed(() => {
  const option = options?.find((o) => resolve(o, optionValue) === value.value);
  const shown = option === undefined ? value.value : resolve(option, optionLabel);
  return shown === undefined || shown === null ? undefined : String(shown);
});

// Actions
// Mirrors how PrimeVue reads optionLabel and optionValue: a property name, a function, or the option itself
function resolve(option: unknown, field: SelectProps['optionLabel'] | SelectProps['optionValue']) {
  if (!field) return option;
  return typeof field === 'function' ? field(option) : (option as Record<string, unknown>)?.[field];
}
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, labelId, listeners }"
    :error="errorMessage"
    :help-text
    :label
    :non-labelable="!editable && !readonly"
    :required
  >
    <InputText
      v-if="readonly"
      :id
      v-bind="{ ...listeners, ...inputAttrs }"
      class="w-full"
      :invalid
      :model-value="selectedLabel"
      :name
      :placeholder
      readonly
    />
    <Select
      v-else
      v-model="value"
      v-bind="listeners"
      :aria-labelledby="labelId"
      class="w-full"
      :disabled
      :editable
      :input-id="id"
      :invalid
      :loading
      :name
      :options
      :option-label
      :option-value
      :placeholder
      :pt="{ label: inputAttrs }"
      @blur="handleBlur"
      @change="(e: SelectChangeEvent) => emit('change', e)"
    />
  </FormField>
</template>
