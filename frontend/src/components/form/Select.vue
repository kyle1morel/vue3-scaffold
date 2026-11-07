<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsSelect from '@/components/bcds/Select.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  loading = false,
  name,
  optionLabel = undefined,
  options,
  optionValue = undefined,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
  name: string;
  optionLabel?: string;
  options: unknown[];
  optionValue?: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<unknown>(() => name);
</script>

<template>
  <BcdsSelect
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :label
    :loading
    :name
    :option-label
    :options
    :option-value
    :placeholder
    :readonly
    :required
    @blur="handleBlur"
  />
</template>
