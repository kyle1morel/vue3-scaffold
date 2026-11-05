<script setup lang="ts">
import { useField } from 'vee-validate';

import { Select } from '@/lib/primevue';

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
  required?: boolean;
}>();

// Emits
const emit = defineEmits<{ change: [event: SelectChangeEvent] }>();

// State
const { errorMessage, handleBlur, value } = useField<unknown>(() => name);
</script>

<template>
  <FormField
    v-slot="{ id, inputAttrs, invalid, labelId, listeners }"
    :error="errorMessage"
    :help-text
    :label
    :non-labelable="!editable"
    :required
  >
    <Select
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
