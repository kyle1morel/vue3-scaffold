<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsComboBox from '@/components/bcds/ComboBox.vue';

// Props
const {
  allowsCustomValue = false,
  delay = 300,
  description = undefined,
  disabled = false,
  label = undefined,
  loading = false,
  name,
  optionLabel = undefined,
  placeholder = undefined,
  readonly = false,
  required = false,
  suggestions
} = defineProps<{
  allowsCustomValue?: boolean;
  delay?: number;
  description?: string;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
  name: string;
  optionLabel?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
  suggestions: unknown[];
}>();

// Emits
const emit = defineEmits<{
  complete: [query: string];
  select: [value: unknown];
}>();

// State
const { errorMessage, handleBlur, value } = useField<unknown>(() => name);
</script>

<template>
  <BcdsComboBox
    v-model="value"
    :allows-custom-value
    :delay
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :loading
    :name
    :option-label
    :placeholder
    :readonly
    :required
    :suggestions
    @blur="handleBlur"
    @complete="(query: string) => emit('complete', query)"
    @select="(selected: unknown) => emit('select', selected)"
  />
</template>
