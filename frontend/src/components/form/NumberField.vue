<script setup lang="ts">
import { useField } from 'vee-validate';

import BcdsNumberField from '@/components/bcds/NumberField.vue';

// Props
const {
  description = undefined,
  disabled = false,
  label = undefined,
  maxFractionDigits = undefined,
  name,
  placeholder = undefined,
  readonly = false,
  required = false
} = defineProps<{
  description?: string;
  disabled?: boolean;
  label?: string;
  maxFractionDigits?: number;
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
    :label
    :max-fraction-digits
    :name
    :placeholder
    :readonly
    :required
    @blur="handleBlur"
  />
</template>
