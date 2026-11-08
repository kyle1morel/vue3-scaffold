<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsNumberField from '@/components/bcds/NumberField.vue';

// Props
const {
  description = undefined,
  disabled = false,
  formatOptions = undefined,
  label = undefined,
  name,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  formatOptions?: Intl.NumberFormatOptions;
  label?: string;
  name: string;
  placeholder?: string;
  readonly?: boolean;
  required?: boolean;
}>();

// State
const { errorMessage, handleBlur, value } = useField<number | null | undefined>(() => name);
</script>

<template>
  <BcdsNumberField
    v-model="value"
    :description
    :disabled
    :error-message="errorMessage"
    :format-options
    :label
    :name
    :placeholder
    :readonly
    :required
    @blur="handleBlur"
  />
</template>
